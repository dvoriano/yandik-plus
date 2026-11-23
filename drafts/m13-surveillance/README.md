# M13-S1 | PHMS, Zoonosis & Surveilans DEMO 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DATA FIKTIF.**

\`surveillance.mjs\` menyusun daftar baca-saja kejadian kesehatan hewan DEMO. Manifest sumber wajib lolos [M00-G2](../m00-source-api-gate/) dan sesi/wilayah melalui M00-G1. Hal tersebut **belum merupakan autentikasi server** dan tidak memberi akses ke iSIKHNAS.

- Tiga kejadian contoh dengan lokasi berupa ID fiktif, **tanpa koordinat riil**, identitas pemilik, sampel laboratorium, atau nomor kasus asli.
- **Dugaan/observasi** dipisahkan dari catatan investigasi, sampel, dan catatan hasil lab. Tidak ada status \`CONFIRMED\`, kasus resmi, wabah resmi, respons otomatis atau diagnosis otomatis.
- Catatan hasil lab DEMO tidak menjadi konfirmasi penyakit; \`official_case_count=null\`, \`verified_lab_result_count=null\`, bukan 0.
- Setiap kejadian punya ID, wilayah, periode, dan referensi snapshot sintetis yang wajib cocok. Duplikat ID, wilayah berbeda, rekaman sesudah bulan snapshot dan sumber resmi palsu ditolak.
- \`buildDemoEventReview\` hanya menyarankan **pembahasan manusia** tanpa penugasan, pemberitahuan atau tindak lanjut otomatis.
- **Tidak ada sinkronisasi APEL atau iSIKHNAS**. Penghitungan investigasi di APEL berbeda dari event register ini dan tidak boleh dijumlahkan tanpa rekonsiliasi yang disetujui.
- \`tests/surveillance.test.mjs\`: **28 QA tertulis, 0 dijalankan**.

Regulasi, akses laboratorium, definisi kasus, pelaporan wajib dan kewenangan resmi membutuhkan telaah terpisah. Jangan memakai prototipe sebagai alat respons penyakit operasional.

[Spesifikasi](../../docs/M13_S1_PHMS_ZOONOSIS_SURVEILANS_DEMO_2026_2030.md) · [QA backlog](../../docs/TEST_BACKLOG.md).
