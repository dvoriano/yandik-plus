"""Loopback HTTP adapter for the synthetic rehearsal host."""

import argparse
from http.cookies import CookieError, SimpleCookie
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from pathlib import PurePosixPath
from secrets import compare_digest, token_urlsafe
import webbrowser
from threading import Thread
from time import monotonic

from account_payload import TTL_SECONDS
from apel_payload import Denied
from api_dispatch import response
from codex_rehearsal import ACTORS, ENTRY, MIME, ROOT, fixture, load_assets, package
from rehearsal_host import RehearsalHost

SESSION = "/local/session"
DISPATCH = "/local/dispatch"
BOOTSTRAP = "/local-workspace.mjs"
COOKIE = "yandik_demo"
CONTENT_LIMIT = 70_000
STATIC_TYPES = {**MIME, ".md": "text/plain; charset=utf-8"}


class DemoServer(HTTPServer):
    """Serial requests keep the SQLite connection on its owning thread."""

    def __init__(self, port, *, actors, allow_commands=False):
        self.assets = load_assets(package())
        page, mime = self.assets[ENTRY]
        script = b'<script type="module" src="/local-workspace.mjs"></script>'
        self.assets[ENTRY] = (page.replace(b"</head>", script + b"</head>", 1), mime)
        script_path = ROOT / "drafts/yandik-portal/local-workspace.mjs"
        self.assets[BOOTSTRAP] = (script_path.read_bytes(), MIME[".mjs"])
        self.codes = {actor: token_urlsafe(12) for actor in actors}
        self.sessions = {}
        self.allow_commands = allow_commands
        self.host = None
        super().__init__(("127.0.0.1", port), DemoRequest)
        try:
            self.host = RehearsalHost(execution_authorized=True, allow_demo_commands=allow_commands)
        except BaseException:
            super().server_close()
            raise

    @property
    def authority(self):
        return f"127.0.0.1:{self.server_port}"

    def server_close(self):
        try:
            if self.host is not None:
                self.host.close()
        finally:
            super().server_close()

    def sign_in(self, code):
        if not isinstance(code, str) or not code.isascii() or len(code) != 16:
            return None
        actor = next((actor for actor, candidate in self.codes.items()
                      if compare_digest(candidate, code)), None)
        if actor is None:
            return None
        handle = self.host.issue(fixture(actor))
        now = monotonic()
        self.sessions = {key: item for key, item in self.sessions.items() if item[1] > now}
        key = token_urlsafe(32)
        self.sessions[key] = (handle, now + TTL_SECONDS)
        return key

    def handle_for(self, key):
        session = self.sessions.get(key)
        if session and session[1] > monotonic():
            return session[0]
        self.sessions.pop(key, None)
        return None

    def sign_out(self, key):
        session = self.sessions.pop(key, None)
        if session:
            self.host.logout(session[0])


def fixture_asset(url_path):
    """Serve linked fixture modules and development docs by file type and directory."""
    path = PurePosixPath(url_path)
    parts = path.parts
    if (len(parts) < 3 or parts[0] != "/" or path.as_posix() != url_path
            or ".." in parts or "tests" in parts or any(part.startswith(".") for part in parts[1:])):
        return None
    if parts[1] == "docs":
        if path.suffix != ".md":
            return None
    elif (parts[1] not in ("drafts", "prototypes") or len(parts) < 4
          or parts[2] in ("yandik-backend-contract", "yandik-qa") or path.suffix not in MIME):
        return None
    file = ROOT.joinpath(*parts[1:]).resolve()
    logical_path = ROOT.joinpath(*parts[1:])
    if file != logical_path or not file.is_file():
        return None
    return file.read_bytes(), STATIC_TYPES[path.suffix]


class DemoRequest(BaseHTTPRequestHandler):
    def setup(self):
        self.request.settimeout(10)
        super().setup()

    def send_bytes(self, status, body=b"", mime="text/plain; charset=utf-8", **headers):
        self.send_response(status)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Security-Policy",
                         "default-src 'self'; style-src 'self' 'unsafe-inline'; "
                         "img-src 'self' data:; frame-ancestors 'none'; object-src 'none'; base-uri 'none'")
        for key, value in headers.items():
            self.send_header(key.replace("_", "-"), value)
        self.end_headers()
        if body:
            self.wfile.write(body)

    def send_json(self, body, *, cookie=None):
        headers = {} if cookie is None else {"Set_Cookie": cookie}
        self.send_bytes(body["status"], json.dumps(body, ensure_ascii=False).encode(),
                        "application/json; charset=utf-8", **headers)

    def cookie_key(self):
        cookies = SimpleCookie()
        try:
            cookies.load(self.headers.get("Cookie", ""))
        except CookieError:
            return None
        value = cookies.get(COOKIE)
        return value.value if value else None

    def check_host(self):
        return self.headers.get_all("Host") == [self.server.authority]

    def do_GET(self):
        if not self.check_host():
            self.send_bytes(403)
            return
        if self.path == "/":
            self.send_bytes(302, Location=ENTRY)
            return
        if self.path == "/favicon.ico":
            self.send_bytes(204)
            return
        if self.path == SESSION:
            handle = self.server.handle_for(self.cookie_key())
            result = response(401, code="DEMO_SESSION_INVALID")
            if handle:
                result = self.server.host.dispatch(handle, {
                    "method": "GET", "path": "/api/v1/core", "query": {}, "body": None,
                })
                if result["status"] == 200:
                    result = response(200, {"allow_commands": self.server.allow_commands})
            self.send_json(result)
            return
        asset = self.server.assets.get(self.path) or fixture_asset(self.path)
        if asset is None:
            self.send_bytes(404)
        else:
            data, mime = asset
            self.send_bytes(200, data, mime)

    def do_POST(self):
        if not self.check_host() or self.headers.get_all("Origin") != ["http://" + self.server.authority]:
            self.send_json(response(403, code="ORIGIN_DENIED"))
            return
        if self.path not in (SESSION, DISPATCH):
            self.send_json(response(404, code="ROUTE_NOT_FOUND"))
            return
        if self.headers.get_content_type() != "application/json" or self.headers.get("Transfer-Encoding"):
            self.send_json(response(415, code="JSON_REQUIRED"))
            return
        lengths = self.headers.get_all("Content-Length", [])
        if len(lengths) != 1 or not lengths[0].isascii() or not lengths[0].isdigit() or len(lengths[0]) > 5:
            self.send_json(response(400, code="LENGTH_INVALID"))
            return
        size = int(lengths[0])
        if size > CONTENT_LIMIT:
            self.send_json(response(413, code="REQUEST_TOO_LARGE"))
            return
        try:
            request = json.loads(self.rfile.read(size))
            if type(request) is not dict:
                raise ValueError
        except (ValueError, RecursionError, TimeoutError):
            self.send_json(response(400, code="REQUEST_INVALID"))
            return
        key = self.cookie_key()
        if self.path == SESSION:
            self.session_command(key, request)
            return
        handle = self.server.handle_for(key)
        if handle is None:
            result = response(401, code="DEMO_SESSION_INVALID")
        else:
            try:
                result = self.server.host.dispatch(handle, request)
            except Denied:
                result = response(422, code="REQUEST_INVALID")
        self.send_json(result)

    def session_command(self, key, request):
        cookie = f"{COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict"
        if request == {"action": "logout"}:
            self.server.sign_out(key)
            self.send_json(response(200), cookie=cookie)
            return
        new_key = self.server.sign_in(request["code"]) if set(request) == {"code"} else None
        if not new_key:
            self.send_json(response(401, code="DEMO_CODE_INVALID"))
            return
        self.server.sign_out(key)
        cookie = f"{COOKIE}={new_key}; Max-Age={TTL_SECONDS}; Path=/; HttpOnly; SameSite=Strict"
        self.send_json(response(200, {"allow_commands": self.server.allow_commands}), cookie=cookie)


def main():
    parser = argparse.ArgumentParser(description="YANDIK+ DEMO · SQLite in-memory · loopback only")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--actor", action="append", choices=ACTORS)
    parser.add_argument("--allow-demo-commands", action="store_true")
    parser.add_argument("--open-browser", action="store_true", help="Buka demo di browser perangkat ini")
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error("Port di luar rentang 0–65535")
    actors = args.actor or ["ALPHA", "KAB-UTARA", "REVIEW", "LEADER"]
    with DemoServer(args.port, actors=actors, allow_commands=args.allow_demo_commands) as server:
        url = f"http://{server.authority}/"
        print(f"Buka {url}", flush=True)
        for actor, code in server.codes.items():
            print(f"Kode sesi DEMO {actor}: {code}", flush=True)
        if args.open_browser:
            Thread(target=webbrowser.open_new_tab, args=(url,), daemon=True).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
