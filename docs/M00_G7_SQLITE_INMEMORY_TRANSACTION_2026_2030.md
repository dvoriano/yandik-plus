# M00-G7 | Penulis Audit SQLite Transaksional Hanya di Memori, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | SQL DAN DB TIDAK DIJALANKAN.**

## Yang ditulis
- [Fungsi penulis in-memory](../drafts/m00-sqlite-demo-writer/writer.py), [skema demo SQLite](../drafts/m00-sqlite-demo-writer/schema.sql), [fixture sintetis](../drafts/m00-sqlite-demo-writer/fixtures.py).
- [25 skenario QA tertulis](../drafts/m00-sqlite-demo-writer/tests/test_writer.py), **0 dijalankan**.
- Kode bisa membuat koneksi **SQLite :memory:** bila kelak diizinkan dijalankan dalam pengujian. Fungsi menolak koneksi database file atau attached DB dan menolak foreign key yang dinonaktifkan.

## Kontrak transaksi DEMO
1. Backend host menyelesaikan identitas reviewer DEMO; hanya role verifikator provinsi contoh yang diizinkan untuk fungsi tulis.
2. Intent hanya berisi ID sintetis, nomor revisi diharapkan, digest source, kode aksi/alasan, dan pengenal permintaan unik.
3. `BEGIN IMMEDIATE` dan cek idempotency command, revisi terakhir, digest head serta sumber sebelum menambahkan audit.
4. Tulis audit event, perbarui head stream dengan conditional update, dan simpan command idempotency dalam **satu transaksi**.
5. Bila terjadi pengecualian, kode memanggil `ROLLBACK`. Repetisi identik mengembalikan tanda replay, bukan penambahan event.
6. Pembacaan ringkas menghitung ulang rantai hash di memori dan tidak menampilkan identitas reviewer.

## Pembatasan dan risiko
| Komponen | Kedudukan |
|---|---|
| SQL perintah dan trigger | **DITULIS, BELUM DIEKSEKUSI**; tidak ada database yang dibuat pada pekerjaan ini |
| Atomicity/rollback | Jalur kode tersedia, **belum ada bukti tes atau concurrence** |
| Perlindungan file data | Koneksi sengaja dibatasi :memory:, tidak bisa dipakai untuk data nyata |
| Otorisasi | Callback sesi DEMO bukan bukti autentikasi pengguna/server |
| Source lineage | Basis digest dan ID DEMO, bukan hasil verifikasi sumber resmi |
| Chain hash | Deteksi ketidakkonsistenan, bukan tamper resistance |
| Integrasi M00-G5/M13-S3 | Belum disambungkan; skema Python G7 berdiri sendiri dan perlu kontrak lintas bahasa bila diintegrasikan |
| Sumber APEL/iSIKHNAS | Tidak dibaca, tidak diubah, tidak disinkronkan |
| Keputusan resmi | Tidak ada, seluruh approval/publikasi ditolak |

Tahap setelah izin testing: verifikasi penolakan file DB, skenario transaksi gagal dan rollback, perintah ganda, kondisi dua penulis, revokasi sesi, integrasi audit persisten yang benar, backup/restore, serta review keamanan dan hukum. Jangan menerapkan skema ini ke database produksi.

**Status:** CODE_WRITTEN_NOT_TESTED, MEMORY_ONLY_DEMO, NO_EXECUTION, PRODUCTION_NO_GO.
