-- CODE_ONLY. Companion typed payload table for K4 rehearsal schema.
CREATE TABLE contract_apel_payload (
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 payload_json TEXT NOT NULL,
 reason_code TEXT CHECK(reason_code IS NULL OR reason_code IN ('CHECK_COUNTS_DEMO','CHECK_ACTIVITY_DEMO','REVIEW_RECORDED_DEMO')),
 PRIMARY KEY(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TRIGGER contract_apel_payload_update_deny BEFORE UPDATE ON contract_apel_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_apel_payload_delete_deny BEFORE DELETE ON contract_apel_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
-- Payload and reason are validated by the dedicated Python writer, not generic CRUD.
