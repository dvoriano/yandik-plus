-- CODE_ONLY. New read-only source snapshots, append-only internal review sidecar.
CREATE TABLE contract_regional_snapshot (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-REGREC-*'),
 domain TEXT NOT NULL CHECK(domain IN ('medicine','practice','surveillance','certificates')),
 region_id TEXT NOT NULL REFERENCES contract_region(id),
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 period TEXT NOT NULL,
 schema_version TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 payload_digest TEXT NOT NULL CHECK(length(payload_digest)=64)
);
CREATE TABLE contract_regional_coverage (
 domain TEXT NOT NULL CHECK(domain IN ('medicine','practice','surveillance','certificates')),
 region_id TEXT NOT NULL REFERENCES contract_region(id),
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 PRIMARY KEY(domain,region_id,year)
);
CREATE TABLE contract_regional_review (
 record_id TEXT NOT NULL REFERENCES contract_regional_snapshot(id),
 revision INTEGER NOT NULL CHECK(revision>0),
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 source_digest TEXT NOT NULL,
 action TEXT NOT NULL CHECK(action IN ('request_clarification','record_discussion','reopen_discussion')),
 reason_code TEXT NOT NULL CHECK(reason_code IN ('CHECK_SOURCE_DEMO','CHECK_COMPLETENESS_DEMO','DISCUSS_FOLLOWUP_DEMO')),
 state TEXT NOT NULL CHECK(state IN ('CLARIFICATION_REQUESTED_DEMO','DISCUSSION_RECORDED_DEMO')),
 recorded_at_utc TEXT NOT NULL,
 PRIMARY KEY(record_id,revision)
);
CREATE TABLE contract_regional_command (
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 command_id TEXT NOT NULL,
 request_digest TEXT NOT NULL CHECK(length(request_digest)=64),
 record_id TEXT NOT NULL,
 result_revision INTEGER NOT NULL,
 PRIMARY KEY(actor_id,command_id),
 FOREIGN KEY(record_id,result_revision) REFERENCES contract_regional_review(record_id,revision)
);
CREATE TRIGGER contract_regional_snapshot_update_deny BEFORE UPDATE ON contract_regional_snapshot BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_snapshot_delete_deny BEFORE DELETE ON contract_regional_snapshot BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_coverage_update_deny BEFORE UPDATE ON contract_regional_coverage BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_coverage_delete_deny BEFORE DELETE ON contract_regional_coverage BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_review_update_deny BEFORE UPDATE ON contract_regional_review BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_review_delete_deny BEFORE DELETE ON contract_regional_review BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_command_update_deny BEFORE UPDATE ON contract_regional_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_regional_command_delete_deny BEFORE DELETE ON contract_regional_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
