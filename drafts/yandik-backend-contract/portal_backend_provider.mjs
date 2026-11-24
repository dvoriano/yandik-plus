/** K4-B4 CODE_ONLY. Explicit portal provider for host-injected in-process transport.
 * No auto fallback to fixtures, no fetch, no storage, no client identity/role.
 * Portal review.html continues existing fixture mode until authorized binding.
 */
import {createDraftClient,queueDraft,sendQueued} from "./api_client.mjs";
const READS=Object.freeze({
 core:["core",[]],profiles:["profiles",["facility_id","year"]],profileHistory:["profiles/history",["record_id"]],inventory:["inventory",["record_id"]],
 apel:["apel",["record_id"]],personnel:["personnel",["facility_id","year"]],roster:["personnel/roster",["facility_id","year"]],staffHistory:["personnel/history",["staff_id"]],support:["support",["record_id"]],supportCatalog:["support/catalog",["facility_id","year"]],
 regionalHistory:["regional/history",["record_id"]],medicine:["medicine",["region_id","year"]],practice:["practice",["region_id","year"]],surveillance:["surveillance",["region_id","year"]],
 certificates:["certificates",["region_id","year"]],coaching:["coaching",["facility_id","year"]],documents:["documents",["facility_id","year"]],coachingDetail:["coaching/detail",["record_id","revision"]],documentDetail:["documents/detail",["record_id","revision"]],
 leadership:["leadership",["year","region_id"]],gis:["gis",["year","region_id","layer"]],library:["library",["q"]],notifications:["notifications",["today"]]
});
const WRITES=Object.freeze({profiles:"profiles/commands",inventory:"inventory/commands",apel:"apel/commands",personnel:"personnel/commands",support:"support/commands",coaching:"coaching/commands",documents:"documents/commands",regional:"regional/review-commands"});
export function createPortalBackend(transport){
 const client=createDraftClient(transport);
 return Object.freeze({
  mode:"BACKEND_REHEARSAL_ONLY",
  async read(resource,query={}){
   if(!Object.hasOwn(READS,resource))throw Error("RESOURCE_UNAVAILABLE");
   const [path,keys]=READS[resource];
   if(!query||Object.keys(query).sort().join("|")!==[...keys].sort().join("|"))throw Error("QUERY_INVALID");
   try{
    const r=await client.read("/api/v1/"+path,query);
    return r.status===200?{available:true,data:r.data,source:"BACKEND_REHEARSAL",error:null}:{available:false,data:null,source:"BACKEND_REHEARSAL",error:r.error,status:r.status};
   }catch{return {available:false,data:null,source:"BACKEND_REHEARSAL",error:"TRANSPORT_UNAVAILABLE"};}
  },
  command(resource,body){
   if(!Object.hasOwn(WRITES,resource))throw Error("RESOURCE_WRITE_UNAVAILABLE");
   return client.command("/api/v1/"+WRITES[resource],body);
  },
  queue:queueDraft,send:entry=>sendQueued(client,entry)
 });
}
