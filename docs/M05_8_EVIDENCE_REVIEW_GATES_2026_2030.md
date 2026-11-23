# M05-8 | Register Bukti, Review Konflik & Gerbang Persetujuan Sumber APEL 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO.** Dokumen ini menjelaskan rancangan kontrak bukti, bukan hasil audit/verifikasi resmi atau persetujuan penggunaan data.

## Tujuan
Tahap M05-5 sampai M05-7 telah menyiapkan rancangan rekonsiliasi, data dictionary 36 field, serta jalur asal data dan isu relasi temporal. **Belum ada sumber resmi dan schema produksi yang diotorisasi untuk dipetakan.** M05-8 mengorganisasi apa yang harus dibuktikan, siapa *secara peran* yang kelak perlu menelaahnya, dan kapan integrasi tetap harus diblokir.

## 1. Katalog 14 persyaratan bukti

| Kode persyaratan | Bukti yang perlu diperiksa | Peran yang perlu dilibatkan (konseptual) |
|---|---|---|
| SOURCE_OWNER_SCOPE | Pemilik data/sistem dan cakupan akses read-only minimal | Owner sumber |
| DATA_DICTIONARY | Export/dokumen schema aktual, pemetaan field M05-6 | Pengelola sistem |
| KEYS_AND_GRAIN | Primary key, foreign key, grain kejadian, lokasi, revisi | Pengelola data |
| SNAPSHOT_ATOMICITY | Bukti snapshot konsisten dan integritas digest | Pengelola sistem |
| SOURCE_PROVENANCE | Sumber otoritatif, lifecycle rekaman, sumber perubahan | Owner sumber |
| REGION_HISTORY | Wilayah Puskeswan menurut masa berlakunya | Pengelola data |
| REPORT_REVISIONS | Status, revisi, timestamp penerimaan server | Pengampu APEL |
| SERVICE_UNIT_GRAIN | Definisi layanan, satuan, hitung kejadian/hewan | Pengampu APEL |
| YEARLY_POLICY | Dasar aturan per tahun 2026–2030 dan tanggal berlaku | Pengampu APEL |
| SUPPORT_PLAN_REALIZATION | Dasar rencana, realisasi, unit dan bukti sah | Pengampu proses |
| SECURITY_RETENTION | Hak akses, privasi, log, retensi, backup/restore | Pengelola sistem |
| JUKNIS_PARITY | Kesesuaian hasil hitung 2026 dengan Juknis dan regresi tahunan | Pengampu APEL |
| STAGING_TEST_PERMISSION | Izin tertulis pengujian terbatas dan pemisahan lingkungan | Owner sistem |
| REPORT_PUBLICATION_PERMISSION | Kewenangan penggunaan hasil di laporan/publikasi | Pengampu APEL |

Pencantuman peran di tabel **bukan penugasan/persetujuan pejabat nyata**, melainkan pengelompokan pihak yang harus dilibatkan pada proses formal nanti.

## 2. Kontrak calon bukti DEMO
`evidence.mjs` menerima metadata `evidence_id`, `requirement_id`, `evidence_type`, `reference_id`, `source_family`, `supplied_by`, `revision`, dan `claim_state=DEMO_UNVERIFIED`.

Hanya ID `DEMO-` dan tipe yang sesuai katalog diterima. Tidak menerima isi berkas, nama sumber aktual, token, tangkapan data asli, atau klaim `VERIFIED`. Satu persyaratan boleh memiliki beberapa calon bukti; jumlah bukti **bukan** ukuran validitas. Referensi dan revisi hanyalah label contoh, tanpa pemeriksaan sumber, tanggal asli atau digest.

## 3. Review bukti dan konflik
`review.mjs` hanya mencatat `DEMO_STRUCTURE_NOTED`, `REQUEST_CLARIFICATION` atau `REJECT_DEMO_CANDIDATE` dengan alasan kode dan reviewer fiktif. Tidak ada status *approved* atau tanda tangan resmi. Setiap catatan melekat pada `evidence_id` serta persyaratan yang sama; duplikasi catatan ditolak.

`gates.mjs` dapat menerima objek `inspectDemoLineage()` dari M05-7 yang diberi penanda DEMO dan belum terverifikasi. Kode konflik dan referensi record menjadi daftar telaah; nomor isu bersifat **indeks per snapshot fixture**, bukan identitas tetap lintas snapshot. Catatan `REQUEST_SOURCE_CLARIFICATION`, `REQUEST_ADDITIONAL_EVIDENCE`, `ESCALATE_TO_SOURCE_OWNER`, atau `DEFER_UNTIL_AUTHORIZED` tidak mengubah `UNRESOLVED`. Tidak ada *latest-wins*, join nama, pengisian nol, koreksi atau penutupan otomatis.

## 4. Enam gerbang kesiapan, semuanya tetap BLOCKED

| Gerbang | Yang harus dibuktikan sebelum boleh dibahas sebagai kesiapan |
|---|---|
| SOURCE_AND_SCOPE | Kewenangan sumber dan tujuan akses minimum |
| SCHEMA_AND_GRAIN | Field aktual, kunci, grain pelayanan yang kompatibel |
| RECONCILIATION_HISTORY | Snapshot, riwayat wilayah, revisi workflow |
| ANNUAL_SUPPORT_POLICY | Aturan tahunan, bukti dukungan, parity Juknis |
| SECURITY_AND_STAGING | Kebijakan pengelolaan data dan izin staging |
| PUBLICATION | Izin tersendiri atas penggunaan/publikasi hasil |

Keluaran `readiness=BLOCKED_NO_OFFICIAL_EVIDENCE_OR_AUTHORIZATION`, `blocked_gates=6`, `officially_verified_requirements=0`. Ini **bukan keputusan pejabat**, melainkan proteksi *fail-closed* pada prototype. Bahkan 14 persyaratan telah diberi fixture DEMO dan tidak ada konflik, keenam gerbang tetap tertutup. Pembuktian di masa depan memerlukan proses validasi nyata dan keputusan terpisah, bukan mengubah boolean DEMO ke `true`.

## 5. Keterbatasan dan pengaman
- Sumber resmi, database/schema aktual, pemilik data, snapshot/digest, dan tanda tangan/otorisasi **belum diverifikasi**.
- Tidak ada konektor, API, SQL, filesystem, jaringan, migrasi, write, repair, delete, penilaian, peringkat, penghargaan, publikasi atau deployment.
- Repo PUBLIC: kode hanya contoh; jangan menempel file kedinasan riil, identitas orang, kredensial, data klinik atau data pemilik hewan.
- Pengujian juga **belum diizinkan** dalam mode CODE_ONLY. Tidak ada eksekusi CL/CI/tes/browser dan tidak ada klaim QA berhasil.

## 6. Keluaran GitHub dan QA
- [Register bukti](../drafts/m05-apel-evidence/evidence.mjs)
- [Catatan review](../drafts/m05-apel-evidence/review.mjs)
- [Gerbang kesiapan](../drafts/m05-apel-evidence/gates.mjs)
- [README](../drafts/m05-apel-evidence/README.md)
- [49 skenario QA tertulis](../drafts/m05-apel-evidence/tests/evidence.test.mjs), **0 dieksekusi**
- [Backlog QA](TEST_BACKLOG.md), [modul APEL](modules/02_APEL_PUSKESWAN.md), [PR #9](https://github.com/dvoriano/yandik-plus/pull/9)

## 7. Tahap berikutnya
**M05-9 (RENCANA):** *manual reconciliation decision register*, yaitu format tindak lanjut per konflik dan kebutuhan bukti untuk bahan pembahasan pengampu proses. Tetap DEMO-only; **tidak mengeksekusi tindakan perbaikan dan tidak menetapkan otorisasi**. Integrasi baru boleh direncanakan ulang setelah sumber/data dictionary dan izin eksplisit tersedia.
