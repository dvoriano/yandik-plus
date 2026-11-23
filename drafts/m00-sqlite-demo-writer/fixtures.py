"""M00-G7 synthetic command and session. All identifiers fictional."""
def demo_intent(command_id="DEMO-COMMAND-ONE",revision=0,head=None):
    return {"command_id":command_id,"link_id":"DEMO-CROSSWALK-ONE",
            "expected_revision":revision,
            "expected_head_digest":head if head is not None else "0"*64,
            "basis_digest":"a"*64,"action_code":"REQUEST_EVIDENCE_DEMO",
            "reason_code":"SOURCE_COMPARISON_DEMO",
            "official_authorization":False}
def demo_resolver(role="provinsi_verifikator",region="Wilayah DEMO Utara"):
    return lambda: {"id":"DEMO-USER-REVIEWER","role":role,
                    "active":True,"region":region}
