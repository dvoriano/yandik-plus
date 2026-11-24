# Katalog Portal YANDIK+ DEMO

**24 November 2026 | KODE DITULIS, BELUM DIUJI.**

Halaman `index.html` adalah **pintu navigasi** ke prototipe yang sudah tersedia, bukan aplikasi baru atau integrasi backend. Tidak ada JavaScript, request eksternal, login, database, penulisan data atau hosting dalam katalog ini. Ruang Kerja Puskeswan yang sudah mendapat uji demo terbatas tetap digunakan tanpa perubahan kode.

- 15 modul ditampilkan dengan status yang berbeda: halaman/prototipe tersedia, ringkasan terbatas, kode model, dan spesifikasi.
- Tautan memakai path relatif ke berkas HTML yang memang ada dalam tree sumber; tautan diperiksa secara statis saat penyusunan, **belum diuji di browser**.
- Tidak ada tautan pura-pura ke modul yang belum punya halaman.
- [Audit konsolidasi dan rencana urutan](../../docs/KONSOLIDASI_YANDIK_2026-11-24.md) menjadi peta kerja; [ROADMAP](../../docs/ROADMAP.md) tetap sumber resmi status milestone.

Jika pemilik ingin membuka secara lokal, gunakan seluruh root hasil unduhan branch `develop/yandik-foundation` (bukan hanya folder portal). Server statis lokal harus menyajikan root repo karena halaman lama memakai impor relatif lintas folder. Contoh: `py -m http.server 8765 --bind 127.0.0.1`, lalu buka `http://127.0.0.1:8765/drafts/yandik-portal/`. Jangan jalankan tes atau deploy tanpa izin. Arsip DEMO lama dan screenshot tidak diubah; tidak dianggap paket yang menyertakan portal baru.

## QA tertunda
1. Muat katalog pada server lokal yang menyajikan root repo.
2. Verifikasi 15 ID modul unik, status dan tautan tidak menyesatkan.
3. Buka ruang kerja, APEL, profil, SDM, dukungan, pembinaan, administrasi dan seluruh tautan teknis.
4. Periksa anchor #cakupan dan #pembinaan, tombol kembali browser dan navigasi keyboard.
5. Periksa lebar 320/375/768/1280 px, kontras, fokus, teks panjang dan tanpa overflow.
6. Pastikan tidak ada request eksternal dari katalog, penyimpanan, data produksi atau route baru.
7. Regresi halaman lama secara terpisah; bukti uji terdahulu bukan bukti lulus portal ini.

**0 QA dijalankan.** Tidak dipublikasikan via GitHub Pages.
