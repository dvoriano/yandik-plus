# M04-S10 | Rancangan Paket Dukungan Puskeswan

**16 November 2026 (WIB) | KODE DITULIS, BELUM DIUJI.** Draf perencanaan fiktif yang berdiri sendiri, bukan modul bantuan resmi.

## Tujuan

Memudahkan penyusunan kebutuhan menjadi paket rencana dukungan tanpa menyalin kembali data Puskeswan, barang, satuan dan jumlah kebutuhan. M04-S10 mulai dari fungsi perencanaan kuantitas, bukan simulasi penerbitan atau persetujuan keputusan. Syarat M04-S9, QA, kewenangan, SOP dan tata kelola tetap berlaku untuk integrasi nyata.

## Alur DEMO

1. Baca kebutuhan sintetis M04-S1 (ID kebutuhan, ID Puskeswan, wilayah, barang, jumlah, satuan, status dan versi).
2. Tampilkan semua kebutuhan, termasuk yang belum terverifikasi dalam DEMO. Hanya sumber berstatus terverifikasi dalam fixture yang bisa dimasukkan ke paket rencana.
3. Buat satu atau beberapa paket; isi nama/alasan, pilih kebutuhan dan jumlah. Jangan menulis kembali identitas, barang atau satuan sumber.
4. Perbarui atau hapus baris/paket; hitung ulang jumlah rencana dan sisa per ID kebutuhan. Jangan menjumlahkan unit dengan set/paket/buah.
5. Jika sumber berubah, data salah, ID ganda atau total rencana melebihi kebutuhan, kode dirancang menolak operasi, bukan mengganti atau menyetujui dengan otomatis.

## Contoh input awal (bukan data riil)

| Sumber fiktif | Kebutuhan | Rencana awal | Sisa dalam draf |
|---|---:|---:|---:|
| DEMO-NEED-001, rantai dingin | 2 unit | 1 unit | 1 unit |
| DEMO-NEED-002, peralatan klinik | 1 set | 0 set | 1 set |
| DEMO-NEED-003, alat penanganan hewan | 3 unit | Tidak dapat direncanakan (status diajukan) | Tidak dihitung |

Angka tersebut adalah ekspektasi pembacaan fixture dan kode, **belum dibuktikan oleh tes**. Sisa = kebutuhan DEMO terverifikasi dikurangi jumlah pada seluruh paket draf; bukan stok fisik, reservasi, kekurangan resmi atau alokasi.

## Kontrak dan UI

- [Model murni, fixture dan 12 skenario tertulis](https://github.com/dvoriano/yandik-plus/commit/c52feb5222196d8a77d99c2a01767dbd75781af8); kontrak input paket hanya ID DEMO, judul, alasan dan baris (need_id, source_version, quantity). Model mencari sumber dari daftar kebutuhan, menolak kolom tambahan dan melakukan pembatasan jumlah lintas paket.
- [UI draft HTML/JS/CSS](https://github.com/dvoriano/yandik-plus/commit/a3e212b1f87f0093f7d49bd114bd61c9d7c0a608); ringkasan per satuan, daftar kebutuhan, pemilihan paket, tambah/edit/hapus paket/baris, pesan kesalahan. Semua perubahan hanya di memori; tidak tersimpan saat halaman ditutup atau dimuat ulang.
- Versi sumber adalah penanda contoh, bukan tanda tangan atau validasi keaslian. Model menggunakan asumsi bahwa perubahan substansial pada sumber selalu menaikkan versi. Apabila versi berubah, operasi ditolak; proses rekonsiliasi/revisi sumber belum dibangun.
- Peran dan batas wilayah, autentikasi, database, audit server, transaksi serentak, adapter M03/APEL riil dan akses resmi belum tersedia. Batas lokal tidak menggantikan kontrol server.
- Tidak ada harga/Rp, pagu, pemilihan penerima resmi, peringkat otomatis, pemesanan, penetapan atau persetujuan, penyaluran, BAST, atau dokumen resmi.

## Status dan kelanjutan

12 skenario Node baru **hanya ditulis**. Inventaris paket QA S9V (192 skenario/17 suite) tetap merupakan snapshot lingkup S9F–S9V; suite S10 ditambahkan ke TEST_BACKLOG secara terpisah. Tidak ada tes, CI, browser atau deployment. Repo PUBLIC per 16 November 2026, PR #9 Draft; seluruh fixture fiktif.

**Tahap S11 yang diusulkan:** telaah kesiapan rencana paket dan rujukan keputusan/anggaran yang sah tanpa menyimpulkan approval, kemudian rancangan pencatatan distribusi dan serah terima hanya setelah syarat kewenangan dan integrasi terpenuhi. Proses riil M04-S10+ tetap RENCANA.
