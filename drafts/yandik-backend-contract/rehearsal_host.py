"""K4-B5 | CODE_ONLY. Single in-process assembly, explicit rehearsal authorization.
No app starts on import, no network, database file or live authentication.
"""
import json
from pathlib import Path
from apel_payload import require
from account_store import AccountStore
from api_dispatch import DraftAPI
CONFIG=json.loads((Path(__file__).resolve().parent/"rehearsal_config.json").read_text("utf-8"))
class RehearsalHost:
    def __init__(self,*,execution_authorized=False,allow_demo_commands=False,clock=None):
        require(execution_authorized is True,"REHEARSAL_NOT_AUTHORIZED")
        require(CONFIG["mode"]=="CODE_ONLY" and CONFIG["synthetic_only"] is True and CONFIG["database"]==":memory:" and CONFIG["http_registered"] is False and CONFIG["production_authorization"] is False,"CONFIG_INVALID")
        self._store=AccountStore(clock=clock);self._allow=allow_demo_commands is True
    def issue(self,trusted_fixture):
        return self._store.issue_demo_session(trusted_fixture)
    def dispatch(self,handle,request):
        require(type(request) is dict and set(request)=={"method","path","query","body"},"REQUEST_INVALID")
        return DraftAPI(self._store,self._store.session_resolver(handle),self._allow).dispatch(request["method"],request["path"],request["query"],request["body"])
    def prepare_handoff(self,handle,proposal):
        require(self._allow,"COMMANDS_DISABLED")
        return self._store.prepare_handoff(proposal,self._store.session_resolver(handle))
    def accept_handoff(self,handle,acceptance):
        require(self._allow,"COMMANDS_DISABLED")
        return self._store.accept_handoff(acceptance,self._store.session_resolver(handle))
    def handoff_history(self,handle,facility_id):
        return self._store.handoff_history(facility_id,self._store.session_resolver(handle))
    def logout(self,handle):return self._store.logout(handle)
    def close(self):self._store.close()
