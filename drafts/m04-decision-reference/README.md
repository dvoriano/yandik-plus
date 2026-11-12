# M04-S2 | Register Referensi Keputusan/Dokumen Eksternal

**KODE DITULIS, BELUM DIUJI. Tidak ada CL, tes, CI, pemanggilan layanan berbayar, atau penggunaan data riil.**

## Tujuan
Mencatat **metadata referensi** terhadap dokumen yang **diklaim telah diterbitkan oleh pihak berwenang di luar YANDIK+**, ketika berkas administrasi DEMO M04-S1 sudah **dicatat sebagai bahan pertimbangan**. Tidak membuat atau menerbitkan dokumen itu sendiri.

## Komponen
- `reference_register.mjs`: model register hingga 25 catatan, anti-duplikat nomor DEMO, draf → pengajuan pemeriksaan → catatan metadata/perlu klarifikasi/tidak sesuai, histori dan penanda sumber usang.
- `fixtures.mjs`: membuat sumber dossier dari fungsi M04-S1 pada data fiktif, bukan mengambil data asli.
- `main.mjs`, `index.html`, `style.css`: contoh form dan daftar metadata, pilihan tambah referensi baru tanpa menghapus daftar lama, pemeriksaan dua peran DEMO, ringkasan baca-saja.
- [Spesifikasi proses bisnis M04-S2](../../docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md).

## Aturan pengendalian
1. **Tidak ada fungsi menyetujui bantuan, anggaran, belanja, paket, penerima, distribusi ataupun BAST.**
2. `metadata_tercatat` hanya berarti keterangan dicatat oleh penelaah DEMO. **Bukan keaslian dokumen, bukan keabsahan hukum, bukan bukti keputusan benar telah terbit.**
3. Nomor, penerbit dan sumber referensi harus berawalan **DEMO-**. Jangan memasukkan nomor/tanggal surat kedinasan asli atau data orang.
4. Persetujuan atau penerbitan keputusan tetap harus dilakukan **secara terpisah melalui pejabat dan sistem resmi**.
5. Label role DEMO bukan autentikasi. Sumber hanya memori browser; **bukan audit**. Tidak ada file upload/konfirmasi penerbit.
6. Belum terintegrasi ke M03 asli, Flask, database, SRIKANDI, pengadaan, dashboard atau website produksi.
7. **Semua pemeriksaan tertunda**, lihat [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

## Kelanjutan
M04-S3 baru dapat merancang pencatatan *rencana tindak lanjut administratif* tanpa mengubah status referensi menjadi sah/approved, sedangkan distribusi dan BAST tetap RENCANA.
