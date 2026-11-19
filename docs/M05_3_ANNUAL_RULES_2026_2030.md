# M05-3 | Kontrak Aturan Evaluasi dan Apresiasi APEL 2026–2030

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Tahap perencanaan setelah M05-0 (data/registry), M05-1 (draf/submit/revisi) dan M05-2 (checklist/tenggat usulan). Penilaian nyata **BELUM DIBUAT**. Kode baru hanya berada pada `drafts/m05-apel-rules`.

## 1. Prinsip
- **Aturan per tahun mandiri:** 2026, 2027, 2028, 2029 dan 2030 wajib memakai ID/versi kebijakan yang berbeda. Usulan 2029 tidak memperbarui hasil 2026 maupun memaksakan rumus 2028. Tahun setelah 2030 tidak menggunakan fallback 2030.
- **Jangan mematok angka atau kategori tanpa dasar:** rumus, bobot, ambang, bonus konsistensi/kecepatan, tie-breaker, normalisasi dan predikat penghargaan semuanya belum terisi pada kode. Adanya template kategori bukan bukti keputusan resmi.
- **Data ≠ skor:** jumlah layanan, bulan terlapor, waktu diterima, realisasi dukungan, dan jumlah layanan kabupaten/kota tidak boleh dianggap ukuran yang sama. Tabel peringkat tidak boleh lahir dari data sumber DEMO yang belum diperiksa.
- **Bulan kosong ≠ nol:** laporan 0 yang dikirim berbeda dari tidak ada laporan; status draf, pengiriman, revisi dan review juga berbeda. Tahun yang belum lengkap tidak boleh otomatis diperlakukan sebagai kinerja tahunan penuh.
- **Kewenangan tetap manusia:** pemeriksaan metodologi, kualitas data, tata kelola, izin publikasi dan penyelesaian keberatan harus diputuskan melalui mekanisme resmi di luar model ini.

## 2. Registry konsep kategori tahunan

| Tahun | Konsep kategori yang dicatat | Kedudukan |
|---|---|---|
| **2026** | Pelayanan terbanyak; disiplin pelaporan; pelayanan kabupaten/kota | **Referensi historis proyek**, perlu verifikasi Juknis, metode dan penerapan Flask |
| **2027** | Champion Pelayanan; Realisasi sesuai dukungan; Kabupaten/Kota pelayanan terbanyak | **Usulan**, belum menjadi keputusan atau rumus yang disahkan |
| **2028** | Belum ditentukan | Harus ada pembahasan dan versi khusus 2028 |
| **2029** | Belum ditentukan | Harus ada pembahasan dan versi khusus 2029 |
| **2030** | Belum ditentukan | Harus ada pembahasan dan versi khusus 2030 |

Konsep 2026 bukan basis otomatis untuk 2027. Konsep 2027 bukan kategori wajib untuk 2028–2030. Kode menerima rancangan kategori/tahun baru secara eksplisit, tetapi tidak menyediakan opsi `approved:true` dan tidak bisa membuat penghargaan.

## 3. Pratinjau indikator tanpa penghitungan skor

`previewAnnualRuleFacts` membaca:
1. **M05-0 ledger DEMO** untuk jumlah kejadian layanan contoh dan jumlah bulan yang mempunyai record.
2. **M05-2 checklist DEMO** untuk jumlah bulan pernah dikirim dan status draf, menunggu telaah atau koreksi.
3. **Tidak ada data terverifikasi** untuk timestamp penerimaan, realisasi dari dukungan yang telah ditetapkan maupun agregasi wilayah.

| Metrik proposal | Nilai yang boleh ditampilkan pada DEMO | Status untuk penilaian resmi |
|---|---|---|
| `SERVICE_VOLUME` | Jumlah kejadian DEMO pada M05-0, dengan label tahun parsial | **Tidak memenuhi syarat** |
| `REPORTING_CONSISTENCY` | Jumlah bulan pernah submit DEMO, bukan bulan terverifikasi | **Tidak memenuhi syarat** |
| `TIMELINESS` | `null`, belum ada timestamp server yang sah | **Tidak dapat dihitung** |
| `SUPPORT_REALIZATION` | `null`, belum ada denominator dukungan sah dan realisasi tervalidasi | **Tidak dapat dihitung** |
| `DISTRICT_SERVICE` | `null`, relasi wilayah dan rekap kab/kota belum terverifikasi | **Tidak dapat dihitung** |

**Penting:** ledger M05-0 dan workflow M05-1/M05-2 masih sumber DEMO yang berdiri sendiri. Walaupun ID fasilitas dan tahun sama, **tidak dapat diasumsikan dua ringkasan tersebut sudah konsisten**. Keluaran menyatakan `sources_reconciled:false`, `official_scoring:false`, `may_rank:false`, `may_award:false`, dan `may_publish:false`. Tidak ada tie-breaker atau skor numerik usulan, agar tidak mudah disangka klasemen yang dapat dipublikasikan.

## 4. Register telaah metodologi

`prepareAnnualRuleReview` membuat **12 gerbang dengan status BELUM_DIBUKTIKAN**:
- Pemilik aturan dan persetujuan khusus tahun bersangkutan
- Kesesuaian aturan historis 2026
- Definisi kategori, satuan dan kamus data
- Bukti layanan dan asal revisi pengiriman
- Timestamp server, jam WIB dan perpanjangan tenggat
- Dasar dukungan/realisasi jika dipakai
- Atribusi fasilitas ke kabupaten/kota
- Rumus/bobot, pembulatan, normalisasi, seri dan tie-breaker
- Kewajaran, data tidak lengkap, kapasitas/ketimpangan antarwilayah
- Perlindungan versi dan perubahan data historis
- Keamanan hak akses wilayah, audit dan bukti
- Mekanisme publikasi dan penanganan keberatan

Catatan simulasi hanya dapat ditandai BELUM_DITELAAH, BUTUH_BUKTI atau BUTUH_KEPUTUSAN. **Tidak ada perintah mengesahkan atau menutup 12 gerbang**. Dokumen dinas, bukti foto, identitas petugas, akta, atau rahasia tidak dimasukkan ke repo publik.

## 5. QA dan pekerjaan setelahnya

| Area | Skenario ditulis | Status |
|---|---:|---|
| Registry/proposal per tahun | 10 | BELUM DIUJI |
| Pratinjau indikator/validasi sumber | 11 | BELUM DIUJI |
| Register gerbang penelaahan | 8 | BELUM DIUJI |
| **Jumlah** | **29** | **0 dijalankan** |

- [Katalog dan usulan aturan](../drafts/m05-apel-rules/rulebook.mjs)
- [Pratinjau nonresmi](../drafts/m05-apel-rules/preview.mjs)
- [Register telaah metodologi](../drafts/m05-apel-rules/review.mjs)
- [Skenario QA tertulis](../drafts/m05-apel-rules/tests/)
- [Backlog QA](TEST_BACKLOG.md)

**M05-4 (RENCANA):** rapor Puskeswan dan tren multi-tahun yang memisahkan angka mentah, status kelengkapan, data yang belum terverifikasi, dan indikator yang tidak bisa diperbandingkan lintas tahun. Tidak membuat piagam/ranking sebelum M05-3 mempunyai metodologi yang disepakati dan bukti memadai.

Seluruh pekerjaan **CODE_ONLY** pada `develop/yandik-foundation`, PR #9 tetap Draft, tanpa CL/CI, tes, merge, akses VPS/DB, perubahan aplikasi Flask dan publikasi situs produksi.
