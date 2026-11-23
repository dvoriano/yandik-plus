# Command Center Demo (mandiri)

**Status:** PoC independen, data sintetis; **bukan** sistem APEL yang sebenarnya.

Prototipe ini mendemonstrasikan pola yang relevan dari ide Augma: ringkasan data visual, interaksi titik skematis, filter prioritas pelaporan, dan area *tanya-data*. Tidak menggunakan source code atau aset Augma.

## Jalankan

```sh
cd experiments/augma-inspired/prototypes/command-center
python3 -m http.server 8765 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8765/`.

Semua file statis tanpa dependensi, token, eksternal API, atau database. Bisa dijalankan di browser laptop/HP dalam jaringan uji lokal jika server sengaja dibuka untuk pengujian. Jangan mengunggah data produksi.

## Pengujian

```sh
node --test tests/core.test.mjs
```

Node.js 20+; tidak perlu npm install.

## Yang sudah bekerja

- Ringkasan jumlah unit, pelaporan, dan pelayanan **fiktif**.
- Diagram lokasi skematis yang bisa diklik atau dipilih via keyboard.
- Cari wilayah dan tampilkan hanya wilayah dengan pelaporan belum lengkap.
- Detail wilayah contoh dan persentase pelaporan.
- Tanya-data **berbasis aturan**, bukan AI sesungguhnya. Respon menyertakan disclaimer simulasi.

## Yang belum ada

- Peta geografis sebenarnya, daftar Puskeswan sesungguhnya, hubungan database/API, GIS, autentikasi, audit akses, model AI/LLM, pengenalan gestur, dan 3D.
- Tidak ada fitur menulis/mengubah data server atau aksi otomatis.

## Aturan sebelum diuji dengan data nyata

Butuh data yang diizinkan untuk uji, definisi metrik dan ketidaklengkapan, persetujuan tata kelola, dan akses read-only melalui data contoh yang telah dianonimkan. Tidak ada koneksi langsung ke `yandikvo.my.id` atau server Sumopod.
