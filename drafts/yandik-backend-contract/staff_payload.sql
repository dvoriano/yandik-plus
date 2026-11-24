-- CODE_ONLY, synthetic in-memory rehearsal only. No migration.
-- Existing contract_staff and contract_placement are the master and interval store.
CREATE TABLE contract_staff_head (
 staff_id TEXT PRIMARY KEY REFERENCES contract_staff(id),
 revision INTEGER NOT NULL CHECK(revision>=0)
);
CREATE TABLE contract_staff_event (
 staff_id TEXT NOT NULL REFERENCES contract_staff(id),
 revision INTEGER NOT NULL CHECK(revision>0),
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 action TEXT NOT NULL CHECK(action IN ('register','assign','transfer','end_assignment','record_competency')),
 before_json TEXT NOT NULL,
 after_json TEXT NOT NULL,
 recorded_at_utc TEXT NOT NULL,
 PRIMARY KEY(staff_id,revision)
);
CREATE TABLE contract_staff_command (
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 command_id TEXT NOT NULL,
 request_digest TEXT NOT NULL CHECK(length(request_digest)=64),
 staff_id TEXT NOT NULL,
 result_revision INTEGER NOT NULL,
 PRIMARY KEY(actor_id,command_id),
 FOREIGN KEY(staff_id,result_revision) REFERENCES contract_staff_event(staff_id,revision)
);
CREATE TABLE contract_staff_coverage (
 facility_id TEXT NOT NULL REFERENCES contract_facility(id),
 year INTEGER NOT NULL CHECK(year BETWEEN 2026 AND 2030),
 completeness TEXT NOT NULL CHECK(completeness IN ('COMPLETE_DEMO','PARTIAL_DEMO')),
 source_id TEXT NOT NULL REFERENCES contract_source(id),
 PRIMARY KEY(facility_id,year)
);
CREATE TABLE contract_staff_competency (
 staff_id TEXT NOT NULL REFERENCES contract_staff(id),
 facility_id TEXT NOT NULL REFERENCES contract_facility(id),
 observed_on TEXT NOT NULL,
 topic TEXT NOT NULL CHECK(topic IN ('PENCATATAN_APEL_DEMO','PELAYANAN_KLINIK_DEMO','SURVEILANS_DEMO','KESMAVET_DEMO')),
 revision INTEGER NOT NULL,
 PRIMARY KEY(staff_id,observed_on,topic),
 FOREIGN KEY(staff_id,revision) REFERENCES contract_staff_event(staff_id,revision)
);
CREATE TRIGGER contract_staff_event_update_deny BEFORE UPDATE ON contract_staff_event BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_event_delete_deny BEFORE DELETE ON contract_staff_event BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_command_update_deny BEFORE UPDATE ON contract_staff_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_command_delete_deny BEFORE DELETE ON contract_staff_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_competency_update_deny BEFORE UPDATE ON contract_staff_competency BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_competency_delete_deny BEFORE DELETE ON contract_staff_competency BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_coverage_update_deny BEFORE UPDATE ON contract_staff_coverage BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_staff_coverage_delete_deny BEFORE DELETE ON contract_staff_coverage BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
-- Placement may only be closed once, with all other attributes unchanged.
CREATE TRIGGER contract_placement_close_only BEFORE UPDATE ON contract_placement
WHEN OLD.end_exclusive IS NOT NULL OR NEW.end_exclusive IS NULL
 OR NEW.id<>OLD.id OR NEW.staff_id<>OLD.staff_id OR NEW.facility_id<>OLD.facility_id
 OR NEW.start_date<>OLD.start_date OR NEW.source_id<>OLD.source_id
BEGIN SELECT RAISE(ABORT,'PLACEMENT_CLOSE_ONLY'); END;
CREATE TRIGGER contract_placement_delete_deny BEFORE DELETE ON contract_placement
BEGIN SELECT RAISE(ABORT,'PLACEMENT_DELETE_DENIED'); END;
