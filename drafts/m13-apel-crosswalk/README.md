# M13-S2 | Kandidat Kaitan Surveilans dan APEL (DEMO)

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | NO SYNC.**

\`crosswalk.mjs\` membangun daftar **kandidat** pasangan \`event_id\` + \`location_ref\` + \`period\` + \`facility_id\` fiktif yang muncul pada dua source DEMO. Model memvalidasi konteks M13-S1 serta ledger M05-0 melalui read-model M05-14. **Cocoknya ID tidak membuktikan dua catatan merepresentasikan satu kejadian nyata**.

- Tidak mengubah ledger APEL, catatan surveilans atau aturan hitung investigasi APEL.
- Tolak ID, wilayah, periode, lokasi, atau pasangan yang tidak ditemukan di salah satu sumber; hanya candidate links eksplisit dan belum diverifikasi.
- Kandidat selalu memerlukan review manusia, tidak punya keputusan, tidak boleh dijadikan total kasus resmi, indikator kinerja, atau penggabungan data.
- Tidak menghubungkan iSIKHNAS, menyalin data pribadi, mengirim pemberitahuan atau menerbitkan keputusan penanganan penyakit.
- \`tests/crosswalk.test.mjs\`: **24 QA tertulis, 0 dijalankan**.

Sumber asli, izin akses/berbagi, kamus kejadian, data pemilik dan lokasi sensitif, keterlacakan sampel serta juknis penghitungan harus disepakati dulu.

[Spesifikasi](../../docs/M13_S2_APEL_SURVEILLANCE_CROSSWALK_DEMO_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
