# Konsolidasi YANDIK+ | 24 November 2026

**Audit inventaris GitHub dan peta pekerjaan, bukan pernyataan siap operasional.** Snapshot dasar branch [`develop/yandik-foundation`](https://github.com/dvoriano/yandik-plus/tree/2aa35dd4d52016474cf0c365cc4554601703078c) pada commit `2aa35dd4d52016474cf0c365cc4554601703078c`, recursive tree utuh: **612 blob/file, 769 entri tree (termasuk direktori), 78 folder langsung di drafts/, 37 file HTML, 3.471.961 byte total blob**. Ukuran tersebut bukan ukuran instalasi, database maupun file ZIP hasil kompresi. PR [#9](https://github.com/dvoriano/yandik-plus/pull/9) tetap Draft. Semua pekerjaan tetap sampai horizon 2030.

## K1/K2 | Editor Profil dan SDM Veteriner DEMO | 24 November 2026

Commit `52613e0`: [ruang kerja](../drafts/yandik-portal/review.html#profil-sdm) memakai lima bagian model M02 (legalitas, bangunan, peralatan, obat/BHP, wilayah kerja) pada ID M05 dan tahun 2026–2030. Isi fixture M02 lama tidak disalin. Editor menggunakan pilihan fiktif, alur simpan/ajukan/telaah/perbaikan/tolak dan jejak sebelum/sesudah; status snapshot M05 disimulasikan sesuai status lima bagian, bukan kelengkapan Profiling 2026. Tanggal telaah tetap tidak terverifikasi.

SDM: daftar aktif per bulan, riwayat interval, mutasi penempatan terbuka dengan batas akhir eksklusif; validasi M05-15 diterapkan ke seluruh kandidat sumber. Rekap tahunan tetap as-of Desember; cakupan parsial/tidak tersedia tidak dipromosikan menjadi lengkap. Catatan kompetensi adalah topik pengembangan fiktif, bukan pelatihan yang terverifikasi atau sertifikat. Ledger APEL dan workflow laporan tidak diubah oleh editor. Sumber M04 tetap independen. Seluruh perubahan dalam memori; reset memulihkan fixture.

[19 kasus QA personel](../drafts/yandik-portal/tests/personnel.test.mjs) ditulis, **0 dijalankan**; bersama 31 kasus konsolidasi terdahulu, total 50 kasus unit pada dua file portal. Tidak ada bukti pengujian browser baru. K1/K2 masih parsial: identitas/source resmi, form Profiling lengkap, inventaris, penyimpanan, penempatan/keaktifan resmi, impor dan sertifikat kompetensi belum. K4/K7 tertunda. Berikutnya K6 workflow pembinaan/Bimtek dan administrasi dokumen berbasis ID M05, tanpa mengubah aturan otorisasi.

## Lanjutan K2/K3/K5/K6 | Aktivitas dan telaah (24 November 2026)
Commit `5219357` memperluas halaman konsolidasi: editor investigasi/kurban sesuai validator model DEMO (bukan kesesuaian resmi Juknis); detail checklist/telaah empat domain; antrean usulan dari workflow tercatat; daftar kebutuhan dan tahapan dukungan. 13 kasus QA tambahan, total 31 pada file konsolidasi, 0 dijalankan. Batas sebelumnya "tanpa input investigasi/kurban" dan "tanpa detail register" telah disusul. Tetap belum ada integrasi sumber nyata, pengaturan kelembagaan, penyimpanan resmi, atau penerbitan.

| Paket | Perkembangan | Yang masih perlu |
|---|---|---|
| K2 | Editor investigasi kejadian/lokasi dan kurban ante/post, validasi melalui model, draf memelihara aktivitas | Input/kelengkapan profil dan SDM, bukti sah, parity Juknis, uji |
| K3 | Tabel kebutuhan dan catatan tahapan pada panel M04 | Identitas lintas sumber, bukti resmi dan kontrol server |
| K5 | Detail telaah/checklist untuk 4 register, pilihan entri dalam wilayah | Edit/workflow inspeksi sesuai kewenangan, data resmi, uji |
| K6 | Antrean pembinaan dari workflow tercatat; bukan daftar kewajiban pelaporan | Bimtek, arsip, GIS/peta, pustaka dan PWA/notifikasi |
| K4/K7 | Tidak berubah | Source berizin, auth/DB dan pengujian/rilis |

## Pembaruan implementasi konsolidasi | 24 November 2026

[Halaman kerja konsolidasi DEMO](../drafts/yandik-portal/review.html) ditulis dengan model lama, bukan salinan angka atau pengganti aplikasi. [Panduan preview Codex](CODEX_PREVIEW_YANDIK.md). Commit kode `9a72422` dan `795e19e`; **18 kasus QA unit dirancang (15 deklarasi test dengan satu loop 4 domain), 0 dijalankan**. Tidak ada bukti browser baru.

| Paket | Keluaran baru | Sisa |
|---|---|---|
| K0 | Katalog 15 modul menautkan halaman konsolidasi dan empat register | QA navigasi |
| K1 | `shared-demo.mjs` memakai M05-15 untuk join identitas APEL/profil/SDM dan filter tahun/wilayah/fasilitas/bulan; memisahkan ledger dari workflow | Crosswalk M04 ↔ M05 belum sah, rekonsiliasi sumber resmi belum |
| K2 | Panel profil/SDM, input empat kategori pelayanan, alur draf/kirim/koreksi/revisi/kirim ulang dan histori M05-1/M05-16; usulan M05-17 | UI investigasi/kurban, kelengkapan profil, penempatan SDM, bukti, audit server dan uji belum |
| K3 | Panel tujuh tahap M04-I1 dari paket hingga catatan pemanfaatan dengan state independen dan tombol eksplisit; tautan administrasi lama | Identitas dan snapshot independen, belum integrasi source/kewenangan/BAST |
| K4 | Tetap menggunakan draf M00-G1–G9 | TERTUNDA: source berizin, auth server, DB, migrasi dan keamanan |
| K5 | `domain-views.mjs` dan panel empat register baca-saja memakai M06-S1, M07-S1, M13-S1, M14-S1 dengan filter wilayah, kolom terbatas, dynamic import | Detail/edit domain, aturan resmi, review, API dan sumber nyata |
| K6 | Bahan pembinaan dan antrean, agregat M05 per wilayah, pustaka dokumen dan tautan telaah SOP | GIS lokasi/peta, workflow Bimtek/arsip, pustaka berizin, notifikasi dan PWA belum |
| K7 | Checklist preview Codex dan 18 QA tertulis | TERTUNDA pengujian baru, regresi, keamanan dan keputusan rilis |

Simulasi browser murni dalam memori; reset/muat ulang tidak mengubah ledger atau database. Tidak ada pemetaan nama/ID otomatis dari M04 ke M05, pengiriman nyata, data pribadi, persetujuan, atau integrasi Flask. Angka regional hanya sumber M05, tanpa menjumlahkan jenis domain berbeda. Pekerjaan berikutnya: lengkapi input investigasi/kurban, detail register dan kontrak identitas eksplisit, lalu QA Codex setelah izin. Jangan tambah prototipe paralel tanpa kebutuhan.

## Ringkasan

- `drafts/yandik-workspace/` sudah merupakan beranda kerja yang memakai M05-14/M05-15/M05-17. Catatan [QA lokal](TEST_BACKLOG.md#ruang-kerja-puskeswan--uji-demo-lokal) melaporkan hasil uji terbatas dengan izin owner pada 24 November; **audit ini tidak mengulang tes**.
- `prototypes/profil-puskeswan/` dan M04 memiliki simulasi terpisah. M04-I1 memakai crosswalk dan snapshot sendiri, bukan bukti satu sumber/master database dengan beranda M05.
- Banyak halaman M04 adalah layar telaah teknis, bukan modul operasional yang terpisah. MOD-05/06/07/08 memiliki model DEMO, tetapi inventaris tidak menemukan HTML khusus; MOD-12/13/14 baru spesifikasi, belum alur terpadu.
- `drafts/yandik-workspace/YANDIK-demo.zip` (81.833 byte) adalah arsip terpisah yang ada pada snapshot; isinya tidak diaudit di sesi ini. Jangan samakan dengan ZIP seluruh branch atau paket yang memuat perubahan terbaru.
- [Katalog portal](../drafts/yandik-portal/) disusun sebagai pintu navigasi ke halaman yang sudah tersedia; tidak mengganti ruang kerja, menggabungkan backend atau mengklaim modul selesai.

## Matriks gap 15 modul

Kode MOD mengikuti [MODULES_INDEX](MODULES_INDEX.md); kode milestone Mxx pada [ROADMAP](ROADMAP.md) **berbeda dari nomor MOD**. Prioritas di sini adalah urutan konsolidasi yang diusulkan; tidak otomatis mengubah prioritas/penyelesaian milestone resmi.

| MOD | Modul | Bukti tampilan/tingkat implementasi | Pekerjaan belum selesai | Urutan |
|---|---|---|---|---|
| MOD-00 | [Core Platform](modules/00_CORE_PLATFORM.md) | Fondasi teknis | Source Flask terotorisasi; session, RBAC per objek, audit dan database bersama. | P0 |
| MOD-01 | [Profil Puskeswan](modules/01_PROFIL_PUSKESWAN.md) | Prototipe web; [halaman DEMO](../prototypes/profil-puskeswan/index.html) | Satukan master ID dan sumber; integrasi form, histori perubahan dan API. | P0 |
| MOD-02 | [APEL Puskeswan](modules/02_APEL_PUSKESWAN.md) | Prototipe web; [halaman DEMO](../drafts/m05-apel-dashboard-ui/index.html) | UI input/koreksi; rekonsiliasi histori dan aturan tahunan; uji angka dan akses. | P0 |
| MOD-03 | [SDM Veteriner](modules/03_SDM_VETERINER.md) | Ringkasan DEMO; [halaman DEMO](../drafts/yandik-workspace/index.html#cakupan) | Detail personel, penempatan, kompetensi, perubahan efektif dan hak akses. | P0 |
| MOD-04 | [Support Puskeswan](modules/04_SUPPORT_PUSKESWAN.md) | Prototipe web; [halaman DEMO](../drafts/m04-integrated-workspace/index.html) | Satukan master, kebutuhan, verifikasi manusia, distribusi, BAST dan pemanfaatan. | P0 |
| MOD-05 | [Pengawasan Obat Hewan](modules/05_PENGAWASAN_OBAT_HEWAN.md) | Model kode DEMO | UI register, inspeksi, temuan, bukti, tindak lanjut; standar dan kewenangan. | P1 |
| MOD-06 | [Klinik & Praktik Dokter Hewan](modules/06_KLINIK_PRAKTIK_DOKTER_HEWAN.md) | Model kode DEMO | UI register, validitas dokumen, pengawasan, koreksi dan pembinaan. | P1 |
| MOD-07 | [PHMS, Zoonosis & Surveilans](modules/07_PHMS_ZOONOSIS.md) | Model kode DEMO | UI event dan telaah; definisi kasus, izin sumber, privasi dan batas iSIKHNAS. | P1 |
| MOD-08 | [Sertifikat Veteriner & Lalu Lintas](modules/08_SERTIFIKAT_LALU_LINTAS.md) | Model kode DEMO | UI register permohonan, persyaratan, status, kewenangan dan referensi resmi. | P1 |
| MOD-09 | [Pembinaan & Bimtek](modules/09_PEMBINAAN_BIMTEK.md) | Ringkasan DEMO; [halaman DEMO](../drafts/yandik-workspace/index.html#pembinaan) | Hubungkan usulan, kegiatan, peserta, bukti, evaluasi dan tindak lanjut. | P2 |
| MOD-10 | [Administrasi & Dokumen](modules/10_ADMINISTRASI_DOKUMEN.md) | Prototipe terpisah; [halaman DEMO](../drafts/m04-admin-dashboard/index.html) | Konsolidasikan antrean, referensi, arsip dan template; bukan pengganti SRIKANDI. | P2 |
| MOD-11 | [Dashboard Pimpinan](modules/11_DASHBOARD_PIMPINAN.md) | Cakupan terbatas; [halaman DEMO](../drafts/yandik-workspace/index.html) | Definisikan indikator, provenance, cakupan dan agregat berizin seluruh modul. | P1 |
| MOD-12 | [GIS Kesehatan Hewan](modules/12_GIS.md) | Spesifikasi | Kamus layer dan lokasi, privasi, agregasi wilayah, peta berizin. | P2 |
| MOD-13 | [Regulasi, SOP & AI opsional](modules/13_PUSTAKA_REGULASI_AI.md) | Spesifikasi | Pustaka versi/rujukan, pencarian dan review; AI tidak wajib untuk kerja inti. | P2 |
| MOD-14 | [Notifikasi & Mode Lapangan](modules/14_NOTIFIKASI_MODE_LAPANGAN.md) | Spesifikasi | Desain antrean lokal, sync konflik, persetujuan notifikasi dan kontrol data. | P2 |

## Urutan pekerjaan yang dirapikan

| Paket | Keluaran yang dituju | Status / gerbang |
|---|---|---|
| K0 | Katalog navigasi 15 modul, satu titik mulai, daftar gap; tanpa perubahan halaman lama | Kode katalog ditulis, belum diuji; audit inventaris tercatat |
| K1 | Konsolidasi data utama: peta identitas master Puskeswan, snapshot sumber, periode, perbedaan null/0, kontrak UI bersama untuk APEL/profil/SDM/dukungan | Belum dikerjakan sebagai satu kontrak terpadu. Dahulukan sumber dan join yang sudah ada; jangan menambah gerbang DEMO berulang tanpa kebutuhan integrasi |
| K2 | Alur kerja petugas: halaman pelaporan/koreksi dari M05-16, detail profil dan SDM, bahan pembinaan, tautan kembali; pertahankan histori 2026 dan parameter tahunan sampai 2030 | Model tersedia sebagian; UI/workflow nyata belum lengkap |
| K3 | Hubungkan administrasi dukungan M03/M04, kebutuhan, verifikasi, distribusi dan referensi BAST; pilih halaman aktif dan pertahankan prototipe teknis sebagai arsip telaah | Banyak prototipe terpisah; belum satu alur sumber, tidak memberi approval anggaran |
| K4 | Source Flask berizin dan disanitasi, role/wilayah server, endpoint, migrasi, audit transaksi, penyimpanan dan pengujian regresi | TERTUNDA sumber/izin; M00-G1–G9 adalah draf, bukan backend operasional |
| K5 | UI DEMO obat hewan, klinik/praktik, surveilans, sertifikat; dashboard lintas modul dengan sumber dan cakupan | Model empat domain tersedia, UI khusus belum |
| K6 | Pembinaan/Bimtek, arsip, GIS, pustaka, notifikasi/PWA; pengembangan bertahap sampai 2030 | Spesifikasi/komponen parsial; tunggu core dan keputusan proses |
| K7 | Review akses, integrasi, tes regresi/UX dan keamanan, data-owner approval, staging dan keputusan rilis | Menunggu izin eksplisit; tidak boleh dianggap selesai berdasarkan jumlah commit |

K1–K3 dapat dirancang/ditulis dengan data sintetis sambil menunggu K4; **tidak boleh mengaktifkan data riil, menghapus sistem lama, atau menyebut alur telah terintegrasi di produksi**. Katalog tidak perlu menjadi duplikasi dashboard; pertahankan ruang kerja sebagai beranda operasi DEMO. Gunakan model/fixture lama bila cocok; jangan menyalin kode atau angka ke antarmuka baru semata-mata agar tampak lengkap.

## Peta dokumen dan isu
- Sumber tunggal status milestone: [ROADMAP](ROADMAP.md). Posisi terbaru: [PROJECT_STATE](../PROJECT_STATE.md). Bukti: [WORKLOG](WORKLOG.md); skenario tertunda: [TEST_BACKLOG](TEST_BACKLOG.md).
- Isu #1–#8 dan #10–#21 tetap terbuka pada snapshot; tidak ditutup tanpa kriteria selesai. #9 adalah Draft PR, bukan modul.
- [Audit 23 November](STATUS_AUDIT_2026-11-23.md) dipertahankan sebagai rekaman historis; pembaruan ini memberi konteks beranda dan prioritas konsolidasi.
- CODE_ONLY tetap berlaku bagi perubahan baru. Izin QA ruang kerja sebelumnya tidak dianggap izin menyeluruh. Tidak ada CI/CL, tes baru, deploy, source riil atau perubahan main pada sesi ini.

## Inventaris tahunan Puskeswan | 24 November 2026
[Kontrak inventaris](M02_INVENTARIS_TAHUNAN_PUSKESWAN.md). 198 butir UI A–J, salin tahun sebelumnya dengan konfirmasi, rekap kondisi/gap dan histori DEMO. Gunakan panel `review.html#inventaris`; 16 QA baru, total 66 kasus unit portal, 0 dijalankan. Belum ada penyimpanan, autentikasi server, sumber nyata atau persetujuan bantuan. Preview setelah izin; cek alur salin/konfirmasi, pencarian, minimum eksplisit, lock/revisi dan scope. M04 tetap independen.

## Tahap 2 terbaru
## 2026-11-24 | Konsolidasi tahap 2: satu ruang kerja DEMO
- [Audit gap 15 modul](KONSOLIDASI_TAHAP_2_2026-11-24.md), [portal](../drafts/yandik-portal/review.html): 12 kelompok navigasi hash untuk 14 modul pengguna, panel tetap mounted, pustaka tertanam, tautan utama APEL/Support/Pustaka ke ruang kerja; prototipe lama dipertahankan. Perbaikan statis konfirmasi draf/reset, urutan ID pembinaan/dokumen dan kunci notifikasi stale. 10 QA unit navigasi tertulis, 0 dijalankan; QA browser dan seluruh audit backend masih tertunda. Bukan audit seluruh baris atau bukti integrasi operasional. CODE_ONLY [skip ci]. Berikutnya kontrak integrasi backend/data dan matriks QA, tanpa menjalankan tes.

