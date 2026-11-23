# M05-10 | Matriks Uji Paritas dan Kriteria Penerimaan APEL 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Ini bukan hasil audit/paritas yang telah dijalankan, bukan hasil validasi angka 2026, dan bukan persetujuan penggunaan/publikasi APEL.

## 1. Tujuan
Sebelum APEL YANDIK+ kelak menjadi sumber pelaporan yang dapat diandalkan, hasil pencatatan dan rekap harus dibandingkan dengan sumber dan aturan yang otoritatif. M05-10 membuat **matriks desain pemeriksaan**, bukan menghitung selisih atau memutuskan kelulusan. Ia sengaja menjaga pemisahan antara: bahan DEMO, kebijakan yang disahkan, hasil uji teknis, validasi pengampu proses, dan persetujuan operasional.

## 2. Ruang lingkup dan sumber yang dibutuhkan
Rancangan mengambil semantik dari:
- M05-0: ledger satu Puskeswan/bulan; bulan kosong berbeda dari laporan nol; investigasi menurut kejadian dan lokasi; satu hewan kurban tidak dihitung dua saat ante/post.
- M05-1/M05-2: revisi dan status workflow; tanggal penerimaan server vs jadwal *usulan* yang belum membuktikan ketepatan waktu.
- M05-3/M05-4: kebijakan independen per tahun, tren/revisi deskriptif tanpa klasemen dan pertumbuhan lintas-tahun yang belum dapat dibandingkan.
- M05-5/M05-6/M05-7: empat keluarga sumber, 36 field kanonik, identitas stabil dan *temporal join* serta persoalan sumber yang belum terverifikasi.
- M05-8/M05-9: 14 persyaratan bukti, enam gerbang BLOCKED, dan tindak lanjut manusia berlabel DEMO tanpa signoff.

Tidak ada data dictionary/sumber produksi, Juknis sah yang diverifikasi terhadap kode Flask, snapshot atomik, digest yang telah dibandingkan atau persetujuan test staging yang terbukti. Rencana pemeriksaan **tidak bisa menggantikan** bukti-bukti tersebut.

## 3. Desain kasus paritas

| Area | Kriteria yang nantinya memerlukan sumber dan verifikasi |
|---|---|
| Identitas Puskeswan | ID konsisten lintas sumber dan perubahan nama/wilayah |
| Laporan per bulan | Definisi grain, satu entri laporan induk dan revisi yang tepat |
| Nol dibanding belum melapor | Nilai nol eksplisit tidak mengubah bulan kosong menjadi terisi |
| Investigasi 2026 | Satuan kejadian/lokasi menurut Juknis yang disetujui |
| Pemeriksaan kurban 2026 | Satu hewan yang melalui ante dan post tidak otomatis dihitung dua |
| Definisi pelayanan | Kamus kategori, unit, aturan jumlah dan duplikasi |
| Workflow | ID pengiriman dan revisi, status, jam server/zona waktu |
| Tenggat | Keputusan per tahun dan pengecualian bulanan, tidak memakai tanggal usulan sebagai fakta |
| Riwayat wilayah | Atribusi kabupaten/kota sesuai masa berlaku, bukan wilayah terkini |
| Kebijakan tahunan | Policy version, tanggal efektif, pemilik keputusan |
| Dukungan Puskeswan | Rencana ≠ realisasi; denominasi, unit dan bukti yang benar |
| Snapshot | Pengambilan konsisten, integrity check, digest dan provenance |
| Keamanan | RBAC, minimisasi data, retensi, log dan backup/restore |
| Rekap per tahun | Total yang dapat dilacak, cakupan bulan, unit dan perubahan revisi |
| Skor/penghargaan | Dilarang menggunakan data DEMO menjadi ranking/predikat resmi |
| Publikasi | Izin terpisah dari penerimaan uji maupun telaah internal |
| Paritas 2026 | Bandingkan perhitungan terhadap baseline/juknis yang nyata setelah otorisasi |
| Aturan 2027–2030 | Wajib punya sumber kebijakan sendiri, tidak otomatis menyalin tahun sebelumnya |

**Katalog kode terdiri dari 23 definisi kasus**, dengan ruang lingkup `EACH_YEAR`, `YEAR_2026_ONLY`, dan `YEAR_2027_TO_2030`. Kode tidak mengisi `expected_value`, comparator, toleransi maupun actual source ref karena belum ada referensi sah. Bahkan uji perbandingan *exact match* dan ambang toleransi harus disepakati berdasarkan karakter setiap metrik, bukan ditetapkan secara otomatis.

## 4. Gerbang penerimaan
Sembilan langkah yang **harus dibuktikan** sebelum klaim kesiapan, semuanya masih BLOCKED:
1. Kewenangan owner sumber dan scope read-only.
2. Schema aktual dan data dictionary.
3. Kunci dan grain yang konsisten.
4. Snapshot atomik, digest dan provenance yang dibuktikan.
5. Paritas Juknis 2026.
6. Kebijakan tahunan 2026–2030 yang disahkan sesuai tahun.
7. Keamanan, privasi, hak akses dan retensi.
8. Izin tertulis pengujian staging.
9. Izin penggunaan/publikasi hasil secara terpisah.

Enam gate M05-8 tetap **BLOCKED**, meski kandidat referensi DEMO lengkap. Status `official_passes=0` pada output berarti **belum ada pengujian/hasil**, bukan pengujian gagal. Keberadaan contoh metadata tidak menghasilkan tanda tangan atau keputusan.

## 5. Aturan pelaporan hasil kelak
Satu kasus baru dapat diberi keputusan jika tersedia referensi sumber yang diverifikasi, skenario uji yang memang telah dijalankan di lingkungan sah, hasil aktual yang dapat ditelusuri, aturan pembanding/toleransi yang disetujui, analisis selisih dan keputusan reviewer berwenang. Kode M05-10 **tidak memiliki API untuk menaikkan status**.

Pelaporan angka tetap membedakan `UNKNOWN`, `NOT_REPORTED`, `NOT_APPLICABLE`, `OBSERVED_ZERO` dan nilai positif. Tahun 2027–2030 memerlukan ketetapan tersendiri; pertumbuhan antar-tahun, ketepatan waktu, dukungan, skor, peringkat atau penghargaan tidak otomatis menjadi sah.

## 6. Keluaran dan QA
- [Matriks kasus per tahun](../drafts/m05-apel-parity/matrix.mjs)
- [Kandidat referensi DEMO](../drafts/m05-apel-parity/references.mjs)
- [Checklist penerimaan BLOCKED](../drafts/m05-apel-parity/acceptance.mjs)
- [50 skenario QA tertulis](../drafts/m05-apel-parity/tests/parity.test.mjs), **0 dijalankan**
- [README modul](../drafts/m05-apel-parity/README.md)
- [TEST_BACKLOG](TEST_BACKLOG.md)

**M05-11 (RENCANA):** rancangan protokol otorisasi pengujian staging dan paket bukti regresi/acceptance review, tanpa menjalankan tes sebelum izin eksplisit, bukti sumber aktual, dan rencana keamanan tersedia.
