# M05-14 | Dashboard APEL Puskeswan DEMO 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DATA SINTETIS.**

Ini **kode rancangan halaman dashboard yang dapat ditinjau nanti**, bukan aplikasi yang sudah dibuka, diuji, di-host atau terhubung ke `yandikvo.my.id`. Seluruh data, identitas dan wilayah berlabel DEMO. Terdapat UI responsif HTML/CSS/vanilla JS tanpa dependensi eksternal, serta model data terpisah untuk menjaga perhitungan.

## Berkas
- `index.html`: kerangka antarmuka berbahasa Indonesia, identitas DEMO dan penjelasan metodologi.
- `styles.css`: layout responsif sidebar, kartu statistik, grafik 12 bulan, matriks status.
- `main.mjs`: presentasi DOM dengan `textContent`, filter tahun/wilayah/Puskeswan, reset filter. **Tidak ada fetch, HTTP, storage, API, logging, notifikasi maupun write.**
- `model.mjs`: membentuk tampilan dari kontrak ledger DEMO M05-0 yang dicek ulang melalui `annualChecklist`; melarang tahun 2031+ dan ID non-DEMO; membedakan `BELUM_DILAPORKAN` (`null`), `LAPORAN_NOL` (`0`) dan laporan ada pelayanan (positif).
- `fixtures.mjs`: tiga Puskeswan fiktif di dua wilayah fiktif; beberapa laporan 2026 dan 2027, sedangkan 2028–2030 belum berisi laporan DEMO; satu contoh investigasi per kejadian/lokasi dan satu hewan kurban ante/post tanpa menggandakan hewan.
- `tests/dashboard.test.mjs`: **50 skenario QA tertulis, 0 dijalankan**.

## Cara memahami tampilan
Kartu **Pelayanan tercatat (DEMO)** menjumlahkan hanya laporan yang benar-benar dibuat dalam fixture, sehingga total bisa **parsial**. Bila tidak ada laporan sama sekali, total layanan adalah `null` dan UI menampilkan `—`, **bukan nol**. Kartu **Bulan Puskeswan terlapor** menghitung kombinasi fasilitas dan bulan, bukan kepatuhan tenggat. Laporan nol tercatat tersendiri; yang belum melapor tidak dihitung sebagai nol.

Grafik bulanan menunjukkan akumulasi layanan hanya dari fasilitas yang melaporkan bulan itu. Matriks memakai tanda `●` (ada pelayanan), `0` (laporan nol), dan `—` (belum melapor). Urutan fasilitas alfabetis, **bukan peringkat**. Tahun 2027–2030 terpisah dalam model kebijakan, dan tidak memiliki skor/predikat yang disetujui.

## Ketentuan pengembangan
Semua kode ada di `drafts/` pada branch `develop/yandik-foundation`. Jangan menjalankan unit test, browser, preview server, CI/CL, deploy, atau mengubah `main` sebelum owner mengizinkan secara eksplisit. **Jika suatu hari izin pengujian sudah diberikan**, halaman ini dirancang untuk dibuka dari server statis lokal dengan dukungan ES module; pembukaan langsung melalui `file://` bisa dibatasi browser. Tidak ada preview live yang telah diverifikasi sekarang.

Tidak mengakses data dari Profil Puskeswan, SDM, koreksi workflow, pembinaan atau website APEL aktual. Integrasi sumber nyata harus melewati M05-8 sampai M05-12 dan keputusan pemilik sistem serta kebijakan. Kode front-end **bukan** dasar otorisasi, skor, peringkat, penghargaan, atau publikasi data dinas.

[Spesifikasi M05-14](../../docs/M05_14_DASHBOARD_APEL_DEMO_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md)

**Tahap berikutnya:** kontrak UI data Profil Puskeswan dan SDM yang diberi identitas sumber, serta alur Pelaporan/Koreksi → Pembinaan/Tindak Lanjut; tetap DEMO-only.
