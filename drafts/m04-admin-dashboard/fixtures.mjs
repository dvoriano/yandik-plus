/**
 * M04-S4 | BELUM DIUJI.
 * Eight illustrative tasks, two fictional references, zero real user data.
 * Constructed through previously drafted M04-S1/S2/S3 models, not hand-coded
 * "approved" decisions. Dates are illustrative and not real deadlines.
 */
import { DEMO_DOSSIER,DEMO_REGISTER,DEMO_REFERENCE_ID,DEMO_PLAN } from "../m04-admin-followup/fixtures.mjs";
import { addExternalReference,submitExternalReference,reviewExternalReference } from "../m04-decision-reference/reference_register.mjs";
import { EXTERNAL_REFERENCE_SAMPLE } from "../m04-decision-reference/fixtures.mjs";
import { createFollowupList,createFollowupDraft,assignFollowup,startFollowup,
  submitFollowupNote,reviewFollowupNote,cancelFollowup,
} from "../m04-admin-followup/followup.mjs";
const makerRef={role:"pencatat_referensi_prov_demo",id:"DEMO-PENCATAT-PROV-01"};
const reviewerRef={role:"penelaah_referensi_prov_demo",id:"DEMO-PENELAAH-PROV-02"};
const second={...EXTERNAL_REFERENCE_SAMPLE,document_ref:"DEMO-SK-EXTERNAL-002",
  document_date_demo:"2026-10-20",
  claim_summary:"Referensi kedua yang diklaim berasal dari luar sistem dan masih memerlukan konfirmasi penerbit."};
const added=addExternalReference(DEMO_REGISTER,DEMO_DOSSIER,second,makerRef);
const submitted=submitExternalReference(added,"DEMO-REF-002",DEMO_DOSSIER,makerRef);
export const DEMO_REGISTER_DASHBOARD=reviewExternalReference(submitted,"DEMO-REF-002",
  DEMO_DOSSIER,reviewerRef,"catat_metadata",
  "Metadata dokumen fiktif kedua dicatat untuk penelusuran; tidak ada konfirmasi keaslian.",true);
export const DEMO_DOSSIER_DASHBOARD=DEMO_DOSSIER;
export const DEMO_AS_OF_DATE="2026-11-11";
const coordinator={role:"koordinator_administrasi_demo",id:"DEMO-KOORDINATOR-PROV-01"};
const examiner={role:"penelaah_tindak_lanjut_demo",id:"DEMO-PENELAAH-FOLLOWUP-02"};
const staffId="DEMO-PETUGAS-ADMIN-01";
const staff={role:"petugas_tindak_lanjut_demo",id:staffId};
let tasks=createFollowupList();
function add(type,ref,due){
  const plan={...DEMO_PLAN,task_type:type,due_date_demo:due};
  tasks=createFollowupDraft(tasks,DEMO_REGISTER_DASHBOARD,ref,DEMO_DOSSIER_DASHBOARD,
    plan,coordinator);
  return tasks.tasks.at(-1).id;
}
function assign(id){tasks=assignFollowup(tasks,id,DEMO_REGISTER_DASHBOARD,DEMO_DOSSIER_DASHBOARD,coordinator);}
function start(id){tasks=startFollowup(tasks,id,DEMO_REGISTER_DASHBOARD,DEMO_DOSSIER_DASHBOARD,staff);}
function submit(id){tasks=submitFollowupNote(tasks,id,DEMO_REGISTER_DASHBOARD,DEMO_DOSSIER_DASHBOARD,staff,
  "Daftar pengecekan administrasi contoh disusun untuk ditelaah, tanpa memverifikasi dokumen asli.",
  "DEMO-CATATAN-001");}
function review(id,action){tasks=reviewFollowupNote(tasks,id,DEMO_REGISTER_DASHBOARD,
  DEMO_DOSSIER_DASHBOARD,examiner,action,
  action==="catat_selesai"
    ?"Catatan administrasi simulasi lengkap dan ditutup tanpa mengesahkan bantuan atau dokumen."
    :"Catatan perlu diperbaiki untuk memperjelas daftar sumber dan alasan administratif.");}
// Reference 1: ditutup, perlu perbaikan, menunggu telaah, dalam proses, draf
const a=add("konfirmasi_sumber",DEMO_REFERENCE_ID,"2026-10-20");
assign(a);start(a);submit(a);review(a,"catat_selesai");
const b=add("periksa_kesesuaian",DEMO_REFERENCE_ID,"2026-11-05");
assign(b);start(b);submit(b);review(b,"kembalikan");
const c=add("klarifikasi_arsip",DEMO_REFERENCE_ID,"2026-11-15");
assign(c);start(c);submit(c);
const d=add("pembahasan_proses",DEMO_REFERENCE_ID,"2026-11-11");
assign(d);start(d);
add("konfirmasi_sumber",DEMO_REFERENCE_ID,"2026-11-18");
// Reference 2: ditugaskan overdue, dibatalkan, dalam proses overdue
const e=add("konfirmasi_sumber","DEMO-REF-002","2026-11-04");
assign(e);
const f=add("periksa_kesesuaian","DEMO-REF-002","2026-11-12");
tasks=cancelFollowup(tasks,f,DEMO_REGISTER_DASHBOARD,DEMO_DOSSIER_DASHBOARD,coordinator,
  "Rencana fiktif ini dibatalkan karena usulan pemeriksaan akan disusun ulang secara administratif.");
const g=add("klarifikasi_arsip","DEMO-REF-002","2026-11-09");
assign(g);start(g);
export const DEMO_TASKS_DASHBOARD=tasks;
