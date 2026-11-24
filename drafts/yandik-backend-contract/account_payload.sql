-- CODE_ONLY. Memory rehearsal companion. No real credential storage or migration.
CREATE TABLE contract_account_head (
 actor_id TEXT PRIMARY KEY REFERENCES contract_actor(id),
 revision INTEGER NOT NULL CHECK(revision>=0)
);
CREATE TABLE contract_access_event (
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 revision INTEGER NOT NULL CHECK(revision>0),
 administrator_id TEXT NOT NULL REFERENCES contract_actor(id),
 action TEXT NOT NULL CHECK(action IN ('register','grant','revoke_grant','disable','enable')),
 reason_code TEXT NOT NULL,
 before_json TEXT NOT NULL,
 after_json TEXT NOT NULL,
 recorded_epoch INTEGER NOT NULL,
 PRIMARY KEY(actor_id,revision)
);
CREATE TABLE contract_access_command (
 administrator_id TEXT NOT NULL REFERENCES contract_actor(id),
 command_id TEXT NOT NULL,
 request_digest TEXT NOT NULL CHECK(length(request_digest)=64),
 actor_id TEXT NOT NULL,
 result_revision INTEGER NOT NULL,
 PRIMARY KEY(administrator_id,command_id),
 FOREIGN KEY(actor_id,result_revision) REFERENCES contract_access_event(actor_id,revision)
);
CREATE TABLE contract_demo_session (
 id TEXT PRIMARY KEY,
 token_digest TEXT NOT NULL UNIQUE CHECK(length(token_digest)=64),
 actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 grant_id TEXT NOT NULL REFERENCES contract_grant(id),
 issued_epoch INTEGER NOT NULL,
 expires_epoch INTEGER NOT NULL CHECK(expires_epoch>issued_epoch),
 revoked_epoch INTEGER CHECK(revoked_epoch IS NULL OR revoked_epoch>=issued_epoch)
);
CREATE TABLE contract_session_event (
 id INTEGER PRIMARY KEY,
 session_id TEXT NOT NULL REFERENCES contract_demo_session(id),
 event TEXT NOT NULL CHECK(event IN ('ISSUED_DEMO','LOGOUT_DEMO','ACCESS_REVOKED_DEMO')),
 recorded_epoch INTEGER NOT NULL
);
CREATE TRIGGER contract_access_event_update_deny BEFORE UPDATE ON contract_access_event BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_access_event_delete_deny BEFORE DELETE ON contract_access_event BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_access_command_update_deny BEFORE UPDATE ON contract_access_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_access_command_delete_deny BEFORE DELETE ON contract_access_command BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_session_event_update_deny BEFORE UPDATE ON contract_session_event BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_session_event_delete_deny BEFORE DELETE ON contract_session_event BEGIN SELECT RAISE(ABORT,'HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_demo_session_revoke_only BEFORE UPDATE ON contract_demo_session
WHEN OLD.revoked_epoch IS NOT NULL OR NEW.revoked_epoch IS NULL
 OR NEW.id<>OLD.id OR NEW.token_digest<>OLD.token_digest OR NEW.actor_id<>OLD.actor_id
 OR NEW.grant_id<>OLD.grant_id OR NEW.issued_epoch<>OLD.issued_epoch OR NEW.expires_epoch<>OLD.expires_epoch
BEGIN SELECT RAISE(ABORT,'SESSION_REVOKE_ONLY'); END;
CREATE TRIGGER contract_demo_session_delete_deny BEFORE DELETE ON contract_demo_session
BEGIN SELECT RAISE(ABORT,'SESSION_HISTORY_IMMUTABLE'); END;
-- Never reactivate or change an existing grant; replacement gets a new ID.
CREATE TRIGGER contract_grant_revoke_only BEFORE UPDATE ON contract_grant
WHEN OLD.active<>1 OR NEW.active<>0 OR NEW.id<>OLD.id OR NEW.actor_id<>OLD.actor_id
 OR NEW.role<>OLD.role OR NEW.scope_kind<>OLD.scope_kind
 OR NEW.region_id IS NOT OLD.region_id OR NEW.facility_id IS NOT OLD.facility_id
BEGIN SELECT RAISE(ABORT,'GRANT_REVOKE_ONLY'); END;
CREATE TRIGGER contract_grant_delete_deny BEFORE DELETE ON contract_grant
BEGIN SELECT RAISE(ABORT,'GRANT_HISTORY_IMMUTABLE'); END;
