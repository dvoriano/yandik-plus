# M02-S4 | Permasalahan dan Referensi SDM/APEL Tanpa Input Ganda

**Status:** Prototype browser offline **teruji**, belum modul aplikasi Flask atau laporan resmi.  
**Tanggal:** 10 November 2026.  
**Ruang lingkup:** hanya kode dan data **DEMO** pada branch GitHub pengembangan, tanpa koneksi VPS/website.

## Kode yang benar-benar dibuat
- \`prototypes/profil-puskeswan/problems.mjs\`: daftar masalah, status, validasi input, histori revisi, dan alur pemeriksaan/tindak lanjut.
- \`prototypes/profil-puskeswan/source_snapshots.mjs\`: adapter demo data **baca-saja** untuk ringkasan SDM dan APEL berdasarkan ID Puskeswan dan periode.
- \`prototypes/profil-puskeswan/main.mjs\`, \`index.html\`, \`style.css\`: antarmuka mobile-first yang menampilkan dua kartu data sumber dan daftar permasalahan.
- \`prototypes/profil-puskeswan/tests/problems.test.mjs\`: 14 tes state workflow masalah.
- \`prototypes/profil-puskeswan/tests/source_snapshots.test.mjs\`: 6 tes sumber data, nol vs kosong, tidak membuat total palsu.
- \`prototypes/profil-puskeswan/tests/browser.test.mjs\`: 3 tes Chromium baru untuk informasi baca-saja dan alur masalah dari input sampai tindak lanjut.

## Alur Permasalahan Puskeswan (simulasi)
Petugas:
1. Buka **Permasalahan Puskeswan** → **Catat masalah**.
2. Isi **kategori**, **judul singkat**, dan **keterangan**, lalu **Simpan draf masalah** atau **Ajukan masalah**.
3. Jika diminta perbaikan, baca alasan, koreksi dan kirim ulang.

Verifikator pada role demonstrasi:
1. Lihat masalah yang telah diajukan; **draf belum dikirim tidak terlihat**.
2. Pilih **Verifikasi masalah**, **Minta perbaikan**, atau **Tolak**. Koreksi/penolakan memerlukan alasan.
3. Masalah terverifikasi masuk status **Terverifikasi, belum ditindaklanjuti**. Selanjutnya dapat **Catat tindak lanjut**, lalu **Tandai selesai**, dengan catatan tertulis.

**Batas penting:** Verifikasi masalah hanyalah pencatatan keadaan. **Tidak menciptakan alokasi bantuan, BAST, persetujuan anggaran, pengadaan, maupun keputusan resmi**. Hubungan ke modul Support harus melalui alur tersendiri pada M03/M04, bukan otomatis.

## Ringkasan SDM dan APEL
- **Identitas master** contoh: \`DEMO-PSW-001\`, sama dengan Profil Puskeswan dan kebutuhan Support fiktif yang sudah ada.
- **SDM**: contoh tenaga aktif per 31 Oktober 2026, termasuk kemungkinan angka \`0\`. Tidak menjadi isian baru di Profil; perubahan SDM nantinya dilakukan hanya pada modul SDM.
- **APEL**: pilihan periode contoh. Oktober 2026 menampilkan angka kategori yang ada pada fixture fiktif, September 2026 memiliki laporan **dengan nol**, November 2026 **belum melapor**, dengan pesan berbeda.
- Jumlah per kategori **tidak dijumlahkan** menjadi "total pelayanan" resmi, karena acuan hitung tetap juknis APEL.
- Status dan sumber data ditandai \`(contoh)\` atau \`Baca-saja\`. Tidak ada formulir edit SDM/APEL pada layar Profil.

### Ketentuan kejujuran data
\`source_snapshots.mjs\` saat ini **menyalin angka fiktif dari contoh pengembangan**, bukan memanggil modul SDM/APEL atau \`foundation/fixtures\` secara langsung. Itu dipakai untuk memperlihatkan cara adapter kelak bekerja. Belum ada sinkronisasi ke database, iSIKHNAS, maupun APEL online. Jangan klaim sebagai "data terhubung produksi".

## Verifikasi nyata di GitHub
- [Commit kontrak masalah dan sumber demo](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95).
- [Commit UI dan pengujian browser](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1).
- [GitHub Actions run #42850233101](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101): **SUCCESS**, ketiga job berhasil.
- **65 tes Python + 45 tes JavaScript + 9 tes Chromium = 119 tes otomatis** tanpa kegagalan; validator fixture fiktif berhasil.

## Belum terintegrasi
- [ ] Repositori belum mempunyai seluruh source Flask legacy 171 file.
- [ ] Belum ada database persistensi, autentikasi/otorisasi server per Puskeswan/wilayah dan audit tahan perubahan.
- [ ] Belum ada integrasi API dan pembaruan real-time SDM/APEL, ataupun koneksi Support yang sah.
- [ ] Belum ada lampiran foto bukti, surat, keputusan bantuan atau BAST.
- [ ] Belum ada uji pengguna pada HP fisik, jaringan lemah, aksesibilitas menyeluruh dan petugas kurang terbiasa teknologi.
- [ ] Belum ada verifikasi field-level Profiling 2026 terhadap source/DB asli.
- [ ] Tidak ada deployment, publikasi GitHub Pages maupun perubahan pada branch \`main\`.

## Lanjutan yang aman
1. Kembangkan model data **Masalah → Kebutuhan Support** hanya sebagai referensi satu arah dengan riwayat dan izin terpisah, tanpa otomatis menyetujui bantuan.
2. Tambahkan validasi aksesibilitas UI (keyboard, teks, label, fokus, error) di GitHub Actions.
3. Setelah source legacy ada di GitHub, petakan ID/fungsi SDM/APEL dan field Profiling sebenarnya sebelum adapter backend dibuat.
4. Validasi aturan kerja dan persetujuan resmi melalui tata kelola kedinasan sebelum deploy.

**Rujukan:** [ROADMAP](ROADMAP.md) · [Katalog Modul](MODULES_INDEX.md) · [Peta Profiling 2026](M02_PROFILING_2026_MAPPING.md) · [Batasan UI](M02_UI_DEMO.md).
