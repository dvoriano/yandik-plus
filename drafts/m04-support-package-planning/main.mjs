/** M04-S10 | KODE DITULIS, BELUM DIUJI. No network, storage or official action. */
import {NEEDS,PACKAGES} from "./fixtures.mjs";
import {buildSupportPlan,replaceDraft,removeDraft} from "./planning.mjs";
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
let drafts=PACKAGES.map(p=>({...p,lines:p.lines.map(l=>({...l}))}));
let active=drafts[0]?.id??null;
let sequence=2;
function selected(){return drafts.find(p=>p.id===active);}
function message(text,error=false){$("feedback").textContent=text;$("feedback").dataset.error=String(error);}
function apply(fn){
  try{const result=fn();drafts=result;render();message("Draf diperbarui di memori. Bukan keputusan atau alokasi.");}
  catch(err){message(err.message,true);}
}
function option(value,label){const n=el("option",label);n.value=value;return n;}
function controls(enabled){for(const id of ["title","purpose","need-select","quantity","delete"])$(id).disabled=!enabled;
 for(const id of ["meta-form","line-form"])for(const b of $(id).querySelectorAll("button"))b.disabled=!enabled;}
function hint(plan){
 const p=selected(),id=$("need-select").value,n=plan.needs.find(x=>x.need_id===id);
 if(!p||!n){$("remaining-hint").textContent="Belum ada kebutuhan yang dapat direncanakan.";return;}
 const current=p.lines.find(x=>x.need_id===id)?.quantity??0;
 $("quantity").value=current||"";
 const max=n.remaining_quantity+current;
 $("quantity").max=String(max);
 $("remaining-hint").textContent="Batas untuk paket ini: "+max+" "+n.unit+" (termasuk jumlah yang sudah direncanakan pada paket aktif).";
}
function render(){
 const plan=buildSupportPlan(NEEDS,drafts);
 const metrics=[["Kebutuhan sumber",plan.totals.source_needs],["Dapat direncanakan (DEMO)",plan.totals.eligible_needs],["Paket draf",plan.totals.draft_packages]];
 $("metrics").replaceChildren(...metrics.map(([label,value])=>{const d=el("div",undefined,"metric");d.append(el("strong",String(value)),el("span",label));return d;}));
 $("units").replaceChildren(...plan.quantities_by_unit.map(u=>el("div",u.unit+": "+u.planned+" direncanakan · "+u.remaining+" sisa dari "+u.requested,"unit")));
 $("needs").replaceChildren(...plan.needs.map(n=>{const d=el("article",undefined,"card");d.append(el("small",n.puskeswan_id+" · "+n.region_demo),el("strong",n.item),el("p","Kebutuhan: "+n.quantity+" "+n.unit),el("p",n.eligible_for_demo_planning?"Draf: "+n.planned_quantity+" · Sisa: "+n.remaining_quantity+" "+n.unit:"Belum dapat direncanakan"),el("small",n.reason));return d;}));
 if(!drafts.some(p=>p.id===active))active=drafts[0]?.id??null;
 $("draft-select").replaceChildren(...(drafts.length?drafts.map(p=>option(p.id,p.title)):[option("","Belum ada paket")]));
 $("draft-select").value=active??"";$("draft-select").disabled=!active;
 const p=selected();
 controls(Boolean(p));$("title").value=p?.title??"";$("purpose").value=p?.purpose??"";
 $("need-select").replaceChildren(...(p?plan.needs.filter(n=>n.eligible_for_demo_planning).map(n=>option(n.need_id,n.item+" · "+n.region_demo+" ("+n.unit+")")):[]));
 hint(plan);
 const display=plan.packages.find(x=>x.id===active);
 $("lines").replaceChildren(...(display?.lines??[]).map(l=>{
   const d=el("article",undefined,"card"),b=el("button","Hapus baris","secondary");
   b.type="button";b.addEventListener("click",()=>apply(()=>replaceDraft(NEEDS,drafts,{...selected(),lines:selected().lines.filter(x=>x.need_id!==l.need_id)})));
   d.append(el("small",l.puskeswan_id),el("strong",l.item),el("p",l.quantity+" "+l.unit+" direncanakan"),b);return d;
 }));
 if(p&&!p.lines.length)$("lines").append(el("p","Belum ada barang dalam paket."));
 $("warnings").replaceChildren(...plan.warnings.map(x=>el("li",x)));
}
$("new").addEventListener("click",()=>{const id="DEMO-PKG-"+String(sequence++).padStart(3,"0");apply(()=>{const next=replaceDraft(NEEDS,drafts,{id,title:"Paket draf "+id.split("-").at(-1),purpose:"Rencana pembahasan kebutuhan dukungan dalam simulasi.",lines:[]});active=id;return next;});});
$("draft-select").addEventListener("change",()=>{active=$("draft-select").value;render();message("");});
$("need-select").addEventListener("change",()=>hint(buildSupportPlan(NEEDS,drafts)));
$("meta-form").addEventListener("submit",e=>{e.preventDefault();if(!selected())return;apply(()=>replaceDraft(NEEDS,drafts,{...selected(),title:$("title").value,purpose:$("purpose").value}));});
$("line-form").addEventListener("submit",e=>{e.preventDefault();const p=selected(),n=NEEDS.find(x=>x.need_id===$("need-select").value);if(!p||!n)return;apply(()=>replaceDraft(NEEDS,drafts,{...p,lines:[...p.lines.filter(l=>l.need_id!==n.need_id),{need_id:n.need_id,source_version:n.source_version,quantity:$("quantity").valueAsNumber}]}));});
$("delete").addEventListener("click",()=>{if(!selected())return;apply(()=>removeDraft(NEEDS,drafts,active));});
render();
