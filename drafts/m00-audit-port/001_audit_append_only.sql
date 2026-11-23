-- M00-G5 | KODE DITULIS, BELUM DIUJI | DOCUMENTARY MIGRATION DRAFT.
-- THIS FILE HAS NEVER BEEN EXECUTED. NO PRODUCTION DATABASE OR MIGRATION.
-- SQLite design for a future server-side writer. Not sufficient by itself
-- for auth, durable storage, backup, access logging, or tamper resistance.
-- Requires access-controlled DB, trusted server timestamp, isolation, and
-- BEGIN IMMEDIATE with conditional revision checks in one real transaction.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS demo_review_stream (
    link_id TEXT PRIMARY KEY NOT NULL,
    source_basis_digest TEXT NOT NULL CHECK(length(source_basis_digest) = 64),
    last_revision INTEGER NOT NULL DEFAULT 0 CHECK(last_revision >= 0),
    last_audit_digest TEXT NOT NULL CHECK(length(last_audit_digest) = 64),
    created_at_utc TEXT NOT NULL,
    updated_at_utc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS demo_review_audit (
    stream_event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL UNIQUE,
    link_id TEXT NOT NULL,
    stream_revision INTEGER NOT NULL CHECK(stream_revision > 0),
    source_basis_digest TEXT NOT NULL CHECK(length(source_basis_digest) = 64),
    reviewer_ref TEXT NOT NULL,
    action_code TEXT NOT NULL,
    reason_code TEXT NOT NULL,
    previous_digest TEXT NOT NULL CHECK(length(previous_digest) = 64),
    event_digest TEXT NOT NULL CHECK(length(event_digest) = 64),
    recorded_at_utc TEXT NOT NULL,
    is_official INTEGER NOT NULL DEFAULT 0 CHECK(is_official = 0),
    UNIQUE(link_id, stream_revision),
    FOREIGN KEY (link_id) REFERENCES demo_review_stream(link_id)
);

CREATE TRIGGER IF NOT EXISTS demo_review_stream_delete_deny
BEFORE DELETE ON demo_review_stream
BEGIN SELECT RAISE(ABORT, 'AUDIT_STREAM_DELETE_DENIED'); END;

CREATE TRIGGER IF NOT EXISTS demo_review_audit_update_deny
BEFORE UPDATE ON demo_review_audit
BEGIN SELECT RAISE(ABORT, 'AUDIT_EVENT_UPDATE_DENIED'); END;

CREATE TRIGGER IF NOT EXISTS demo_review_audit_delete_deny
BEFORE DELETE ON demo_review_audit
BEGIN SELECT RAISE(ABORT, 'AUDIT_EVENT_DELETE_DENIED'); END;

-- NOT INCLUDED: actual write transaction, host session, permission checks,
-- trusted source signatures, object-level authorization, backup/restore,
-- retention, operational monitoring, or tamper-resistant external anchors.
