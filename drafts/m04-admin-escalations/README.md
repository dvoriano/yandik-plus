# M04-S5 | Kendala dan Eskalasi Administratif Lintas Petugas

**KODE DITULIS, BELUM DIUJI.** Tidak ada CL/CI, runner Node, browser, preview, API, atau penggunaan data riil.

## Rancangan proses
1. **Petugas DEMO M04-S3** menuliskan kendala pekerjaan dan dampaknya, upaya sebelumnya serta kebutuhan koordinasi.
2. Pelapor mengirim draf ke antrean koordinator **DEMO**.
3. Koordinator meneruskan ke penerima/unit tujuan **DEMO** dengan tanggal tanggapan contoh. Tidak ada pengiriman surat atau pemberitahuan otomatis.
4. Penerima mencatat tanggapan, metadata fiktif dan hal yang masih perlu dipastikan.
5. Penelaah terpisah meminta klarifikasi tambahan atau **menutup catatan administratif saja**. Itu **tidak** menyatakan persoalan substantif terselesaikan, dokumen sah, bantuan disetujui, dana tersedia, barang dikirim atau BAST selesai.
6. Pembatalan oleh koordinator memerlukan alasan. Histori tindakan tetap disimpan pada state memori.

## File
- `escalations.mjs`: kontrak kendala, validasi field, status, peran DEMO, anti-duplikasi kendala aktif sejenis pada tugas yang sama, deteksi sumber berubah, histori dan rekap.
- `fixtures.mjs`: satu tugas M04-S3 dan referensi M04-S2 fiktif. Tidak mengambil data sungguhan.
- `main.mjs`, `index.html`, `style.css`: form laporan, penerusan, tanggapan, telaah, pembatalan, daftar status, dan teks rekap baca-saja.

## Pembatasan
- Hanya contoh `DEMO-`; tidak ada autentikasi petugas sebenarnya atau pengiriman ke pihak lain.
- Tanggal acuan demo dipilih manual, bukan SLA/tenggat kedinasan yang sudah disahkan.
- Catatan tersimpan sementara di memori browser, bukan database atau audit yang memenuhi tata naskah.
- Semua tindakan menolak field yang mengklaim keputusan/anggaran/penyaluran.
- Proses konfirmasi ke penerbit, alur keuangan, pengadaan, distribusi, BAST dan keputusan pejabat tetap **di luar** contoh ini.
- **Belum diuji;** semua pemeriksaan dan kekurangan dicatat untuk penyisiran berikutnya.

[Spesifikasi M04-S5](../../docs/M04_S5_ADMIN_ESCALATIONS.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
