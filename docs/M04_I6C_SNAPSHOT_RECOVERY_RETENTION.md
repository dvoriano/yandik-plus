# M04-I6C | Konsistensi Snapshot, Rencana Recovery dan Retensi DEMO

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Melanjutkan M04-I6A (manifest migrasi satu arah) dan M04-I6B (pembaca target I5 baca-saja). Tidak membangun sistem migrasi nyata, SQL write, file backup, penghapusan, atau autentikasi Flask/APEL. Semua input contoh dan ID fiktif.

## 1. Maksud
Menyiapkan **rancangan fail-closed** sebelum perpindahan data dari snapshot I4 menuju struktur I5 per Puskeswan. Tiga keputusan harus tetap terpisah: (a) kecocokan pengamatan data, (b) kesiapan teknis recovery/backup, (c) persetujuan pemilik proses dan aturan retensi. Hasil DEMO yang rapi tidak memenuhi ketiganya secara otomatis.

## 2. Sumber, snapshot dan batas atomisitas

`planSnapshotConsistency(manifest,[observasi1,observasi2])` memeriksa ulang manifest I6A terhadap **dua pengamatan** data I4 dan inventaris I5. Ia menolak data sumber berubah meski nomor revisi tidak berubah, perubahan revisi, target sudah terisi, hash/format manifest rusak dan data partisi silang fasilitas yang tidak sah. Keluaran hanya berisi metadata dan `stable_in_supplied_observations:true`, selalu dengan:
- `atomic_snapshot_proven:false`
- `source_provenance_verified:false`
- `target_locked:false`
- `backup_verified:false`, `restore_verified:false`
- `may_write:false`, `may_cutover:false`, `official_authorization:false`

**Dua pembacaan identik bukan pembuktian snapshot atomik.** Untuk integrasi riil perlu host server yang membuka snapshot transaksi yang konsisten, validasi sumber asli, pembekuan penulis, pemeriksaan ulang target **di dalam** transaksi mutasi, dan abort semua fasilitas bila salah satu validasi gagal. Pola ini hanya ditulis sebagai 12 gerbang dalam `runbook.mjs`; **tidak ada transaksi yang dieksekusi**.

## 3. Jurnal pemulihan DEMO dan respons kegagalan

`createRecoveryJournal`, `appendRecoveryPlan`, `verifyRecoveryJournal` dan `failureResponsePlan` membentuk contoh jurnal dalam memori untuk satu ID rencana migrasi DEMO.

| Urutan | Makna | Hasil |
|---|---|---|
| 1 | `risiko_dicatat` | Rencana risiko, bukan insiden nyata |
| 2 | `backup_direncanakan` | Rencana salinan, **tidak berarti backup ada** |
| 3 | `restore_direncanakan` | Rencana uji pemulihan, **belum dijalankan** |
| 4 | `ditelaah_demo` | Pemeriksa harus berbeda dari penyusun, hanya ID contoh |
| 5 | `rancangan_dibekukan` | Desain dibekukan di memori, **bukan izin migrasi** |

Revisi dan hash berantai digunakan sebagai pemeriksaan perubahan sederhana. Karena data jurnal belum persisten dan tidak memiliki kunci tanda tangan, **hash bukan bukti audit tidak bisa dimanipulasi**. Perubahan data, gagal backup/restore, jurnal rusak, operasi terputus atau otorisasi tidak sah menghasilkan saran: **hentikan proses, pertahankan sumber/target/arsip, dan tinjau manual**. Tidak ada tombol atau fungsi yang menjalankan rollback nyata.

Untuk migrasi sungguhan, recovery perlu jurnal tahan gagal, sumber tetap dipertahankan, penanda cutover yang dibatasi hak akses, prosedur restore teruji, backup off-host, dan keputusan operator untuk pemulihan; detail implementasi menunggu keamanan dan proses kedinasan.

## 4. Inventaris retensi tanpa keputusan masa simpan

`planRetentionRegister` menghasilkan daftar kelas data untuk sumber, manifest dan rencana backup tingkat global, serta versi, event, command, arsip I4 dan ID lama per Puskeswan. Penanda hold DEMO hanya metadata contoh.

| Ketentuan | Status sekarang |
|---|---|
| Masa simpan per jenis arsip | `BELUM_DITETAPKAN` |
| Legal hold / sengketa / pemeriksaan | `BELUM_DIPERIKSA` atau `DEMO_HOLD_DICATAT` |
| Klasifikasi, pengampu, hak akses historis | BUTUH KEPUTUSAN |
| Persetujuan pemusnahan/penghapusan | **TIDAK ADA** |
| Ekspor, purge, cron retensi dan penghapusan | **TIDAK DIBUAT** |

Keluaran selalu `can_delete=false`, `can_export=false`, `can_purge=false`, `policy_approved=false`. Tidak ada satu pun jangka waktu retensi yang diasumsikan. Prosedur nyata harus mengacu pada klasifikasi arsip/data, aturan pemeriksaan dan keputusan pejabat/pengelola yang berwenang.

## 5. Dua belas gerbang runbook sebelum integrasi riil

Runbook hanya daftar prasyarat **BELUM_DIBUKTIKAN**: provenance source, autentikasi/RBAC, snapshot baca konsisten, lock penulis, recheck di lock, backup terverifikasi, uji restore, atomic commit/abort seluruh fasilitas, jurnal tahan gagal, validasi pasca-cutover, kebijakan retensi, serta izin owner dan tata kelola keamanan/SPBE.

Walaupun seluruh checklist rancangan suatu saat terisi, versi I6C ini **tidak memiliki jalur menaikkan `may_execute` atau `may_cutover`**. Implementasi memerlukan proses review, pengujian terpisah dan keputusan tersendiri. SQLite I5 masih satu DB dengan satu penulis fisik, bukan tenant isolation sebenarnya.

## 6. Bukti pekerjaan dan QA ditunda

- [Snapshot preflight](../drafts/m04-snapshot-recovery/snapshot.mjs) dan [8 tes tertulis](../drafts/m04-snapshot-recovery/tests/snapshot.test.mjs)
- [Recovery in-memory](../drafts/m04-snapshot-recovery/recovery.mjs) dan [11 tes tertulis](../drafts/m04-snapshot-recovery/tests/recovery.test.mjs)
- [Retensi DEMO](../drafts/m04-snapshot-recovery/retention.mjs) dan [6 tes tertulis](../drafts/m04-snapshot-recovery/tests/retention.test.mjs)
- [Runbook prasyarat](../drafts/m04-snapshot-recovery/runbook.mjs) dan [5 tes tertulis](../drafts/m04-snapshot-recovery/tests/runbook.test.mjs)
- [Daftar pemeriksaan tertunda](TEST_BACKLOG.md)

**30 skenario baru tertulis, 0 dijalankan.** Tidak ada audit teknis operasional, backup/restore, verifikasi keamanan, tes browser/CI, merge, deployment, atau pemakaian data nyata. Repo GitHub berstatus PUBLIC, semua data harus tetap fiktif.

## 7. Tahap berikutnya yang disarankan

**M04-I6D: peta keputusan integrasi Flask/APEL dan gerbang pelaksanaan** yang memisahkan persyaratan aplikasi lama (source Flask legacy belum masuk repository), otorisasi pengguna, tata kelola SPBE, uji lintas modul dan pemulihan sebelum penerapan. Bila tetap CODE_ONLY, hasilnya hanya dokumen/kontrak dan daftar skenario, bukan aktivitas produksi. M05 APEL 2.0 tetap mengikuti roadmap.
