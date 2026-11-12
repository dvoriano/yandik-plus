# M04-S9D | Register Catatan Hasil Pembahasan Kelembagaan DEMO

**Status:** KODE DITULIS, **BELUM DIUJI**. Disusun 11 November 2026.  
**Kode:** [drafts/m04-institutional-minutes/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-minutes).

## Posisi dalam alur YANDIK+
- M04-S8: rancangan 12 persyaratan kelembagaan dan perubahan katalog.
- M04-S9: rencana tindak lanjut kekurangan atas telaah DEMO.
- M04-S9B: ringkasan eksekutif DEMO.
- M04-S9C: agenda dan kebutuhan bukti untuk pembahasan.
- **M04-S9D:** pencatatan masukan pembahasan contoh, kebutuhan bukti, rencana langkah berikutnya, penanggung jawab DEMO, tanggal rencana serta pembacaan oleh penelaah berbeda.

**Kedudukan penting:** M04-S9D bukan berita acara rapat yang sah, keputusan pejabat, pengesahan SOP, atau penilaian kelayakan integrasi. Tidak dapat mengubah source, unit, katalog, perizinan, penerima bantuan, alokasi, pengadaan, distribusi maupun BAST.

## Sumber dan data yang boleh digunakan
Sumber wajib paket M04-S9C dengan status synthetic DEMO dan daftar butir yang belum diputuskan manusia. Satu item agenda hanya boleh mempunyai satu catatan pada register contoh agar tidak ada dua versi aktif dari rapat yang tidak terbukti. Penulisannya hanya memakai kode petugas DEMO serta teks contoh; **jangan mengisi nama, nomor surat, alamat, dokumen atau data asli** selama repository masih public dan belum ada tata kelola data riil.

Pemeriksaan sumber dilakukan dengan membandingkan snapshot agenda. Ketika sumber berubah, **mutasi harus ditahan** dan ringkasan hanya boleh memberitahukan bahwa sumber lama perlu dikaji ulang. Ini kontrak rancangan, **BELUM DIUJI**.

## Form dan alur
| Tahap | Pelaku label DEMO | Hasil catatan |
|---|---|---|
| Catat | Sekretariat contoh | Masukan agenda, bukti yang harus disiapkan, langkah lanjut, penanggung jawab dan tenggat contoh |
| Ajukan pembacaan | Sekretariat asal | Draf menjadi menunggu telaah |
| Kembalikan | Penelaah contoh berbeda | Perlu perbaikan dan alasan |
| Revisi | Sekretariat asal | Kembali ke draf, histori lama tidak dihapus |
| Catat sebagai bahan | Penelaah contoh berbeda | Catatan dibaca untuk bahan saja, bukan persetujuan |
| Batalkan | Sekretariat asal | Catatan dibatalkan dengan alasan dan histori |

Review hanya mengizinkan **minta_perbaikan** atau **catat_sebagai_bahan**, tidak punya pilihan pengesahan, kelayakan, penetapan bantuan atau persetujuan anggaran. Walau semua item dicatat sebagai bahan, status integrasi tetap **BELUM DINILAI**.

## Antarmuka dan batas
Form dan ringkasan disiapkan pada index.html + main.mjs. Riwayat berada di memori halaman, tidak tersimpan permanen, bukan tanda tangan/arsip resmi. Pembuatan ringkasan teks hanya untuk disalin lalu ditelaah manual. Belum tersedia autentikasi, otorisasi wilayah, penyimpanan, notifikasi, API maupun audit permanen.

Delapan skenario pengujian ditulis pada folder tests, namun **tidak dijalankan**. Rinciannya dicatat pada TEST_BACKLOG. Tidak ada CL, CI, tes browser, deployment atau perubahan main dan produksi.

## Rencana akses GitHub
Pemilik menyampaikan rencana **mengubah repo menjadi private pada Sabtu, 14 November 2026**. Ini status **RENCANA / MENUNGGU TINDAKAN PEMILIK**, bukan perubahan yang telah dilakukan; pengingat Sabtu sudah dijadwalkan secara terpisah. Sampai GitHub menunjukkan private pada pemeriksaan berikutnya, perlakukan repo sebagai **PUBLIC** dan larang data riil/rahasia.

## Tahap berikut
Penutupan daftar keputusan akses dan klasifikasi informasi, pemetaan pengampu proses asli, telaah kelembagaan/SPBE, kemudian QA berurutan **hanya setelah izin eksplisit pemilik**. M04-S10+ untuk proses keputusan resmi/pengadaan/distribusi/BAST tetap RENCANA.
