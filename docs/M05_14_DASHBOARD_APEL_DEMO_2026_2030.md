# M05-14 | Rancangan Dashboard APEL Puskeswan 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Berbeda dari M05-4 yang hanya mendesain keluaran rekap deskriptif, M05-14 menyusun **halaman visual HTML/CSS/JS** untuk menampilkan contoh data sintetis. Halaman **belum ditinjau di browser, belum diuji, belum dipublikasikan, dan tidak terhubung ke sumber APEL yang sedang berjalan**.

## 1. Kebutuhan pengguna
Pengelola dan petugas perlu dapat membaca:
- layanan Puskeswan yang sudah dicatat menurut bulan dan tahun;
- laporan eksplisit nol, bulan belum melapor, dan laporan dengan aktivitas;
- jumlah fasilitas-bulan yang memiliki laporan, tanpa menyebutnya "patuh tepat waktu";
- cakupan data parsial agar jumlah pelayanan tidak menyesatkan sebagai total final;
- tampilan status per Puskeswan dan 12 bulan yang bisa disaring berdasarkan tahun, wilayah dan unit.

Fitur dasar dashboard dibuat dalam `drafts/m05-apel-dashboard-ui` dengan label **DEMO** yang konsisten. Belum ada menu operasional profil, SDM atau pembinaan; hanya penanda bahwa alur tersebut akan dibangun kemudian.

## 2. Kontrak data dan sumber
`model.mjs` memakai kontrak ledger sintetis M05-0: `annualChecklist` memeriksa struktur dan laporan per fasilitas/bulan. Identitas fasilitas `DEMO-PSW-*`, wilayah `DEMO-REGION-*`, label yang wajib berawalan `Puskeswan DEMO` / `Wilayah DEMO`, dan rentang tahun 2026–2030. Filter lintas wilayah yang bertentangan ditolak. Tidak ada penarikan data aktual maupun akses Flask/DB/API.

| Kondisi per bulan | Nilai model | Tampilan |
|---|---:|---|
| Belum melapor | `null` | `—` |
| Laporan nol eksplisit | `0` | `0` |
| Ada laporan pelayanan | bilangan bulat positif | `●` dan informasi detail melalui label aksesibilitas |

Ketika **tidak ada satu pun laporan**, total layanan tetap `null`, bukan angka `0`. Ketika hanya ada sebagian bulan, jumlah layanan yang dihitung dari laporan tersedia diberi keterangan **parsial**. Angka tersebut **bukan nilai provinsi maupun capaian tahun resmi**.

## 3. Komponen tampilan

| Komponen | Kegunaan dan batas |
|---|---|
| Pilihan tahun 2026–2030 | Masing-masing policy draft berbeda, tidak memakai aturan tahun lain |
| Filter wilayah DEMO | Memilih fasilitas yang masuk dalam wilayah fiktif |
| Filter Puskeswan DEMO | Memilih satu unit tanpa menunjukkan ranking |
| Kartu pelayanan tercatat | Total pada laporan DEMO yang tersedia, bukan skor atau capaian final |
| Kartu fasilitas-bulan terlapor | Rasio jumlah laporan terisi terhadap kombinasi fasilitas × 12 bulan |
| Kartu laporan nol | Nol yang memang dikirim dalam data sintetis |
| Kartu belum melapor | Tidak disamakan dengan laporan nol |
| Grafik 12 bulan | Bulan tanpa laporan diberi penanda tidak tersedia |
| Matriks Puskeswan × 12 bulan | Status per bulan dengan simbol teks yang tidak bergantung pada warna saja |
| Catatan metodologi | Penjelasan jelas bahwa data tidak resmi dan tidak memuat verifikasi Juknis |

Desain responsif dengan antarmuka bahasa Indonesia, kontrol `<select>` standar yang mendukung keyboard, teks status, tabel semantik, dan label aksesibilitas. Kebutuhan pengujian visual/perangkat tetap masuk backlog. Rancangan belum terverifikasi di Chrome/Firefox/ponsel.

## 4. Fixture sintetis
Terdapat tiga unit **Puskeswan DEMO Alpha, Beta, Gamma** di **Wilayah DEMO Utara dan Selatan**. Sampel 2026 berisi 16 fasilitas-bulan terlapor, 20 fasilitas-bulan belum dilaporkan, dan tiga laporan nol eksplisit. Sampel 2027 berisi enam fasilitas-bulan. Tahun 2028–2030 belum memiliki contoh laporan, sehingga menjadi latihan empty state. Angka ini sepenuhnya dibuat di kode, **bukan statistik APEL Provinsi Sumatera Barat**.

## 5. Keamanan dan keterbatasan
- Tidak ada API, request jaringan, token, database, localStorage, fitur edit, notifikasi atau kanal publikasi.
- `officially_verified=false`, `may_publish=false`, `may_score=false`, `may_rank=false`, `can_compare_across_years=false`.
- Ketepatan waktu dan perbandingan dukungan/realisasi **tidak dihitung** karena sumber otoritatif belum ada.
- Tidak ada atribut pengguna pribadi, data hewan sebenarnya atau lokasi riil dalam fixture.
- Catatan M05-8 sampai M05-13 tentang izin sumber, Juknis, pemetaan, pengujian, rilis dan audit tetap berlaku; halaman statis ini tidak meloloskan gerbang tersebut.

## 6. Berkas dan QA
- [Halaman HTML](../drafts/m05-apel-dashboard-ui/index.html)
- [Gaya CSS](../drafts/m05-apel-dashboard-ui/styles.css)
- [Logika tampilan](../drafts/m05-apel-dashboard-ui/main.mjs)
- [Model data DEMO](../drafts/m05-apel-dashboard-ui/model.mjs)
- [Data sintetis](../drafts/m05-apel-dashboard-ui/fixtures.mjs)
- [50 QA tertulis](../drafts/m05-apel-dashboard-ui/tests/dashboard.test.mjs), **0 dijalankan**
- [README](../drafts/m05-apel-dashboard-ui/README.md)
- [TEST_BACKLOG](TEST_BACKLOG.md)

**Tahap berikutnya:** mulai dari kontrak **Profil Puskeswan ↔ SDM** yang bisa diperlihatkan pada UI, lalu rancang pelaporan/koreksi dan pembinaan/tindak lanjut dengan fixture DEMO. Integrasi nyata menunggu semua otorisasi dan tes yang relevan.
