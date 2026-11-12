# ROADMAP & PROGRES YANDIK+ | Sumber Status Utama

**Diperbarui:** 12 November 2026 (WIB)  
**Ruang lingkup:** pengembangan **langsung di GitHub**, tanpa VPS, perangkat lokal, atau deployment.  
**Mulai sesi baru:** [PROJECT_STATE.md](../PROJECT_STATE.md) → dokumen ini → [WORKLOG.md](WORKLOG.md) → [Issue #1](https://github.com/dvoriano/yandik-plus/issues/1).  
**Acuan:** [MASTERPLAN](MASTERPLAN.md) · [Indeks 15 modul](MODULES_INDEX.md) · [Riwayat perubahan](CHANGELOG_ROADMAP.md).

**MODE KERJA TERBARU:** [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md). Kode baru hanya ditulis di GitHub, **tanpa CL/CI/tes dulu**, dan semua pemeriksaan ditumpuk pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Bukti 176 tes lama hanya berlaku sampai M03-S3; tidak ada klaim tes M03-S4.

## Dokumen penjelasan untuk pembaca nonteknis (11 November 2026)

**Revisi Ringkasan Eksekutif 1.1:** [dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) sekarang menegaskan **AI Agent sebagai sarana bantu pengembangan YANDIK+**, dengan kebutuhan kredit/token/kuota pemakaian yang perlu ditelaah pembiayaan dan pengendaliannya. Bukan persetujuan belanja, penggunaan layanan AI operasional, atau bukti sistem selesai.

| Keluaran | Keterangan | Kedudukan |
|---|---|---|
| [Ringkasan Eksekutif](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) | Bahan paparan singkat tujuan, manfaat, fungsi, kendali dan pertanyaan kelembagaan | **DRAF, SIAP DIBACA / BELUM DITELAAH FORMAL** |
| [Pengenalan Lengkap YANDIK+](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/PENGENALAN_YANDIK_PLUS.md) | 15 modul, fitur/fungsi, sistem kerja, peran, alur, mutu data, keamanan, hubungan SPBE, tahapan dan FAQ | **DRAF, SIAP DIBACA / BELUM DITELAAH FORMAL** |

Pemeriksaan dan persetujuan substansi dicatat pada [Issue #21](https://github.com/dvoriano/yandik-plus/issues/21), **masih terbuka**.

Penyusunan dokumen ini **tidak mengubah status pengembangan modul**, tidak mengesahkan aturan prioritas/anggaran, tidak menjadi bukti pengujian kode baru, dan tidak menambah pengeluaran CL/CI. Pemeriksaan metadata GitHub 11 November 2026 menunjukkan repositori berstatus **PUBLIC**; pembaca tautan tidak harus diberi izin GitHub. Keterbukaan kode bukan persetujuan penggunaan atau publikasi data kedinasan.

## Arti status
- **SELESAI:** keluaran/commit dan bukti telah ada untuk ruang lingkup yang disebut; dokumentasi selesai tidak berarti modul terimplementasi.
- **SEDANG:** pekerjaan nyata sedang dilakukan; ada file/commit/issue yang dapat diperiksa.
- **BELUM DIUJI:** kode ditulis dan tersimpan di GitHub, tanpa eksekusi dan tanpa bukti lulus; tidak boleh dipindah ke SELESAI tanpa izin dan bukti QA.
- **RENCANA:** belum dikerjakan, termasuk usulan.
- **TERTUNDA:** menunggu sumber, keputusan atau dependensi tanpa menghalangi pekerjaan lain.
- **DIBATALKAN:** dikeluarkan dari scope aktif, dengan alasan tercatat di changelog.

## A. Selesai (dokumen dan persiapan, bukan fitur baru)
| ID | Pekerjaan | Bukti |
|---|---|---|
| DONE-01 | Pemetaan aplikasi Flask aktif melalui inspeksi read-only terdahulu | Catatan arsitektur di docs/ARCHITECTURE.md |
| DONE-02 | Snapshot source terpisah dan audit statis awal | Arsip sumber 168 file; paket pengembangan 171 file di percakapan, **bukan di repo** |
| DONE-03 | Setup repository (historis: tercatat private; terdeteksi PUBLIC 11 Nov 2026) + branch pengembangan + PR draft | `develop/yandik-foundation`, [PR #9](https://github.com/dvoriano/yandik-plus/pull/9) |
| DONE-04 | Masterplan, 15 spesifikasi modul dan katalog | docs/MASTERPLAN.md + docs/modules/* |
| DONE-05 | UX, workflow, batasan keamanan, changelog | docs/UX_PAPERLESS.md, WORKFLOW_ENGINE.md, CHANGELOG_ROADMAP.md |
| DONE-06 | Validator kode awal untuk impor dan panduan | scripts/verify_import.py, docs/IMPORT_OFFLINE.md; **belum mengimpor kode Flask** |
| DONE-07 | Sistem serah-terima lintas chat dan tata kerja GitHub-only | PROJECT_STATE.md, docs/WORKLOG.md, docs/GITHUB_WORKFLOW.md |
| DONE-08 | Kode kontrak dan fixture fiktif + tes otomatis | [commit 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6), [GitHub Actions: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) |
| DONE-09 | Prototype role/wilayah, workflow immutable dan 12 tes tambahan | [commit 9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac), [GitHub Actions: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867) |

| DONE-10 | Kontrak master data Puskeswan, SDM/penempatan, profil, sarpras + 18 tes tambahan | [kode](https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a), [tes](https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854), [GitHub Actions sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) |
| DONE-11 | Prototype perubahan Profil per bagian, review, 25 tes tambahan | [kode](https://github.com/dvoriano/yandik-plus/commit/ee9cceecfe4a61c315e6bef6a38f0e6c9b4e30e8), [tes](https://github.com/dvoriano/yandik-plus/commit/12007b6d8cc1c96011e0b521510b0adf6d600557), [Actions: SUCCESS, 65 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) |
| DONE-12 | M02-S2 Prototype UI HP Profil Saya + antrian verifikator, 20 tes model Node dan CI | [kode](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910), [GitHub Actions Python+Node SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) |
| DONE-13 | M02-S3 perbaikan draf + mode pimpinan, tes browser HP 320/375, peta domain Profiling | [perbaikan](https://github.com/dvoriano/yandik-plus/commit/0ce6b2db1ef0f9ca417eea072f1307c1ee94de30), [tes Chromium](https://github.com/dvoriano/yandik-plus/commit/78cf52a06d38874581a6709bf7b22b723704ed40), [CI SUCCESS: 96 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703), [peta domain](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) |
| DONE-14 | M02-S4 Permasalahan Puskeswan + kartu SDM/APEL baca-saja, 23 tes baru (20 Node + 3 Chromium) | [model](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95), [UI](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1), [Actions: 119 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101), [detail](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md) |
| DONE-15 | M03-S1 usulan Support dari masalah terverifikasi, 15 tes Node dan 3 tes Chromium baru | [model](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926), [UI](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7), [GitHub Actions 137 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) |
| DONE-16 | M03-S2 pemeriksaan metadata bukti, pencegahan duplikat per Puskeswan lintas masalah, 15 tes Node + 2 Chromium baru | [kode](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815), [UI](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1), [GitHub Actions SUCCESS 154 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527), [detail](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md) |
| DONE-17 | M03-S3 prioritas percobaan 5 faktor dan review provinsi, uji fairness dasar + stale review guard | [model](https://github.com/dvoriano/yandik-plus/commit/dfc49f323dc36f4526031fd370f93696a5658aae), [UI](https://github.com/dvoriano/yandik-plus/commit/7519ab003375041c46c2bfb7d18febe5beb1e897), [guard](https://github.com/dvoriano/yandik-plus/commit/87a14fd5d76a387e4b40792fd41c054795bd7b06), [CI 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270), [dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_PRIORITY_ASSESSMENT.md) |

## B. Sedang dikerjakan (kode/pekerjaan aktif)
| ID | Pekerjaan | Status tepat | Syarat selesai |
|---|---|---|---|
| M00 | Fondasi dan source pengembangan GitHub | **SEDANG**: kontrak, fixture dan CI teruji; Flask legacy 171 file belum masuk repo | Source legacy terimpor, dependensi/config anonim dan tes runtime/regresi APEL berhasil |
| M01 | Core Platform: role/wilayah dan workflow | **SEDANG**: role/workflow dan master Profil/SDM/Sarpras prototype; **40 tes foundation** lulus [GitHub Actions](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) | Role disepakati; endpoint legacy, transaksi audit dan pengujian akses API tersambung dan lulus |
| M02 | Profil Puskeswan terpadu | **SEDANG (prototype interaktif)**: form per bagian, Masalah→tindak lanjut, SDM/APEL baca-saja dummy; **65 Python + 45 Node + 9 Chromium = 119 tes** [Actions SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101) | Uji UX dan aksesibilitas pada HP nyata, field Profiling lama, otorisasi/API/DB server, integrasi sumber asli |
| M03 | Support Puskeswan: kebutuhan dan prioritas | **SEDANG**: M03-S1..S3 prototype teruji sebelumnya [176 tes lama](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270); **M03-S4A/S4B/S4C kode draft BELUM DIUJI**, [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) | Pending test [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); evaluasi fairness, bobot kebijakan, source real/Flask, keamanan backend, uji petugas; tidak ada alokasi otomatis |
| M04-S1 | Support: berkas administrasi sebelum keputusan resmi | **SEDANG (kode draft) / BELUM DIUJI**: [enam berkas simulasi](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review) dari kebutuhan terverifikasi DEMO; pemeriksaan lima kelengkapan dan pencatatan bahan pertimbangan tanpa keputusan. [Commit](https://github.com/dvoriano/yandik-plus/commit/9051571aeee25a2611850aa43406aceb6fe66a04) | [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md), sumber M03 asli, otorisasi dan aturan administrasi belum divalidasi; **bukan persetujuan bantuan** |
| M04-S2 | Register referensi keputusan/dokumen eksternal | **SEDANG (kode draft), BELUM DIUJI**: metadata dari dokumen yang diklaim terbit di luar sistem, pemeriksaan fiktif oleh dua peran, anti-duplikat, histori dan sumber usang [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference) | [Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md), [QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); bukan autentikasi keaslian, penerbitan SK atau persetujuan bantuan |
| M04-S3 | Support: penugasan tindak lanjut administratif | **SEDANG (kode draft), BELUM DIUJI**: tugas dengan penanggung jawab DEMO, tenggat contoh, catatan, telaah/revisi dan histori; [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup) | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); penutupan catatan **bukan** konfirmasi surat/bantuan/anggaran |
| M04-S4 | Dashboard antrean tindak lanjut administratif | **SEDANG (kode draft), BELUM DIUJI**: [rekap dan filter baca-saja](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard) berdasar tugas DEMO M04-S3; tanggal acuan eksplisit, perhatian, perbaikan dan status sumber | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md), [QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); bukan dashboard bantuan/anggaran atau konfirmasi surat resmi |
| M04-S5 | Kendala dan eskalasi administratif lintas petugas | **SEDANG (kode draft), BELUM DIUJI**: [pelaporan, penerusan, tanggapan dan telaah DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations) terhubung pada tugas M04-S3 simulasi, dengan catatan riwayat | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md); [QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); tidak menerbitkan perintah dinas, memverifikasi surat atau menyetujui bantuan |
| M04-S6 | Matriks arah eskalasi dan tanggung jawab DEMO | **SEDANG (kode draft), BELUM DIUJI**: [rute 5×3 dan catatan pilihan beralasan](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix) dari M04-S5, telaah terpisah tanpa meneruskan otomatis | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S6_ROUTING_MATRIX.md), [QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); **bukan SOP, disposisi, atau persetujuan bantuan** |
| M04-S7 | Katalog unit DEMO, matriks RACI, draf aturan koordinasi | **SEDANG (kode draft) / BELUM DIUJI**: [empat unit dan enam aktivitas RACI](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-unit-catalog), catatan SOP berbasis rute M04-S6 ditelaah DEMO tanpa pengesahan | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S7_UNIT_CATALOG_RACI.md), [QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); **bukan SOP/disposisi resmi**, tidak ada keputusan bantuan |
| M04-S8 | Persyaratan SOP dan tata kelola katalog | **SEDANG (kode draft), BELUM DIUJI**: [12 unsur dan perubahan unit DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance), telaah terpisah, histori revisi, tidak menerapkan perubahan | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S8_SOP_GOVERNANCE.md) · [QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); bukan SOP resmi/bantuan/anggaran |
| M04-S9 | Register tindak lanjut pembahasan kelembagaan | **SEDANG (kode draft), BELUM DIUJI**: [register temuan, penanggung jawab, tenggat, progres dan histori](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup) dari telaah M04-S8 DEMO | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9_INSTITUTIONAL_FOLLOWUP.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); penutupan catatan **bukan** izin integrasi |
| M04-S9N | Register pertanyaan yang belum terjawab DEMO | **SEDANG (kode draft), BELUM DIUJI:** [pertanyaan per fungsi dari 18 butir M04-S9M](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-open-question-register) dengan bukti diminta, rujukan asal dan filter catatan kekurangan | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9N_OPEN_QUESTIONS.md), QA tertunda; tanpa jawaban atau keputusan resmi |
| M04-S9M | Paket bahan serah-terima untuk telaah manusia DEMO | **SEDANG (kode draft), BELUM DIUJI:** [6 paket fungsi/18 butir dengan pertanyaan terbuka dan permintaan bukti](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-human-review-handoff); tidak ada pengiriman, rapat atau keputusan | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9M_HUMAN_REVIEW_HANDOFF.md), QA tertunda; bukan surat, penugasan atau izin integrasi |
| M04-S9L | Rekap lintas fungsi usulan dan kekurangan bukti DEMO | **SEDANG (kode draft), BELUM DIUJI:** [matriks 6 fungsi/18 butir dan ketergantungan lintas fungsi](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-cross-function-recap), 3 usulan & 3 kekurangan fiktif | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9L_CROSS_FUNCTION_RECAP.md), QA tertunda; bukan hasil audit, penugasan atau izin integrasi |
| M04-S9K | Register usulan tindak lanjut berbasis catatan DEMO | **SEDANG (kode draft), BELUM DIUJI:** [18 baris register dan 3 contoh usulan fiktif](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-proposed-followups); semua status tugas/keputusan resmi tetap nol | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9K_PROPOSED_FOLLOWUPS.md), QA tertunda; bukan penugasan, keputusan atau izin integrasi |
| M04-S9J | Lembar catatan pembahasan contoh per fungsi | **SEDANG (kode draft), BELUM DIUJI:** [18 lembar masukan/bukti/tindak lanjut DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-discussion-confirmation) dengan histori revisi di memori halaman, tanpa keputusan | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9J_DISCUSSION_CONFIRMATION.md), QA tertunda; bukan notulen, berita acara atau persetujuan resmi |
| M04-S9I | Agenda telaah per fungsi dan pertanyaan konfirmasi DEMO | **SEDANG (kode draft), BELUM DIUJI:** [enam paket fungsi, 18 butir dan pertanyaan](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-function-review-agendas) dari M04-S9H; semua undangan/keputusan belum ada | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9I_FUNCTION_REVIEW_AGENDAS.md), QA tertunda, bukan undangan atau penugasan resmi |
| M04-S9H | Konsolidasi hambatan dan kebutuhan bukti telaah DEMO | **SEDANG (kode draft), BELUM DIUJI**: [18 butir bahan telaah](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-blocker-triage) dengan pengampu/penelaah usulan, pendahulu dan filter perhatian | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9H_BLOCKER_TRIAGE.md), QA tertunda; tanpa pengesahan, persetujuan QA/deploy |
| M04-S9G | Matriks ketergantungan hambatan integrasi DEMO | **SEDANG (kode draft), BELUM DIUJI:** [peta 18 prasyarat dan urutan pendahulu](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-dependency-matrix) dari M04-S9F; fase P0–P3 tetap tidak dieksekusi | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9G_DEPENDENCY_PLAN.md), QA tertunda; bukan izin tes/deploy, SOP, atau keputusan bantuan |
| M04-S9F | Checklist prasyarat integrasi lintas modul | **SEDANG (kode draft), BELUM DIUJI**: [18 prasyarat dan 4 gelombang QA](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-preintegration-checklist) berdasarkan papan M04-S9E DEMO; tidak ada status lulus atau tombol approval | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9F_CROSS_MODULE_READINESS.md), QA tertunda dan keputusan kelembagaan, keamanan, SPBE tetap terbuka |
| M04-S9E | Peta perhatian tindak lanjut kelembagaan DEMO | **SEDANG (kode draft), BELUM DIUJI**: [papan baca-saja](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-oversight) menyatukan seluruh agenda M04-S9C dan catatan M04-S9D; memperlihatkan catatan kosong, batal, lewat tenggat contoh, revisi/telaah, sumber berubah | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9E_OVERSIGHT_BOARD.md), QA tertunda; bukan keputusan kelembagaan/izin integrasi |
| M04-S9D | Register catatan pembahasan DEMO | **SEDANG (kode draft), BELUM DIUJI**: [catatan/bukti/tindak lanjut dan histori](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-minutes) dari agenda M04-S9C, penelaah berbeda, source stale | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9D_DISCUSSION_NOTES.md); QA tertunda; bukan berita acara/SOP/izin integrasi |
| M04-S9C | Agenda telaah kelembagaan, akses repository dan kebutuhan bukti | **SEDANG (kode draft), BELUM DIUJI**: [agenda keputusan manusia](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-review) dari sumber DEMO M04-S9B dan snapshot repo PUBLIC; 10 unsur wajib, usulan katalog, risiko akses dan QA | [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9C_INSTITUTIONAL_REVIEW.md), [kajian akses](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/REPOSITORY_ACCESS_DECISION.md); tanpa penetapan resmi/QA/deploy |
| M04-S9B | Rekap eksekutif pembahasan kelembagaan | **SEDANG (kode draft), BELUM DIUJI**: [model dan tampilan baca-saja DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-briefing) menggabungkan 12 unsur M04-S8 dengan temuan, penanggung jawab, rencana, status dan usulan katalog M04-S9 | [Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_EXECUTIVE_BRIEFING.md); QA tertunda; tidak membuat keputusan SOP/anggaran atau izin integrasi |

### M04-S9N: register pertanyaan belum terjawab DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI baca-saja dan 12 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-open-question-register) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/997c329930940658e754070fac3b51ff89979b56) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/85fbf1384e50462ccd7658b2449daa90a0018b6f). **Belum diuji**, tanpa CL/CI.
- [x] Pertanyaan dari M04-S9M diuraikan per butir dan fungsi usulan (6 fungsi/18 butir), masing-masing ber-ID DEMO, rujukan revisi sumber, permintaan bukti dan dependensi.
- [x] Filter kolom kekurangan bukti tertulis vs belum diisi, tanpa mengartikan yang kosong sebagai bukti lengkap. [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9N_OPEN_QUESTIONS.md) dan QA-M04S9N dicatat.
- [ ] Penelaahan manusia, jawaban resmi, verifikasi bukti, penunjukan pengampu, tes regresi/HP/keamanan dan izin QA/deploy tetap BELUM DILAKUKAN.
- [ ] Repo PUBLIC per 12 Nov; pengingat untuk PRIVATE Sabtu 14 Nov aktif tetapi perubahan belum dilaksanakan.
- [ ] M04-S10+ bantuan, pengadaan, anggaran, penyaluran dan BAST tetap RENCANA. Tidak ada deployment atau perubahan produksi.

### M04-S9M: paket bahan telaah manusia per fungsi (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI baca-saja, 12 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-human-review-handoff) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/d433a03010daa9b6fe43dcbb23b3f125db2b4f91) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/d01d915c031a09ef85bbc41edd668bef39e1de4d). **BELUM DIUJI**, tanpa CL/CI.
- [x] Ringkasan M04-S9L dan pertanyaan M04-S9I dikonsolidasikan menjadi enam paket fungsi, 18 butir beserta bahan bukti diminta, ketergantungan dan pertanyaan terbuka.
- [x] [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9M_HUMAN_REVIEW_HANDOFF.md) dan QA-M04S9M masuk TEST_BACKLOG.
- [ ] Bukti dan jawaban riil tidak diperiksa; belum ada handoff/undangan resmi, penunjukan penelaah, rapat, keputusan atau izin QA/deploy. Tes impor, HP, aksesibilitas, keamanan masih **BELUM DIUJI**.
- [ ] Repo masih PUBLIC per metadata 12 Nov 2026. Pengingat ubah PRIVATE Sabtu 14 Nov aktif, perubahan belum dilakukan.
- [ ] M04-S10+ keputusan bantuan, anggaran, pengadaan, penyaluran dan BAST tetap RENCANA, tanpa perubahan website produksi.

### M04-S9L: rekap lintas fungsi dan kekurangan bahan DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI baca-saja, dan 12 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-cross-function-recap) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/68b056363aa302898baf75fd604c6fe9d5618023) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/dfb9ee472b4916bf15b0c0d206869164640acfd1). Seluruhnya **BELUM DIUJI**.
- [x] Pemetaan 18 butir M04-S9K menjadi rekap enam fungsi, teks usulan dan kekurangan bukti yang **benar-benar terisi dalam fixture DEMO**, serta pendahulu antar-fungsi.
- [x] [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9L_CROSS_FUNCTION_RECAP.md) dan QA-M04S9L masuk TEST_BACKLOG.
- [ ] Evaluasi bukti riil, penelaah/pejabat, QA teknis, HP, keamanan dan regresi tetap BELUM DIUJI/BUTUH KEPUTUSAN. Kolom kosong tidak berarti lengkap atau selesai.
- [ ] Repo PUBLIC 12 Nov. Perubahan ke PRIVATE Sabtu 14 Nov sudah diingatkan dan belum dilaksanakan; semua kode DEMO nonrahasia.
- [ ] M04-S10+ bantuan, anggaran, pengadaan, distribusi dan BAST masih RENCANA; tidak ada CL, CI, tes atau deployment.

### M04-S9K: register usulan tindak lanjut DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI baca-saja dan 12 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-proposed-followups) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/06f820acf7b9d30d6207486b126884c020628487) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/c988033abf186eeb5b73b2de59168960d69bef2e). Semua **BELUM DIUJI**.
- [x] 18 butir M04-S9J direferensikan sebagai register usulan: 3 contoh sintetis pada GOV-01, SEC-01, DAT-01; 15 butir belum memiliki usulan contoh. Tanpa menyimpulkan status nyata.
- [x] [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9K_PROPOSED_FOLLOWUPS.md) dan QA-M04S9K masuk TEST_BACKLOG.
- [ ] Belum ada tugas, verifikasi, penetapan penanggung jawab, tenggat, keputusan kelembagaan, izin QA atau deploy. Tes impor/HP/keamanan tetap BELUM DIUJI.
- [ ] Repo PUBLIC per pemeriksaan 12 Nov. Rencana ubah PRIVATE Sabtu 14 Nov dengan pengingat aktif, belum dilakukan; kode hanya data DEMO.
- [ ] M04-S10+ keputusan bantuan, anggaran, pengadaan, distribusi dan BAST masih RENCANA, tidak dibuat otomatis dari register.

### M04-S9J: lembar catatan pembahasan per fungsi DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Model, UI dan 12 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-discussion-confirmation) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/dda23595beba7936a716490e9c0ccfbeb2fe7cc6) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/82db145f0266517fdb310f7f51a3ea3d6f23cda7). **BELUM DIUJI**, tidak ada test runner atau CI.
- [x] Per fungsi dan butir M04-S9I: masukan DEMO, kekurangan bukti DEMO, usulan tindak lanjut DEMO. Histori revisi hanya untuk pengembangan contoh di memori halaman.
- [x] [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9J_DISCUSSION_CONFIRMATION.md) serta QA-M04S9J ditambahkan ke TEST_BACKLOG.
- [ ] Pengujian impor, validasi sumber, batas kolom, histori, keamanan input, HP/aksesibilitas dan reset **BELUM DIUJI**. Tidak ada hasil rapat, notulen resmi, keputusan, penugasan atau izin QA/deploy.
- [ ] Repo masih PUBLIC menurut metadata 12 November. Rencana ubah PRIVATE Sabtu 14 November (pengingat aktif) belum dilakukan. Semua fixture dan catatan hanya DEMO.
- [ ] M04-S10+ bantuan, pengadaan, anggaran, distribusi dan BAST tetap RENCANA; branch main dan produksi tidak disentuh.

### M04-S9I: agenda telaah menurut fungsi pengampu DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI baca-saja dan 11 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-function-review-agendas) di [commit model](https://github.com/dvoriano/yandik-plus/commit/dc7675ce7130813c770fa1e732f5a0364a86bdaa) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/da76b445ad2ca4f03655a8d9983bebc2fe9d6e48). Semua **BELUM DIUJI**.
- [x] 18 butir M04-S9H menjadi enam agenda menurut fungsi kelembagaan, keamanan, data, alur Support, QA dan integrasi. Tiap butir punya pertanyaan konfirmasi, kebutuhan bukti, rujukan pendahulu serta pengampu/penelaah **usulan**.
- [x] [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9I_FUNCTION_REVIEW_AGENDAS.md) serta QA-M04S9I telah dicatat di TEST_BACKLOG.
- [ ] Tidak ada pertemuan terlaksana, undangan dikirim, berita acara resmi, konfirmasi penelaah, keputusan, izin tes atau deployment. QA tetap BELUM DIUJI.
- [ ] Repository PUBLIC per metadata 12 Nov; rencana ubah PRIVATE Sabtu 14 Nov dengan pengingat aktif tetapi belum dilakukan. Tidak menyimpan data kedinasan asli.
- [ ] M04-S10+ keputusan bantuan, pengadaan, anggaran, distribusi dan BAST tetap RENCANA. Tanpa CL/CI/tes/deploy.

### M04-S9H: paket telaah hambatan dan kebutuhan bukti (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI serta 11 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-blocker-triage) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/5f62897756ae204df31f4aac2247946a50fd43dd) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/0d775de0f6188f9105473bca0d3412ab387cbee7); semuanya **BELUM DIUJI**.
- [x] Seluruh 18 butir M04-S9G tampil dengan bukti perlu disiapkan, pengampu/penelaah usulan, status perhatian dan ketergantungan. Tidak ada keputusan, penetapan petugas atau penilaian kelulusan.
- [x] [Spesifikasi M04-S9H](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9H_BLOCKER_TRIAGE.md) dan QA-M04S9H ditambahkan.
- [ ] Pemeriksaan riil, keamanan, SOP/SPBE, telaah pengampu, QA lintas modul, tes HP dan audit **BELUM DIUJI / BUTUH KEPUTUSAN**.
- [ ] Repo masih PUBLIC per 12 Nov; rencana PRIVATE Sabtu 14 Nov belum dieksekusi. Pengingat telah terjadwal.
- [ ] M04-S10+ keputusan sah, pengadaan, anggaran, penyaluran dan BAST tetap RENCANA; tanpa CL, CI, tes, deploy.

### M04-S9G: matriks ketergantungan dan urutan hambatan (KODE DITULIS / BELUM DIUJI)
- [x] [Model, antarmuka baca-saja dan 11 skenario tes tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-dependency-matrix) pada [commit model](https://github.com/dvoriano/yandik-plus/commit/427320fe50ca2e8a349d3acc080771e5bfc2bf4c) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/17bfabee99d769ee8c91f79c35b2c1c2e3d16b12). **Tidak ada pengujian.**
- [x] 18 prasyarat M04-S9F dipetakan ke pendahulu konseptual, fase P0–P3, urutan topologis dan hitungan dependensi lanjutan. Tanpa penilaian durasi, bobot anggaran, izin pengujian atau kelayakan otomatis.
- [x] [Dokumen spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9G_DEPENDENCY_PLAN.md) serta QA-M04S9G dimasukkan ke TEST_BACKLOG.
- [ ] Pengujian sintaks, impor, ketepatan dependensi, ketahanan siklus, UI HP, keamanan dan aksesibilitas **BELUM DIUJI**. Pemetaan resmi kelembagaan, SPBE, kewenangan dan retensi tetap memerlukan keputusan manusia.
- [ ] GitHub masih PUBLIC 12 Nov. Rencana owner menjadikannya PRIVATE Sabtu 14 Nov (pengingat aktif), **belum dilaksanakan**.
- [ ] M04-S10+ keputusan bantuan sah, anggaran, pengadaan, distribusi dan BAST tetap RENCANA; tanpa CL/CI/tes/deploy.

### M04-S9F: prasyarat integrasi lintas modul (KODE DITULIS / BELUM DIUJI)
- [x] [Kode dan 10 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-preintegration-checklist) dalam [commit model](https://github.com/dvoriano/yandik-plus/commit/40533bfb0afa58a0598cfa473998e283a9c6c492) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/d480cbf3c18c474f037ef022ecd2fff942a2d511), **tidak dijalankan**.
- [x] 18 kebutuhan bukti lintas kelembagaan, keamanan, Profil/SDM/APEL, Support M03/M04, QA dan operasional. Empat tahapan QA P0-P3 sebagai rencana, semuanya BELUM DIMULAI.
- [x] [Dokumen M04-S9F](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9F_CROSS_MODULE_READINESS.md) dan daftar QA-M04S9F ditambahkan ke TEST_BACKLOG.
- [ ] Bukti resmi/telaah instansi, verifikasi kode, QA akses/keamanan/HP, audit dan rollback **BELUM DIUJI/DISETUJUI**; tidak boleh menyimpulkan siap integrasi.
- [ ] Repo masih PUBLIC; Sabtu 14 November rencana perubahan ke PRIVATE (pengingat aktif), belum dieksekusi. Kode tetap DEMO.
- [ ] M04-S10+ keputusan bantuan, anggaran, pengadaan, distribusi dan BAST tetap RENCANA dan tunduk kewenangan resmi.

### M04-S9E: peta perhatian tindak lanjut kelembagaan (KODE DITULIS / BELUM DIUJI)
- [x] [Model, fixture, UI responsif dan 9 skenario tes](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-oversight) tersimpan pada [commit model](https://github.com/dvoriano/yandik-plus/commit/561ccc970edde3abc9dc80e2d64149ba9277892d) dan [commit UI](https://github.com/dvoriano/yandik-plus/commit/7c2aeb5e43373d7928e70c7adb89d76860fa3255). Semua **BELUM DIUJI**.
- [x] Menampilkan seluruh agenda, belum ada catatan, catatan batal, terlambat DEMO, draf, menunggu/perlu perbaikan serta sumber berubah; ringkasan baca-saja tanpa keputusan resmi.
- [x] [Dokumen rancangan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9E_OVERSIGHT_BOARD.md) dan QA-M04S9E dicatat pada TEST_BACKLOG.
- [ ] Pengujian impor, sintaks, tampilan HP, angka, edge cases, keamanan dan aksesibilitas **BELUM DIUJI** karena mode CODE_ONLY.
- [ ] Pemilik mengubah repo ke private pada Sabtu 14 November 2026 (pengingat aktif, perubahan **belum dilakukan**); review keamanan/tata kelola dan SPBE tetap terbuka.
- [ ] M04-S10+ keputusan bantuan sah, anggaran, paket, penyaluran dan BAST masih RENCANA, tidak digerakkan oleh dashboard DEMO.

### M04-S9D: catatan pembahasan kelembagaan DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Model dan UI draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-minutes) beserta 8 skenario tes yang hanya ditulis, **tidak dijalankan**. [Commit](https://github.com/dvoriano/yandik-plus/commit/3f413a06d7a5de953ea70d95e19df9be6c3f00b6); [spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9D_DISCUSSION_NOTES.md).
- [x] Agenda M04-S9C dihubungkan ke satu catatan DEMO per butir, kebutuhan bukti, penanggung jawab, tanggal rencana, pembacaan terpisah, revisi dan deteksi sumber berubah sebagai rancangan.
- [ ] QA impor/status/histori/stale sumber/HP/keamanan **BELUM DIUJI**, autentikasi/API/DB dan tata naskah belum ada. Tidak ada klaim keputusan resmi.
- [ ] Repository masih PUBLIC saat diperiksa 11 November; rencana pemilik mengubahnya ke PRIVATE pada **Sabtu 14 November 2026**, **belum dilakukan**, tanpa perubahan otomatis. Tetap kosong dari data sensitif.
- [ ] M04-S10+ bantuan resmi, alokasi, pengadaan, distribusi, BAST tetap RENCANA; tanpa CL/CI/tes/deploy.

### M04-S9C: agenda telaah kelembagaan dan perlindungan informasi (KODE DITULIS / BELUM DIUJI)
- [x] [Tujuh berkas M04-S9C](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-review) dan [commit](https://github.com/dvoriano/yandik-plus/commit/f36d5cc2af45543e416e8b2cb58b4d1ad3bb9bfb) mencatat agenda pemeriksaan 10 unsur wajib M04-S8, usulan katalog, pengampu usulan, bukti yang perlu disiapkan, snapshot akses repository dan QA tertunda.
- [x] Tujuh skenario tes ditulis tetapi **BELUM DIJALANKAN**. [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9C_INSTITUTIONAL_REVIEW.md) dan [kajian akses](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/REPOSITORY_ACCESS_DECISION.md) tersedia.
- [ ] Keputusan pemilik mengenai visibilitas repo dan klasifikasi isi masih terbuka; metadata PUBLIC pada 11 November 2026 tidak diubah oleh kode.
- [ ] Pengujian, telaah nyata kelembagaan, SPBE, SOP dan keamanan belum dilakukan. Integrasi/keputusan bantuan M04-S10+ tetap RENCANA. Tanpa CL, CI atau deploy.

### Catatan audit statis M04-S9B / akses GitHub (11 Nov 2026)
- [x] [Catatan pembacaan statis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_STATIC_REVIEW.md): status repo PUBLIC terdeteksi, klaim private di dokumen diperbarui. Tidak ada pengujian atau deploy.
- [ ] Keputusan pemilik mengenai visibilitas repo dan klasifikasi isi, pembuktian kode, SOP, SPBE, akses dan audit sebelum integrasi riil masih terbuka.

### M04-S9B: rekap eksekutif kelembagaan (KODE DITULIS / BELUM DIUJI)
- [x] [Tujuh berkas rancangan](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-briefing) serta [spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_EXECUTIVE_BRIEFING.md) untuk laporan baca-saja dari M04-S8/M04-S9 fiktif. [Commit](https://github.com/dvoriano/yandik-plus/commit/96e091411249c46f444d19cd4f62694bf36458fc).
- [x] Cakupan 12 unsur, kekurangan wajib tanpa penugasan aktif DEMO, penanggung jawab, rencana koreksi, tenggat, sumber berubah, katalog dan pertanyaan keputusan manusia dirancang dalam kode.
- [ ] **BELUM DIUJI:** impor, validasi, hitungan, hubungan sumber, tampilan HP, aksesibilitas, keamanan, status sumber berubah dan kejelasan kewenangan.
- [ ] Semua keluaran DEMO tetap bukan kelayakan integrasi, SOP sah, perubahan unit efektif atau persetujuan bantuan. M04-S10+ RENCANA. Tanpa CL/CI/tes/deploy.

### M04-S9: register tindak lanjut kelembagaan (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup) untuk temuan dari checklist M04-S8, usulan katalog serta topik pembahasan DEMO, dengan rencana perbaikan, penanggung jawab, tenggat, progres, telaah dan riwayat. [Commit](https://github.com/dvoriano/yandik-plus/commit/1f3a4f47118e8fb6c3c1ccb2fe143fc9bb9eab65).
- [x] Kode rujukan topik DEMO dapat diisi sesuai kebutuhan, tidak dibatasi dua opsi tetap. [Revisi](https://github.com/dvoriano/yandik-plus/commit/d1624a7dcab447a88b9768065891590ee651a9db).
- [x] [Spesifikasi M04-S9](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9_INSTITUTIONAL_FOLLOWUP.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] **BELUM DIUJI:** impor, validasi, keamanan, tugas peran, stale source, form HP, perhitungan ringkasan dan aksesibilitas.
- [ ] Penutupan semua catatan bukan sertifikat siap integrasi; keputusan bantuan resmi, anggaran, pengadaan dan BAST M04-S10+ tetap **RENCANA**.

### M04-S8: kesiapan SOP dan perubahan unit (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance): checklist 12 persyaratan, perubahan unit tambah/ubah/nonaktif, alasan dan dampak M04-S6/M04-S7 serta rollback. [Commit](https://github.com/dvoriano/yandik-plus/commit/aa6b8949b20094df481bd06b64504cfa6cff27a8) · [revisi](https://github.com/dvoriano/yandik-plus/commit/8a510f46f7a428f78df6d0a18d1f4d95165da10a).
- [x] Dua jalur telaah konseptual, riwayat perubahan dan [dokumen proses](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S8_SOP_GOVERNANCE.md).
- [ ] Seluruh QA di [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) **BELUM DIUJI**, belum ada SOP/struktur resmi atau implementasi perubahan katalog.
- [ ] M04-S10+ keputusan bantuan, anggaran, paket, distribusi dan BAST tetap RENCANA.

### M04-S7: katalog unit, RACI dan aturan koordinasi (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas kode draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-unit-catalog) untuk katalog empat unit DEMO, enam aktivitas RACI, naskah koordinasi dari catatan M04-S6 dan telaah oleh peran lain. [Commit](https://github.com/dvoriano/yandik-plus/commit/64493b20e5abb3078f15f5abd48ffab3c77902eb).
- [x] [Dokumen batas kewenangan dan proses M04-S7](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S7_UNIT_CATALOG_RACI.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Sintaks/impor, kecocokan unit, aturan RACI, kontrol versi, form, keamanan dan aksesibilitas **BELUM DIUJI**.
- [ ] Penetapan SOP, struktur resmi, autentikasi, anggaran dan keputusan bantuan belum tersedia; proses bantuan M04-S10+ RENCANA.

### M04-S6: matriks alur eskalasi dan penanggung jawab (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas draft M04-S6](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix): matriks 5 kategori × 3 urgensi, saran unit tujuan DEMO, alasan koordinator, telaah peran terpisah, histori dan teks baca-saja. [Commit](https://github.com/dvoriano/yandik-plus/commit/0456b4307d982fa04c7891d9e1ee0c5a36b21b84).
- [x] [Dokumen batas proses dan tanggung jawab](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S6_ROUTING_MATRIX.md) serta [backlog pemeriksaan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] **BELUM DIUJI:** kode, impor lintas modul, form, status, stale guard, keamanan, HP dan aksesibilitas.
- [ ] Tidak ada penerusan otomatis, persetujuan, disposisi dinas atau klaim struktur resmi; M04-S10+ keputusan/paket/pengadaan/distribusi/BAST **RENCANA**.

### M04-S5: Kendala dan eskalasi administratif (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations) untuk kategori kendala, urgensi, pelaporan, penerusan ke petugas/unit tujuan DEMO, tanggapan, review terpisah, klarifikasi, pembatalan dan histori.
- [x] Deteksi sumber M04-S3 berubah, pencegahan kendala aktif sejenis ganda pada tugas yang sama, dan rekap antrean simulasi. [Commit](https://github.com/dvoriano/yandik-plus/commit/3db79c4b0199fa635597d2caffde21ad3ca9838e).
- [x] [Dokumen proses M04-S5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md) dan [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Kode, UI, validasi dan akses nyata **BELUM DIUJI**; tidak ada notifikasi/disposisi/surat dinas otomatis.
- [ ] **M04-S10+ RENCANA:** keputusan pejabat, anggaran, pengadaan, paket, distribusi, BAST dan evaluasi melalui prosedur berwenang.

### M04-S4: Dashboard antrean administrasi (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard) berisi rekap tugas, perhatian, tanggal acuan manual, filter, daftar urutan dan teks rekap baca-saja menggunakan data fiktif. [Commit](https://github.com/dvoriano/yandik-plus/commit/a2bcc8ef931c0c0363bb92efd0d2d75671d447ef).
- [x] [Spesifikasi indikator, sumber dan batas kewenangan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md) dan [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Semua perhitungan, impor, skenario sumber stale, UI HP, aksesibilitas dan integrasi **BELUM DIUJI**.
- [ ] M04-S10+ keputusan pejabat, pengadaan, paket, distribusi dan BAST **RENCANA**, tidak boleh dianggap disetujui.

### M04-S3: tindak lanjut administratif DEMO (KODE DITULIS / BELUM DIUJI)
- [x] [Enam berkas rancangan](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup) untuk tugas, penanggung jawab dan tenggat fiktif, status, catatan, pengembalian/telaah, pembatalan dan histori.
- [x] Anti-duplikat jenis tugas untuk satu referensi aktif dan deteksi perubahan sumber M04-S2. [Commit kode](https://github.com/dvoriano/yandik-plus/commit/805a052a11a7ceddeb5efdf382d209b344f03825), [perbaikan kontrol](https://github.com/dvoriano/yandik-plus/commit/b4041ee90d70dd3505591531f508ba0ce8d01d54).
- [x] [Spesifikasi M04-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md) dan [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] **BELUM DIUJI:** sintaks, interaksi, impor antar modul, status, ketepatan hasil, keamanan, HP dan aksesibilitas.
- [ ] **M04-S4+ RENCANA:** segala keputusan pejabat/anggaran, pengadaan, distribusi, serah terima/BAST dan evaluasi.
- **Penutupan catatan kerja tidak berarti dokumen resmi sah atau bantuan disetujui.**

### M04-S2: Register referensi eksternal (KODE DITULIS / BELUM DIUJI)
- [x] Enam [berkas kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference) dengan data kebutuhan/berkas M04-S1 fiktif, referensi dokumen eksternal, tahap telaah metadata dan daftar multi-entri.
- [x] [Dokumen prosedur dan pembatasan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md), [commit model](https://github.com/dvoriano/yandik-plus/commit/edcc66dfd03ffba302ff7e88422a32d6b61a79ef), [commit UI](https://github.com/dvoriano/yandik-plus/commit/7b177e2de92ec380971006a3f3497d775e4682b8).
- [ ] Semua tes, penelusuran ke penerbit asli, pemeriksaan hukum, peran resmi dan API/DB **BELUM DIUJI/TERSEDIA**.
- [ ] Metadata tercatat **bukan** bukti keputusan sah, bantuan disetujui atau anggaran tersedia.
- [ ] M04-S3+ paket, penyaluran, BAST dan evaluasi tetap RENCANA.

### M04-S1: Berkas pertimbangan administrasi (KODE DITULIS / BELUM DIUJI)
- [x] Rancangan fungsi [draf administrasi](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review), lima checklist, pengajuan, pengembalian, riwayat dan teks pertimbangan dari data fiktif.
- [x] [Dokumen proses bisnis M04-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md); [commit kode](https://github.com/dvoriano/yandik-plus/commit/9051571aeee25a2611850aa43406aceb6fe66a04).
- [ ] Semua QA dan uji browser, validasi lintas modul, kebijakan dan autentikasi resmi **BELUM DIUJI**.
- [ ] **M04-S2 dan seterusnya RENCANA:** pencatatan keputusan dari sistem/pejabat berwenang, rencana paket, distribusi, BAST, evaluasi.
- **Tidak ada penerbitan SK, keputusan alokasi, nominal belanja, pembelian, atau BAST secara otomatis.**

### M03-S4C: Bahan penyusunan berita acara telaah (KODE DITULIS / BELUM DIUJI)
- [x] **Kode draft:** [generator teks dan form simulasi](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) serta [commit](https://github.com/dvoriano/yandik-plus/commit/93a0d7df9e446af1db4f350ac47b34c56faf1c79). Memuat alasan, skor fiktif, catatan penelaah, histori rekomendasi dan revisi, serta tindak lanjut.
- [x] **Dokumentasi:** [spec M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md) dan [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] **Belum diuji:** impor JS, validasi isi, status review, histori, HTML, keyboard/HP dan pengamanan teks.
- [ ] **Belum ada BA resmi:** nomor, tanggal yang dibuktikan, peserta resmi, tanda tangan, arsip SRIKANDI dan pengesahan tetap menjadi urusan pejabat/sistem berwenang.
- [ ] **M04 tetap RENCANA:** keputusan penerima bantuan, anggaran, pengadaan, distribusi dan BAST tidak dibuat oleh kode ini.

### M03-S4B: Alur telaah metodologi, KODE DITULIS / BELUM DIUJI
- [x] **Kode tersedia:** [review_ledger.mjs dan form review](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) berisi draf, pengajuan, permintaan perbaikan, pencatatan untuk pembahasan, dan penolakan metodologis. [commit](https://github.com/dvoriano/yandik-plus/commit/bfa697af515479ec05735badcde4c89222e8c5d8).
- [x] **Dokumentasi:** [alur dan batas kewenangan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md) serta [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] **Semua pemeriksaan ditunda:** logika status, validasi, revisi, tampilan, perlindungan sumber dan akses riil **BELUM DIUJI**.
- [ ] Tidak ada pengesahan bobot, pemilihan penerima, alokasi, pengadaan atau BAST. Mode tanpa CL/CI masih berlaku.

### M03-S4: Draft baru, sengaja BELUM DIUJI
- [x] **KODE ADA:** draft modul komparasi enam skenario anonim fiktif, tiga profil bobot dan indikator sensitivitas; [commit](https://github.com/dvoriano/yandik-plus/commit/3e30ac406a24ec17ee604b654251c7b3eb1cee7c).
- [x] **DOKUMEN ADA:** [rencana](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md), [backlog semua pemeriksaan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md), [mode tanpa CL/CI](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- [ ] **QA/tes kode:** TIDAK dijalankan atas instruksi pemilik. Syntax, perhitungan, browser HP dan integrasi masih **BELUM DIUJI**.
- [ ] **Keputusan kebijakan:** bobot dan batas skor belum disetujui; tidak boleh menjadi keputusan dukungan/anggaran.
- [ ] **Integrasi:** draft di `drafts/`, bukan modul aplikasi aktif; lanjut hanya ketika tes diizinkan dan hasil dikaji.
**M03-S4 tidak dimasukkan ke tabel SELESAI dan tidak mendapat DONE-18.** Tes terakhir M03-S3 tidak berlaku untuk draft ini.

### M00: subpekerjaan
- [x] M00-A: buat branch dan draft PR agar `main` tidak berubah
- [x] M00-B: tulis standar pengembangan, roadmap, modul dan validator awal
- [x] M00-C: buat handoff permanen lintas percakapan
- [ ] M00-D: masukkan source Flask hasil snapshot sanitasi **secara langsung melalui kemampuan GitHub yang tersedia**, tanpa meminta pengguna melakukan download/PowerShell/SSH
- [x] M00-E1: `.env.example`, fixture dummy, kontrak Profil/APEL/Support, 10 tes, GitHub Actions SUCCESS
- [ ] M00-E2: pemetaan dependensi Flask asli, konfigurasi anonim untuk runtime dan tes startup setelah source tersedia
- [ ] M00-F: test regresi APEL, integritas struktur dan keamanan minimum sebelum M00 ditutup

**Catatan dependensi:** M00-D mungkin belum dapat diselesaikan dalam satu operasi melalui akses GitHub saat ini. Tidak boleh menyatakan source sudah di repo atau memaksa langkah manual; tetap kerjakan bagian yang memungkinkan langsung di GitHub, dengan status sesuai bukti.

## C. Rencana per modul (M01, M02, M03 dan draf M04-S1/S2/S3/S4/S5/S6/S7/S8 sudah di daftar SEDANG)
| ID | Prioritas | Modul/keluaran | Dependensi | Dokumen |
|---|---|---|---|---|
| M04-S10+ | P0 | Support: proses resmi oleh pejabat berwenang, alokasi, paket, distribusi dan BAST | M04-S9 serta prosedur/otorisasi yang disahkan | [Support](modules/04_SUPPORT_PUSKESWAN.md) |
| M05 | P1 | APEL 2.0: rapor, tren, koreksi, peraturan 2027 | M01/M02 | [APEL](modules/02_APEL_PUSKESWAN.md) |
| M06 | P1 | Pengawasan Obat Hewan | M01 | [Obat](modules/05_PENGAWASAN_OBAT_HEWAN.md) |
| M07 | P1 | Klinik/Praktik Dokter Hewan | M01 | [Klinik](modules/06_KLINIK_PRAKTIK_DOKTER_HEWAN.md) |
| M08 | P1 | Dashboard Pimpinan lintas modul | Modul sumber | [Dashboard](modules/11_DASHBOARD_PIMPINAN.md) |
| M09 | P2 | Notifikasi, PWA dan draf lapangan | M01 | [Notifikasi](modules/14_NOTIFIKASI_MODE_LAPANGAN.md) |
| M10 | P2 | GIS Kesehatan Hewan | M02 | [GIS](modules/12_GIS.md) |
| M11 | P2 | Pustaka Regulasi, SOP, AI opsional | M01 | [Pustaka/AI](modules/13_PUSTAKA_REGULASI_AI.md) |
| M12 | P2 | Administrasi Kegiatan dan Dokumen paperless | M01 | [Dokumen](modules/10_ADMINISTRASI_DOKUMEN.md) |
| M13 | P2 | PHMS, zoonosis dan surveilans (tidak duplikasi iSIKHNAS) | M01/M02 | [PHMS](modules/07_PHMS_ZOONOSIS.md) |
| M14 | P2 | Sertifikat Veteriner dan Lalu Lintas | M01 | [Sertifikat](modules/08_SERTIFIKAT_LALU_LINTAS.md) |
| M15 | P2 | Pembinaan, Bimtek, pengembangan SDM | M01/M02 | [Pembinaan](modules/09_PEMBINAAN_BIMTEK.md) |
| M16 | P3 | Kajian integrasi e-SPJ/kepegawaian/kanal eksternal | Evaluasi SPBE | [Administrasi](modules/10_ADMINISTRASI_DOKUMEN.md) |

## D. Item kualitas lintas modul
- **SEC-01 P0:** otorisasi API pengguna, reset password, akses dokumen, CSRF dan password hashing pada versi pengembangan.
- **DEV-01 P0:** dependensi yang bisa direproduksi, konfigurasi dummy dan fixture aman.
- **REG-01 P0:** regresi APEL termasuk satu laporan/bulan/Puskeswan, kategori dan hitung Kesmavet.
- **UX-01 P0:** uji lima pekerjaan umum di HP dengan pengguna nonteknis.
- **GOV-01 P1:** kamus data, kewenangan, dan peninjauan SPBE sebelum sistem resmi diintegrasikan.

## E. Aturan pembaruan
**Ketentuan baru:** buat kode tanpa tes/CL/CI terlebih dahulu, tandai **BELUM DIUJI**, letakkan di luar jalur workflow otomatis bila memungkinkan, tambahkan ke [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); `[skip ci]` di pesan commit. Tes baru hanya setelah owner memberi izin. Bukti tes lama tidak otomatis membenarkan kode baru.

**Setiap ada progres nyata**, perbarui paling sedikit:
1. [PROJECT_STATE.md](../PROJECT_STATE.md): status terbaru dan langkah berikut, ringkas untuk chat baru.
2. Dokumen ini: ubah checklist/status hanya dengan bukti hasil.
3. [WORKLOG.md](WORKLOG.md): satu entri ringkas yang menunjuk commit/issue/PR.
4. Dokumen modul yang berubah, bila terkait; [CHANGELOG_ROADMAP.md](CHANGELOG_ROADMAP.md) bila ada penambahan/pengubahan/penghapusan scope.
5. Issue/PR yang berhubungan. Jangan menandai selesai kalau baru rencana atau kode belum diuji.

## F. Batas mutlak
Website https://yandikvo.my.id/ dan seluruh komponen produksinya **tidak berubah**; tidak ada koneksi VPS YANDIK+, VPS Indodax, live database, atau otomatisasi deploy. Persiapan staging/deploy hanya setelah pendanaan, pengujian dan persetujuan terpisah.
