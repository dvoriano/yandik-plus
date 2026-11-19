# M05-2 | Checklist Kepatuhan APEL Multi-Tahun 2026–2030

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Lanjutan M05-0 (laporan dan registry per tahun) dan M05-1 (draf, pengiriman, koreksi, histori DEMO). **Bukan pembacaan website langsung, bukan hasil kepatuhan resmi, dan bukan penerapan batas waktu.**

## 1. Tujuan
Menyediakan kontrak checklist bulanan Puskeswan yang tidak menyamakan semua bulan kosong dengan nol ataupun menyamakan draf, pengiriman, dan laporan yang telah ditelaah. Setiap tahun **2026, 2027, 2028, 2029, 2030** memakai sumber dan usulan kebijakan tahunan yang berbeda. Kelengkapan dan ketepatan waktu dinilai terpisah, setelah keabsahan sumber dipastikan.

## 2. Lima keadaan laporan

| Status checklist DEMO | Asal M05-1 | Interpretasi |
|---|---|---|
| `BELUM_DILAPORKAN` | Tidak ada laporan induk | Bulan belum berisi record, bukan deklarasi nol |
| `DRAF_BELUM_DIKIRIM` | DRAFT | Petugas sedang menyusun; **belum dianggap terkirim** |
| `TERKIRIM_MENUNGGU_TELAAH` | SUBMITTED_REVIEW_PENDING | Ada pengiriman DEMO; **belum diverifikasi/disahkan** |
| `DIKEMBALIKAN_UNTUK_PERBAIKAN` | CORRECTION_REQUESTED | Pernah dikirim, sedang membutuhkan koreksi |
| `DRAF_REVISI_BELUM_DIKIRIM` | REVISION_DRAFT | Pernah dikirim lalu diperbaiki; revisi belum dikirim ulang |

Pengiriman terdahulu dicatat sebagai `has_demo_submission`, tetapi **tidak otomatis masuk capaian patuh**. Nilai `reported_zero` hanya ada bila laporan yang pernah dikirim dan divalidasi oleh kontrak M05-0 menunjukkan nol eksplisit.

Ringkasan menampilkan jumlah bulan per status, jumlah bulan yang pernah ada pengiriman DEMO, dan bulan pengiriman DEMO bernilai nol. **Tidak ada persentase kepatuhan resmi, skor apresiasi, klasemen, atau keputusan penalti.**

## 3. Kalender tiap tahun, bukan aturan tunggal 2026–2030

`planAnnualDeadline` hanya menerima tahun yang telah terdaftar dalam M05-0 dan harus diberi `proposal_id`, `deadline_day`, `publication_day`. Tidak ada tenggat bawaan. Tanggal kalender simulasi dihitung untuk **bulan sesudah periode pelayanan**.

Contoh **usulan simulasi saja**: periode Januari 2028 dengan `deadline_day=9` menghasilkan 9 Februari 2028; Desember 2030 menghasilkan tenggat simulasi Januari 2031. Itu **bukan pengesahan** tenggat 2028/2030. Angka 9/10 yang pernah dipakai pada APEL 2026 tidak ditetapkan otomatis pada tahun berikutnya.

Fitur `exceptions` memungkinkan bulan tertentu mempunyai tanggal usulan berbeda, disertai alasan, tanpa mengubah bulan lain. Semua keluaran memuat `approved:false`, `official_rules_verified:false`, `deadline_enforced:false`, `publication_allowed:false`.

**Yang belum dikerjakan:** verifikasi SK/juknis, keputusan resmi tenggat dan jam WIB, hari libur, ekstensi tenggat, server clock, audit penerimaan, notifikasi dan aturan penguncian setelah tenggat.

## 4. Batas penilaian tepat waktu dan bukti timestamp
M05-1 **belum mempunyai cap waktu penerimaan yang terverifikasi oleh server**. Karena itu checklist utama selalu menghasilkan `timeliness:"TIDAK_DAPAT_DITENTUKAN"` dan `official_compliance:null`, bahkan untuk laporan yang pernah dikirim.

`simulateSubmissionDateComparison` merupakan alat *rehearsal*: contoh tanggal `YYYY-MM-DD` dipasangkan dengan ID event pengiriman DEMO yang sesuai, lalu dibandingkan dengan tenggat **usulan**. Hasilnya berawalan `SIMULASI_` atau `TIDAK_DAPAT_DITENTUKAN`. Tidak ada penetapan **TEPAT_WAKTU** / **TERLAMBAT** resmi.

Tanggal contoh hanya tingkat kalender tanpa jam. Sistem sesungguhnya membutuhkan cap waktu server dengan zona Asia/Jakarta, kebijakan batas jam, koreksi jam server, aturan perpanjangan, penerimaan yang telah diverifikasi dan keputusan pengampu.

## 5. Isolasi akses dan data
Pembaca mengakses M05-1 melalui `readDemoWorkflow` yang memakai callback sesi dan fasilitas dari kontrak M04-I6B. Pelapor Puskeswan tidak boleh membaca fasilitas lain, pemeriksaan akses dilakukan per permintaan, dan rincian tidak diperluas ke pimpinan tanpa keputusan hak akses. Semua callback belum dihubungkan dengan backend asli.

Keluaran status hanya per fasilitas yang diminta dan berisi ID serta metadata DEMO. Tidak ada daftar global pengguna, foto, identitas petugas, file bukti, dokumen atau kredensial. Pembacaan per bulan **tidak membuktikan** snapshot atomik bila state berubah saat proses berjalan.

## 6. Rencana QA dan batas tahun

| Area | Skenario tertulis | Status |
|---|---:|---|
| Registry kalender, pengecualian, Desember 2030/Jan 2031, klaim izin palsu | 9 | BELUM DIUJI |
| Status per bulan, hitungan summary, nol vs kosong, cakupan peran, lima tahun | 12 | BELUM DIUJI |
| Tanggal contoh, tanggal tidak valid, ID event pengiriman, anti-klaim patuh | 7 | BELUM DIUJI |
| **Total** | **28** | **0 dijalankan** |

- [Kode kalender](../drafts/m05-apel-compliance/schedule.mjs)
- [Kode checklist](../drafts/m05-apel-compliance/checklist.mjs)
- [Perbandingan tanggal DEMO](../drafts/m05-apel-compliance/timing.mjs)
- [Fixture dan tes tertulis](../drafts/m05-apel-compliance/tests/)
- [Backlog pengujian](TEST_BACKLOG.md)

## 7. Tahap setelah M05-2
**M05-3 (RENCANA):** kontrak *rule-set* pelaporan/apresiasi per tahun 2026–2030, pemisahan basis data layanan dari skor, dan prosedur verifikasi kebijakan sebelum perhitungan resmi. Tanpa menyetujui sendiri bobot, kategori, bonus pelaporan, target/dukungan atau predikat.

**Batas mutlak:** GitHub PUBLIC, branch `develop/yandik-foundation`, PR #9 Draft, CODE_ONLY. Tidak ada tes, CL/CI, merge, DB/VPS/Flask produksi, email/WA/notifikasi, publikasi atau deploy.
