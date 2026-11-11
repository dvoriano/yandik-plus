# M04-S4 | Dashboard Antrean Tindak Lanjut Administratif

**KODE DITULIS, BELUM DIUJI.** Tidak menjalankan CL, tes, browser, CI, preview yang dieksekusi, atau layanan berbayar.

## Fungsi yang dirancang
- Baca daftar tugas **DEMO** M04-S3 dan hasil penelusuran referensi M04-S2 tanpa mengubah data sumber.
- Rekap tugas aktif, catatan perlu perbaikan, menunggu telaah, melewati tanggal rencana, sumber berubah, catatan ditutup administratif dan rencana dibatalkan.
- Filter menurut status, penanggung jawab DEMO, kategori perhatian, dan tanggal acuan fiktif yang **dipilih manual**.
- Daftar tugas diurutkan berdasarkan kebutuhan perhatian dan tanggal rencana, **bukan ranking penerima bantuan**.
- Rekap baca-saja untuk dipilih/disalin manual, bukan laporan resmi.
- Ringkasan keseluruhan selalu sebelum filter; jumlah tugas yang tampil ditulis terpisah.

## Batasan
1. Tanggal acuan disediakan pengguna; **jangan mengklaim terlambat menurut tanggal sekarang** bila acuan tidak dipilih.
2. Nilai `ditutup_administratif` hanya berarti catatan diselesaikan dalam simulasi. **Bukan** dokumen sah, bantuan diberikan, anggaran tersedia, pengadaan atau BAST.
3. Metadata M04-S2 tidak diverifikasi ke instansi penerbit. Perubahan sumber dapat ditandai untuk pemeriksaan ulang tetapi tidak otomatis membatalkan tugas.
4. Seluruh contoh petugas, referensi, kegiatan dan tanggal **fiktif**, ada di memori browser dan hilang saat halaman dimuat ulang. Tidak ada akun atau DB.
5. Tidak terhubung ke website produksi YANDIK+, Flask, SRIKANDI, e-budgeting maupun dashboard pimpinan sungguhan.

## Berkas
- `dashboard.mjs`: fungsi rekap murni, klasifikasi perhatian, filter, pengurutan, teks baca-saja.
- `fixtures.mjs`: contoh delapan tugas dengan variasi status melalui kontrak M04-S1/S2/S3.
- `index.html`, `style.css`, `main.mjs`: rancangan tampilan dashboard dan filter.
- [Dokumen M04-S4](../../docs/M04_S4_FOLLOWUP_DASHBOARD.md) dan [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

**Tahap ini hanya dashboard antrean administratif.** Seluruh rancangan paket, distribusi, BAST, keputusan/keuangan resmi tetap RENCANA dan tidak disimulasikan sebagai sudah disetujui.
