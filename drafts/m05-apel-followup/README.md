# M05-9 | Register Tindak Lanjut Rekonsiliasi Manual APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DATA DEMO SAJA.**

M05-9 menyiapkan pencatatan **usulan tindak lanjut**, bukan menjalankan perbaikan atau menutup temuan. Sumber inputnya adalah paket M05-8 yang seluruhnya `BLOCKED`, dengan kebutuhan bukti M05-5/M05-6 dan potensi isu lineage M05-7. Tidak ada akses ke APEL, database, pengguna nyata, atau dokumen resmi.

- `register.mjs`: dari paket kesiapan DEMO M05-8, bentuk 14 tugas kebutuhan bukti ditambah satu tugas untuk setiap konflik lineage. Setiap task punya `snapshot_id`, ID tugas, sumber isu/kode, peran penelaah **konseptual**, daftar jenis bukti yang dibutuhkan, dan status `OPEN_UNVERIFIED`. ID isu berupa indeks lokal **hanya untuk snapshot tertentu**, bukan identitas tetap lintas snapshot.
- `proposals.mjs`: buat **usulan** aksi manual saja: permintaan bukti, klarifikasi sumber, telaah rekonsiliasi, pembahasan lingkup atau penundaan. Catatan lama dikembalikan sebagai histori append-only di dalam nilai hasil; `expected_revision` adalah pemeriksaan nomor revisi DEMO, **bukan** kontrol konkurensi DB atau audit hukum. Tidak menghapus tugas, memutuskan benar-salah atau menyatakan temuan selesai.
- `handoff.mjs`: tampilan daftar tugas per kelompok untuk bahan pembahasan, tidak mengirim, menugaskan orang nyata, mempublikasikan, atau melaksanakan tindak lanjut.

Semua label dan identitas fixture berawalan `DEMO-`. **Tidak menerima** sumber dan nama nyata, isian dokumen bebas, kredensial, tanda tangan, atau perubahan status menjadi sah. Tenggat dan bukti signoff selalu `null` karena belum ada kewenangan penugasan aktual.

**50 skenario QA tertulis, 0 dijalankan** pada `tests/followup.test.mjs`. Baca [spesifikasi M05-9](../../docs/M05_9_MANUAL_RECONCILIATION_FOLLOWUP_2026_2030.md) dan [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

**M05-10 (RENCANA):** matriks desain uji paritas dan kriteria penerimaan terhadap Juknis serta schema yang kelak disetujui. Tetap non-eksekusi sampai izin pengujian dan bukti resmi diperoleh.
