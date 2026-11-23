# M13-S2 | Kandidat Rekonsiliasi Surveilans ↔ Investigasi APEL, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | NO SYNC | DATA FIKTIF.**

## Masalah yang dicegah
Pada APEL M05-0, satu investigasi dicatat berdasarkan **kejadian dan lokasi**. Pada surveilans M13-S1, catatan kejadian memuat status dugaan, investigasi, dan sampel. Kedua sumber **tidak otomatis dapat dipersamakan** walau nama/ID tampak sama. Jangan menambah total kasus dari data investigasi APEL atau sebaliknya.

## Kode draft
- [Model candidate crosswalk](../drafts/m13-apel-crosswalk/crosswalk.mjs) memeriksa apakah \`event_id\`, \`location_ref\`, periode, Puskeswan dan wilayah fiktif tersedia di source M13-S1 serta ledger M05-0 yang divalidasi melalui dashboard M05-14.
- [Fixture contoh](../drafts/m13-apel-crosswalk/fixtures.mjs) secara sengaja menambahkan satu kejadian dan satu investigasi fiktif dengan kunci yang cocok, **bukan bukti bahwa keduanya kejadian nyata yang sama**.
- [24 QA tertulis](../drafts/m13-apel-crosswalk/tests/crosswalk.test.mjs), **0 dijalankan**.

## Kontrak
| Objek | Perilaku | Batas kewenangan |
|---|---|---|
| Link eksplisit | Hanya \`PROPOSED_UNVERIFIED_DEMO\` | Tidak ada konfirmasi otomatis |
| Kunci | \`facility_id\`, \`event_id\`, \`location_ref\`, \`period\`, \`region_label\`, \`source_id\`, \`snapshot_id\` | Tidak membuktikan kejadian sama |
| Konsistensi wilayah | Fasilitas terdaftar dan satu wilayah DEMO; bila tak cocok ditolak | Tidak ada perluasan akses |
| Histori/tanggal | Satu tahun pilihan (2026–2030), sumber M13-S1 valid | Tidak memperbaiki histori M05-0 |
| Hasil | \`POSSIBLE_MATCH_UNVERIFIED_DEMO\`, butuh review manusia | Bukan tautan resmi, skor atau kasus sah |
| Sumber | M05-0 dan M13-S1 tetap independen | Tidak ada sinkron iSIKHNAS, API/DB, deduplikasi sah |
| Hitungan | Candidate count DEMO saja; total rekonsiliasi resmi \`null\` | Tidak boleh menjumlahkan unit layanan vs kasus |

**Jika tidak ada kandidat**, angka 0 menunjukkan *nol usulan*, bukan nol kasus/kejadian nyata. Jika ada kandidat, belum berarti satu catatan yang sama. Tidak ada perubahan ledger, notifikasi, atau keputusan.

## Pekerjaan integrasi berikut
1. Pastikan identitas master Puskeswan, wilayah, event dan lokasi dalam sumber yang diberi izin, termasuk penanganan perubahan ID.
2. Klarifikasi pencatatan investigasi dalam Juknis dan definisi kasus sumber surveilans.
3. Kembangkan review manusia dua sumber, bukti minimal, jejak keputusan dan mekanisme pembatalan yang tidak merusak histori.
4. Validasi hak akses data kejadian/lokasi dan iSIKHNAS, uji negatif dan regresi dengan izin.
5. Seluruh source dan keputusan tetap **NO_GO** sampai verifikasi organisasi.

**Status:** CODE_WRITTEN_NOT_TESTED; cross-module reconciliation NOT PROVEN.
