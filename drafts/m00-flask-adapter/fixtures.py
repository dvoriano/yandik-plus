"""M00-G6 | Fictional facility and animal-health record."""
def demo_input():
    region="Wilayah DEMO Utara"
    m={"schema":"M00-G2-SOURCE-MANIFEST-UNTESTED-1",
       "source_id":"DEMO-SOURCE-G6","snapshot_id":"DEMO-SNAPSHOT-G6",
       "domain":"SURVEILLANCE_DEMO","region_label":region,
       "capture_month":"2026-11","revision":1,
       "origin":"LOCAL_SYNTHETIC_FIXTURE","synthetic":True,
       "source_verified":False,"official_authorization":False}
    e={"event_id":"DEMO-EVENT-G6","location_ref":"DEMO-LOCATION-G6",
       "region_label":region,"period":"2026-10",
       "syndrome_tag":"DEMO-SYNDROME-GENERAL",
       "report_class":"SUSPECTED_UNVERIFIED_DEMO",
       "investigation_state":"NOT_STARTED_DEMO",
       "sample_state":"NOT_LOGGED_DEMO","followup_state":"NOT_RECORDED_DEMO",
       "evidence_ref_count_demo":0,"source_id":m["source_id"],
       "snapshot_id":m["snapshot_id"],"official_case_reference":None,
       "official_lab_reference":None}
    return {"session":{"id":"DEMO-USER-G6","role":"kab_kota",
                       "active":True,"region":region},
            "payload":{"region_label":region,"manifest":m,"events":[e]}}
