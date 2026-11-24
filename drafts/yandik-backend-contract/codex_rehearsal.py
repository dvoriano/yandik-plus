"""K4-C8 | CODE_ONLY. Optional local browser rehearsal, NOT a server.
Nothing runs on import. Do not execute until owner separately authorizes browser + memory DDL.
No auto package/browser install, HTTP listener, persistent DB or production credentials.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit

BASE=Path(__file__).resolve().parent
ROOT=BASE.parent.parent
ORIGIN="http://127.0.0.1:8765"
ENTRY="/drafts/yandik-portal/backend-review.html"
ACTORS=("ALPHA","BETA","GAMMA","KAB-UTARA","KAB-SELATAN","REVIEW","REVIEW2","ADMIN","LEADER")
MIME={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".mjs":"text/javascript; charset=utf-8"}
def package():
    data=json.loads((BASE/"integrated_package.json").read_text("utf-8"))
    if data["execution_authorized"] is not False or data["production_authorization"] is not False or data["persistent"] is not False or data["network_service"] is not False or data["real_data_allowed"] is not False or data["virtual_origin"]!=ORIGIN:raise ValueError("PACKAGE_GUARD")
    return data
def static_path(url,method,allowlist):
    # Exact origin/path/method; no URL decoding, query, traversal or arbitrary file serving.
    if method!="GET" or not isinstance(url,str):return None
    parts=urlsplit(url)
    if parts.scheme!="http" or parts.netloc!="127.0.0.1:8765" or parts.query or parts.fragment:return None
    path=parts.path
    if path not in allowlist:return None
    return path
def fixture(actor):
    if actor not in ACTORS:raise ValueError("FIXTURE_DENIED")
    return lambda:{"actor_id":"DEMO-ACTOR-"+actor,"grant_id":"DEMO-GRANT-"+actor}
def browser_request(source,page,request):
    # The host selects and binds actor/handle. Never accept identity or a handle from page data.
    return source["page"]==page and source["frame"]==page.main_frame and source["frame"].url==ORIGIN+ENTRY and type(request) is dict and set(request)=={"method","path","query","body"}
def cli(argv=None):
    parser=argparse.ArgumentParser(description="Local synthetic YANDIK+ rehearsal only; no production")
    parser.add_argument("--authorize-local-rehearsal",action="store_true")
    parser.add_argument("--allow-demo-commands",action="store_true")
    parser.add_argument("--actor",action="append",choices=ACTORS)
    opts=parser.parse_args(argv)
    if not opts.authorize_local_rehearsal:parser.error("Separate owner permission for browser and memory DDL required")
    opts.actor=opts.actor or ["ALPHA"]
    if len(opts.actor)>5 or len(set(opts.actor))!=len(opts.actor):parser.error("Choose one to five distinct DEMO actors")
    return opts
def load_assets(data):
    assets={}
    for rel in data["static_files"]:
        path=ROOT/rel
        if not rel.startswith(("drafts/yandik-portal/","drafts/yandik-backend-contract/")) or path.suffix not in MIME or not path.is_file() or not path.resolve().is_relative_to(ROOT.resolve()) or rel!=path.relative_to(ROOT).as_posix():raise ValueError("STATIC_ASSET_INVALID")
        assets["/"+rel]=(path.read_bytes(),MIME[path.suffix])
    if ENTRY not in assets:raise ValueError("ENTRY_MISSING")
    return assets
def main(argv=None):
    opts=cli(argv)
    data=package();assets=load_assets(data)
    # Optional dependencies only after the explicit local authorization flag.
    from playwright.sync_api import sync_playwright
    from rehearsal_host import RehearsalHost
    from api_dispatch import response
    from apel_payload import Denied
    host=RehearsalHost(execution_authorized=True,allow_demo_commands=opts.allow_demo_commands)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=False)
            try:
                pages=[];contexts=[]
                def static(route):
                    path=static_path(route.request.url,route.request.method,assets)
                    if path is None:route.abort();return
                    body,mime=assets[path]
                    route.fulfill(status=200,body=body,content_type=mime,headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"})
                def install(actor):
                    ctx=browser.new_context(service_workers="block",accept_downloads=False)
                    contexts.append(ctx);ctx.route("**/*",static)
                    page=ctx.new_page();handle=host.issue(fixture(actor))
                    def dispatch(source,request):
                        if not browser_request(source,page,request):return response(403,code="REHEARSAL_CONTEXT_REQUIRED")
                        try:return host.dispatch(handle,request)
                        except Denied:return response(401,code="DEMO_SESSION_INVALID")
                        except Exception:return response(500,code="HOST_ERROR")
                    page.expose_binding("yandikDemoDispatch",dispatch)
                    page.goto(ORIGIN+ENTRY,wait_until="domcontentloaded")
                    page.evaluate("""async (enabled)=>{
                        const m=await import('./backend-workspace.mjs');
                        await m.mountBackendWorkspace(document.getElementById('backend-root'),{
                            transport:req=>window.yandikDemoDispatch(req),
                            executionAuthorized:true,allowCommands:enabled
                        });
                    }""",opts.allow_demo_commands)
                    pages.append(page)
                for actor in opts.actor:install(actor)
                # Pump the sync Playwright loop so page binding calls remain serviced.
                # Stop by closing all pages or Ctrl+C. No background server.
                print("DEMO only; isolated browser contexts. Close all pages or Ctrl+C to stop.")
                while any(not page.is_closed() for page in pages):
                    page=next((p for p in pages if not p.is_closed()),None)
                    if page is None:break
                    try:page.wait_for_timeout(300)
                    except Exception:
                        if not page.is_closed():raise
            finally:browser.close()
    finally:host.close()
if __name__=="__main__":main()
