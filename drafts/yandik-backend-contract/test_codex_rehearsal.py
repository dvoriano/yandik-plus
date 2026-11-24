"""CODE_ONLY | 6 pure + 3 memory rehearsal declarations; no browser or QA executed."""
import unittest
from codex_rehearsal import static_path,fixture,package,cli,ORIGIN,ENTRY,load_assets
from rehearsal_host import RehearsalHost
from apel_payload import Denied
class PureTests(unittest.TestCase):
    def test_default_off(self):
        with self.assertRaises(SystemExit):cli([])
    def test_actor_allowlist(self):
        with self.assertRaises(ValueError):fixture("REAL")
    def test_valid_path(self):self.assertEqual(static_path(ORIGIN+ENTRY,"GET",{ENTRY}),ENTRY)
    def test_external(self):self.assertIsNone(static_path("https://example.org"+ENTRY,"GET",{ENTRY}))
    def test_traversal(self):self.assertIsNone(static_path(ORIGIN+"/drafts/../.env","GET",{ENTRY}))
    def test_no_post(self):self.assertIsNone(static_path(ORIGIN+ENTRY,"POST",{ENTRY}))
class StoreTests(unittest.TestCase):
    def setUp(self):self.h=RehearsalHost(execution_authorized=True,allow_demo_commands=False)
    def tearDown(self):self.h.close()
    def test_separate_actor(self):
        a=self.h.issue(fixture("ALPHA"));b=self.h.issue(fixture("GAMMA"))
        req={"method":"GET","path":"/api/v1/core","query":{},"body":None}
        self.assertEqual(self.h.dispatch(a,req)["data"]["facilities"][0]["facility_id"],"DEMO-PSW-ALPHA")
        self.assertEqual(self.h.dispatch(b,req)["data"]["facilities"][0]["facility_id"],"DEMO-PSW-GAMMA")
    def test_default_write_off(self):
        a=self.h.issue(fixture("ALPHA"))
        self.assertEqual(self.h.dispatch(a,{"method":"POST","path":"/api/v1/apel/commands","query":{},"body":{}})["status"],403)
    def test_logout(self):
        a=self.h.issue(fixture("ALPHA"));self.h.logout(a)
        self.assertEqual(self.h.dispatch(a,{"method":"GET","path":"/api/v1/core","query":{},"body":None})["status"],401)
