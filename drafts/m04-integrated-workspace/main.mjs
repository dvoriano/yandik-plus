/** M04-I1 | KODE DITULIS, BELUM DIUJI. */
import {MASTER,demoWorkspace} from "./fixtures.mjs";
import {ACTIONS,advanceDemo,viewWorkspace} from "./workspace.mjs";
const $=id=>document.getElementById(id);
const node=(t,v)=>{const n=document.createElement(t);n.textContent=String(v);return n;};
function card(title,rows){const c=document.createElement("article");c.className="card";c.append(node("strong",title),...rows.map(x=>node("p",x)));return c;}
function cards(id,rows){$(id).replaceChildren(...(rows.length?rows:[node("p","Belum tersedia dalam DEMO.")]));}
const labels=["Susun paket","Catat telaah","Buat jadwal","Catat kirim","Catat terima","Catat rujukan","Catat pemanfaatan"];
let w;
function actor(){
 const role=$("role").value;return role==="puskeswan"?{role,puskeswan_id:MASTER[0].id,region:MASTER[0].region}:role==="kab_kota"?{role,region:MASTER[0].region}:{role};
}
function choices(){
 const a=actor(),old=$("facility").value;
 const allowed=a.role==="pimpinan"?[]:MASTER.filter(m=>a.role==="puskeswan"?m.id===a.puskeswan_id:a.role==="kab_kota"?m.region===a.region:true);
 $("facility").replaceChildren(...[["","Agregat saja"],...allowed.map(m=>[m.id,m.name])].map(([id,label])=>{const o=node("option",label);o.value=id;return o;}));
 $("facility").value=allowed.some(m=>m.id===old)?old:a.role==="pimpinan"?"":allowed[0]?.id??"";
 $("facility").disabled=a.role==="pimpinan";
}
function render(){
 const a=actor(),selected=$("facility").value||null,v=viewWorkspace(w,a,$("period").value,selected),g=v.aggregate,d=v.details;
 cards("aggregate",[
 card("Puskeswan",[g.facilities]),card("Laporan tersedia",[g.reports+" · belum tersedia "+g.missing]),
 card("Jumlah layanan tercatat",[g.services??"Belum tersedia"]),card("Kebutuhan dapat dijembatani",[g.bridge_eligible])]);
 $("detail").hidden=!d;$("scenario").hidden=!d||a.role!=="provinsi_admin";
 if(!d)return;
 $("name").textContent=d.facility.name+" · "+d.facility.region;
 cards("profile",(d.profile??[]).map(s=>card(s.label,[s.value??"Belum tersedia",s.status])));
 cards("sources",[card("APEL "+d.apel.periode,[d.apel.status,"Total: "+(d.apel.total??"Belum tersedia"),
 ...Object.entries(d.apel.kategori??{}).map(([k,n])=>k+": "+n)]),
 card("SDM",[d.sdm.status,"Dokter hewan: "+(d.sdm.dokter_hewan??"Belum tersedia"),"Paramedik: "+(d.sdm.paramedik??"Belum tersedia")])]);
 cards("needs",d.needs.map(n=>card(n.item,[n.quantity+" "+n.unit,n.status,
 ...(d.excluded.find(x=>x.local_need_id===n.id)?.reasons??[])])));
 cards("support",[
 ...d.packages.map(p=>card("Paket "+p.id,p.lines.map(l=>l.item+" · "+l.quantity+" "+l.unit))),
 ...d.schedule.map(s=>card("Jadwal "+s.id,[s.date_demo,s.quantity+" "+s.unit])),
 ...d.ship.map(s=>card("Kirim "+s.id,[s.quantity+" "+s.unit,"Menunggu terima: "+s.awaiting_receipt])),
 ...d.receipt.map(r=>card("Penerimaan "+r.id,["Baik "+r.good+" · Rusak "+r.damaged+" "+r.unit])),
 ...d.handover.map(h=>card("Rujukan "+h.document_ref,["Metadata DEMO · tidak ditandatangani"])),
 ...d.monitor.map(m=>card("Pemanfaatan "+m.item,[m.latest?"Digunakan "+m.latest.used+" / "+m.eligible_quantity+" "+m.unit:"Belum diamati"]))]);
 if(a.role!=="provinsi_admin")return;
 const key=d.facility.id.slice(9),ids=["DEMO-PKG-","DEMO-TELAAH-","DEMO-JADWAL-","DEMO-KIRIM-","DEMO-TERIMA-","DEMO-SERAH-","DEMO-MON-"];
 const collections=[w.packages,w.reviews,w.schedules,w.shipments,w.receipts,w.handovers,w.observations];
 const done=collections.map((list,i)=>list.some(x=>x.id===ids[i]+key));
 $("steps").replaceChildren(...ACTIONS.map((act,i)=>{
  const b=node("button",(done[i]?"Tercatat: ":"")+labels[i]);b.type="button";
  b.disabled=done[i]||(i>0&&!done[i-1]);b.addEventListener("click",()=>apply(()=>advanceDemo(w,selected,act)));return b;
 }));
}
function apply(fn){try{const next=fn();w=next;render();$("error").textContent="";$("feedback").textContent="State simulasi diperbarui di memori.";}
 catch(e){$("error").textContent=e.message;$("feedback").textContent="";}}
try{w=demoWorkspace();choices();render();$("role").addEventListener("change",()=>{choices();render();});
 for(const id of ["period","facility"])$(id).addEventListener("change",render);
 $("reset").addEventListener("click",()=>apply(demoWorkspace));
}catch(e){$("error").textContent="DEMO tidak dapat dimuat: "+e.message;document.querySelectorAll("button,select").forEach(n=>n.disabled=true);}
