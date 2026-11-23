# M00-G2 | Kontrak Sumber Data dan Batas Akses API DEMO

**KODE DITULIS, BELUM DIUJI.** Tidak membuat API, autentikasi, sinkronisasi data, koneksi iSIKHNAS atau importer nyata.

- \`assertDemoSourceManifest\` memvalidasi metadata sumber yang **hanya** dihasilkan fixture lokal, termasuk domain, ID, snapshot, wilayah, versi, bulan 2026–2030 dan flag yang menolak klaim verifikasi.
- \`requireDemoSourceRead\` menggabungkan manifest dengan gerbang baca-saja \`M00-G1\` berbasis peran/wilayah contoh; tidak mengizinkan pengungkapan data kejadian secara otomatis.
- \`draftApiBoundaryContract\` menjabarkan syarat yang belum ada: autentikasi server, isolasi tenant, izin sumber, perlindungan data sensitif, dan API read/write nyata.
- Callback \`resolveServerSession\` **hanya kontrak host backend**. Jika berasal dari browser, desain keamanan ini tidak berlaku. Jangan mengambil identitas/role dari input pengguna.
- \`tests/source_access.test.mjs\`: **24 QA tertulis, 0 dijalankan**.

Penggunaan data kesehatan hewan yang sebenarnya memerlukan izin pengampu sumber, pengaturan akses, bukti kualitas data, dan proses kelembagaan tersendiri. Tidak ada data resmi dalam branch publik ini.

[Spesifikasi](../../docs/M00_G2_SOURCE_API_BOUNDARY_2026_2030.md) · [QA backlog](../../docs/TEST_BACKLOG.md).
