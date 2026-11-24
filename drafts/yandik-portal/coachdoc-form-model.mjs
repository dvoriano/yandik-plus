/** CODE_ONLY | Forms for coaching and paperless, exact typed envelopes. */
export const TYPES=["Pembinaan","Bimtek","Monitoring"];
export const TOPICS=["Pelaporan APEL","Profil dan inventaris","Pelayanan veteriner","Kompetensi SDM"];
export const RESULTS=["HASIL_TERCATAT_DEMO","PERLU_PENDALAMAN_DEMO"];
export const RECOMMENDATIONS=["PERBARUI_DATA_DEMO","PEMBINAAN_LANJUT_DEMO","TELAAH_TEKNIS_DEMO"];
export const COMPLETIONS=["TINDAK_LANJUT_TERCATAT_DEMO","HASIL_DITELAAH_DEMO"];
export const REASONS=["CHECK_RESULT_DEMO","CHECK_EVIDENCE_DEMO","UPDATE_SOURCE_DEMO"];
export const EVIDENCE=["Agenda","Daftar hadir agregat","Dokumentasi","Catatan hasil"];
export const DOCS={HASIL:"Laporan hasil",BA:"Berita acara",PENGANTAR:"Surat pengantar",REKAP:"Rekap tindak lanjut"};
export const ACTIONS={plan:"Rencanakan kegiatan",record:"Catat hasil kegiatan",review:"Telaah hasil",return_result:"Kembalikan hasil untuk koreksi",close:"Catat penyelesaian tindak lanjut",create:"Buat draf",refresh:"Perbarui draf dari sumber",evidence:"Catat metadata bukti",submit:"Ajukan telaah draf",return_doc:"Kembalikan draf",archive:"Arsipkan DEMO",reopen:"Buka kembali arsip DEMO"};
export const fmt=v=>v==null?"Belum tersedia":String(v).replaceAll("_"," ");
export function missingEvidence(s){return EVIDENCE.filter(k=>!s?.evidence?.some(x=>x.kind===k));}
export function coachdocCommand(row,action,payload,command_id){
 if(!row?.candidate_actions?.includes(action)||!Object.hasOwn(ACTIONS,action)||!Number.isInteger(row.revision)||row.revision!==row.current_revision||!/^DEMO-REC-(COACH|DOC)-[A-Z0-9_-]+$/.test(row.record_id)||!/^DEMO-COMMAND-[A-Z0-9_-]{1,40}$/.test(command_id))throw Error("ACTION_UNAVAILABLE");
 return {command_id,record_id:row.record_id,expected_revision:row.revision,action,payload};
}
export function slotGroups(rows){
 const groups=new Map();
 for(const r of rows){if(!groups.has(r.activity_id))groups.set(r.activity_id,{activity_id:r.activity_id,slot:r.slot,rows:[]});groups.get(r.activity_id).rows.push(r);}
 return [...groups.values()].sort((a,b)=>a.slot-b.slot);
}
export function progress(rows){return {slots:rows.length,planned:rows.filter(r=>r.snapshot).length,open:rows.filter(r=>r.snapshot?.stage==="FOLLOWUP_OPEN").length,closed:rows.filter(r=>r.snapshot?.stage==="CLOSED_DEMO").length};}
