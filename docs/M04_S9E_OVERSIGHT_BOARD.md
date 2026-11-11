# M04-S9E | Peta Perhatian Tindak Lanjut Kelembagaan DEMO

**Status:** KODE DITULIS, **BELUM DIUJI**. 11 November 2026, WIB.

**Kode:** [drafts/m04-institutional-oversight/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-oversight).

## Kedudukan dan nilai tambah
Rancangan M04-S9E adalah **papan pemantauan baca-saja**, bukan register rapat baru atau dashboard persetujuan bantuan.
Alur sumber tetap: M04-S8/S9 → rekap M04-S9B → agenda M04-S9C → register catatan M04-S9D → **rekap M04-S9E**.
Ketika sumber belum mempunyai catatan, butir agenda tetap muncul sehingga tidak tertutup oleh ringkasan yang hanya menampilkan pekerjaan tercatat.

## Informasi yang ditampilkan
| Kategori | Makna untuk tindak lanjut |
|---|---|
| Sumber berubah | Catatan M04-S9D tidak sesuai snapshot agenda yang sekarang; perlu kaji ulang sebelum mutasi |
| Tanpa catatan | Ada agenda M04-S9C yang belum mempunyai catatan pembahasan |
| Catatan dibatalkan | Catatan masih terlacak, tapi belum boleh dianggap pembahasan lengkap |
| Lewat tenggat DEMO | Tanggal contoh telah terlewati untuk catatan yang masih terbuka |
| Perlu perbaikan | Penelaah DEMO meminta klarifikasi; bukan persetujuan |
| Menunggu telaah | Catatan dalam antrean pembacaan penelaah DEMO |
| Draf | Bahan dicatat tetapi belum diajukan untuk telaah |
| Hanya bahan | Telah dicatat untuk bahan pembahasan, **bukan** pengesahan SOP atau kesiapan integrasi |

**Prioritas hanya pengurutan tampilan, tidak memutuskan penerima bantuan atau menetapkan urgensi kedinasan.**
Jika sumber berubah, penanda perubahan mengungguli klasifikasi lain agar seluruh agenda ditinjau kembali. Rincian item dan penghitungan berasal dari data fiktif.

## Pengendalian desain
- Semua sumber harus berstatus synthetic DEMO; rujukan catatan harus cocok dengan butir M04-S9C. Tidak ada fallback ke data layanan resmi.
- Nilai tanggal menggunakan acuan yang diisi pengguna pada form DEMO, bukan penentuan otomatis berbasis jam produksi.
- Tampilan berisi filter kelompok/status dan ringkasan teks hanya baca-saja. Tidak ada aksi tambah/ubah/hapus, persetujuan, kirim, API, database, atau autentikasi.
- Status kelayakan integrasi **selalu BELUM DINILAI**, termasuk ketika semua agenda telah mempunyai catatan yang dibaca.
- Snapshot repository public pada 11 November 2026 bersifat historis. Rencana perubahan menjadi private pada Sabtu, 14 November 2026, masih menunggu tindakan pemilik dan pemeriksaan ulang.
- Identitas dan bahan dalam fixture adalah contoh. Tidak boleh diisi nama warga/pemilik hewan, surat internal, nomor rahasia atau data sensitif dalam repo public.

## Berkas dan QA
- oversight.mjs: pembentukan papan dari summary M04-S9D, pengelompokan perhatian dan keluaran teks.
- fixtures.mjs: penggunaan data DEMO tanpa API.
- main.mjs, index.html, style.css: UI responsif yang dirancang untuk HP dengan label/filter/empty state dan escape teks DOM.
- tests/oversight.test.mjs: **9 skenario tes ditulis tetapi belum dijalankan**.
- README.md: rujukan pengembang dan batas modul.

QA tertunda mencakup urutan klasifikasi, sumber berubah, catatan kosong/batal, kalkulasi tanggal, aksesibilitas HP dan keamanan input. Lihat [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).

## Batas kewenangan dan tahap lanjut
Modul ini bukan rapat resmi, telaah tata kelola, audit keamanan, penetapan SOP atau izin integrasi. Pengesahan proses bisnis, tupoksi, SPBE, keamanan, retensi dokumen, keputusan keuangan, pengadaan, distribusi dan BAST tetap melalui pengampu berwenang.
QA baru boleh dijalankan setelah izin eksplisit pemilik untuk keluar dari CODE_ONLY. Perubahan tidak menyentuh main, PR #9, VPS, website aktif atau database.
