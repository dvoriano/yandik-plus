"""K4-C2 | CODE_ONLY. Synthetic responsibility handoff, separate from SDM placement."""
import re
from apel_payload import exact,match,require
from contract import ACTOR,FACILITY
from apel_store import GRANT
HANDOFF=re.compile(r"DEMO-HANDOFF-[A-Z0-9_-]{1,40}")
REASONS=("CHANGE_DUTY_DEMO","REPLACE_RESPONSIBLE_DEMO")
TTL=86400
def proposal(raw):
    require(exact(raw,("handoff_id","facility_id","outgoing_actor_id","incoming_actor_id","new_grant_id","reason_code")),"HANDOFF_SHAPE")
    require(match(HANDOFF,raw["handoff_id"]) and match(FACILITY,raw["facility_id"]) and match(ACTOR,raw["outgoing_actor_id"]) and match(ACTOR,raw["incoming_actor_id"]) and match(GRANT,raw["new_grant_id"]),"HANDOFF_ID_INVALID")
    require(raw["outgoing_actor_id"]!=raw["incoming_actor_id"] and raw["reason_code"] in REASONS,"HANDOFF_INVALID")
    return dict(raw)
def acceptance(raw):
    require(exact(raw,("handoff_id","expected_digest")) and match(HANDOFF,raw["handoff_id"]) and isinstance(raw["expected_digest"],str) and re.fullmatch(r"[0-9a-f]{64}",raw["expected_digest"]),"ACCEPTANCE_INVALID")
    return dict(raw)
def timely(created,now):return created<=now<created+TTL
