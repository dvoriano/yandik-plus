# M04-I6D | Gerbang Integrasi Flask/APEL

**KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Folder ini hanya model review DEMO dan tidak terhubung ke Flask, server, basis data, arsip, kredensial atau data operasional.

- `legacy-surfaces.mjs`: lima rute terdokumentasi APEL/SDM yang harus direkonsiliasi dengan kode aplikasi lama. Kehadiran rute asli, method, autentikasi, response dan schema **BELUM DIPERIKSA**.
- `contracts.mjs`: 12 gerbang infrastruktur I6C + 12 gerbang kompatibilitas aplikasi I6D, semuanya berstatus **BELUM_DIBUKTIKAN**.
- `handoff.mjs`: catatan masalah review dan pengampu usulan dengan ID/aktor sintetis. Tidak bisa menutup gerbang, menyetujui integrasi atau menyentuh Flask.
- `tests/`: **21 skenario tertulis; tidak dijalankan**, untuk validasi daftar rute, klaim palsu, gerbang, dan catatan review.

Tidak ada fungsi edit/patch route, login API, SQL, inspeksi database, feature-flag produksi, deployment, atau cutover. Keluaran bertanda `may_integrate=false`, `may_deploy=false`, `official_authorization=false`.

Kontrak dokumentasi: [M04-I6D](../../docs/M04_I6D_FLASK_APEL_INTEGRATION_GATES.md) · [M04-I6C](../../docs/M04_I6C_SNAPSHOT_RECOVERY_RETENTION.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
