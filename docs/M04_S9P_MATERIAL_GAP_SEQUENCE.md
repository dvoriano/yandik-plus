# M04-S9P | Indeks Catatan Kesenjangan Bahan dan Urutan Telaah DEMO

**Tanggal:** 12 November 2026, WIB  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Kode:** [drafts/m04-material-gap-sequence/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-material-gap-sequence)  
**Kedudukan:** rancangan **urutan membaca bahan untuk diskusi manusia**, bukan penentuan prioritas program, alokasi anggaran, tugas pejabat atau izin integrasi.

## Tujuan dan kontrak sumber
M04-S9P menggabungkan **M04-S9O** (18 permintaan bahan, keberadaan teks catatan DEMO, tanpa bukti resmi terverifikasi) dan **M04-S9M** (hubungan pendahulu pada 18 butir). Dependensi yang diturunkan dari M04-S9G merupakan **hipotesis desain**, bukan prasyarat kedinasan yang telah ditetapkan.
Modul menolak ketidakcocokan ID/fungsi/fase/revisi/snapshot, daftar pertanyaan atau status resmi antara kedua sumber. Seluruh sumber tetap sintetis di `CODE_ONLY`.

## Indeks kesenjangan: tidak sama dengan temuan audit
| Lapisan | Bentuk data | Makna yang diperbolehkan |
|---|---|---|
| Bahan diminta | Deskripsi 18 kebutuhan dari M04-S9O | Jenis bahan yang disarankan untuk dibahas, belum diterima |
| Ada catatan kekurangan DEMO | 3 baris berisi teks fiktif: GOV-01, SEC-01, DAT-01 | **Hanya ada catatan teks**, bukan bukti kurangnya dokumen riil |
| Tidak ada catatan kekurangan DEMO | 15 baris tanpa teks | **Belum diisi**, bukan bukti dokumen cukup atau masalah selesai |
| Bukti resmi terverifikasi | **0** | Tidak ada hasil telaah/verifikasi resmi dalam DEMO |

Nama 'indeks kesenjangan' menunjuk **indeks catatan tentang kesenjangan yang mungkin perlu didiskusikan**. Ini tidak membuktikan adanya kesenjangan administratif yang sebenarnya. Semua 18 butir tetap `KELENGKAPAN_BUKTI_BELUM_DAPAT_DINILAI_DARI_DEMO`.

## Aturan urutan dependensi
- Gunakan graph butir dari M04-S9M. Sebuah butir pembahasan ditampilkan **setelah seluruh pendahulunya muncul di daftar**.
- Urutan topologis stabil: butir tanpa pendahulu diproses dahulu; bila lebih dari satu sama-sama bisa dibahas, pilih fase P0–P3 lalu ID secara alfabetis.
- `dependency_layer` menunjukkan kedalaman rantai pendahulu, **bukan kelas kepentingan**. `downstream_discussion_items` menunjukkan jumlah butir lain yang bergantung langsung/tidak langsung, **bukan skor pengaruh**.
- Empat gelombang P0–P3 hanya wadah pengelompokan wacana; tidak membuktikan aktivitas tahap tersebut sudah dimulai.
- Jika ada ID pendahulu asing, self-loop, ketergantungan fase mundur atau **siklus**, rancangan menolak mengeluarkan urutan. Tidak membuat fallback yang terlihat seperti prioritas sah.
- Urutan demo **bukan** instruksi kerja, daftar tugas, jadwal dinas, urutan pencairan, syarat bantuan, otorisasi tes ataupun deployment.

## Kolom dan tampilan
Setiap dari 18 baris berisi ID `DEMO-SEQ-{ID}`, urutan diskusi yang diusulkan, fase/lapis, fungsi, bahan diminta, ID pertanyaan sumber, pendahulu dan pendahulu lintas fungsi, banyaknya rujukan lanjutan, serta ada/tidaknya catatan DEMO.
Pengampu resmi, tenggat, dokumen diverifikasi, keputusan, kesiapan dan izin QA/deploy tetap **kosong/false**. Tidak ada status tuntas atau persentase readiness.
UI read-only menampilkan jumlah butir dan relasi pendahulu, ringkasan P0–P3, filter fungsi dan status catatan DEMO, rincian urutan, serta rekap teks yang dapat disalin manual.

## Keselamatan, izin dan metadata
- Kode menerima hanya snapshot DEMO `synthetic: true`, `mode: CODE_ONLY` dari M04-S9O dan M04-S9M, dengan enam fungsi, 18 butir dan nol verifikasi resmi.
- Tidak ada API, fetch, login, storage, database, unggah berkas, perubahan sumber, notifikasi, surat, berita acara, pengesahan, pengadaan atau BAST.
- Perubahan sumber (`source_stale`) hanya menjadi peringatan untuk meninjau ulang. Repository PRIVATE di kemudian hari bukan bukti keamanan histori.
- Repository menurut metadata GitHub **12 November 2026 masih PUBLIC**; pengingat owner untuk mengubah PRIVATE Sabtu 14 November aktif, tetapi pengaturan belum diubah. Dilarang menyimpan data kedinasan atau rahasia pada fixture.
- Penetapan SOP/SPBE, legalitas, kearsipan, kewenangan verifikasi, risiko anggaran dan keputusan bantuan tetap wewenang manusia di luar DEMO.

## QA dan rencana berikut
- [12 skenario Node tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-material-gap-sequence/tests/sequence.test.mjs), **BELUM DIJALANKAN** sesuai [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- Antrean QA mencakup urutan topologis, empat fase, simpul awal, lapis, siklus satu fase, perubahan fase mundur, sumber tidak cocok, input palsu, ketahanan UI HP dan aksesibilitas di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Tahap berikut yang dapat dirancang: **M04-S9Q**, paket ringkasan pembahasan berurutan per fase untuk telaah manusia, termasuk pertanyaan terbuka dan sumber pembuktian, tetap tanpa pengiriman atau persetujuan otomatis.
- M04-S10+ bantuan, anggaran, pengadaan, distribusi dan BAST tetap RENCANA.
- PR #9 tetap DRAFT; jangan menggabungkan ke `main`, menjalankan CL/CI, Node/browser tests, Actions, VPS, database produksi, website YANDIK+ aktif maupun bot Indodax.

## Paket pembahasan per fase tahap berikut
Urutan baca sumber, pertanyaan dan permintaan bukti dirangkum menurut P0–P3 dalam [M04-S9Q](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9Q_PHASE_REVIEW_PACKETS.md). Paket masih **BELUM DIKIRIM / KODE BELUM DIUJI**, bukan pengesahan kegiatan, keputusan atau undangan resmi.
