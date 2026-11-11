# M04-S3 | Rencana dan Tindak Lanjut Administratif

**KODE DITULIS, BELUM DIUJI.** Tidak ada CL, test runner, CI, browser runtime, pengujian keamanan, atau akses data nyata.

M04-S3 mengambil referensi **metadata_tercatat** dari M04-S2 **DEMO** (bukan keputusan sah) lalu menyiapkan rencana tindak lanjut berupa permintaan klarifikasi dan penyusunan bahan administrasi. Penutupan tugas tidak berarti dokumen eksternal asli, bantuan disetujui, atau proses pengadaan/BAST boleh berjalan.

## Isi
- `followup.mjs`: daftar tugas immutable, gerbang sumber dan versi, kategori tugas, penanggung jawab DEMO, draf, penugasan, proses, catatan pekerjaan, telaah dan pembatalan, histori serta ringkasan baca-saja.
- `fixtures.mjs`: menghasilkan berkas M04-S1 dan referensi M04-S2 fiktif lewat kontrak yang telah ditulis, bukan data produksi.
- `index.html`, `main.mjs`, `style.css`: tampilan formulir contoh untuk HP, tugas, status, dan teks ringkasan. Belum diuji, tidak boleh menyatakan berfungsi nyata.

## Aturan pembatasan
1. Status `metadata_tercatat` hanya menunjukkan **metadata dicatat**, bukan verifikasi pihak penerbit, keaslian, atau putusan yang sah.
2. Tugas berupa **menyiapkan** klarifikasi, daftar kesesuaian, telaah arsip atau pembahasan. Sistem tidak menghubungi penerbit dan tidak melakukan pemeriksaan resmi.
3. Semua pelaku berawalan `DEMO-`; role chooser bukan login/otorisasi dan histori dalam memori bukan audit sah.
4. Tugas `ditutup_administratif` berarti **catatan ditelaah**, bukan masalah fasilitas selesai, bantuan diberikan, anggaran tersedia, pengadaan, distribusi atau BAST.
5. Jika sumber M04-S1/M04-S2 berubah, operasi ditolak sambil menunggu kajian ulang. Tanggal hanyalah contoh, bukan pengingat otomatis.
6. Tidak ada integrasi Flask, DB, SRIKANDI, e-budgeting, arsip pemerintah ataupun produksi.

[Spesifikasi M04-S3](../../docs/M04_S3_ADMIN_FOLLOWUP.md) · [Antrean pemeriksaan tertunda](../../docs/TEST_BACKLOG.md).

**Jangan jalankan CL, tes atau CI sampai pemilik proyek memberi izin.**
