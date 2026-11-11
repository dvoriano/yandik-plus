# MASTERPLAN YANDIK+ | 2027 dan seterusnya

**Versi:** 1.0 (rancangan yang dapat berubah)  
**Ditetapkan sebagai arah pengembangan:** 10 November 2026  
**Sifat:** perencanaan dan pengembangan offline, **bukan** persetujuan deployment atau perubahan website produksi.

**Dokumen untuk pembaca nonteknis:** [Ringkasan Eksekutif YANDIK+](RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) dan [Pengenalan Lengkap YANDIK+](PENGENALAN_YANDIK_PLUS.md), keduanya berstatus draf bahan telaah, bukan penetapan resmi.

## Visi
**YANDIK+: Kerja sudah sulit, administrasi jangan rumit.**  
Satu ruang kerja digital bidang pelayanan dan kesehatan hewan: data dicatat sekali pada sumber yang tepat, digunakan kembali untuk pelayanan, pengawasan, pembinaan, dukungan, monitoring, pelaporan, dan keputusan.

## Tujuan terukur
1. Mengurangi pengisian data berulang dan penyusunan laporan manual.
2. Menampilkan tugas sesuai peran, terutama bagi petugas yang kurang terbiasa memakai aplikasi.
3. Membuat setiap kegiatan memiliki jejak: rencana → pelaksanaan → bukti → verifikasi → tindak lanjut → rekap.
4. Menghubungkan data APEL, profil, dan SDM sebagai master data bersama.
5. Menyediakan data terverifikasi dan laporan yang dapat ditelusuri oleh pimpinan.
6. Menyiapkan pengembangan tanpa bergantung token AI berbayar atau akses VPS produksi.

## Posisi YANDIK+
- **Alat bantu operasional teknis dan analitik**, bukan pengganti iSIKHNAS, SRIKANDI, OSS/perizinan, sistem kepegawaian, pengadaan, atau layanan resmi lain.
- Penyusunan draf/rekap dan monitoring diperbolehkan sesuai kewenangan; penerbitan, tanda tangan, arsip resmi, dan keputusan tetap melalui pejabat/sistem berwenang.
- Pengguna utama: petugas Puskeswan; koordinator kab/kota; verifikator dan admin provinsi; petugas pengawasan; pimpinan; pengelola data.
- Akses publik sangat terbatas pada informasi yang boleh dipublikasikan.

## Prinsip desain
- **Mulai dari pekerjaan, bukan daftar menu**: beranda tugas yang perlu diselesaikan.
- **Sekali isi, banyak kegunaan**: tidak membuat entri pelayanan individu baru hanya untuk mengulang rekap APEL.
- **Mobile-first dan bahasa sederhana**: tombol besar, petunjuk singkat, simpan draf, konfirmasi jelas.
- **Satu identitas Puskeswan** untuk profil, SDM, sarpras, pelayanan, dan dukungan.
- **Paperless yang dapat diaudit**: bukti, nomor referensi, status, riwayat revisi, pembuat, verifikator.
- **Aman dan proporsional**: hak akses menurut peran/wilayah, minimisasi data pribadi, tidak ada kredensial dalam repo.
- **Bertahap, modular, interoperabel**: pertahankan Flask dan fitur aktif sebagai baseline, jangan rewrite total.

## Peta domain / modul
Lihat [indeks modul](MODULES_INDEX.md) dan spesifikasi terpisah di folder [modules/](modules/). Kelompok besar:
1. Fondasi: akun, hak akses, wilayah, master Puskeswan, workflow, notifikasi, audit, generator dokumen, UX.
2. Operasional layanan: Profil Puskeswan, APEL, SDM veteriner, Support Puskeswan.
3. Pengawasan: Obat Hewan, Klinik/Praktik Dokter Hewan.
4. Teknis kesehatan hewan: PHMS/zoonosis, sertifikat veteriner/lalu lintas.
5. Manajemen: pembinaan/Bimtek, administrasi kegiatan, dashboard pimpinan, GIS, pustaka regulasi/AI opsional.

## Alur lintas modul
APEL (pelayanan bulanan) + Profil (sarana/obat/SDM) → identifikasi kebutuhan → verifikasi → usulan dukungan → persetujuan manusia/otoritas → distribusi/BAST → monitoring pemanfaatan.  
Contoh: alat rantai dingin rusak tercatat pada profil; Puskeswan mengonfirmasi kebutuhan; verifikator menilai; penyaluran serta BAST dicatat tanpa meminta profil ditulis ulang.

## Aturan data induk
- ID Puskeswan yang stabil, wilayah/kabupaten-kota, satuan kerja dan status verifikasi sebagai kunci utama.
- Pisahkan **data operasional**, **dokumen bukti**, **catatan audit**, dan **data agregat publik**.
- Tiap indikator menyebut sumber, definisi, periode, pembaruan terakhir, verifikator dan metode hitung.
- Koreksi dilacak, jangan mengubah laporan historis tanpa jejak versi/periode.

## Strategi implementasi tanpa anggaran
- GitHub dipakai untuk dokumen, source salinan sanitasi, issues, draf tes dan PR dengan **data sintetis**. Metadata pada 11 November 2026 menunjukkan repository **PUBLIC**; pemilik merencanakan perubahan PRIVATE pada Sabtu 14 November 2026. Hingga perubahan terverifikasi, jangan menaruh data atau dokumen rahasia.
- Tidak ada koneksi ke VPS YANDIK+ ataupun bot Indodax; tidak ada deployment otomatis.
- Pengembangan berurutan mengikuti [Roadmap](ROADMAP.md), dengan [UX](UX_PAPERLESS.md) dan [Workflow bersama](WORKFLOW_ENGINE.md) menjadi standar tiap modul.
- Funding di kemudian hari digunakan untuk staging, migrasi, keamanan, pelatihan dan deployment resmi; kemampuan membuat kode tidak memerlukan dana tersebut.

## Kriteria sebuah fitur boleh dinyatakan SELESAI
Spesifikasi disetujui, kode dan tes tersedia di GitHub, hak akses dipastikan, data dummy lulus skenario lapangan, tidak mengubah perhitungan APEL 2026, dan dokumentasi serta rencana deploy/rollback disediakan. **Selesai di GitHub tidak sama dengan tayang di website.**

## Pengendalian perubahan
Satu sumber status: [ROADMAP.md](ROADMAP.md). Usul tambah/ubah/hapus melalui issue/PR, perbarui spesifikasi modul dan [CHANGELOG_ROADMAP.md](CHANGELOG_ROADMAP.md). Fitur dibatalkan tetap dicatat alasannya. Tidak boleh diam-diam mengubah aturan penilaian atau proses pelayanan aktif.
