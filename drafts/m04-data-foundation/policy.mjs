/** M04-I2 | KODE DITULIS, BELUM DIUJI. Proposed server-side DEMO policy.
 * Caller must supply identity resolved from a trusted authenticated session.
 * This file does not implement authentication or establish formal authority.
 */
export const ROLES=Object.freeze(["puskeswan","kab_kota","provinsi_verifikator","provinsi_admin","pimpinan"]);
export const ACTIONS=Object.freeze(["advance","request_correction","review_correction","sync_source"]);
const idPattern=/^DEMO-USER-[A-Z0-9_-]{1,40}$/;
export function principal(id,lookup){
 if(typeof id!=="string"||!idPattern.test(id))throw Error("ACCESS_DENIED");
 const p=lookup(id);
 if(!p||p.id!==id||p.active!==true||!ROLES.includes(p.role))throw Error("ACCESS_DENIED");
 if(p.role==="puskeswan"&&(!p.puskeswan_id||!p.region))throw Error("ACCESS_DENIED");
 if(p.role==="kab_kota"&&!p.region)throw Error("ACCESS_DENIED");
 return {id:p.id,role:p.role,region:p.region??null,puskeswan_id:p.puskeswan_id??null};
}
export function scope(actor,facility){
 if(!facility||facility.status!=="aktif")return false;
 if(actor.role==="puskeswan")return actor.puskeswan_id===facility.id&&actor.region===facility.region;
 if(actor.role==="kab_kota")return actor.region===facility.region;
 return ["provinsi_admin","provinsi_verifikator"].includes(actor.role);
}
export function requireAction(actor,facility,action){
 if(!scope(actor,facility))throw Error("ACCESS_DENIED");
 const allowed={
  advance:["provinsi_admin"],
  request_correction:["puskeswan","kab_kota","provinsi_admin"],
  review_correction:["kab_kota","provinsi_verifikator"],
  sync_source:["provinsi_admin"]
 };
 if(!Object.hasOwn(allowed,action)||!allowed[action].includes(actor.role))throw Error("ACCESS_DENIED");
}
