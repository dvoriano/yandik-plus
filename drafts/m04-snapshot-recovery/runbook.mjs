/**
 * M04-I6C | KODE DITULIS, BELUM DIUJI.
 * Human-readable host transaction contract, not an executable migration engine.
 */
import {I6C_SNAPSHOT_SCHEMA} from "./snapshot.mjs";
import {I6C_JOURNAL_SCHEMA,verifyRecoveryJournal} from "./recovery.mjs";
import {I6C_RETENTION_SCHEMA} from "./retention.mjs";
export const I6C_RUNBOOK_SCHEMA="M04-I6C-CUTOVER-RUNBOOK-UNTESTED-1";
const fail=code=>{throw Error(code)};
export const REQUIRED_GATES=Object.freeze([
 ["source_provenance","Verifikasi asal, versi dan integritas snapshot I4 dari server"],
 ["session_rbac","Autentikasi backend dan otorisasi peran/wilayah terbukti"],
 ["consistent_read","Snapshot sumber dan target dibaca konsisten di sisi server"],
 ["exclusive_write","Lock/maintenance window mencegah penulis lain masuk"],
 ["recheck_in_lock","Sumber dan target dicek ulang dalam transaksi yang sama"],
 ["backup_verified","Backup sumber/target terbukti utuh dan lokasi aman"],
 ["restore_drill","Uji pemulihan terisolasi telah berhasil"],
 ["whole_dataset_atomic","Migrasi semua fasilitas sebagai satu unit commit/abort"],
 ["journal_durable","Jurnal audit memiliki persistensi, akses, dan retensi sah"],
 ["postcutover_validation","Jumlah, relasi, checksum, hak akses dan histori cocok"],
 ["retention_approved","Retensi, legal hold, export dan disposal disetujui"],
 ["owner_governance","Izin G0, pemilik proses, keamanan, SPBE, jadwal perubahan"]
]);
export function buildCutoverRunbook(snapshot,retention,journal){
 if(!snapshot||snapshot.schema!==I6C_SNAPSHOT_SCHEMA||
    snapshot.synthetic!==true||snapshot.may_write!==false||
    snapshot.atomic_snapshot_proven!==false||
    snapshot.target_locked!==false||snapshot.official_authorization!==false)
  fail("RUNBOOK_SNAPSHOT_INVALID");
 if(!retention||retention.schema!==I6C_RETENTION_SCHEMA||
    retention.policy_approved!==false||retention.can_delete!==false)
  fail("RUNBOOK_RETENTION_INVALID");
 verifyRecoveryJournal(journal);
 if(journal.schema!==I6C_JOURNAL_SCHEMA||
    journal.manifest_sha256!==snapshot.manifest_sha256)
  fail("RUNBOOK_JOURNAL_MISMATCH");
 const gates=REQUIRED_GATES.map(([id,requirement])=>({
  id,requirement,status:"BELUM_DIBUKTIKAN",evidence_id:null
 }));
 return {schema:I6C_RUNBOOK_SCHEMA,synthetic:true,
  manifest_sha256:snapshot.manifest_sha256,journal_revision:journal.revision,
  gates,abort_if:"ANY_GATE_MISSING_OR_SOURCE_TARGET_CHANGED",
  rollback_policy:"PRESERVE_SOURCE_AND_TARGET_ESCALATE_MANUAL",
  // No UI/status can promote this plan to permission.
  all_gates_verified:false,may_execute:false,may_write:false,
  may_cutover:false,may_delete:false,official_authorization:false};
}
