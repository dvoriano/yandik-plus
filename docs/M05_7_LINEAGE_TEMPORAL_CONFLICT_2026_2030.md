# M05-7 | Data Lineage, Relasi Temporal & Conflict Review APEL 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Rancangan dapat ditinjau di GitHub, tetapi **belum diuji dan tidak terhubung ke sistem APEL yang berjalan**.

## 1. Tujuan
Menyusun jalur penelusuran asal data layanan Puskeswan agar angka yang kelak tampil dalam rapor dapat dikaitkan dengan identitas fasilitas, periode, revisi, sumber kebijakan, dan riwayat wilayah yang benar. Hasil saat ini **hanya kontrak dan contoh DEMO**, tidak menetapkan angka resmi, penilaian atau klasemen.

Ketergantungan: [M05-5 rekonsiliasi sumber](M05_5_SOURCE_RECONCILIATION_2026_2030.md) dan [M05-6 kamus 36 field semantik](M05_6_DATA_DICTIONARY_MAPPING_2026_2030.md). Keduanya belum memiliki bukti schema produksi atau persetujuan pemilik data. M05-7 tidak boleh mengubah status tersebut.

## 2. Sumber, kunci, dan hubungan yang diusulkan

| Kelompok DEMO | Identitas & grain yang perlu diverifikasi kelak | Relasi yang diperiksa |
|---|---|---|
| Fasilitas | `facility_id` stabil, bukan nama atau ejaan | Akar identitas lintas modul |
| Histori wilayah | `mapping_id`, `facility_id`, `region_id`, valid-from/to | Satu atribusi yang mencakup bulan penuh atau konflik |
| Pelayanan | `record_id`, `facility_id`, `period`, `revision_id`, `event_id`, `location_id`, kategori, satuan | Banyak kejadian boleh terikat pada satu revisi, identitas kejadian tidak dihitung ganda secara otomatis |
| Workflow | `record_id`, fasilitas + bulan + revisi, status, `request_id`, waktu | Calon pasangan **revisi tepat**, bukan sekadar fasilitas + bulan |
| Kebijakan | `policy_id`, tahun, versi, masa berlaku | Versi sesuai tahun dan mencakup satu bulan; tidak meneruskan aturan tahun sebelumnya secara otomatis |
| Rencana dukungan | `plan_id`, fasilitas, bulan, unit, jumlah direncanakan | Rencana berdiri sendiri dan bukan realisasi |
| Realisasi dukungan | `realization_id`, `plan_id`, unit, bukti, jumlah | Banyak realisasi dapat merujuk satu rencana, tetapi tidak menjadi bukti sah secara otomatis |

Semua bentuk record di atas adalah **schema fixture DEMO** untuk penulisan kode, bukan klaim nama tabel/kolom Flask/DB produksi.

## 3. Aturan temporal dan revisi
1. `period` dibatasi format `YYYY-MM` untuk 2026–2030. Bulan Desember 2030 memiliki batas akhir interval 1 Januari 2031 tanpa otomatis memperluas tahun laporan.
2. Dalam contoh DEMO, `valid_from` inklusif dan `valid_to` eksklusif. Atribusi wilayah dan kebijakan hanya dipasangkan bila **satu** record mencakup seluruh bulan laporan. Pergantian wilayah dalam satu bulan, selang yang tidak tertutup, atau tumpang tindih menjadi isu telaah, bukan dipaksa ke wilayah terbaru.
3. Revisi laporan mengikuti kunci `facility_id + period + revision_id`. Revisi berbeda tidak dipilih dengan aturan *latest wins* atau di-overwrite. Timestamp pengiriman bukan bukti bahwa status akhir sudah diverifikasi.
4. Identitas Puskeswan harus stabil sepanjang sejarah. Perubahan nama tidak boleh digunakan sebagai kunci join. Alias atau perpindahan wilayah memerlukan kamus resmi dan aturan temporal tersendiri.
5. Grain kejadian harus dipastikan terhadap Juknis sebelum agregasi, termasuk investigasi per kejadian/lokasi dan kurban per hewan. Kode DEMO hanya mendeteksi tabrakan kunci kejadian dan tidak membentuk jumlah pelayanan akhir.

## 4. Konflik dan tindakan

| Kode/keluarga konflik | Makna | Perlakuan |
|---|---|---|
| `MISSING_FACILITY`, `AMBIGUOUS_FACILITY`, `DUPLICATE_SOURCE_ID` | Identitas sumber tidak ada atau tidak tunggal | Ditandai, tidak membuat ID pengganti atau memilih baris pertama |
| `DUPLICATE_EVENT_GRAIN` | Kategori + event + lokasi berulang dalam revisi yang sama | Tidak dijumlah atau dibuang otomatis; periksa grain menurut sumber |
| `WORKFLOW_MISSING`, `WORKFLOW_REVISION_MISMATCH`, `WORKFLOW_CARDINALITY`, `WORKFLOW_WITHOUT_SERVICE_REVISION` | Pasangan workflow hilang, berbeda revisi, atau ambigu | Tidak mengasumsikan versi terbaru sebagai pasangan |
| `REGION_NOT_COVERED`, `REGION_PARTIAL_MONTH`, `REGION_SPLIT_OR_OVERLAP` | Atribusi bulan tidak tunggal dan lengkap | Region candidate menjadi null; pembahasan aturan historis diperlukan |
| `POLICY_MISSING_OR_VERSION`, `POLICY_PARTIAL_MONTH`, `POLICY_CARDINALITY` | Versi atau periode policy tidak sesuai | Tidak memakai aturan tahun lain secara otomatis |
| `SUPPORT_PLAN_MISSING`, `SUPPORT_PLAN_CARDINALITY`, `SUPPORT_UNIT_CONFLICT`, `SUPPORT_EVIDENCE_MISSING` | Referensi, satuan, atau bukti realisasi belum memadai | Tidak menghitung tingkat realisasi atau mengakui BAST |
| `NO_ACTIVITY_NOT_EXPLICIT_ZERO` | Deklarasi nihil tanpa observasi nol eksplisit | Nilai tidak diubah menjadi nol |

Konflik selalu `HUMAN_REVIEW_REQUIRED` dengan `auto_resolved=false`. Tidak ada klaim bahwa nama kode mencerminkan seluruh kemungkinan konflik produksi.

## 5. Ketentuan nilai dan jejak angka
`OBSERVED_ZERO` adalah angka nol **yang dicatat secara eksplisit**, bukan bulan kosong. `UNKNOWN`, `NOT_REPORTED`, dan `NOT_APPLICABLE` tetap terpisah dari `OBSERVED_NONZERO`. Perencanaan dukungan dan realisasi tidak digabung pada satu angka tanpa satuan, denominator, periode dan bukti sah.

Keluaran `candidate_chains` hanya menyimpan referensi calon untuk fasilitas, mapping wilayah, workflow dan policy yang cocok secara bentuk. `support_plan_candidates` dan `support_realization_candidates` terpisah. Seluruh calon selalu `verified=false`, `usable_for_reporting=false`; bahkan bila `issues.length=0`, **bukan berarti rekonsiliasi resmi selesai**. Belum ada bukti snapshot atomik, digest terverifikasi atau parity dengan kode produksi.

## 6. Pembatasan pengembangan
- Repository bersifat PUBLIC: semua nama dan record wajib DEMO, tanpa data kedinasan riil, kredensial atau informasi pribadi.
- Tidak membaca file produksi, introspeksi schema, menjalankan SQL, server, service, test runner, CI, CL, browser, VPS, website maupun database.
- Tidak melakukan auto-join pada sumber asli, auto-resolve, overwrite, koreksi, approval, scoring, ranking, penghargaan, publikasi atau deployment.
- Semua penanda `may_connect`, `may_query`, `may_write`, `may_repair`, `may_score`, `may_publish`, `official_authorization`, verifikasi mapping dan owner bernilai **false**.

## 7. Bukti untuk tahap berikutnya
Sebelum memakai relasi pada staging, diperlukan: data dictionary resmi, pemilik dan dasar akses, daftar ID primer/asing, aturan grain revisi/kejadian, histori wilayah dengan interval berlaku, timezone/timestamp server, versi kebijakan per tahun dan persetujuannya, unit serta bukti rencana/realisasi, snapshot audit yang sah, kasus regresi terhadap Juknis dan review manusia lintas pengampu. Persetujuan uji/staging dan izin keluar dari CODE_ONLY harus **eksplisit** dan terpisah; akses produksi bukan akibat otomatis dari dokumen ini.

## 8. File dan kelanjutan
- [Kontrak & review DEMO](../drafts/m05-apel-lineage/lineage.mjs)
- [README modul](../drafts/m05-apel-lineage/README.md)
- [38 skenario QA tertulis](../drafts/m05-apel-lineage/tests/lineage.test.mjs), **0 dijalankan**
- [TEST_BACKLOG](TEST_BACKLOG.md)

**M05-8 (RENCANA):** paket *evidence review* yang merekam status bukti, penanggung jawab, selisih yang harus diklarifikasi, dan gerbang keputusan pemakaian sumber. Perancangan dapat dibuat secara DEMO dan baca-saja; **integrasi riil tetap tertunda**.
