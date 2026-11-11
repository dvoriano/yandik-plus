# M04-S9G | Matriks Ketergantungan dan Urutan Penyelesaian Hambatan Integrasi

**Tanggal:** 12 November 2026 (WIB)  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Sumber:** Checklist M04-S9F sintetis, bukan hasil evaluasi kelembagaan atau keamanan.  
**Kode:** [drafts/m04-dependency-matrix/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-dependency-matrix).

## Tujuan
Rancangan M04-S9G menata hubungan **pendahulu → kegiatan yang bergantung** untuk 18 prasyarat M04-S9F.
Urutan topologis membantu menghindari pengerjaan konsep yang bergantung pada keputusan atau informasi yang belum ada.
Model tidak menetapkan tanggal implementasi, prioritas anggaran, pembagian tugas resmi, persetujuan QA, penetapan bantuan, atau kelayakan integrasi.

## Ringkasan empat fase
| Fase | Fokus | Butir |
|---|---|---|
| P0 | Tata kelola, klasifikasi akses/rahasia, SOP, SPBE dan arsip | GOV-01, GOV-02, GOV-03, GOV-04, SEC-01, SEC-03, SEC-04 |
| P1 | Data Profil/SDM/APEL, otorisasi wilayah, bukti dan desain alur Support | DAT-01, DAT-02, DAT-03, SEC-02, FLOW-01, FLOW-02, FLOW-03 |
| P2 | QA teknis dan pengalaman pengguna, **sesudah izin eksplisit** | QA-01, QA-02 |
| P3 | Staging/rollback dan kewenangan perubahan | INT-01, INT-02 |

**Seluruh fase BELUM DIMULAI.** Fase adalah pengelompokan pekerjaan konseptual; tes P1/P2 dan staging P3 tidak boleh dilakukan hanya karena butir pendahulunya sudah dibahas.

## Tabel ketergantungan rancangan
| ID | Pendahulu yang perlu dibahas lebih dulu |
|---|---|
| GOV-01 | Tidak ada: identifikasi penanggung jawab proses |
| SEC-01 | Tidak ada: klasifikasi informasi dan keputusan akses repo |
| GOV-03 | GOV-01 |
| GOV-02 | GOV-01, GOV-03 |
| GOV-04 | GOV-01 |
| SEC-04 | SEC-01 |
| SEC-03 | SEC-01, GOV-04 |
| DAT-01 | GOV-01 |
| SEC-02 | SEC-01, DAT-01 |
| DAT-02 | DAT-01 |
| DAT-03 | DAT-01 |
| FLOW-01 | GOV-01, DAT-01 |
| FLOW-02 | DAT-03, FLOW-01, SEC-02 |
| FLOW-03 | GOV-02, GOV-03 |
| QA-01 | FLOW-02, SEC-04 |
| QA-02 | QA-01, DAT-02, SEC-02 |
| INT-01 | SEC-03, QA-02, GOV-04 |
| INT-02 | INT-01, GOV-02, FLOW-03 |

Daftar pendahulu merupakan **hipotesis desain yang harus ditelaah manusia**, bukan persyaratan yang sudah sah. Sebagian diskusi bisa berlangsung paralel; tidak ada klaim jalur kritis berdasarkan durasi karena durasi, SDM resmi dan biaya belum ditetapkan.

## Model dan aturan keselamatan
1. Kode menerima hanya paket sintetis M04-S9F dengan 18 butir unik, label status tertunda dan empat gelombang QA yang BELUM DIMULAI.
2. Seluruh prasyarat harus terdapat dalam peta dependensi; ID tidak dikenal, duplikasi, dependensi pada dirinya sendiri, siklus, atau hubungan fase mundur harus ditolak secara konseptual. **Implementasi belum diuji**.
3. Urutan dibuat secara topologis; tiap butir memperlihatkan pendahulu langsung, lapisan dependensi dan banyaknya butir lanjutan yang terdampak (bukan perkiraan durasi).
4. Jika sumber M04-S9E ditandai berubah, peta memberi peringatan untuk kaji ulang. Ini tidak otomatis mengesahkan versi baru.
5. Ketiadaan pendahulu hanya berarti dapat menjadi **topik awal diskusi**, bukan dapat dieksekusi atau dinyatakan lulus.
6. Semua butir memiliki verified=false dan authorized_to_act=false. Peta tidak mempunyai kontrol untuk mengubah nilai tersebut.
7. Status akhir selalu **SELURUH_HAMBATAN_BELUM_DITUNTASKAN_BUKAN_IZIN_INTEGRASI** bahkan bila visibilitas repo kelak private.

## Langkah konseptual pertama
- Pembahasan siapa pengampu proses bisnis/struktur, sumber tupoksi, dan batas kewenangan, bukan penunjukan otomatis oleh sistem.
- Pemilik repository mengubah visibilitas dan mengkaji klasifikasi isi saat waktunya. **Pengingat Sabtu, 14 November 2026 telah aktif**, tetapi sampai pemeriksaan GitHub 12 November repo masih PUBLIC.
- Penelaahan tata kelola SPBE, SOP, kearsipan dan keamanan sebelum penggunaan data riil.
- Pemilihan scope QA, izin eksplisit owner serta bukti tes baru dilakukan pada tahap terpisah; tidak ada pemakaian CL/CI pada tahap CODE_ONLY.

## Verifikasi dan kelanjutan
[11 skenario Node](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-dependency-matrix/tests/dependencies.test.mjs) sudah ditulis untuk validasi DAG, ID, penolakan siklus, urutan fase, sumber berubah, status larangan QA dan pesan ketidaklayakan; **BELUM DIJALANKAN**.
Backlog QA rinci tersedia pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
Langkah berikutnya adalah konsolidasi *blocking issues* untuk telaah manusia dan QA berizin bila pemilik meminta. M04-S10+ keputusan, paket, anggaran, distribusi dan BAST tetap RENCANA.
Branch main, PR #9, VPS, database, website YANDIK+ aktif, dan bot Indodax tidak diubah.
