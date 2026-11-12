/**
 * YANDIK+ M04-S9J | KODE DITULIS, BELUM DIUJI.
 * In-memory draft of discussion notes, evidence gaps and suggested follow-ups.
 * Not formal confirmation, actual minutes, review, SOP, authorization or approval.
 */
import {AGENDA_SCHEMA,NO_APPROVAL as S9I_NO_APPROVAL,FUNCTIONS}
  from "../m04-function-review-agendas/agendas.mjs";

export const CONFIRMATION_SCHEMA="M04-S9J-CONFIRMATION-DEMO-UNTESTED-1";
export const DEMO_STATE="CONTOH_BELUM_DIKONFIRMASI_RESMI";
export const NO_DECISION="TIDAK_ADA_KEPUTUSAN_ATAU_IZIN_INTEGRASI";
const MAX_TEXT=500;
const MAX_EDITS=200;
const NOTES=["masukan_demo","kekurangan_bukti_demo","tindak_lanjut_usulan_demo"];
const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function requireAgenda(source){
  if(!isObj(source)||source.schema!==AGENDA_SCHEMA||
    source.synthetic!==true||source.mode!=="CODE_ONLY"||
    source.readiness!==S9I_NO_APPROVAL||
    !Array.isArray(source.groups)||source.groups.length!==FUNCTIONS.length||
    !isObj(source.source)||!isObj(source.source.repo_snapshot)||
    source.totals?.functions!==6||source.totals?.agenda_items!==18||
    source.totals?.official_decisions!==0||source.totals?.meetings_held!==0||
    source.totals?.verified_materials!==0||source.totals?.sent_invitations!==0||
    source.totals?.confirmed_reviewers!==0)
    throw Error("Hanya paket agenda M04-S9I DEMO tanpa keputusan yang dapat dipakai.");
  const ids=new Set(),keys=new Set(FUNCTIONS.map(x=>x.id));
  for(const g of source.groups){
    if(!isObj(g)||!keys.has(g.id)||!Array.isArray(g.items)||
      g.items.length<1||g.count!==g.items.length||
      g.invitation_sent!==false||g.meeting_held!==false||
      g.minutes_official!==false||g.owner_assigned!==false||
      g.discussion_state!=="BELUM_DIJADWALKAN")
      throw Error("Fungsi agenda telah berubah atau dianggap resmi.");
    keys.delete(g.id);
    for(const x of g.items){
      if(!isObj(x)||typeof x.id!=="string"||ids.has(x.id)||
        typeof x.title!=="string"||!x.title||
        typeof x.evidence_needed!=="string"||!x.evidence_needed||
        !Array.isArray(x.proposed_questions)||!x.proposed_questions.length||
        x.proposed_questions.some(q=>typeof q!=="string"||!q)||
        x.evidence_verified!==false||x.reviewer_confirmed!==false||
        x.meeting_held!==false||x.decision_made!==false)
        throw Error("Butir agenda bukan catatan DEMO yang belum diputuskan.");
      ids.add(x.id);
    }
  }
  if(keys.size||ids.size!==18)
    throw Error("Paket harus mencakup 6 fungsi dan 18 butir unik.");
  return source;
}
function identity(source){
  // Non-cryptographic local consistency token; NOT an audit hash.
  return [
    source.schema,source.source.as_of_demo,
    source.source.snapshot_changed?"STALE":"CURRENT_DEMO",
    source.source.repo_snapshot.visibility,
    source.source.repo_snapshot.observed_on,
    ...source.groups.flatMap(g=>[
      g.id,...g.items.map(x=>x.id+"#"+x.title+"#"+x.evidence_needed+
        "#"+x.proposed_questions.join("|")),
    ]),
  ].join("\n");
}
function emptyNotes(){
  return {masukan_demo:"",kekurangan_bukti_demo:"",tindak_lanjut_usulan_demo:""};
}
export function createDemoConfirmationBook(agenda){
  requireAgenda(agenda);
  return {
    schema:CONFIRMATION_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source_identity:identity(agenda),
    source_stale:agenda.source_stale===true,
    source_snapshot:{...agenda.source.repo_snapshot},
    revision:0,edits:0,
    records:agenda.groups.flatMap(g=>g.items.map(x=>({
      function_id:g.id,item_id:x.id,
      revision:0,notes:emptyNotes(),
      history:[],review_state:DEMO_STATE,
      official_confirmation:false,official_evidence_verified:false,
      official_decision:false,authorized_to_test:false,authorized_to_deploy:false,
    }))),
    readiness:NO_DECISION,
    caution:"Hanya contoh dalam memori halaman, tidak disimpan atau dikirim. Jangan isi data atau berkas riil.",
  };
}
function validateBook(book,agenda){
  requireAgenda(agenda);
  if(!isObj(book)||book.schema!==CONFIRMATION_SCHEMA||
    book.synthetic!==true||book.mode!=="CODE_ONLY"||
    book.source_identity!==identity(agenda)||
    book.readiness!==NO_DECISION||!Array.isArray(book.records)||
    book.records.length!==18||!Number.isSafeInteger(book.edits)||book.edits<0||
    book.edits>MAX_EDITS||book.revision!==book.edits)
    throw Error("Buku DEMO tidak cocok dengan paket agenda atau sumber berubah.");
  const expected=new Map(agenda.groups.flatMap(g=>g.items.map(x=>[x.id,g.id])));
  const found=new Set();
  for(const x of book.records){
    if(!isObj(x)||!expected.has(x.item_id)||found.has(x.item_id)||
      x.function_id!==expected.get(x.item_id)||
      !isObj(x.notes)||NOTES.some(k=>typeof x.notes[k]!=="string"||
        x.notes[k].length>MAX_TEXT)||
      !Array.isArray(x.history)||x.review_state!==DEMO_STATE||
      x.official_confirmation!==false||x.official_evidence_verified!==false||
      x.official_decision!==false||x.authorized_to_test!==false||
      x.authorized_to_deploy!==false)
      throw Error("Catatan DEMO berubah menjadi status resmi atau tidak valid.");
    found.add(x.item_id);
  }
  return book;
}
function sanitize(value){
  if(typeof value!=="string"||value.length>MAX_TEXT||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value))
    throw Error("Catatan DEMO harus teks singkat tanpa karakter kontrol (maksimal 500).");
  return value.trim();
}
export function editDemoConfirmation(book,agenda,functionId,itemId,changes){
  validateBook(book,agenda);
  if(!isObj(changes)||Object.keys(changes).length!==NOTES.length||
    NOTES.some(key=>!Object.prototype.hasOwnProperty.call(changes,key))||
    Object.keys(changes).some(key=>!NOTES.includes(key)))
    throw Error("Hanya tiga kolom catatan contoh yang dapat diubah.");
  const target=book.records.find(x=>x.function_id===functionId&&x.item_id===itemId);
  if(!target)throw Error("Butir tidak terdaftar pada fungsi itu.");
  const notes=Object.fromEntries(NOTES.map(k=>[k,sanitize(changes[k])]));
  if(NOTES.every(k=>notes[k]===target.notes[k]))return book;
  if(book.edits>=MAX_EDITS)throw Error("Batas revisi DEMO tercapai. Kosongkan contoh.");
  const nextRevision=book.revision+1;
  return {
    ...book,revision:nextRevision,edits:nextRevision,
    records:book.records.map(record=>record!==target?record:{
      ...record,notes,revision:record.revision+1,
      history:[...record.history,{
        demo_revision:nextRevision,action:"CATATAN_CONTOH_DIPERBARUI",
        changed_fields:NOTES.filter(k=>notes[k]!==record.notes[k]),
        official:false,
      }],
    }),
  };
}
export function confirmationView(book,agenda){
  validateBook(book,agenda);
  const byId=new Map(book.records.map(x=>[x.item_id,x]));
  const groups=agenda.groups.map(group=>({
    id:group.id,title:group.title,goal:group.goal,
    source_count:group.count,
    formal_review_occurred:false,
    items:group.items.map(item=>{
      const record=byId.get(item.id);
      return {
        function_id:group.id,item_id:item.id,title:item.title,phase:item.phase,
        questions:[...item.proposed_questions],
        expected_evidence:item.evidence_needed,
        dependency_ids:[...item.dependency_ids],
        note:{...record.notes},revision:record.revision,
        has_demo_draft:NOTES.some(k=>Boolean(record.notes[k])),
        official_confirmation:false,
      };
    }),
  }));
  const rows=groups.flatMap(g=>g.items);
  return {
    schema:CONFIRMATION_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source_snapshot:{...agenda.source.repo_snapshot},
    source_stale:agenda.source_stale===true,
    revision:book.revision,
    groups,
    totals:{
      functions:groups.length,items:rows.length,
      demo_notes_started:rows.filter(x=>x.has_demo_draft).length,
      official_reviews:0,verified_evidence:0,formal_decisions:0,
      authorized_tests:0,authorized_deployments:0,
    },
    readiness:NO_DECISION,
    policy:"Catatan hanya simulasi dalam memori browser. Ini bukan hasil rapat/konfirmasi resmi.",
  };
}
export function confirmationText(view,groupId="all"){
  if(!isObj(view)||view.schema!==CONFIRMATION_SCHEMA||
    view.synthetic!==true||view.readiness!==NO_DECISION||
    !Array.isArray(view.groups)||!["all",...FUNCTIONS.map(x=>x.id)].includes(groupId))
    throw Error("Rekap DEMO belum sesuai.");
  const chosen=view.groups.filter(g=>groupId==="all"||g.id===groupId);
  return [
    "YANDIK+ M04-S9J | LEMBAR KONFIRMASI CONTOH (BELUM DIUJI)",
    "BUKAN NOTULEN, BERITA ACARA, BUKTI RESMI, PERSETUJUAN ATAU IZIN.",
    "Snapshot repo: "+view.source_snapshot.visibility+" / "+
      view.source_snapshot.observed_on+" (bukan pemeriksaan live).",
    "Sumber berubah: "+(view.source_stale?"YA, kaji ulang":"tidak terdeteksi DEMO"),
    "Draf terisi "+view.totals.demo_notes_started+
      " dari 18 butir; semua keputusan/verifikasi resmi: 0.",
    ...chosen.flatMap(g=>[
      "FUNGSI USULAN: "+g.title,
      ...g.items.flatMap(x=>[
        "- "+x.item_id+" "+x.title+" ["+x.phase+"]",
        "  Kebutuhan bukti: "+x.expected_evidence,
        "  Pendahulu: "+(x.dependency_ids.join(", ")||"tidak ada"),
        "  Masukan DEMO: "+(x.note.masukan_demo||"BELUM DIISI"),
        "  Kekurangan bukti DEMO: "+(x.note.kekurangan_bukti_demo||"BELUM DIISI"),
        "  Usulan tindak lanjut DEMO: "+(x.note.tindak_lanjut_usulan_demo||"BELUM DIISI"),
      ]),
    ]),
    "STATUS: "+view.readiness,view.policy,
  ].join("\n");
}
