# Standar UX YANDIK+ | Paperless, Ramah Petugas Lapangan

## Sasaran
Petugas yang hanya terbiasa WhatsApp dan formulir sederhana dapat menyelesaikan tugas utama melalui ponsel tanpa pelatihan panjang.

## 10 kaidah wajib
1. **Beranda tugas saya** sebelum daftar menu; tampilkan maks. 3 tindakan terpenting.
2. **Istilah pekerjaan**, bukan jargon teknis. Contoh: "Isi pelayanan bulan ini", "Laporkan kebutuhan", "Cetak rekap".
3. **Tiga langkah untuk tugas sederhana**: pilih → isi → kirim; proses yang rumit boleh lebih dari tiga dengan progres jelas.
4. **Data identitas terisi otomatis** dari akun: Puskeswan, kab/kota, pelapor, tanggal.
5. **Simpan draf** otomatis; pesan konfirmasi saat berhasil dan alasan yang jelas jika gagal.
6. **Tampilan HP lebih dulu**, tombol cukup besar, label permanen, kontras dan teks mudah dibaca.
7. **Pertanyaan sedikit dan relevan**; tampilan bercabang berdasarkan pilihan sehingga yang tidak berlaku disembunyikan.
8. **Angka nol jelas**: bila tidak ada kegiatan, bisa isi 0 sesuai juknis; jangan artikan kosong sebagai nol.
9. **Lihat dan perbaiki sebelum kirim**; untuk data terkirim perlu jejak revisi dan hak akses.
10. **Tidak menyalin laporan lagi**: data yang sah menghasilkan rekap, draf berita acara, dan laporan terstruktur.

## Contoh beranda per peran
- Puskeswan: Isi Laporan; Profil Saya; Kebutuhan Saya; Rekap; Panduan.
- Kab/kota: Puskeswan di Wilayah; Verifikasi; Jadwal Pembinaan; Rekap Wilayah.
- Pengawas: Jadwal; Periksa Sarana; Temuan; Tindak Lanjut; Laporan.
- Provinsi: Antrian Verifikasi; Peta Kebutuhan; Bantuan; Pengawasan; Analitik.
- Pimpinan: Ringkasan; Permasalahan; Tindak Lanjut; Laporan, mode baca.

## Pola formulir
- Bagian besar dibuat wizard pendek: Identitas → Kegiatan/Kebutuhan → Bukti → Ringkasan → Kirim.
- Form wajib menjelaskan satuan, periode, cara hitung, dan contoh pengisian.
- Lampiran foto memiliki pratinjau, ukuran maksimum, dan alasan bila unggahan gagal.
- Verifikasi tidak menghapus laporan; petugas menerima catatan perbaikan dengan tautan ke isian spesifik.
- Browser/network yang tidak stabil: simpan draf lokal yang aman, beri peringatan bahwa sinkronisasi belum terjadi, cegah duplikasi kirim.

## Penerapan M02-S2 sampai M02-S3
- [x] Prototype mobile-first [Profil Saya](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan/) memiliki status per bagian, tombol besar, petunjuk singkat, dan langkah draf → ajukan → review.
- [x] State model 20 tes Node dan lintas-test Python+Node lulus [GitHub Actions](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701).
- [x] Tes Chromium headless pada viewport 320/375 px, tidak ada overflow horizontal, alur draf/perbaikan/verifikasi dan tanpa error JS [GitHub Actions](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703).
- [ ] Uji aksesibilitas mendalam: keyboard penuh, screen reader, ukuran teks, kontras, jaringan lambat, HP fisik dan petugas nonteknis **belum dilakukan**.
- [ ] Uji kemampuan pengguna menyelesaikan tugas tanpa arahan dan pengukuran durasi/kesalahan.

## Ukuran keberhasilan dalam tes pengguna
- Minimal 5 tugas: kirim APEL, ubah profil, ajukan kebutuhan, cek status, unduh laporan.
- Uji dengan pengguna nonteknis dan HP kelas menengah/bawah, termasuk koneksi lemah.
- Catat keberhasilan tanpa bantuan, durasi, salah input, kebutuhan koreksi, dan kepuasan. Nilai target ditetapkan setelah uji awal, bukan diada-adakan.
- Semua status penting dapat dipahami tanpa mengandalkan warna atau ikon saja.
