# M05-13 | Observabilitas dan Audit Trail APEL Puskeswan 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Seluruh kode memakai ID sintetis; belum ada log layanan, pemeriksaan kesehatan, notifikasi, data resmi, atau pengukuran aktual.

## 1. Kedudukan dalam roadmap
M05-8 menutup enam gerbang readiness; M05-9 merencanakan tindak lanjut tanpa keputusan; M05-10 merinci 23 definisi kasus paritas; M05-11 mendesain izin staging; M05-12 menginventarisasi 18 kontrol kesiapan rilis dan 11 kondisi penghentian. M05-13 menyusun kontrak data untuk **memikirkan pengamatan masalah dan audit** tanpa menganggap ada sistem pemantau yang sedang berjalan.

**Status konseptual:** 12 sinyal, tanpa sumber live, ambang yang disahkan, jadwal polling, timestamp tepercaya, saluran alert, pemilik insiden nyata, hasil uji regresi, persetujuan staging, atau kewenangan rilis. **Tidak ada event = belum terukur, bukan sehat.**

## 2. Katalog sinyal rancangan

| Sinyal | Pertanyaan audit dan rujukan |
|---|---|
| INGEST_STATUS | Ketersediaan proses penerimaan dan status pengiriman |
| REPORT_REVISION_LINK | Kecocokan revisi workflow dengan laporan pelayanan |
| MISSING_VS_ZERO | Nol eksplisit, belum melapor, tidak berlaku dan nilai tak tersedia |
| FACILITY_IDENTITY | Kunci stabil fasilitas dan periodisasi laporan |
| REGION_AS_OF_MONTH | Atribusi kabupaten/kota pada bulan yang tepat |
| INVESTIGATION_EVENT_LOCATION | Keunikan pemeriksaan investigasi per kejadian dan lokasi |
| KURBAN_SINGLE_ANIMAL | Satu hewan kurban tidak digandakan saat ante/post |
| SERVICE_TOTALS | Cakupan, unit, rekonsiliasi dan ketepatan total pelayanan |
| YEAR_POLICY_VERSION | Versi kebijakan independen per tahun 2026–2030 |
| SOURCE_SNAPSHOT | Keandalan provenance, periode dan snapshot yang sama |
| SECURITY_REDACTION | Kehati-hatian audit akses, retensi dan data sensitif |
| RESTORE_HEALTH | Kesiapan backup, health check dan jalur pemulihan |

Sinyal mengacu pada syarat bukti M05-8 dan kategori penghentian M05-12. **Penamaan sinyal tidak berarti implementasi pendeteksi atau trigger berjalan.** Setiap ambang numerik harus berdasarkan bukti dan kebijakan yang disetujui.

## 3. Ledger sintetis dan sifat audit
`ledger.mjs` mencatat *hanya metadata kode*: `DEMO-EVT-*`, `DEMO-SNAP-*`, `DEMO-PSW-*`, `YYYY-MM`, ID sinyal, severity `INFO/REVIEW/URGENT_REVIEW` dan kode observasi terbatas. Fungsi mengeluarkan nomor urut lokal per snapshot, menghitung ulang jumlah per tingkat, dan menolak perubahan struktur/urutan yang tidak sesuai. Tidak menyimpan teks bebas, sumber dokumen, credential, nomor kontak, isi data hewan atau raw log.

Tidak ada integritas kriptografis, penyimpanan tahan gangguan, retensi, sinkronisasi waktu atau kontrol akses nyata. Karena itu hasilnya **tidak boleh diperlakukan sebagai audit trail kedinasan yang autentik**. Rancangan khusus demonstrasi.

## 4. Triage dan handoff
`triage.mjs` menampilkan 12 sinyal terlepas dari jumlah observasi. Bila tidak ada observasi: `NOT_MEASURED`; bila ada: hanya `HUMAN_REVIEW_NEEDED`, bukan status kesehatan produksi. Catatan review `DEMO-NOTE-*` memilih kode aksi permintaan bukti, penjelasan atau eskalasi penelaah, tetapi **tidak** menugaskan pegawai, mengirim notifikasi, menandatangani, menutup insiden, atau mengubah data sumber.

Handoff mencatat gap sinyal dan antrean telaah untuk pembahasan manusia, **bukan** rekam insiden resmi atau dasar operasional rollback. `alert_sent=0`, `may_send_alert=false`, `official_incident_count=0` dan seluruh aksi tulis/publikasi dinonaktifkan.

## 5. Persyaratan sebelum rancangan dapat dijadikan sistem operasional
- Izin pemilik proyek untuk tes (ubah CODE_ONLY secara eksplisit) terpisah dari izin pengampu sistem/sumber untuk akses.
- Data dictionary, versi Juknis 2026, kebijakan tahunan 2027–2030, dan paritas dengan skema aktual.
- Kebijakan RBAC, retensi, minimisasi/pseudonimisasi, pengamanan log, pengaturan waktu server dan pengelolaan rahasia.
- Metrik, definisi ambang dan *false positive*, inspeksi backup/restore, playbook insiden, serta saluran eskalasi yang ditunjuk resmi.
- Verifikasi staging independen, rencana rilis/rollback, pengujian keberhasilan dan persetujuan publikasi yang berbeda dari sekadar telah menulis kode.

Seluruh komponen tersebut belum dibuktikan. Repo PUBLIC tetap hanya berisi metadata sintetis tanpa dokumen kedinasan asli.

## 6. Berkas dan QA
- [Katalog sinyal](../drafts/m05-apel-observability/catalog.mjs)
- [Ledger observasi sintetis](../drafts/m05-apel-observability/ledger.mjs)
- [Papan pantauan, triage & handoff](../drafts/m05-apel-observability/triage.mjs)
- [50 skenario QA tertulis](../drafts/m05-apel-observability/tests/observability.test.mjs), **0 dijalankan**
- [README](../drafts/m05-apel-observability/README.md)
- [TEST_BACKLOG](TEST_BACKLOG.md)

## 7. Arah fitur setelah M05-13
Prioritaskan **dashboard APEL 2026–2030** dan penyatuan **Profil Puskeswan → SDM → Pelaporan & Koreksi → Pembinaan → Tindak Lanjut**. Langkah awal tetap menggunakan fixture DEMO, kontrak status yang membedakan nol/missing, data terkait lokasi historis, dan kebijakan tiap tahun. **Tidak ada penggabungan ke main atau aplikasi produksi** tanpa keputusan dan pemeriksaan resmi.
