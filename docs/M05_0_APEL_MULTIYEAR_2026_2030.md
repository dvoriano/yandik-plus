# M05-0 | Fondasi APEL Puskeswan Multi-Tahun 2026–2030

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Tindak lanjut eksplisit keputusan owner: **YANDIK+ tidak dibangun hanya untuk APEL 2026; cakupan perencanaan pelaporan dan evaluasi adalah 2026–2030.** Ini bukan berarti aturan 2027–2030 telah ditetapkan. Pengembangan M05-0 hanya ada pada `drafts/m05-apel-multiyear`, terpisah dari Flask/website.

## 1. Prinsip lintas tahun

1. **Lima tahun dalam satu sistem, lima versi kebijakan yang terpisah.** Registry eksplisit 2026–2030; 2026 adalah referensi historis yang masih harus dicocokkan dengan Juknis dan kode produksi. Tahun 2027, 2028, 2029, 2030 **menunggu keputusan tahunan**.
2. **Tidak menyalin rumus otomatis:** `draft_rule_version` unik untuk setiap tahun; `scoring_rule_version` kosong, `approved:false` dan `scoring_enabled:false` sampai ada bukti, pengujian dan persetujuan tersendiri.
3. **Jangan menimpa tahun lama:** revisi peraturan di masa depan tidak mengubah catatan/perhitungan yang pernah berlaku. Perubahan historis perlu prosedur koreksi dan audit tersendiri, belum dibangun.
4. **Batas 2030 adalah cakupan roadmap, bukan akhir umur aplikasi:** untuk periode 2031+ kelak tambahkan entry, versi dan keputusan eksplisit. Kode sekarang menolak tahun di luar registry daripada menerapkan aturan 2030 tanpa izin.
5. **Pelaporan, rekap dan penghargaan dipisahkan:** rekam nilai layanan tidak sama dengan memberi skor, klasemen, atau otorisasi publikasi. Kebijakan masing-masing tahun tidak dianggap sah dari kode.

## 2. Status kebijakan rancangan per tahun

| Tahun | Acuan | Status sekarang |
|---|---|---|
| 2026 | Ketentuan APEL/Juknis 2026 terdokumentasi, perlu parity terhadap aplikasi lama | REFERENSI BELUM DIVERIFIKASI |
| 2027 | Rumus pelaporan, dukungan, apresiasi dan kategori per 2027 perlu keputusan tahun tersebut | BELUM DITETAPKAN |
| 2028 | Kebijakan, nomenklatur dan target/dukungan sesuai keputusan 2028 | BELUM DITETAPKAN |
| 2029 | Kebijakan, nomenklatur dan target/dukungan sesuai keputusan 2029 | BELUM DITETAPKAN |
| 2030 | Kebijakan, nomenklatur dan target/dukungan sesuai keputusan 2030 | BELUM DITETAPKAN |

Kode `proposeAnnualPolicy` hanya menghasilkan **usulan DEMO** per tahun. Tanggal 9 dan 10 yang relevan dalam konteks 2026 tidak disalin menjadi tenggat berlaku otomatis pada 2027–2030. Tidak ada persetujuan aturan resmi, termasuk keputusan scoring.

## 3. Kontrak laporan bulanan DEMO

Kunci unik: `(facility_id, YYYY-MM)`. Satu Puskeswan dapat menyampaikan satu laporan per bulan; input kedua untuk kunci sama **ditolak**, bukan ditimpa. Revisi/peninjauan memerlukan alur baru dengan histori, autentikasi dan otorisasi tersendiri.

Data DEMO mencakup:
- Bilangan bulat nonnegatif untuk jenis layanan ilustratif `pengobatan`, `vaksinasi`, `penyuluhan` dan `layanan_lain`. **Nama dan batas kategori ini belum dipetakan satu per satu terhadap formulir hidup.**
- Investigasi memakai pasangan `event_id + location_id`, mewakili kejadian dan lokasi; pasangan ganda ditolak. Realisasi hitung mengikuti definisi resmi yang kelak harus diverifikasi.
- Pemeriksaan kurban memakai `animal_id` unik; `ante` dan `post` pada hewan yang sama tidak menggandakan jumlah hewan.
- Referensi bukti memakai ID `DEMO-...` fiktif, **bukan foto, arsip SRIKANDI, URL atau data pribadi**.
- `declared_no_activity:true` berarti laporan nol eksplisit. Bulan tanpa record adalah **BELUM_DILAPORKAN**, bukan otomatis nol. Apabila data semua nol tanpa deklarasi nol, draft ditolak.
- Seluruh rekap berstatus nonresmi; tanpa verifikasi sumber, petugas, waktu kirim dan keabsahan bukti.

Tidak tersedia hubungan langsung dengan iSIKHNAS, sertifikat, stok, user login atau modul Support. Tidak ada perhitungan piagam, klasemen, poin, bonus kecepatan atau normalisasi kuantitas lintas tahun.

## 4. Indikator lima tahun

`fiveYearDemoOverview` memberi lima baris, **satu per tahun**, yang menampilkan versi kebijakan draf, bulan terlapor, bulan kosong, laporan nol, total kejadian DEMO dan penanda tahun belum lengkap. Tidak menghasilkan ranking, skor, penghargaan otomatis atau perbandingan yang secara metodologi dianggap setara lintas tahun.

**Contoh:** apabila Puskeswan mengirim laporan Januari 2028 saja, jumlah bulan yang telah lapor = 1 dan yang belum = 11. Total layanan 1 bulan tersebut **bukan capaian tahunan penuh**. Jika Februari adalah laporan sah berisi nol, Februari tetap dihitung sebagai bulan yang sudah melaporkan.

## 5. Jalur pengembangan 2026–2030

| Gelombang | Hasil yang direncanakan | Ketergantungan |
|---|---|---|
| M05-0 | Kontrak tahun 2026–2030, data DEMO, ledger, baseline regresi dan skenario tertulis | Kode ada, BELUM DIUJI |
| M05-1 | Draf, submit, revisi per tahun dan bukti pelayanan | Hak akses, sumber kanonik dan juknis |
| M05-2 | Checklist kepatuhan dan penjadwalan yang berversi per tahun | Konfirmasi tanggal efektif dan kebijakan |
| M05-3 | Perhitungan/penilaian 2026–2030 dengan rule-set terverifikasi per periode | Persetujuan metode dan contoh hasil baseline |
| M05-4 | Rekap/rapor dan dashboard multi-tahun tanpa membandingkan tahun yang tidak setara | Ketuntasan dan kualitas data |
| M05-5 | Ekspor, berita, apresiasi dan evaluasi lintas tahun sesuai keputusan resmi | Audit, privasi, publikasi dan persetujuan |

Alur coding tetap di branch `develop/yandik-foundation`, PR #9 Draft. Migrasi/Flask/go-live hanya sesudah gerbang M04-I6D, izin G0, uji data anonim dan keputusan kelembagaan.

## 6. Bukti kode dan antrean QA

- [Registry kebijakan per tahun](../drafts/m05-apel-multiyear/policy.mjs)
- [Validasi laporan/ledger](../drafts/m05-apel-multiyear/reporting.mjs)
- [Ringkasan lima tahun](../drafts/m05-apel-multiyear/timeline.mjs)
- [Fixture sintetis](../drafts/m05-apel-multiyear/fixtures.mjs)
- [29 skenario QA, belum dijalankan](../drafts/m05-apel-multiyear/tests/)
- [Daftar QA tertunda](TEST_BACKLOG.md)

**29 skenario tertulis, 0 dijalankan.** Berkas tersimpan di GitHub hanya membuktikan keberadaan kode, bukan ketepatan komputasi, parity Juknis, keamanan, dukungan Flask/SQLite, atau keabsahan kebijakan 2027–2030. GitHub PUBLIC, tidak memakai data nyata.

## 7. Langkah berikutnya

**M05-1 (usulan):** kontrak `draft → submit → koreksi` untuk tiap periode dan fasilitas, pemisahan revisi berjejak dari laporan final, bukti metadata fiktif serta validasi hak akses tepercaya. Tetap kode DEMO dan skenario QA tertunda sampai izin owner berubah.
