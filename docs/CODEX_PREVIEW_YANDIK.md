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
