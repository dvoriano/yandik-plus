# YANDIK+ v1.0 · Integrasi dan QA pengembangan

24 November 2026 WIB · Branch `integration/yandik-v1-readiness` · Basis `9c19b2e965c4c37dcd2fa5111f6240b31ceb9019`

## Menjalankan demo

Dari root checkout branch integrasi, jalankan Python 3.10 atau lebih baru. Aplikasi menggunakan modul pustaka standar Python dan aset browser lokal.

```sh
python3 -B drafts/yandik-backend-contract/local_server.py --allow-demo-commands
```

Buka `http://127.0.0.1:8765/` dari browser di komputer yang menjalankan perintah. Salin kode sesi `ALPHA` dari terminal untuk berperan sebagai petugas Puskeswan. Kode `KAB-UTARA`, `REVIEW`, dan `LEADER` membuka cakupan lain pada konteks browser terpisah. `--actor` menentukan peran yang tersedia. `--port` mengganti port. Tanpa `--allow-demo-commands`, sesi hanya dapat membaca. Hentikan server dengan Ctrl+C.

Server mengikat loopback dan membuat SQLite `:memory:` dengan fixture tiap kali proses dimulai. Data DEMO dibagi antarsesi selama server hidup dan hilang saat proses berhenti. Kode sesi dibuat saat start. Identitas dan grant ditentukan server, sesi peramban memakai cookie HttpOnly, dan kebijakan cakupan tetap diperiksa oleh dispatcher. Portal fixture lama tetap tersedia melalui tautan “Kembali ke simulasi portal”. Perubahan pada portal fixture hanya berlaku di sesi browser itu.

[Tampilan desktop](../drafts/yandik-qa/v1-dev/desktop.png) · [Tampilan ponsel](../drafts/yandik-qa/v1-dev/ponsel.png)

## Audit sumber

Empat branch remote diperiksa dan 723 commit dapat dijangkau dari seluruh branch pada awal audit. Riwayat perubahan, PR, kode, matriks modul, roadmap dan dokumentasi QA ditinjau untuk menentukan basis integrasi.

| Branch | SHA audit | Temuan |
|---|---|---|
| `develop/yandik-foundation` | `9c19b2e` | Graph aplikasi terlengkap. Portal fixture, UI backend, provider 23 baca dan 8 perintah, AccountStore, DDL SQLite dan replay. Dipakai sebagai basis integrasi. |
| `main` | `ab37885` | Satu commit berbeda berisi perubahan README. |
| `planning/yandik-plus-roadmap-2026` | `0ede697` | Sudah tercakup dalam riwayat branch pengembangan. |
| `lab/augma-inspired-experiments` | `5928ce6` | 191 commit unik. UI GIS/asisten/prototipe berbeda, mode data dan lisensi sumber terpisah. Evaluasi dan pengujian tetap di worktree lab. |

[PR #9](https://github.com/dvoriano/yandik-plus/pull/9) berstatus terbuka dan draft menuju `main`. [Bukti uji parsial](QA_PARTIAL_2026-11-24.md) mengacu ke `fd066c2`, 22 tes kontrak dan 25 tes penulis APEL. Ke-47 tes tersebut lulus ketika diulang dari worktree pada SHA yang sama, bersama empat tes retry JavaScript yang dicatat terpisah. Eksekusi checkout lengkap kemudian mencakup 319 tes backend.

Titik macet integrasi adalah boot aplikasi. `backend-review.html` hanya menerima transport dari binding Playwright, yang tidak tersedia pada browser biasa. Adapter loopback menggunakan entry dan provider yang sama, mengganti hanya transport. Model lama tetap dapat dibuka. Perbaikan regresi juga mencakup impor ganda pada notulen, data tahun yang kosong dalam tren APEL, urutan validasi cakupan Profil/SDM, dan fixture pengujian M04/M05 yang tertinggal dari kontraknya.

## Hasil yang dijalankan

Pengujian lokal memakai Python 3.12.14, Node 24.22.3, Flask 3.1.2 untuk adaptor historis, dan Playwright 1.56.1 dengan Chromium bundel. Tangkapan layar diambil dengan Chromium sistem 156. Build server utama tidak memerlukan Flask maupun Playwright.

| Cakupan | Lulus | Gagal |
|---|---:|---:|
| Backend kontrak dan SQLite rehearsal | 319 | 0 |
| Python foundation dan empat suite draf M00 | 175 | 0 |
| JavaScript model dan kontrak pada branch integrasi | 1.675 | 0 |
| Chromium prototipe Profil Puskeswan | 17 | 0 |
| Chromium integrasi HTTP dan portal | 6 | 0 |
| Lab terpisah · Python, Node, Chromium | 66 + 31 + 19 | 0 |

Run awal JavaScript selesai dengan 1.482 lulus dan 50 entri gagal. Empat belas entri gagal berasal dari file yang tidak dapat dimuat karena impor ganda, sehingga total test runner meningkat setelah perbaikan. Validator fixture foundation dan audit performa lokal empat halaman lab juga berjalan. Pemeriksaan browser mencakup:

- Masuk dengan kode sintetis, penolakan tanpa sesi atau untuk fasilitas di luar cakupan, validasi origin, dan keluar.
- Dua belas menu backend di 320, 375, 768 dan 1280 piksel, termasuk dashboard, register, GIS, pustaka dan notifikasi. Pengujian menemukan overflow pada filter fasilitas dan memverifikasi perbaikannya. Fokus awal keyboard menuju tautan lompat konten.
- APEL menyimpan draf, menahan pengiriman saat perubahan belum disimpan, mengirim, menerima koreksi dari verifikator, dan mengirim ulang.
- Inventaris yang dikonfirmasi menjadi dasar usulan Support Puskeswan. Rencana dan hasil pembinaan menjadi sumber draf paperless yang terikat revisi.
- Navigasi dari backend ke portal fixture, menu ponsel, hash dan Back.

### Ulangi QA browser

Pasang Playwright 1.56.1 dan Chromium di lingkungan QA lokal. Dari root checkout:

```sh
node --test drafts/yandik-portal/tests/local-workspace.browser.test.mjs
```

Suite memilih port loopback sementara. Opsional, gunakan `YANDIK_PYTHON` atau `YANDIK_CHROMIUM_PATH` untuk memilih executable lokal.

## Status rilis

Demo pengembangan sudah diuji. Rilis operasional masih menunggu sumber Flask dan ledger APEL yang disetujui, autentikasi instansi, database persisten, validasi migrasi/pemulihan, dan uji penerimaan bersama petugas Puskeswan. Kode sesi dan data yang digunakan di sini sintetis. Ringkasan backend menampilkan ledger sebagai belum tersedia. ID Support historis M04 tetap terpisah dari M05. Pemeriksaan usability pada sesi ini memakai otomasi keyboard dan viewport. Pengujian bersama pengguna masih diperlukan.

Browser bersama Codex gagal diinisialisasi dan environment tidak memiliki port preview atau forwarding yang tersedia saat pengujian. Halaman dan seluruh interaksi di atas diuji melalui HTTP loopback lokal. Jalankan perintah di atas dari perangkat sendiri untuk membuka demo interaktif.
