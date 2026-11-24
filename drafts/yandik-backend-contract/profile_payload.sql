-- CODE_ONLY | companion tables. Not a migration.
CREATE TABLE contract_profile_section (
 record_id TEXT PRIMARY KEY,
 facility_id TEXT NOT NULL,
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 section TEXT NOT NULL CHECK(section IN ('legalitas','bangunan','peralatan','obat_bhp','wilayah_kerja','surveilans','kesmavet')),
 schema_version TEXT NOT NULL,
 FOREIGN KEY(record_id,facility_id) REFERENCES contract_record(id,facility_id),
 UNIQUE(facility_id,year,section)
);
CREATE TABLE contract_profile_payload (
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 schema_version TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 domain_action TEXT NOT NULL CHECK(domain_action IN ('save_draft','submit','return_correction','record_review','reopen')),
 reason_code TEXT,
 PRIMARY KEY(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TRIGGER contract_profile_payload_update_deny BEFORE UPDATE ON contract_profile_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_profile_payload_delete_deny BEFORE DELETE ON contract_profile_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
