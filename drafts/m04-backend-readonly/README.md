# M04-I6B | Identitas backend dan inventaris read-only

**KODE DITULIS, BELUM DIUJI.** Seluruh pengguna/fasilitas adalah DEMO. Folder ini **bukan implementasi login atau backend produksi**.

- `identity.mjs`: kontrak resolusi identitas dari callback server tanpa menerima peran, ID pengguna, atau daftar hak dari payload klien; validasi status aktif dan pembatasan wilayah.
- `inventory.mjs`: inventaris target I5 khusus admin provinsi berupa empat jumlah baris dan daftar ID fasilitas DEMO, serta ringkasan revisi satu fasilitas sesuai peran; pimpinan tidak bisa membaca detail.
- SQL yang digunakan **hanya `SELECT`**, tanpa `INSERT`, `UPDATE`, `DELETE`, `PRAGMA`, `BEGIN` atau pembuatan koneksi. Fungsi host `withConsistentRead` wajib membuka transaksi snapshot baca-saja yang konsisten secara independen.
- Input `facilityId` semata-mata *selector*, bukan otorisasi. Resolver `resolveServerSession` wajib dihubungkan ke sesi yang diverifikasi backend, bukan data yang bisa dipilih browser.
- Hasil memberi `may_write:false`, `source_verified:false`, `target_frozen:false`. Tidak ada jaminan bahwa target tetap kosong setelah dibaca; tidak ada migrasi/approval.
- `tests/gateway.test.mjs` memuat **15 skenario tertulis, tidak dijalankan** (mock adapter saja).

[Spesifikasi M04-I6B](../../docs/M04_I6B_BACKEND_READONLY_IDENTITY.md) · [I6A](../../docs/M04_I6A_MIGRATION_PREFLIGHT.md).
