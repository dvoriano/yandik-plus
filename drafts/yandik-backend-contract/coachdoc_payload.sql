-- CODE_ONLY. Companion typed tables. No migration.
CREATE TABLE contract_coaching_activity (
 record_id TEXT PRIMARY KEY,
 facility_id TEXT NOT NULL,
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 slot INTEGER NOT NULL CHECK(slot IN (1,2)),
 FOREIGN KEY(record_id,facility_id) REFERENCES contract_record(id,facility_id),
 UNIQUE(facility_id,year,slot)
);
CREATE TABLE contract_coaching_document (
 record_id TEXT PRIMARY KEY,
 facility_id TEXT NOT NULL,
 activity_id TEXT NOT NULL REFERENCES contract_coaching_activity(record_id),
 kind TEXT NOT NULL CHECK(kind IN ('HASIL','BA','PENGANTAR','REKAP')),
 FOREIGN KEY(record_id,facility_id) REFERENCES contract_record(id,facility_id),
 FOREIGN KEY(activity_id,facility_id) REFERENCES contract_record(id,facility_id),
 UNIQUE(activity_id,kind)
);
CREATE TABLE contract_coachdoc_payload (
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 schema_version TEXT NOT NULL,
 domain_action TEXT NOT NULL,
 snapshot_json TEXT NOT NULL,
 command_payload_json TEXT NOT NULL,
 PRIMARY KEY(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TRIGGER contract_coachdoc_payload_update_deny BEFORE UPDATE ON contract_coachdoc_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_coachdoc_payload_delete_deny BEFORE DELETE ON contract_coachdoc_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_document_source_update_deny BEFORE UPDATE ON contract_document_source BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_document_source_delete_deny BEFORE DELETE ON contract_document_source BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_evidence_ref_update_deny BEFORE UPDATE ON contract_evidence_ref BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_evidence_ref_delete_deny BEFORE DELETE ON contract_evidence_ref BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
