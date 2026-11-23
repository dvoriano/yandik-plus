-- M00-G7 | CODE_ONLY | NOT EXECUTED IN CHAT | MEMORY-ONLY DEMO SCHEMA
-- This code must NOT be applied to a production database.
PRAGMA foreign_keys=ON;
CREATE TABLE demo_stream (
  link_id TEXT PRIMARY KEY,
  basis_digest TEXT NOT NULL CHECK(length(basis_digest)=64),
  revision INTEGER NOT NULL CHECK(revision>=0),
  head_digest TEXT NOT NULL CHECK(length(head_digest)=64),
  created_at_utc TEXT NOT NULL,
  updated_at_utc TEXT NOT NULL
);
CREATE TABLE demo_audit (
  event_id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL REFERENCES demo_stream(link_id),
  revision INTEGER NOT NULL CHECK(revision>0),
  reviewer_id TEXT NOT NULL,
  action_code TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  basis_digest TEXT NOT NULL CHECK(length(basis_digest)=64),
  previous_digest TEXT NOT NULL CHECK(length(previous_digest)=64),
  event_digest TEXT NOT NULL CHECK(length(event_digest)=64),
  recorded_at_utc TEXT NOT NULL,
  is_official INTEGER NOT NULL CHECK(is_official=0),
  UNIQUE(link_id,revision)
);
CREATE TABLE demo_command (
  command_id TEXT PRIMARY KEY,
  input_digest TEXT NOT NULL CHECK(length(input_digest)=64),
  link_id TEXT NOT NULL REFERENCES demo_stream(link_id),
  result_revision INTEGER NOT NULL CHECK(result_revision>0),
  result_head TEXT NOT NULL CHECK(length(result_head)=64)
);
CREATE TRIGGER demo_audit_update_deny
BEFORE UPDATE ON demo_audit BEGIN SELECT RAISE(ABORT,'AUDIT_UPDATE_DENIED'); END;
CREATE TRIGGER demo_audit_delete_deny
BEFORE DELETE ON demo_audit BEGIN SELECT RAISE(ABORT,'AUDIT_DELETE_DENIED'); END;
CREATE TRIGGER demo_command_update_deny
BEFORE UPDATE ON demo_command BEGIN SELECT RAISE(ABORT,'COMMAND_UPDATE_DENIED'); END;
CREATE TRIGGER demo_command_delete_deny
BEFORE DELETE ON demo_command BEGIN SELECT RAISE(ABORT,'COMMAND_DELETE_DENIED'); END;
CREATE TRIGGER demo_stream_delete_deny
BEFORE DELETE ON demo_stream BEGIN SELECT RAISE(ABORT,'STREAM_DELETE_DENIED'); END;
-- Triggers cannot protect against a malicious DB administrator, process-level
-- tampering, filesystem manipulation, deletion, backup theft or data retention.
