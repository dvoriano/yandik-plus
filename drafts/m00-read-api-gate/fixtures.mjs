/** M00-G3 | Entire host & client request are synthetic in-memory fixtures. */
import {demoSurveillanceFixtures,demoSurveillanceAdapters}
 from "../m13-surveillance/fixtures.mjs";
export function demoReadApiFixture(){
 const {manifest,events}=demoSurveillanceFixtures();
 const {resolveServerSession}=demoSurveillanceAdapters();
 return {
  request:{method:"GET",operation:"LIST_EVENTS",event_id:null},
  host:{resolveServerSession,region_label:"Wilayah DEMO Utara",
    manifest,events}
 };
}
