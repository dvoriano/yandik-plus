/** YANDIK+ M04-S9L | KODE DITULIS, BELUM DIUJI. Read-only DEMO UI. */
import {FOLLOWUP_DEMO} from "./fixtures.mjs";
import {buildCrossFunctionRecap,crossFunctionRecapText,CLASSES}
  from "./recap.mjs";
const $=id=>document.getElementById(id);
const el=(type,value="")=>{
  const n=document.createElement(type);n.textContent=String(value);return n;
};
let recap=null;
function refresh(){
  if(!recap)return;
  const group=$("group").value,category=$("category").value;
  const matched=recap.rows.filter(x=>
    (group==="all"||x.function_id===group)&&
    (category==="all"||x.class_code===category));
  const list=$("items");list.replaceChildren();
  for(const x of matched){
    const li=el("li");
    li.append(el("strong",x.source_id+" · "+x.source_title),
      el("p",x.function_id+" · "+x.phase+" · "+x.class_label),
      el("p","Referensi: "+x.id+" / revisi contoh "+x.source_revision),
      el("p","Bahan diminta: "+x.source_material),
      el("p","Kekurangan bukti tertulis DEMO: "+
        (x.kekurangan_bukti_demo||"BELUM DIISI")),
      el("p","Usulan tertulis DEMO: "+
        (x.usulan_tindak_lanjut_demo||"BELUM DIISI")),
      el("p","Pendahulu lintas fungsi: "+
        (x.cross_function_dependencies.map(y=>y.source_id+
        " ("+y.function_id+")").join(", ")||"Tidak ada")),
      el("p","Penelaah usulan: "+x.reviewer_role_suggestion),
      el("p","Belum ada verifikasi, penugasan atau keputusan resmi."));
    list.append(li);
  }
  if(!matched.length)
    list.append(el("li","Tidak ada butir yang sesuai filter DEMO."));
  $("selected").textContent="Menampilkan "+matched.length+
    " dari 18 butir sintetik, tanpa status resmi.";
  $("export").value=crossFunctionRecapText(recap,group,category);
}
try{
  recap=buildCrossFunctionRecap(FOLLOWUP_DEMO);
  $("totals").textContent=recap.totals.functions+" fungsi · "+
    recap.totals.items+" butir · "+
    recap.totals.proposal_notes+" usulan tertulis DEMO · "+
    recap.totals.gap_notes+" kekurangan bukti tertulis DEMO · "+
    recap.totals.official_decisions+" keputusan resmi.";
  $("snapshot").textContent="Repo snapshot "+
    recap.source.repo_snapshot.visibility.toUpperCase()+
    " pada "+recap.source.repo_snapshot.observed_on+" (bukan live).";
  for(const f of recap.functions){
    const tr=el("tr");
    tr.append(el("th",f.title),el("td",f.total),
      el("td",f.proposal_notes),el("td",f.gap_notes),
      el("td",f.no_gap_notes),el("td",f.cross_function_links));
    $("matrix").append(tr);
    const opt=el("option",f.title);opt.value=f.id;
    $("group").append(opt);
  }
  for(const [code,label] of Object.entries(CLASSES)){
    const opt=el("option",label);opt.value=code;
    $("category").append(opt);
  }
  for(const warning of recap.warnings)
    $("warnings").append(el("li",warning));
  for(const id of ["group","category"])$(id).addEventListener("change",refresh);
  refresh();
}catch(error){
  $("items").replaceChildren();$("export").value="";
  $("error").textContent="Rekap DEMO gagal dibangun: "+error.message;
}
