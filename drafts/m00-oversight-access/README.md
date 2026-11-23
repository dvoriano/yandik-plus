# M00-G1 | Gerbang Akses Baca-Saja untuk Modul Pengawasan

**KODE DITULIS, BELUM DIUJI.** Pengendalian cakupan wilayah DEMO di \`scoped_read.mjs\` menggunakan kontrak identitas M04-I6B, **bukan login atau otorisasi server yang terbukti**.

- Diperuntukkan sebagai rancangan untuk registrasi pengawasan obat, klinik/praktik, serta register permohonan sertifikat.
- Hanya admin/verifikator provinsi dan koordinator kabupaten/kota yang sesuai wilayah dapat mengakses **rincian sintetis**. Petugas Puskeswan dan pimpinan tidak diberi akses detail.
- Pemeriksaan daftar menolak record non-DEMO dan pencampuran wilayah.
- Tidak menyediakan write API, unggah, otorisasi eksternal, persetujuan izin, penerbitan sertifikat, ekspor, atau publikasi.
- Callback \`resolveServerSession\` wajib berasal dari host backend terpercaya bila dikembangkan lebih lanjut. Fixture/role-switch di browser **tidak memenuhi syarat**.
- \`tests/scoped_read.test.mjs\` berisi **19 skenario QA tertulis, 0 dijalankan**.

Belum memuat data nyata, adapter Flask, mekanisme sesi, CSRF, audit server, pengesahan role resmi, atau kebijakan dokumen. Status tetap NO_GO sampai tes negatif/teritorial dan persetujuan kelembagaan.
