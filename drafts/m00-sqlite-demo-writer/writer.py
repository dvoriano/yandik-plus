"""M00-G7 | CODE ONLY | KODE DITULIS BELUM DIUJI.
SQLite in-memory demo writer. It can NEVER open a named database file.
No Flask integration, official identity or legitimate source authorization.
"""
import hashlib
import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = "M00-G7-ATOMIC-INMEMORY-UNTESTED-1"
ZERO = "0" * 64
SHA = re.compile(r"[a-f0-9]{64}\Z")
LINK = re.compile(r"DEMO-CROSSWALK-[A-Z0-9_-]{1,28}\Z")
CMD = re.compile(r"DEMO-COMMAND-[A-Z0-9_-]{1,32}\Z")
USER = re.compile(r"DEMO-USER-[A-Z0-9_-]{1,40}\Z")
ACTIONS = {"REQUEST_EVIDENCE_DEMO", "POSSIBLY_RELATED_DEMO",
           "DISTINCT_RECORDS_DEMO", "REOPEN_DEMO"}
REASONS = {"IDENTIFIER_UNCLEAR_DEMO", "LOCATION_UNCLEAR_DEMO",
           "PERIOD_UNCLEAR_DEMO", "SOURCE_COMPARISON_DEMO",
           "MANUAL_ASSESSMENT_DEMO"}
INTENT_KEYS = {"command_id", "link_id", "expected_revision",
               "expected_head_digest", "basis_digest", "action_code",
               "reason_code", "official_authorization"}
SESSION_KEYS = {"id", "role", "active", "region"}

class DemoWriterDenied(Exception):
    pass

def exact(d, keys):
    return type(d) is dict and set(d) == keys

def matches(value, pattern):
    return isinstance(value, str) and pattern.fullmatch(value) is not None

def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)

def digest(value):
    return hashlib.sha256(canonical(value).encode("utf8")).hexdigest()

def _assert_memory(conn):
    if not isinstance(conn, sqlite3.Connection):
        raise DemoWriterDenied("SQLITE_CONNECTION_REQUIRED")
    databases = list(conn.execute("PRAGMA database_list"))
    if len(databases) != 1 or databases[0][1] != "main" or databases[0][2]:
        raise DemoWriterDenied("DISK_DATABASE_FORBIDDEN")
    if conn.execute("PRAGMA foreign_keys").fetchone()[0] != 1:
        raise DemoWriterDenied("FOREIGN_KEYS_REQUIRED")

def _actor(resolve_server_session, *, can_write):
    if not callable(resolve_server_session):
        raise DemoWriterDenied("SERVER_SESSION_REQUIRED")
    session = resolve_server_session()
    if (not exact(session, SESSION_KEYS)
        or not matches(session["id"], USER)
        or session["active"] is not True
        or session["role"] not in ({"provinsi_verifikator"} if can_write
                                  else {"provinsi_verifikator", "provinsi_admin"})
        or session["region"] not in {"Wilayah DEMO Utara", "Wilayah DEMO Selatan"}):
        raise DemoWriterDenied("ACCESS_DENIED")
    # This is an untrusted demonstration callback, NOT a real auth service.
    return session

def _intent(x):
    if not exact(x, INTENT_KEYS) or (
        not matches(x["command_id"], CMD)
        or not matches(x["link_id"], LINK)
        or type(x["expected_revision"]) is not int
        or not 0 <= x["expected_revision"] <= 100
        or not matches(x["expected_head_digest"], SHA)
        or not matches(x["basis_digest"], SHA)
        or x["action_code"] not in ACTIONS
        or x["reason_code"] not in REASONS
        or x["official_authorization"] is not False
    ):
        raise DemoWriterDenied("INTENT_DENIED")
    if x["expected_revision"] == 0 and x["expected_head_digest"] != ZERO:
        raise DemoWriterDenied("FIRST_REVISION_HEAD_INVALID")
    if x["expected_revision"] == 0 and x["action_code"] == "REOPEN_DEMO":
        raise DemoWriterDenied("REOPEN_REQUIRES_PRIOR_NOTE")
    return x

def create_in_memory_demo_store():
    """Only creates an ephemeral SQLite :memory: database if invoked."""
    conn = sqlite3.connect(":memory:", isolation_level=None)
    try:
        conn.execute("PRAGMA foreign_keys=ON")
        sql = (Path(__file__).resolve().parent / "schema.sql").read_text("utf-8")
        conn.executescript(sql)
        _assert_memory(conn)
    except Exception:
        conn.close()
        raise
    return conn

def _receipt(link_id, revision, head, replayed):
    return {"schema": SCHEMA, "synthetic": True,
            "mode": "IN_MEMORY_TRANSACTION_ONLY", "link_id": link_id,
            "review_revision_demo": revision,
            "head_digest_demo": head, "idempotent_replay_demo": replayed,
            "committed_in_memory_demo": True,
            "persisted_to_disk": False, "audit_immutable_proven": False,
            "source_authenticated": False, "production_identity_verified": False,
            "may_publish": False, "may_sync": False,
            "official_authorization": False}

def append_demo_review(conn, *, intent, resolve_server_session):
    """BEGIN IMMEDIATE + version check + audit and command insert + COMMIT."""
    _assert_memory(conn)
    x = _intent(intent)
    actor = _actor(resolve_server_session, can_write=True)
    actor_id = actor["id"]
    request_hash = digest({"intent": x, "actor": actor_id})
    conn.execute("BEGIN IMMEDIATE")
    try:
        old = conn.execute(
            "SELECT input_digest, link_id, result_revision, result_head "
            "FROM demo_command WHERE command_id=?", (x["command_id"],)
        ).fetchone()
        if old is not None:
            if old[0] != request_hash or old[1] != x["link_id"]:
                raise DemoWriterDenied("IDEMPOTENCY_CONFLICT")
            conn.execute("COMMIT")
            return _receipt(old[1], old[2], old[3], True)
        stream = conn.execute(
            "SELECT basis_digest,revision,head_digest "
            "FROM demo_stream WHERE link_id=?", (x["link_id"],)
        ).fetchone()
        if stream is None:
            revision = 0
            head = ZERO
            if x["expected_revision"] != 0 or x["expected_head_digest"] != ZERO:
                raise DemoWriterDenied("STREAM_NOT_FOUND")
            now = datetime.now(timezone.utc).isoformat()
            conn.execute(
                "INSERT INTO demo_stream(link_id,basis_digest,revision,"
                "head_digest,created_at_utc,updated_at_utc) VALUES(?,?,?,?,?,?)",
                (x["link_id"], x["basis_digest"], 0, ZERO, now, now),
            )
        else:
            basis, revision, head = stream
            if basis != x["basis_digest"]:
                raise DemoWriterDenied("STALE_SOURCE_DIGEST")
        if (revision != x["expected_revision"]
            or head != x["expected_head_digest"]):
            raise DemoWriterDenied("REVISION_CONFLICT")
        if x["action_code"] == "REOPEN_DEMO" and revision == 0:
            raise DemoWriterDenied("REOPEN_REQUIRES_PRIOR_NOTE")
        next_revision = revision + 1
        event = {
            "link_id": x["link_id"], "revision": next_revision,
            "reviewer_id": actor_id, "action_code": x["action_code"],
            "reason_code": x["reason_code"],
            "basis_digest": x["basis_digest"], "previous_digest": head,
            "official_authorization": False,
        }
        event_hash = digest(event)
        event_id = "DEMO-AUDIT-" + x["command_id"][len("DEMO-COMMAND-"):]
        timestamp = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "INSERT INTO demo_audit(event_id,link_id,revision,"
            "reviewer_id,action_code,reason_code,basis_digest,"
            "previous_digest,event_digest,recorded_at_utc,is_official)"
            "VALUES(?,?,?,?,?,?,?,?,?,?,0)",
            (event_id, x["link_id"], next_revision, actor_id,
             x["action_code"], x["reason_code"], x["basis_digest"],
             head, event_hash, timestamp),
        )
        updated = conn.execute(
            "UPDATE demo_stream SET revision=?,head_digest=?,updated_at_utc=? "
            "WHERE link_id=? AND revision=? AND head_digest=? AND basis_digest=?",
            (next_revision, event_hash, timestamp, x["link_id"],
             revision, head, x["basis_digest"]),
        ).rowcount
        if updated != 1:
            raise DemoWriterDenied("STREAM_COMPARE_AND_SWAP_FAILED")
        conn.execute(
            "INSERT INTO demo_command(command_id,input_digest,link_id,"
            "result_revision,result_head) VALUES(?,?,?,?,?)",
            (x["command_id"], request_hash, x["link_id"],
             next_revision, event_hash),
        )
        conn.execute("COMMIT")
        return _receipt(x["link_id"], next_revision, event_hash, False)
    except BaseException:
        conn.execute("ROLLBACK")
        raise

def read_demo_audit_summary(conn, *, link_id, resolve_server_session):
    """Checks in-memory chain. Deliberately does not return reviewer identity."""
    _assert_memory(conn)
    _actor(resolve_server_session, can_write=False)
    if not matches(link_id, LINK):
        raise DemoWriterDenied("LINK_DENIED")
    row = conn.execute("SELECT basis_digest,revision,head_digest "
                       "FROM demo_stream WHERE link_id=?", (link_id,)).fetchone()
    if row is None:
        raise DemoWriterDenied("LINK_NOT_FOUND")
    basis, revision, expected_head = row
    entries = conn.execute(
        "SELECT reviewer_id,action_code,reason_code,basis_digest,"
        "previous_digest,event_digest,revision "
        "FROM demo_audit WHERE link_id=? ORDER BY revision", (link_id,)
    ).fetchall()
    if len(entries) != revision:
        raise DemoWriterDenied("AUDIT_LENGTH_MISMATCH")
    head = ZERO
    for i, (actor, action, reason, entry_basis, prev, event_hash, rev) in enumerate(entries, 1):
        ev={"link_id":link_id,"revision":i,"reviewer_id":actor,
            "action_code":action,"reason_code":reason,
            "basis_digest":entry_basis,"previous_digest":prev,
            "official_authorization":False}
        if (rev!=i or entry_basis!=basis or prev!=head
            or digest(ev)!=event_hash):
            raise DemoWriterDenied("AUDIT_CHAIN_MISMATCH")
        head=event_hash
    if head!=expected_head:
        raise DemoWriterDenied("AUDIT_HEAD_MISMATCH")
    return {"schema":SCHEMA,"synthetic":True,
            "recorded_review_notes_demo":revision,
            "hash_chain_self_consistent_demo":True,
            "durable_audit_proven":False, "production_authorization_proven":False,
            "no_actor_identity_exposed":True,
            "official_case_count":None, "may_publish":False,
            "official_authorization":False}
