"""K4-A9 | CODE_ONLY. Synthetic account lifecycle contract, not authentication."""
import re
from apel_payload import require,exact,match
from contract import ACTOR,FACILITY,REGION
from apel_store import GRANT
ACCESS_CMD=re.compile(r"DEMO-ACCESS-CMD-[A-Z0-9_-]{1,40}")
ROLES=("puskeswan","kab_kota","provinsi_verifikator","pimpinan")
ACTIONS=("register","grant","revoke_grant","disable","enable")
REASONS=("ASSIGNMENT_DEMO","CHANGE_DUTY_DEMO","ACCESS_REVIEW_DEMO")
TTL_SECONDS=1800
def intent(x):
    require(exact(x,("command_id","target_actor_id","expected_revision","action","payload","reason_code"))
            and match(ACCESS_CMD,x["command_id"]) and match(ACTOR,x["target_actor_id"])
            and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000
            and x["action"] in ACTIONS and x["reason_code"] in REASONS,"ACCESS_INTENT_INVALID")
    a=x["action"];p=x["payload"]
    if a=="grant":
        require(exact(p,("grant_id","role","region_id","facility_id")) and match(GRANT,p["grant_id"]) and p["role"] in ROLES,"GRANT_INVALID")
        role=p["role"]
        if role=="puskeswan":require(match(FACILITY,p["facility_id"]) and p["region_id"] is None,"GRANT_SCOPE_INVALID")
        elif role=="kab_kota":require(match(REGION,p["region_id"]) and p["facility_id"] is None,"GRANT_SCOPE_INVALID")
        else:require(p["region_id"] is None and p["facility_id"] is None,"GRANT_SCOPE_INVALID")
    elif a=="revoke_grant":
        require(exact(p,("grant_id",)) and match(GRANT,p["grant_id"]),"GRANT_INVALID")
    else:require(p is None,"ACCESS_PAYLOAD_INVALID")
    return x
def valid_time(value):
    require(type(value) is int and 0<=value<=4102444800,"CLOCK_INVALID")
    return value
def session_live(issued,expires,revoked,now):
    return revoked is None and issued<=now<expires
