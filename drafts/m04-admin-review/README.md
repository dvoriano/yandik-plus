# M04-S1 | Administrasi Bahan Pertimbangan Bantuan Puskeswan

**Status: KODE DITULIS, BELUM DIUJI.** Tidak ada CL, unit test, browser, CI atau pemeriksaan runtime pada kode ini.

## Tujuan
Menyiapkan contoh **berkas administrasi usulan dukungan** dari kebutuhan yang pada sumber **DEMO** berstatus terverifikasi. Penilaian prioritas hanya disertakan sebagai referensi, **bukan pemberi hak alokasi**.

## Berkas
- `dossier.mjs`: kontrak data dan alur draf, perbaikan, pengajuan untuk pemeriksaan, dan catatan sebagai bahan pertimbangan. Tidak memiliki aksi approve/allocate/issue SK/BAST.
- `fixtures.mjs`: kebutuhan fiktif, termasuk contoh yang belum terverifikasi untuk pengecekan gerbang sumber pada QA nanti.
- `main.mjs`, `index.html`, `style.css`: formulir untuk HP (masih belum diuji), daftar kelengkapan, penelaahan, histori dan teks bahan pertimbangan baca-saja.
- [Spesifikasi proses M04-S1](../../docs/M04_S1_ADMIN_HANDOFF.md).

## Urutan rancangan
1. Pilih kebutuhan DEMO yang `terverifikasi` dan memiliki metadata bukti DEMO.
2. Penyusun provinsi DEMO mengisi tujuan, konteks, batasan, kode bukti dan status kelengkapan.
3. Draf boleh belum lengkap; pengajuan diblokir bila ada unsur yang belum tercatat `ada`.
4. Penelaah administrasi DEMO yang berbeda hanya dapat meminta perbaikan atau mencatat bahan pertimbangan.
5. Catatan pertimbangan dapat dibaca dan disalin **manual** untuk proses berwenang di luar demo.

**Hasil `tercatat_untuk_pertimbangan` bukan penetapan penerima, keputusan anggaran, pengadaan, pengiriman, tanda terima atau BAST.**

## Batas
Tidak terintegrasi dengan M03/Flask/APEL/SDM, bukan login riil, tidak ada audit yang dapat dipercaya secara hukum, tidak ada berkas nyata dan tidak ada tanggal resmi. Data tidak disimpan, hilang saat halaman dimuat ulang. Paket, pendanaan, distribusi, dan BAST **belum dibuat**.

**Jangan menjalankan QA/tes/CI sebelum instruksi pemilik.** Semua pemeriksaan tertunda di [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
