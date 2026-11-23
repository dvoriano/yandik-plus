# M00-G4 | Batas kesiapan izin sumber & identitas server

**KODE DITULIS, BELUM DIUJI | DEMO ONLY | NO REAL IMPORT.**

Kontrak ini menyiapkan daftar persyaratan sebelum YANDIK+ boleh terhubung ke sumber kesehatan hewan resmi. Ia **sengaja tidak menerima status APPROVED** atau nomor izin asli dan tidak pernah membuka akses data.

- \`buildDemoSourceReadiness\`: validasi tujuh tema pemeriksaan (otorisasi pemilik data, tujuan, klasifikasi, transfer, retensi, identitas server, audit/insiden) dan manifest M00-G2; dibaca peran administrasi/verifikator provinsi fiktif. Selesainya *draft* checklist **bukan** izin.
- \`draftServerIdentityRequirements\`: daftar prasyarat autentikasi server Flask seperti sesi host, expirasi/revokasi, CSRF, scope wilayah/objek, allowlist respons, tanpa password bawaan, audit, dan izin sumber.
- Tidak ada panggilan jaringan, endpoint Flask, credential, data nyata, pengajuan perizinan, import atau persistence.
- \`tests/readiness.test.mjs\`: **22 skenario QA tertulis, 0 dijalankan**.

[Spesifikasi](../../docs/M00_G4_SOURCE_PERMISSION_GATE_2026_2030.md) · [Backlog QA](../../docs/TEST_BACKLOG.md).
