# Prototype M02-S2 | Profil Puskeswan Mobile-First

**Status:** antarmuka demo offline interaktif. Bukan aplikasi produksi, bukan server Flask, dan **bukan sistem login/otorisasi nyata**.

## Apa yang bisa dicoba
1. Masuk sebagai **Petugas Puskeswan** dalam pemilih peran simulasi.
2. Buka salah satu bagian (Legalitas, Bangunan, Peralatan, Obat/BHP, Wilayah Kerja).
3. Isi informasi baru lalu **Simpan draf** atau **Ajukan verifikasi**. Nilai terverifikasi belum berubah.
4. Ganti ke **Verifikator Kab/Kota** atau **Verifikator Provinsi** pada pemilih peran simulasi.
5. Buka **Antrian Verifikasi**; setujui, minta perbaikan, atau tolak. Penolakan/perbaikan wajib disertai alasan.
6. Kembali ke **Petugas** untuk memperbaiki usulan. Akses **Pimpinan** hanya menampilkan ringkasan.

**Penting:** Perubahan tersimpan hanya dalam memori tab, hilang saat refresh. Pergantian peran bukan autentikasi, bukan bukti izin akses sungguhan. Ini sengaja dibuat hanya dengan data fiktif DEMO.

## Tambahan M02-S4
- **Permasalahan Puskeswan:** catat kategori, judul, uraian, simpan draf/kirim, verifikator bisa meminta perbaikan/menolak/mencatat masalah, lalu menulis tindak lanjut dan menandai selesai. Tidak ada persetujuan bantuan.
- **SDM/APEL:** dua kartu sumber baca-saja berdata simulasi. Pilih periode untuk memahami beda laporan nol dan belum melapor. Tidak ada input kedua.
- `problems.mjs`: model masalah fiktif (14 tes baru).
- `source_snapshots.mjs`: snapshot sumber statis **hanya DEMO** (6 tes baru).
- `tests/browser.test.mjs`: 3 tes Chromium baru (total 9 browser).
- [GitHub Actions: 119 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101), [dokumentasi](../../docs/M02_PROBLEMS_AND_REFERENCES.md).

## Tambahan M03-S1: Usulan kebutuhan Support
- Petugas memilih **Usulkan kebutuhan** pada masalah yang telah diverifikasi, mengisi item, kategori, jumlah, satuan, urgensi, alasan, simpan draf atau ajukan.
- Verifikator membaca usulan (draf belum terlihat), meminta perbaikan/menolak dengan alasan, atau memverifikasi kebutuhan tanpa menyetujui dana.
- `support_needs.mjs` dan `tests/support_needs.test.mjs`: 15 tes baru, termasuk anti-duplikasi dan anti-alokasi.
- `tests/browser.test.mjs` memuat 3 tes UI baru; [GitHub Actions SUCCESS: 137 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052).
- Tidak ada API, database, keputusan anggaran, pengadaan maupun pengiriman bantuan.
- [Dokumentasi](../../docs/M03_LINKED_SUPPORT_NEEDS.md).

## Tambahan M03-S2: metadata bukti dan pencegahan duplikat
- **Draf tanpa bukti boleh**, tetapi pengajuan hanya dengan kode bukti `DEMO-...`; URL/path nyata ditolak.
- Verifikator wajib mengonfirmasi pemeriksaan metadata, **bukan** file fisik; keputusan bantuan tetap tidak tersedia.
- Normalisasi nama barang dan deteksi duplikat dalam satu Puskeswan lintas masalah; pengajuan ulang setelah penolakan perlu alasan.
- [15 tes Node dan 2 Chromium baru, 154 tes keseluruhan SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).
- [Dokumen khusus](../../docs/M03_EVIDENCE_AND_DEDUP.md).

## Struktur
- \`index.html\`: struktur semantik, label, skip link, form dan pesan status.
- \`style.css\`: tampilan mobile-first dan responsif, tombol lebar, status teks (tak mengandalkan warna saja).
- \`main.mjs\`: interaksi layar tanpa dependensi atau request HTTP, membatasi render konten data memakai \`textContent\`.
- \`model.mjs\`: state machine murni, pemisahan draft vs terverifikasi, antrian review dan aturan keputusan.
- \`tests/model.test.mjs\`: 25 unit tes logika JavaScript, termasuk draf yang sudah disimpan.
- \`tests/browser.test.mjs\`: 6 tes Chromium E2E pada viewport 320/375 px di GitHub Actions.

## Cara memeriksa di GitHub
- Kode tersedia pada branch \`develop/yandik-foundation\` dan dapat ditinjau per file.
- GitHub Actions menjalankan tes Python/Node, pengecekan sintaks, dan Chromium E2E tanpa meminta pengaturan laptop. [Run SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703).
- Draf yang sudah tersimpan dapat diajukan langsung. Mode pimpinan hanya menjelaskan bahwa agregat belum tersedia dan tidak merender data individu.
- Repo **tidak mengaktifkan GitHub Pages atau publikasi**. Sebuah file HTML di repository belum otomatis menjadi situs yang bisa dibuka langsung dari URL GitHub.
- Jangan membuka demo menggunakan data nyata atau menganggap simulasi menggantikan izin API backend.

## Integrasi berikutnya
1. Gunakan [peta domain Profiling 2026](../../docs/M02_PROFILING_2026_MAPPING.md) untuk menghindari input ganda; verifikasi field sebenarnya ketika source Flask tersedia di GitHub.
2. Bangun API+database staging dengan autentikasi nyata dan pemeriksaan izin pada server, bukan memakai role-switch klien.
3. Siapkan lampiran bukti, pengingat dan audit permanen.
4. Uji kemudahan penggunaan dengan petugas Puskeswan pada layar HP.

**Tidak ada koneksi ke VPS, iSIKHNAS, website YANDIK+ produksi, atau data kepegawaian nyata.**
