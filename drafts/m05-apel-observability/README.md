# M05-13 | Observabilitas & Audit Trail APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.** Tidak ada observasi langsung terhadap APEL, VPS, API, database, layanan, atau pengguna.

M05-13 menyiapkan katalog pertanyaan pantauan dan **ledger proposal metadata sintetis di memori**, bukan fasilitas audit resmi yang tahan manipulasi. Sifat *append-only* pada keluaran fungsi JavaScript tidak setara dengan log yang permanen, ditandatangani, atau mempunyai waktu server tepercaya.

- `catalog.mjs`: **12 sinyal konseptual**, ditautkan ke kebutuhan bukti M05-8 dan kondisi risiko/rollback M05-12. Tidak ada ambang dan jadwal pemantauan yang ditetapkan.
- `ledger.mjs`: observasi `DEMO-EVT-` dengan identitas `DEMO-SNAP-`, satuan bulan/tahun, identitas Puskeswan sintetis, kode masalah terbatas, urutan per snapshot, serta penolakan data bebas. Tidak ada raw event, nama orang, IP, token, sumber aslinya, tanggal pencatatan tepercaya, akses live, atau penyimpanan persisten.
- `triage.mjs`: papan pantauan DEMO `NOT_MEASURED`, catatan telaah usulan, dan handoff non-operasional. **Tidak ada catatan ≠ sehat.** Tidak mengonfirmasi insiden, menghubungi penanggung jawab, mengirim Telegram/email, menutup masalah atau melakukan rollback.
- `tests/observability.test.mjs`: **50 QA ditulis, 0 dijalankan**.

Pemisahan: sinyal sintetis ≠ indikasi masalah riil; observasi `URGENT_REVIEW` bukan insiden terkonfirmasi; review manusia ≠ approval; katalog rollback bukan pemicu otomatis. Tahun 2027–2030 tetap perlu kebijakan masing-masing.

Semua kode hanya di `drafts/`; branch `develop/yandik-foundation`, PR #9 tetap DRAFT. Repo PUBLIC: tidak boleh memuat database, payload log, nama personel, data hewan/pemilik, kunci, identitas asli, alamat server, catatan insiden resmi, atau rahasia.

[Lihat spesifikasi M05-13](../../docs/M05_13_APEL_OBSERVABILITY_AUDIT_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md)

**Langkah pasca-M05-13:** beralih ke *fitur bernilai pengguna* di modul Puskeswan, terutama rancangan dashboard berbasis data DEMO, profil Puskeswan, SDM, dan alur laporan/koreksi. Katalog di sini hanya memberi kontrak risiko agar dashboard tidak salah menandai data yang belum sah.
