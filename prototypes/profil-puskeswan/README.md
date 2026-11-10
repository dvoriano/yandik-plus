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

## Struktur
- \`index.html\`: struktur semantik, label, skip link, form dan pesan status.
- \`style.css\`: tampilan mobile-first dan responsif, tombol lebar, status teks (tak mengandalkan warna saja).
- \`main.mjs\`: interaksi layar tanpa dependensi atau request HTTP, membatasi render konten data memakai \`textContent\`.
- \`model.mjs\`: state machine murni, pemisahan draft vs terverifikasi, antrian review dan aturan keputusan.
- \`tests/model.test.mjs\`: pengujian node:test untuk alur inti dan penyalahgunaan peran pada simulasi.

## Cara memeriksa di GitHub
- Kode tersedia pada branch \`develop/yandik-foundation\` dan dapat ditinjau per file.
- GitHub Actions menjalankan tes Node dan pengecekan sintaks JS tanpa meminta pengaturan laptop.
- Repo **tidak mengaktifkan GitHub Pages atau publikasi**. Sebuah file HTML di repository belum otomatis menjadi situs yang bisa dibuka langsung dari URL GitHub.
- Jangan membuka demo menggunakan data nyata atau menganggap simulasi menggantikan izin API backend.

## Integrasi berikutnya
1. Selaraskan label dan field dengan Profiling 2026 yang asli setelah source Flask tersedia di GitHub.
2. Bangun API+database staging dengan autentikasi nyata dan pemeriksaan izin pada server, bukan memakai role-switch klien.
3. Siapkan lampiran bukti, pengingat dan audit permanen.
4. Uji kemudahan penggunaan dengan petugas Puskeswan pada layar HP.

**Tidak ada koneksi ke VPS, iSIKHNAS, website YANDIK+ produksi, atau data kepegawaian nyata.**
