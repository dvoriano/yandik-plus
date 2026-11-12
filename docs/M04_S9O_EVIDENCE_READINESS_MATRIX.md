# M04-S9O | Matriks Persiapan Bahan Pembahasan DEMO

**Tanggal:** 12 November 2026 (WIB)  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Kode:** [drafts/m04-evidence-readiness-matrix/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-evidence-readiness-matrix)  
**Kedudukan:** bahan perancangan pengelolaan kelengkapan bukti, bukan inventaris dokumen riil, hasil audit, penetapan siap integrasi, persetujuan anggaran ataupun keputusan pejabat.

## Tujuan dan asal data
M04-S9O menyandingkan **M04-S9M** (18 kebutuhan bahan dan catatan DEMO) serta **M04-S9N** (pertanyaan terbuka per butir). Enam fungsi usulan tetap sama: kelembagaan, keamanan informasi, data Profil/SDM/APEL, alur Support, QA, dan integrasi.
Rantai fixture: M04-S9I → M04-S9J → M04-S9K → M04-S9L → M04-S9M → M04-S9N → **M04-S9O**. Tidak ada sambungan ke dokumen/DB kedinasan, situs produksi atau data pribadi.

## Tiga lapisan yang wajib dibedakan
| Lapisan | Nilai dalam DEMO | Arti dan batasannya |
|---|---|---|
| 1. Bahan diminta | 18 deskripsi sumber dari M04-S9M | **Jenis dokumen yang ingin dibahas**; bukan dokumen diterima/dilampirkan |
| 2. Catatan bahan DEMO | 3 catatan teks contoh pada GOV-01, SEC-01, DAT-01; 15 kosong | Teks pemantik diskusi saja, **bukan dokumen bukti** |
| 3. Bukti resmi terverifikasi | **0** | Tidak ada bukti resmi yang diperiksa atau dinyatakan sah oleh sistem ini |

Catatan kekurangan bukti pada tiga butir contoh juga hanya teks fiktif, bukan temuan audit. **Kolom kosong tidak berarti bukti cukup, masalah selesai, atau instansi tidak mempunyai dokumen.** Tidak ada skor/persentase kesiapan, predikat lulus atau penetapan kewenangan.

## Isi tiap baris dan matriks per fungsi
- Identitas `DEMO-MAT-{ID}`, ID/fungsi/fase/revisi sumber dan deskripsi bahan yang diminta.
- Daftar ID pertanyaan terbuka yang dirujuk dari M04-S9N.
- Catatan teks DEMO (jika ada), label ada/belum ada catatan, dan catatan kekurangan DEMO.
- Kolom dokumen diterima DEMO **false**, bukti resmi terverifikasi **false**, dan referensi bukti resmi **null**.
- Status kesiapan **KELENGKAPAN_BUKTI_BELUM_DAPAT_DINILAI_DARI_DEMO** untuk seluruh baris; kolom reviewer resmi dan persetujuan integrasi selalu false.
- Rekap enam fungsi yang dapat difilter dan ringkasan teks baca-saja untuk persiapan diskusi manusia.

## Pengamanan dan pembatasan akses
1. Model memeriksa `QUESTION_SCHEMA` dari M04-S9N dan `HANDOFF_SCHEMA` dari M04-S9M dalam mode `synthetic: true` dan `CODE_ONLY`, dengan **18 ID butir, 6 fungsi**, jumlah pertanyaan, revisi dan snapshot yang sesuai.
2. Model dirancang menolak rujukan pertanyaan/ID yang hilang, duplikat, deskripsi bahan yang tidak cocok, dan klaim palsu telah menjawab, memverifikasi, menugaskan atau menyetujui. **Kode belum diuji**.
3. Sumber stale ditandai untuk pemeriksaan ulang, bukan untuk mengubah readiness.
4. Browser hanya memiliki filter fungsi/status catatan dan textarea baca-saja. Tidak ada login, fetch, API, database, storage, upload, pengiriman, tanda tangan atau pembuatan berita acara.
5. Penilaian persyaratan SOP, SPBE, klasifikasi informasi, kearsipan, kewenangan, legalitas bukti dan keputusan kelembagaan tetap pada pihak berwenang.
6. Repository menurut metadata GitHub pada **12 November 2026 masih PUBLIC**. Pengingat pemilik untuk mengubah PRIVATE Sabtu 14 November aktif, tetapi perubahan **belum dilaksanakan**. Jangan unggah data riil, dokumen kedinasan atau rahasia. Perubahan visibility tidak otomatis memperbaiki histori paparan.

## QA tertunda dan rencana lanjut
- [12 skenario tes Node tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-evidence-readiness-matrix/tests/readiness.test.mjs) tetapi **BELUM DIJALANKAN** sesuai [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- QA impor berantai, tiga lapisan bukti, catatan kosong, referensi pertanyaan, screenshot/HP/aksesibilitas, XSS, snapshot stale dan seluruh larangan keputusan masuk [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Tahap berikut yang bisa dirancang: **M04-S9P**, indeks kesenjangan bahan pembahasan dan urutan penelaahan berdasarkan dependensi, tanpa menetapkan kelulusan/penugasan resmi.
- M04-S10+ bantuan, anggaran, pengadaan, penyaluran dan BAST tetap RENCANA.
- PR #9 tetap Draft, tidak merge `main`, tidak menjalankan CL/CI, Node/browser test, workflow, deployment, VPS, database produksi, situs YANDIK+ aktif atau bot Indodax.
