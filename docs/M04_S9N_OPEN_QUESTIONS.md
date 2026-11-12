# M04-S9N | Register Pertanyaan yang Belum Terjawab DEMO

**Tanggal:** 12 November 2026 (WIB)  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Kode:** [drafts/m04-open-question-register/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-open-question-register)  
**Kedudukan:** rancangan daftar pertanyaan untuk telaah manusia, bukan temuan audit, surat kedinasan, daftar kewajiban yang telah ditetapkan, berita acara atau hasil keputusan.

## Tujuan dan hubungan sumber
M04-S9N menguraikan **seluruh pertanyaan yang masih terbuka** pada paket M04-S9M menjadi baris-baris ber-ID unik, dengan fungsi pengampu **usulan**, ID butir, revisi, kebutuhan bahan bukti dan ketergantungan. Rantai fixture hanya DEMO: M04-S9I → M04-S9J → M04-S9K → M04-S9L → M04-S9M → **M04-S9N**.

Jumlah pertanyaan dihitung dari sumber, tidak ditetapkan sebagai jumlah hasil rapat, permintaan dokumen sah, temuan pemeriksaan atau kinerja instansi.

## Struktur register per pertanyaan
| Kolom | Fungsi | Batasan |
|---|---|---|
| ID pertanyaan | `DEMO-Q-{ID butir}-{nomor}` dari urutan pertanyaan M04-S9M | Identitas lokal DEMO, bukan nomor surat atau nomor register instansi |
| ID/fungsi/fase/revisi sumber | Menghubungkan pertanyaan pada 18 butir/6 fungsi dan versi catatan contoh | Bukan referensi arsip/berita acara resmi |
| Bunyi pertanyaan | Teks asli yang belum dijawab pada M04-S9M | Tidak mencantumkan atau menyimpulkan jawaban manusia |
| Bukti diminta | Jenis bahan yang perlu disiapkan untuk pembahasan | Bukan bukti yang telah dilampirkan dan diverifikasi |
| Catatan kekurangan DEMO | Teks fiktif pada catatan M04-S9J yang diteruskan dari M04-S9M | Kolom kosong **bukan** berarti tidak ada kekurangan |
| Pengampu dan penelaah usulan | Kategori fungsi yang mungkin menyiapkan/menelaah | Bukan penugasan pejabat atau penetapan kewenangan |
| Dependensi | ID pendahulu dan lintas fungsi | Bukan laporan bahwa prasyarat sudah dipenuhi |
| Status jawaban | `BELUM_ADA_JAWABAN_RESMI` untuk setiap pertanyaan | Tidak ada tanda persetujuan, kelulusan, izin QA/deploy atau keputusan |

## Tampilan read-only
Antarmuka DEMO menyajikan jumlah pertanyaan per fungsi, filter fungsi dan dua keadaan kolom kekurangan bukti: ada teks tertulis atau belum diisi. Daftar pertanyaan dapat dilihat dan ringkasannya disalin secara manual.
**Tidak ada formulir mengisi jawaban, perubahan status, unggahan bukti, pengiriman ke pihak luar, autentikasi, API, database, storage atau notifikasi.**

## Keamanan dan pembatas kelembagaan
- Sumber hanya boleh M04-S9M sintetis dengan `mode: CODE_ONLY`, 6 fungsi dan 18 butir; jumlah pertanyaan dan permintaan bukti harus konsisten dengan paket asal.
- Semua tanggapan resmi, bukti terverifikasi, penelaah resmi, penugasan, keputusan, izin QA/deploy dan serah-terima tetap **nol, false, atau null**.
- Kode menolak sumber dengan ID/fungsi/pertanyaan/rujukan tidak cocok, sumber berstatus resmi, atau total catatan yang berubah tanpa konsistensi. **Validasi ini belum diuji.**
- Perubahan snapshot sumber menghasilkan peringatan, bukan pengesahan. Repo menjadi PRIVATE di kemudian hari juga tidak menjamin histori paparan sebelumnya sudah aman.
- Repo masih **PUBLIC** pada pemeriksaan GitHub 12 November 2026. Pengingat owner mengubah ke PRIVATE Sabtu 14 November 2026 masih terjadwal, pengaturan belum berubah. Tidak boleh memasukkan dokumen kedinasan atau data pribadi.
- Tidak mengeluarkan keputusan bantuan, penetapan SOP/SPBE, nota dinas, penugasan, pengadaan, anggaran, penyaluran, BAST atau mengubah data APEL historis.

## Status QA dan rencana selanjutnya
- [12 skenario Node tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-open-question-register/tests/questions.test.mjs), **BELUM DIJALANKAN** di bawah [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- Validasi sumber dan ID, jumlah pertanyaan, keadaan kolom kosong, rujukan lintas fungsi, sumber stale, penolakan klaim resmi, serta UX HP/aksesibilitas/XSS dicatat pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Langkah lanjutan yang dapat dirancang: matriks kesiapan bahan pembahasan yang membedakan *jenis bahan diminta*, *bahan DEMO yang ada*, dan *bukti resmi yang diverifikasi*, tanpa otomatis menutup pertanyaan.
- M04-S10+ bantuan, anggaran, pengadaan, distribusi dan BAST tetap **RENCANA**. Tidak ada CL, CI, Node/browser tests, Actions, deployment, merge `main`, VPS, database produksi, website YANDIK+ aktif atau bot Indodax.

## Matriks bahan pembahasan tahap berikut
Permintaan bahan dan catatan DEMO pada register ini dijabarkan bersama sumber M04-S9M dalam [M04-S9O](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9O_EVIDENCE_READINESS_MATRIX.md). Seluruh bukti resmi belum diverifikasi; status kesiapan tidak dihitung. Tetap **KODE DITULIS, BELUM DIUJI**.
