# M05-6 | Data Dictionary & Schema Mapping APEL 2026–2030

**20 November 2026 | KODE DITULIS, BELUM DIUJI.** Ini matriks kebutuhan bisnis, bukan hasil pembacaan schema produksi. Tidak ada nama tabel/kolom aktual yang diketahui atau diasumsikan.

## 1. Status bukti
- Schema aktual: **BELUM DIBERIKAN**.
- Data dictionary resmi: **BELUM DIVERIFIKASI**.
- Owner sumber dan kewenangan akses: **BELUM DIVERIFIKASI**.
- Semua field aktual di katalog kode bernilai null dan \`NOT_MAPPED\`.
- Contoh kandidat hanya boleh memakai label \`DEMO-\`, bukan nama tabel produksi.

## 2. Domain mapping
| Domain | Kunci/field bisnis utama | Pertanyaan yang wajib dijawab |
|---|---|---|
| Identitas fasilitas | canonical facility ID, nama, masa aktif | Apakah ID stabil lintas sistem dan perubahan nama? |
| Histori wilayah | region ID, valid-from/to | Apakah mutasi wilayah historis dapat direkonstruksi per bulan? |
| Ledger pelayanan | record ID, facility, period, revision, nihil | Apa grain record, aturan revisi, dan definisi nihil? |
| Detail kejadian | activity type, quantity, unit, event/location ID | Apakah event dihitung per kejadian, lokasi, hewan, atau tindakan? |
| Workflow | record, facility, period, status, revision, request, submitted_at | Timestamp server mana yang otoritatif? Bagaimana submit ulang dan koreksi dilacak? |
| Versi kebijakan | year, version, approval state, effective dates | Dokumen/keputusan apa yang mengesahkan aturan per tahun? |
| Rencana dukungan | plan, facility, period, planned quantity | Apa dasar, denominator dan unit dukungan yang disetujui? |
| Realisasi dukungan | realization, quantity, date, evidence | Bukti serah terima/realisasi apa yang sah dan dapat diaudit? |

## 3. Aturan relasi yang belum boleh diasumsikan
- Facility ID harus diuji stabilitasnya; jangan join menggunakan nama fasilitas.
- Ledger dan workflow perlu kunci fasilitas + periode + revisi yang kompatibel. Kecocokan fasilitas-bulan saja belum membuktikan satu laporan mewakili satu ledger.
- Event identity perlu grain yang disepakati, termasuk aturan investigasi per lokasi/kejadian dan pemeriksaan kurban per hewan.
- Region attribution harus temporal, bukan sekadar wilayah fasilitas saat ini.
- Policy version harus ditautkan ke tahun, masa berlaku, dan bukti persetujuan.
- Rencana dukungan dan realisasi harus memiliki unit, periode, denominator, serta bukti yang sebanding.
- Timestamp memerlukan zona waktu, sumber jam, makna status, dan aturan koreksi.
- Nilai null, tidak diketahui, tidak berlaku, belum dikirim, dan nol teramati tetap kategori terpisah.

## 4. Keluaran katalog
[Katalog field dan fungsi review](../drafts/m05-apel-mapping/mapping.mjs) · [20 QA tertulis](../drafts/m05-apel-mapping/tests/mapping.test.mjs) (0 dijalankan).

Katalog mendefinisikan kebutuhan field semantik. Fungsi review hanya menerima contoh kandidat berlabel DEMO dan selalu mengembalikan \`verified=false\`. Tidak ada kemampuan koneksi atau query.

## 5. Bukti yang diperlukan untuk mengisi mapping aktual
1. Persetujuan owner sistem dan pemilik data, tujuan penggunaan, scope read-only, dan akun minimum.
2. Data dictionary/schema export resmi dari lingkungan staging atau dokumentasi pengelola.
3. Definisi primary/foreign key, unique constraint, nullable, enum/status, tipe data dan indeks relevan.
4. Aturan periode, zona waktu, audit/revision history, soft-delete, retensi, dan transaksi.
5. Kamus layanan, satuan, grain event, nihil, wilayah historis dan policy tahunan.
6. Sampel sintetis atau tersamarkan yang disetujui, plus total kontrol untuk rekonsiliasi.
7. Review mapping bersama owner proses, pengelola aplikasi dan pengelola data.

## 6. Gerbang
M05-6 tidak menyatakan mapping selesai. Setelah bukti resmi tersedia, tahap review manual harus menetapkan setiap field sebagai MATCH, PARTIAL, CONFLICT, NOT_FOUND atau NOT_APPLICABLE beserta bukti dan reviewer. Status MATCH pun tidak memberi izin query atau produksi.

**M05-7 (RENCANA):** matriks lineage, cardinality, temporal joins dan konflik setelah data dictionary resmi diberikan. Semua tes tetap tertunda sampai pemilik proyek mencabut CODE_ONLY.
