# Ruang Kerja Puskeswan YANDIK+

Prototipe web responsif dengan data fiktif. Halaman ini menyajikan ringkasan APEL, profil, SDM veteriner, dan contoh bahan pembinaan. Filter tahun, wilayah, dan Puskeswan menyaring data di beranda. Dashboard APEL terperinci, simulasi Profil dan Dukungan memiliki kontrol masing-masing.

- APEL memakai model dan fixture [M05-14](../m05-apel-dashboard-ui/). Pelayanan dihitung dari laporan yang tersedia. Tanda — berarti belum ada laporan, sedangkan 0 adalah laporan eksplisit tanpa layanan.
- Profil dan SDM memakai [M05-15](../m05-profile-sdm/) dengan identitas fasilitas DEMO yang sama. Jumlah tenaga pada cakupan parsial atau tidak tersedia ditampilkan sebagai —.
- Bahan pembinaan berasal dari contoh [M05-17](../m05-followup-review/). Usulan baca-saja dan workflow laporan DEMO tetap memakai sumber terpisah dari agregat APEL.

## Katalog modul

[Katalog Portal YANDIK+](../yandik-portal/) adalah pintu navigasi yang dibuat kemudian (belum diuji). Beranda ini tetap halaman kerja utama DEMO. Arsip ZIP dan gambar yang ada tidak diperbarui sebagai bagian dari konsolidasi katalog.

## Pratinjau lokal

Halaman awal berada di `drafts/yandik-workspace/index.html`. Gunakan server statis yang menghidangkan root salinan repositori sehingga impor relatif dari `drafts/` dan `prototypes/` dapat dimuat. Untuk lingkungan yang memiliki Python, jalankan perintah berikut dari root salinan repositori.

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8765/drafts/yandik-workspace/`. JavaScript memakai ES modules tanpa dependensi npm atau proses kompilasi. Aplikasi menggunakan fixture lokal. Login, database, pelaporan operasional dan integrasi dengan sistem produksi belum tersedia.
