# M04-I6B | Kontrak Identitas Backend & Inventaris Baca-Saja (DEMO)

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Lanjutan I6A yang masih sepenuhnya GitHub-only/CODE_ONLY. Bukan keamanan aplikasi yang sudah diimplementasikan, bukan hasil pengujian, bukan login resmi, dan bukan izin migrasi.

## Tujuan
Menghilangkan ketergantungan pada *role switch* dan identitas yang bisa dipilih browser **dalam rancangan adapter berikutnya**, tanpa mengganti kontrak autentikasi aplikasi Flask lama. Memberi jendela baca-saja untuk inventaris I5 agar preflight migrasi DEMO tahu apakah tujuan kosong. Tetap menganggap source snapshot dan DB belum terbukti asli.

## Batas kepercayaan

| Bagian | Aturan rancangan |
|---|---|
| Host server | Menyediakan `resolveServerSession()` tanpa argumen, membaca sesi yang benar-benar diverifikasi server; tidak boleh meneruskan `actor_id`, `role`, `region` atau klaim hak dari body/query/header |
| Identitas | Divalidasi dengan kontrak M04-I2; akun aktif dan format DEMO; peran/wilayah berasal dari resolver backend. Setiap permintaan membaca identitas lagi |
| Inventaris global | Hanya `provinsi_admin`; penolakan terjadi **sebelum** callback database dibuka |
| Ringkasan fasilitas | Puskeswan hanya ID sendiri + wilayah sesuai; kab/kota sesuai wilayah; verifikator dan admin provinsi untuk fasilitas aktif; pimpinan tanpa akses detail |
| Pembaca DB | `withConsistentRead(callback)` wajib memakai koneksi read-only/transaction snapshot backend. Modul I6B sendiri hanya melakukan `SELECT` |
| Pemisahan data | Keluaran tidak mengembalikan `payload`, detail histori, kebutuhan, nama petugas, atau dokumen. ID fasilitas hanya untuk admin pada inventaris global |
| Penolakan | Sesi tidak sah, fasilitas tidak aktif, data foreign, skema rusak, hitungan tidak cocok atau kesalahan database harus gagal tertutup |

**Penting:** Injeksikan kedua callback melalui komposisi server, bukan dari argument pengguna. Callback dari browser yang sekadar mengembalikan objek bertuliskan `trusted` **tidak dianggap aman**. Kode ini belum bisa membuktikan bahwa callback benar-benar tepercaya.

## Kontrak pembacaan
`openI6BReadonlyGateway({resolveServerSession, withConsistentRead})` menawarkan:
- `globalTargetInventory()`: hasil `inventory` berformat sama seperti `emptyDemoTargetInventory()` I6A, termasuk `schema`, `synthetic`, `facility_ids` dan `current_rows/version_rows/event_rows/command_rows`; hanya untuk admin provinsi DEMO.
- `scopedFacilitySummary(facilityId)`: ID Puskeswan dan revisi saja, hanya setelah pemeriksaan status/role/wilayah server.

Jika tabel belum ada, koneksi gagal, atau jumlah baris bertentangan dengan daftar ID, pembacaan harus gagal. Inventaris bersifat *point-in-time*; I6A tetap melakukan pemeriksaan `target_empty` dan **tidak berubah menjadi prosedur migrasi**. Belum ada gerbang penguncian target antara inventaris dan transaksi nantinya.

## Batasan yang masih terbuka
1. Belum ada integrasi Flask, pengesahan identitas, sesi aman, proteksi CSRF, logout/revocation, autentikasi multi-faktor, otorisasi API dan audit autentikasi.
2. Belum ada autentikasi sumber, snapshot tepercaya, *read-only* database sungguhan, bukti konsistensi/transaksi terhadap race, maupun penanganan migrasi lintas fasilitas.
3. Kebijakan kewenangan, peran penelaah, tingkat agregasi pimpinan, retensi/arsip, tata kelola SPBE dan perubahan katalog tetap membutuhkan keputusan pengampu proses.
4. SQLite mengunci satu penulis untuk database bersama; **I6B tidak membuat sharding atau tenant isolation fisik**.
5. Tidak ada endpoint, integrasi APEL/SDM, BAST, stok, pembelian, alokasi maupun pengiriman nyata.
6. Sumber repository bersifat PUBLIC. Hanya data DEMO, jangan menambah data pengguna, dokumen resmi atau kredensial.

## QA tertunda
**15 skenario Node ditulis, tidak dijalankan**, membahas autentikasi semu, penolakan akses, pembatasan wilayah, inventorinya, pemisahan keluaran, sesi yang berubah, input bentuk salah dan kontrak SQL SELECT. Pengujian nyata mutlak membutuhkan izin G0 dan koneksi sintetis read-only yang bisa diverifikasi.

- [Kode I6B](../drafts/m04-backend-readonly/)
- [QA I6B](../drafts/m04-backend-readonly/tests/gateway.test.mjs)
- [Antrean pengujian](TEST_BACKLOG.md)

**Tahap berikutnya M04-I6C (usulan):** desain snapshot atomik serta jurnal recovery/retensi yang tidak menulis data nyata, lalu lintas Flask/APEL baru ditinjau setelah G0 dan keputusan kelembagaan.
