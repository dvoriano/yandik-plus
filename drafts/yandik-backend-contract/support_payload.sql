-- CODE_ONLY. No migration; companion schema for new synthetic cases only.
CREATE TABLE contract_support_case (
 record_id TEXT PRIMARY KEY,
 facility_id TEXT NOT NULL,
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 item_id TEXT NOT NULL CHECK(item_id IN ('A.4.a','A.4.b')),
 FOREIGN KEY(record_id,facility_id) REFERENCES contract_record(id,facility_id),
 UNIQUE(facility_id,year,item_id)
);
CREATE TABLE contract_support_payload (
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 schema_version TEXT NOT NULL,
 domain_action TEXT NOT NULL,
 snapshot_json TEXT NOT NULL,
 command_payload_json TEXT NOT NULL,
 PRIMARY KEY(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TRIGGER contract_support_payload_update_deny BEFORE UPDATE ON contract_support_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_support_payload_delete_deny BEFORE DELETE ON contract_support_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
