# M04-S9T | Register Kebutuhan Bukti untuk Pemeriksaan QA (DEMO)

**12 November 2026 WIB** · **KODE DITULIS, BELUM DIUJI** · **Tidak ada izin pengujian ataupun penetapan kelulusan**

## Tujuan
Menyiapkan daftar bahan pembuktian yang kelak diperlukan saat owner mengizinkan pemeriksaan QA untuk pekerjaan M04-S9F–S9S. M04-S9T bukan sebuah aplikasi pengujian, bukan registrasi dokumen resmi, dan tidak memverifikasi bukti secara otomatis.

Modul membaca hanya paket sintetis M04-S9S lalu menghasilkan **register baca-saja**. Setiap kebutuhan diberi ID dan sumber, tetapi tidak ada file dokumen, status lulus, tanggal verifikasi, nama pejabat, penutupan temuan atau otorisasi. Seluruh nilai tetap `BELUM_ADA_BUKTI_DI_DEMO`.

## Struktur register
| Kategori | Jumlah permintaan | Sumber dan artinya | Status |
|---|---:|---|---|
| Gerbang G0–G5 | 6 | Ringkasan jenis bukti untuk memeriksa tiap gerbang QA yang diusulkan | Bukti belum diterima |
| Temuan STATIC-01–04 | 8 | Dua permintaan bukti untuk tiap temuan audit statis yang masih terbuka | Bukti belum diterima |
| **Total** | **14** | **Daftar kebutuhan, bukan dokumen tersedia** | **0 terverifikasi** |

Setiap baris memuat ID DEMO, kelompok `gerbang`/`temuan`, rujukan asal, uraian jenis bukti, status penerimaan, tanggal verifikasi dan referensi dokumen yang semuanya masih kosong, null atau false.

## Hubungan dengan pemeriksaan dan kewenangan
- **G0:** persetujuan owner mengenai ruang lingkup tes, lingkungan isolasi, batas penggunaan dan larangan data asli. Belum ada persetujuan.
- **G1:** pemeriksaan sintaks/import/export di isolasi. Tidak dijalankan.
- **G2:** regresi M04-S9F–S9J termasuk perubahan fingerprint catatan. Tidak dijalankan.
- **G3:** kesinambungan data DEMO M04-S9K–S9Q, 18 butir, 6 fungsi dan P0–P3. Tidak dijalankan.
- **G4:** browser, keamanan, keyboard, aksesibilitas dan tampilan HP. Tidak dijalankan.
- **G5:** penelaahan kelembagaan manusia mengenai SOP/SPBE, klasifikasi data, arsip dan kewenangan, bukan status lulus teknis.

STATIC-01 dan STATIC-04 telah memiliki perbaikan tertulis pada kode, namun belum memiliki bukti hasil tes. STATIC-02 menunggu izin QA dan STATIC-03 menunggu keputusan owner terkait visibilitas dan histori repository. **Nol temuan ditutup resmi.**

## Berkas dan antarmuka
- [Model register](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-qa-evidence-register/register.mjs), [fixture sintetis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-qa-evidence-register/fixtures.mjs), dan [10 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-qa-evidence-register/tests/register.test.mjs).
- [Halaman DEMO dan dokumentasi](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-qa-evidence-register) hanya menampilkan ringkasan, gerbang, temuan dan daftar kebutuhan bukti yang dapat difilter. Tidak ada tombol unggah, approve, verify, run, atau kirim.
- Tidak ada login, backend, database, fetch, API, storage, kirim surat, tanda tangan, CI, GitHub Actions atau interaksi dengan sistem produksi.

## QA yang masih ditunda
Sepuluh skenario baru ditulis untuk memeriksa cakupan enam gerbang dan empat temuan, jumlah 14 kebutuhan, ID unik, integritas rujukan, penolakan status palsu, kepastian nilai nol serta filter ekspor teks. **Semua BELUM DIJALANKAN**.
Jumlah tes tertulis dalam rangkaian praintegrasi ini menjadi **172 skenario** (162 sebelumnya + 10 skenario M04-S9T). Angka 172 bukan hasil PASS atau coverage; **nol tes dijalankan pada M04-S9T**.

## Batasan proyek
Repository GitHub masih PUBLIC menurut pemeriksaan metadata 12 November 2026. Jangan menyimpan dokumen kedinasan, informasi pribadi atau rahasia. M04-S9T menggunakan data fiktif dan tidak boleh dihubungkan ke sistem YANDIK+ aktif atau proses penganggaran/pengadaan/BAST.
Branch `develop/yandik-foundation` tetap untuk pengembangan; PR #9 tetap Draft dan tidak digabung ke main. Mode [CODE_ONLY](CODE_ONLY_MODE.md) berlaku. Owner perlu izin eksplisit terlebih dahulu untuk tes, lalu pihak berwenang menelaah substansi kelembagaan.
