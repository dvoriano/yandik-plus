-- CODE_ONLY | companion schema. Not a migration.
CREATE TABLE contract_inventory_payload (
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 catalog_digest TEXT NOT NULL CHECK(length(catalog_digest)=64),
 snapshot_json TEXT NOT NULL,
 domain_action TEXT NOT NULL CHECK(domain_action IN ('save_item','copy_prior','confirm_item','confirm_group','submit','county_review','return_correction','province_review','reopen')),
 reason_code TEXT,
 PRIMARY KEY(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TRIGGER contract_inventory_payload_update_deny BEFORE UPDATE ON contract_inventory_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_inventory_payload_delete_deny BEFORE DELETE ON contract_inventory_payload BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
