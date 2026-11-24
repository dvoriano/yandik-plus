-- CODE_ONLY. Logical SQLite rehearsal schema; NOT a migration for existing database.
-- No script in this directory executes it. Use only disposable synthetic memory DB after permission.
PRAGMA foreign_keys=ON;
CREATE TABLE contract_region (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-REGION-*'),
 label TEXT NOT NULL
);
CREATE TABLE contract_facility (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-PSW-*'),
 region_id TEXT NOT NULL REFERENCES contract_region(id),
 label TEXT NOT NULL,
 UNIQUE(id,region_id)
);
CREATE TABLE contract_actor (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-ACTOR-*'),
 active INTEGER NOT NULL CHECK(active IN (0,1))
);
-- One grant is an assignment, not a client-supplied role. Scope and active status
-- must also be checked server-side per request, with revocation and field projection.
CREATE TABLE contract_grant (
 id TEXT PRIMARY KEY,
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 role TEXT NOT NULL CHECK(role IN ('puskeswan','kab_kota','provinsi_verifikator','provinsi_admin','pimpinan')),
 scope_kind TEXT NOT NULL CHECK(scope_kind IN ('facility','region','province')),
 region_id TEXT REFERENCES contract_region(id),
 facility_id TEXT,
 active INTEGER NOT NULL CHECK(active IN (0,1)),
 FOREIGN KEY(facility_id,region_id) REFERENCES contract_facility(id,region_id),
 CHECK((role='puskeswan' AND scope_kind='facility' AND facility_id IS NOT NULL AND region_id IS NOT NULL)
 OR (role='kab_kota' AND scope_kind='region' AND region_id IS NOT NULL AND facility_id IS NULL)
 OR (role IN ('provinsi_admin','provinsi_verifikator','pimpinan') AND scope_kind='province' AND region_id IS NULL AND facility_id IS NULL))
);
CREATE TABLE contract_source (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-SOURCE-*'),
 namespace TEXT NOT NULL,
 source_version TEXT NOT NULL,
 digest TEXT NOT NULL CHECK(length(digest)=64 AND digest NOT GLOB '*[^0-9a-f]*'),
 verification TEXT NOT NULL CHECK(verification='UNVERIFIED_DEMO'),
 UNIQUE(namespace,source_version,digest)
);
-- Mapping candidates never establish identity. Each accepted mapping must be separately
-- reviewed in future authorized reconciliation; this rehearsal permits candidates only.
CREATE TABLE contract_crosswalk_candidate (
 id TEXT PRIMARY KEY,
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 external_id TEXT NOT NULL,
 facility_id TEXT NOT NULL REFERENCES contract_facility(id),
 status TEXT NOT NULL CHECK(status IN ('CANDIDATE_DEMO','REJECTED_DEMO')),
 UNIQUE(source_id,external_id,facility_id)
);
-- Shared revision envelope for facility-bound working records only.
-- The typed domain rules remain in their existing models. No generic JSON CRUD.
CREATE TABLE contract_record (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-REC-*'),
 resource TEXT NOT NULL CHECK(resource IN ('profiles','inventory','apel','personnel','coaching','documents')),
 facility_id TEXT NOT NULL,
 region_id TEXT NOT NULL,
 business_key TEXT NOT NULL,
 current_revision INTEGER NOT NULL DEFAULT 0 CHECK(current_revision>=0),
 owner_id TEXT NOT NULL REFERENCES contract_actor(id),
 FOREIGN KEY(facility_id,region_id) REFERENCES contract_facility(id,region_id),
 UNIQUE(resource,facility_id,business_key),
 UNIQUE(id,facility_id)
);
CREATE TABLE contract_revision (
 record_id TEXT NOT NULL REFERENCES contract_record(id),
 revision INTEGER NOT NULL CHECK(revision>0),
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 action TEXT NOT NULL CHECK(action IN ('save_draft','submit','return_correction','record_review')),
 state TEXT NOT NULL CHECK(state IN ('DRAFT','SUBMITTED','CORRECTION','RECORDED_DEMO')),
 recorded_at_utc TEXT NOT NULL,
 payload_digest TEXT NOT NULL CHECK(length(payload_digest)=64 AND payload_digest NOT GLOB '*[^0-9a-f]*'),
 PRIMARY KEY(record_id,revision)
);
CREATE TABLE contract_apel_period (
 record_id TEXT PRIMARY KEY,
 facility_id TEXT NOT NULL,
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
 FOREIGN KEY(record_id,facility_id) REFERENCES contract_record(id,facility_id),
 UNIQUE(facility_id,year,month)
);
-- No record in an authorized ledger = unreported; never coerce to zero.
-- Workflow snapshots do not enter the ledger without separate reconciliation.
CREATE TABLE contract_inventory_year (
 record_id TEXT PRIMARY KEY,
 facility_id TEXT NOT NULL,
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 catalog_version TEXT NOT NULL,
 FOREIGN KEY(record_id,facility_id) REFERENCES contract_record(id,facility_id),
 UNIQUE(facility_id,year)
);
CREATE TABLE contract_staff (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-SDM-*'),
 kind TEXT NOT NULL CHECK(kind IN ('dokter_hewan','paramedik'))
);
CREATE TABLE contract_placement (
 id TEXT PRIMARY KEY,
 staff_id TEXT NOT NULL REFERENCES contract_staff(id),
 facility_id TEXT NOT NULL REFERENCES contract_facility(id),
 start_date TEXT NOT NULL,
 end_exclusive TEXT,
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 CHECK(end_exclusive IS NULL OR end_exclusive>start_date)
);
CREATE TRIGGER contract_placement_insert_no_overlap BEFORE INSERT ON contract_placement
WHEN EXISTS(SELECT 1 FROM contract_placement p WHERE p.staff_id=NEW.staff_id
 AND (p.end_exclusive IS NULL OR NEW.start_date<p.end_exclusive)
 AND (NEW.end_exclusive IS NULL OR p.start_date<NEW.end_exclusive))
BEGIN SELECT RAISE(ABORT,'PLACEMENT_OVERLAP'); END;
CREATE TRIGGER contract_placement_update_no_overlap BEFORE UPDATE ON contract_placement
WHEN EXISTS(SELECT 1 FROM contract_placement p WHERE p.staff_id=NEW.staff_id AND p.id<>OLD.id
 AND (p.end_exclusive IS NULL OR NEW.start_date<p.end_exclusive)
 AND (NEW.end_exclusive IS NULL OR p.start_date<NEW.end_exclusive))
BEGIN SELECT RAISE(ABORT,'PLACEMENT_OVERLAP'); END;
-- Provenance for generated documents pins the exact source revision.
CREATE TABLE contract_document_source (
 document_id TEXT NOT NULL,
 document_revision INTEGER NOT NULL,
 source_record_id TEXT NOT NULL,
 source_revision INTEGER NOT NULL,
 PRIMARY KEY(document_id,document_revision),
 FOREIGN KEY(document_id,document_revision) REFERENCES contract_revision(record_id,revision),
 FOREIGN KEY(source_record_id,source_revision) REFERENCES contract_revision(record_id,revision),
 CHECK(document_id<>source_record_id)
);
CREATE TABLE contract_evidence_ref (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-EVIDENCE-*'),
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 classification TEXT NOT NULL CHECK(classification='SYNTHETIC_METADATA_ONLY'),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TABLE contract_audit (
 id TEXT PRIMARY KEY,
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL,
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 action TEXT NOT NULL,
 recorded_at_utc TEXT NOT NULL,
 UNIQUE(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TABLE contract_command (
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 command_id TEXT NOT NULL,
 request_digest TEXT NOT NULL CHECK(length(request_digest)=64 AND request_digest NOT GLOB '*[^0-9a-f]*'),
 record_id TEXT NOT NULL,
 result_revision INTEGER NOT NULL,
 PRIMARY KEY(actor_id,command_id),
 FOREIGN KEY(record_id,result_revision) REFERENCES contract_revision(record_id,revision)
);
CREATE TRIGGER contract_revision_update_deny BEFORE UPDATE ON contract_revision BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_revision_delete_deny BEFORE DELETE ON contract_revision BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_audit_update_deny BEFORE UPDATE ON contract_audit BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_audit_delete_deny BEFORE DELETE ON contract_audit BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_command_update_deny BEFORE UPDATE ON contract_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_command_delete_deny BEFORE DELETE ON contract_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
-- Application transaction must check record resource, immutable identity, source scope,
-- transitions, reviewer separation, ISO dates, and exactly one revision+audit+command.
-- Do not expose this schema via generic CRUD. These constraints are incomplete for production.
