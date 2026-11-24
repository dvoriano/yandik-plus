# YANDIK+ | Panduan preview Codex (DEMO)
 
**24 November 2026. Semua perubahan konsolidasi baru K1–K6 berstatus KODE DITULIS, BELUM DIUJI.** Repository publik; gunakan hanya fixture fiktif. Ini bukan aplikasi produksi atau persetujuan pengujian.

## Titik masuk
- Repository: https://github.com/dvoriano/yandik-plus
- Branch: `develop/yandik-foundation`, bukan `main`.
- Katalog: `drafts/yandik-portal/index.html`.
- Halaman kerja konsolidasi: `drafts/yandik-portal/review.html`.
- Beranda sebelumnya (uji terbatas historis): `drafts/yandik-workspace/index.html`.
- Clone/checkout seluruh branch, jangan hanya menyalin HTML atau ZIP lama; impor ES module mengacu ke folder sibling di repo.

## Instruksi preview untuk Codex setelah pemilik secara eksplisit mengizinkan
1. Gunakan checkout branch pengembangan pada workspace terisolasi; catat SHA. Jangan pindah ke main atau merge PR #9.
2. Jalankan server file statis hanya pada loopback, dari root checkout: `python -m http.server 8765 --bind 127.0.0.1`.
3. Buka melalui browser/preview lokal: `http://127.0.0.1:8765/drafts/yandik-portal/review.html`. Jika lingkungan Codex memerlukan port preview, gunakan mekanisme lokal/forwarding yang disediakan; jangan membuka ke internet.
4. Periksa konsol browser dan kesalahan impor; uji tiap panel terpisah. Tidak ada npm/build wajib untuk halaman ini. Tidak ada Flask, DB, VPS, data asli atau kredensial yang diperlukan.
5. Dokumentasikan temuan, termasuk error yang menghalangi render; jangan menyatakan fitur lulus hanya dari screenshot. Jika diperlukan, perbaiki kode pada branch pengembangan, [skip ci], tanpa mengubah kode produksi.

## Checklist visual dan perilaku setelah izin pengujian
- Katalog dan beranda: navigasi, fokus keyboard, ukuran 320/375/768/1280 px, tidak ada overflow halaman.
- K1: wilayah ↔ fasilitas konsisten; 2026–2030; laporan nol berbeda dari belum melapor; SDM parsial tidak dianggap nol.
- K2: pilih fasilitas dan bulan kosong, buat draf, simpan, simulasi kirim, minta koreksi sebagai reviewer DEMO, revisi dan kirim ulang; jejak revisi bertambah, ledger tidak berubah. Perubahan angka belum disimpan harus menghalangi kirim. Uji tambah/hapus pasangan kejadian/lokasi, duplikasi, serta satu hewan ante+post dihitung sekali; cek draf/revisi memelihara aktivitas. Tidak ada input bukti nyata.
- K3: pilih skenario M04 sendiri, lanjut tujuh tahap jika kebutuhan lolos model; cek skenario tanpa kebutuhan tidak dipaksa lolos. ID M04 dan M05 tidak disamakan.
- K5: empat register, filter wilayah, daftar/status dan selector detail/checklist; wilayah Selatan tanpa snapshot surveilans harus berstatus belum tersedia, bukan nol kasus. Jangan melakukan penerbitan, pengesahan atau sinkronisasi.
- K6: bahan pembinaan/antrean dari M05-17, agregat wilayah M05, tautan dokumen dan telaah SOP. GIS belum peta, PWA/offline sync dan notifikasi nyata belum ada.
- Catat pemuatan dan hasil uji satu per satu. Unit QA baru ada di `drafts/yandik-portal/tests/consolidated.test.mjs`, 31 kasus yang dirancang (25 deklarasi, dua loop masing-masing empat domain), belum dijalankan.

## Batas tetap
CODE_ONLY berlaku sampai izin eksplisit diberikan untuk cakupan QA terkait. Jangan menyalakan CI/CL, GitHub Pages, hosting publik, workflow, staging, migrasi atau deploy. PR tetap Draft. K4 (source Flask berizin, auth, database) dan K7 (QA/regresi/keamanan serta keputusan rilis) belum selesai. Preview lokal bukan integrasi operasional.

### Lanjutan visual 24 November
- Uji perubahan pilihan register ketika detail masih memuat; tidak boleh memperlihatkan detail wilayah lama.
- Periksa tabel kebutuhan/tahap dukungan pada skenario yang belum layak, tanpa menyamakan ID M04 dengan M05.
- Periksa input activity yang belum disimpan sebelum kirim, reset dan ganti cakupan. Catat temuan tanpa menyimpulkan parity resmi Juknis.

### Lanjutan editor Profil/SDM
- Buka `review.html#profil-sdm`. Cek lima bagian kosong pada awal editor (snapshot lama tetap ditampilkan pada ringkasan sampai perubahan simulasi dibuat), draf, pengajuan, perbaikan, telaah, isolasi fasilitas/tahun dan histori. Tidak ada tanggal persetujuan resmi.
- Mutasi tenaga dengan penempatan terbuka pada bulan setelah tanggal mulai; bandingkan sumber/tujuan sebelum dan sesudah bulan tersebut dan rekap Desember. Cakupan parsial tetap —. Catat kompetensi untuk tenaga aktif, tolak duplikasi dan mutasi mundur yang bertentangan dengan catatan kompetensi.
- Simpan draf laporan sebelum mengubah profil/SDM. Reset laporan/profil/SDM hanya mengembalikan fixture, bukan database. QA tambahan: `drafts/yandik-portal/tests/personnel.test.mjs` (19); total dua file unit portal 50 kasus, 0 dijalankan.

## Inventaris tahunan Puskeswan | 24 November 2026
[Kontrak inventaris](M02_INVENTARIS_TAHUNAN_PUSKESWAN.md). 198 butir UI A–J, salin tahun sebelumnya dengan konfirmasi, rekap kondisi/gap dan histori DEMO. Gunakan panel `review.html#inventaris`; 16 QA baru, total 66 kasus unit portal, 0 dijalankan. Belum ada penyimpanan, autentikasi server, sumber nyata atau persetujuan bantuan. Preview setelah izin; cek alur salin/konfirmasi, pencarian, minimum eksplisit, lock/revisi dan scope. M04 tetap independen.

### Paperless MOD-10 (belum diuji)
- Buka `coaching.html#administrasi`, buat kegiatan dan draf hasil terlebih dahulu. Uji pembuatan naskah, bukti fiktif, koreksi, perubahan sumber dan versi, arsip simulasi, pencarian dan reset bersama. Tidak ada DOCX/PDF atau integrasi resmi.

### Pustaka digital MOD-13 (belum diuji)
- Buka `library.html`; uji kata kunci, kategori/status, tautan dokumen, FAQ, favorit, koreksi/telaah simulasi dan reset. Dua kandidat regulasi/pedoman tidak memiliki naskah resmi dalam pustaka. Jangan tafsirkan telaah DEMO sebagai pengesahan atau publikasi.

### MOD-11 Dashboard pimpinan (belum diuji)
- `review.html#pimpinan`; buat kegiatan dan draf administrasi pada halaman yang sama, ubah inventaris, profil dan dukungan. Periksa ringkasan, cakupan dan reset; M04/register tidak mengikuti filter M05. Halaman coaching standalone adalah sesi berbeda.

### MOD-12 GIS sintetis (belum diuji)
- `review.html#wilayah`; periksa enam layer, filter, titik dan tombol detail, perubahan state sesi, data nol/kosong, register independen. Kisi bukan GPS, basemap atau wilayah nyata. Tidak ada lokasi kasus atau M04 pada titik M05.

### MOD-14 Notifikasi dan simulator lapangan (belum diuji)
- `review.html#notifikasi` dan `#mode-lapangan`; periksa tanggal simulasi, scope, read/dedupe, perubahan state, antrean, konflik dan ACK hilang/retry. Tidak ada service worker, cache, penyimpanan offline, kanal pesan atau server nyata.

### Konsolidasi tahap 2 (belum diuji)
- Mulai `review.html#layanan`; gunakan sidebar/menu mobile untuk semua modul pengguna, bukan membuka prototipe terpisah. Periksa hash langsung, Back/Forward, panel tetap mounted dan sumber independen. Katalog di tab baru. Pustaka tersedia pada `#pustaka`. QA tambahan di TEST_BACKLOG; tidak mengizinkan eksekusi.

## Master QA K7 (terbaru)
[Master QA](MASTER_QA_YANDIK_2026_2030.md) mengatur 29 skenario preview pada portal konsolidasi, termasuk Pustaka dan Pembinaan/Dokumen di review.html, bukan sesi standalone. Izin preview tidak mengizinkan unit, DDL atau CI. Langkah sebelumnya historis; gunakan urutan dan stop rules terbaru. 0 dijalankan.

## Handoff QA-A
[Percobaan 24 November dan prompt Codex](QA_A_PREVIEW_HANDOFF_2026-11-24.md). Preview diizinkan pada sesi ini tetapi checkout lingkungan terblokir. Tidak ada hasil browser. Izin tidak mencakup unit, SQL atau rilis.
