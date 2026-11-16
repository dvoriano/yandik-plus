# M04-S9V | Paket persiapan sesi QA

**KODE DITULIS, BELUM DIUJI.** Tidak boleh dijalankan dalam CODE_ONLY.

`plan.mjs` menyatukan inventaris tes tertulis dengan gerbang QA dan 14 kebutuhan bukti dari sumber DEMO. Tidak menyediakan test runner atau tindakan eksekusi.

- 16 suite sebelumnya: 184 skenario tertulis, dihitung dari pembacaan teks GitHub. Tambahan 8 skenario M04-S9V menghasilkan 17 suite/192 skenario tertulis.
- G1: 12 skenario audit kontrak S9R; G2: 56 skenario S9F–S9J; G3: 124 skenario S9K–S9Q dan S9S–S9V. G4 adalah pemeriksaan browser/manual terpisah, tidak dihitung dalam 192.
- G0 menunggu izin eksplisit owner. G5 adalah telaah institusi terpisah. Semua eksekusi, bukti dan penutupan temuan masih nol.
- Dokumen sesi memuat kriteria masuk, keluar dan berhenti; commit aktual yang disetujui owner belum ditetapkan.
- Perbaikan kontrak snapshot S9U (`observed_on` → `observed_date`) masih belum diuji.

Rujukan: `docs/M04_S9V_QA_SESSION_PLAN.md`.