-- CODE_ONLY | New in-memory schema; never migrate real data.
CREATE TABLE contract_handoff_proposal (
 id TEXT PRIMARY KEY CHECK(id GLOB 'DEMO-HANDOFF-*'),
 facility_id TEXT NOT NULL REFERENCES contract_facility(id),
 outgoing_actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 incoming_actor_id TEXT NOT NULL REFERENCES contract_actor(id),
 reviewer_id TEXT NOT NULL REFERENCES contract_actor(id),
 reviewer_grant_id TEXT NOT NULL REFERENCES contract_grant(id),
 proposed_epoch INTEGER NOT NULL,
 snapshot_json TEXT NOT NULL,
 snapshot_digest TEXT NOT NULL CHECK(length(snapshot_digest)=64),
 CHECK(outgoing_actor_id<>incoming_actor_id AND reviewer_id<>outgoing_actor_id AND reviewer_id<>incoming_actor_id)
);
CREATE TABLE contract_handoff_receipt (
 handoff_id TEXT PRIMARY KEY REFERENCES contract_handoff_proposal(id),
 administrator_id TEXT NOT NULL REFERENCES contract_actor(id),
 accepted_epoch INTEGER NOT NULL,
 record_count INTEGER NOT NULL CHECK(record_count>0),
 outgoing_account_revision INTEGER NOT NULL,
 incoming_account_revision INTEGER NOT NULL,
 snapshot_digest TEXT NOT NULL CHECK(length(snapshot_digest)=64)
);
CREATE TABLE contract_handoff_record (
 handoff_id TEXT NOT NULL REFERENCES contract_handoff_receipt(handoff_id),
 record_id TEXT NOT NULL REFERENCES contract_record(id),
 payload_revision INTEGER NOT NULL CHECK(payload_revision>=0),
 previous_owner_id TEXT NOT NULL REFERENCES contract_actor(id),
 next_owner_id TEXT NOT NULL REFERENCES contract_actor(id),
 PRIMARY KEY(handoff_id,record_id),
 CHECK(previous_owner_id<>next_owner_id)
);
CREATE TRIGGER contract_handoff_proposal_update_deny BEFORE UPDATE ON contract_handoff_proposal BEGIN SELECT RAISE(ABORT,'HANDOFF_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_handoff_proposal_delete_deny BEFORE DELETE ON contract_handoff_proposal BEGIN SELECT RAISE(ABORT,'HANDOFF_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_handoff_receipt_update_deny BEFORE UPDATE ON contract_handoff_receipt BEGIN SELECT RAISE(ABORT,'HANDOFF_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_handoff_receipt_delete_deny BEFORE DELETE ON contract_handoff_receipt BEGIN SELECT RAISE(ABORT,'HANDOFF_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_handoff_record_update_deny BEFORE UPDATE ON contract_handoff_record BEGIN SELECT RAISE(ABORT,'HANDOFF_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER contract_handoff_record_delete_deny BEFORE DELETE ON contract_handoff_record BEGIN SELECT RAISE(ABORT,'HANDOFF_HISTORY_IMMUTABLE'); END;
