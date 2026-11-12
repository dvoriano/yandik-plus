# YANDIK+ | Kajian Akses Repository GitHub dan Perlindungan Informasi

**Disusun:** 11 November 2026 (WIB)  
**Kedudukan:** bahan rekomendasi, bukan keputusan pemilik repository atau instansi.  
**Pengaturan repository BELUM DIUBAH.**

## Rencana waktu yang dinyatakan pemilik
Pemilik berencana mengubah repository menjadi **PRIVATE pada Sabtu, 14 November 2026**. Per 11 November 2026 tindakan ini **BELUM DILAKUKAN** dan tidak ada otomasi perubahan visibilitas yang dijalankan. Pemeriksaan terbaru hanya menunjukkan PUBLIC. Pada hari pelaksanaan, konfirmasi ulang hasil perubahan dan akses kolaborator; jangan menganggapnya selesai dari rencana saja.

## Temuan terbatas yang teramati
- Koneksi GitHub menyatakan repository dvoriano/yandik-plus memiliki visibilitas **PUBLIC** pada 11 November 2026. Ini berarti pembatasan akses pembaca yang diasumsikan pada beberapa naskah lama tidak berlaku.
- Branch pengembangan adalah develop/yandik-foundation; Pull Request #9 masih draft ke main saat diperiksa.
- Pohon source branch pengembangan memuat **195 entri**, tidak terpotong. Pencarian **nama berkas dan ekstensi** sensitif pada pohon ini hanya menemukan .env.example. Berkas contoh itu berisi tiga nama variabel dengan nilai contoh/placeholder, bukan bukti bahwa keseluruhan repo dan seluruh sejarah commit bebas dari rahasia.
- .gitignore memuat pola dasar untuk .env, berkas .db/.sqlite/.sql, .pem/.key, backups dan uploads. Ini **bukan pengendali keamanan retroaktif** dan tidak menghapus berkas yang sudah pernah dikomit.
- Audit **belum** memeriksa semua konten, seluruh histori Git, fork, artefak Actions, cache, releases, atau seluruh data yang telah terpublikasi.

## Dua opsi untuk keputusan pemilik
| Opsi | Cocok bila | Syarat sebelum penggunaan |
|---|---|---|
| **PRIVATE** (direkomendasikan sementara untuk bahan internal) | Naskah kerja/konsep kelembagaan membutuhkan pembatasan pembaca | Pemilik repo menentukan anggota yang perlu akses; cek dampak kolaborator, forks dan layanan yang bergantung pada repository |
| **PUBLIC** | Memang disetujui sebagai proyek kode yang boleh terbuka | Telaah seluruh data, sejarah commit, identitas, tautan, lisensi dan klasifikasi informasi; jangan memuat dokumen internal/rahasia |

**Keterbukaan kode tidak pernah berarti informasi kedinasan bebas dipublikasikan.** Mengubah repo menjadi private juga **tidak menarik kembali** file yang mungkin telah disalin, dilihat, dicache atau di-fork saat public. Jika kelak ditemukan credential yang pernah terunggah, pengendali layanan harus mencabut/mengganti credential tersebut dan menilai penyebarannya.

## Langkah manual bila pemilik memutuskan PRIVATE
1. Buka github.com/dvoriano/yandik-plus menggunakan akun pemilik.
2. Pilih **Settings → General**, lalu bagian **Danger Zone → Change repository visibility**.
3. Pilih **Make private** dan ikuti konfirmasi GitHub.
4. Setelah selesai, periksa ulang visibilitas pada halaman repository, hak kolaborator, Pull Request dan ketergantungan layanan publik yang mungkin terdampak.

**Tidak ada perubahan settings otomatis** pada tahap M04-S9C karena opsi visibilitas membutuhkan keputusan pemilik dan konektor yang tersedia hanya dipakai untuk pembacaan/penulisan berkas, bukan pengaturan akses.

## Checklist proteksi sebelum memasukkan data asli
- [ ] Keputusan tertulis pemilik mengenai visibilitas dan klasifikasi dokumen.
- [ ] Telaah keseluruhan isi source + histori commit dan temuan scanner yang diizinkan. Tidak dilakukan pada tahap CODE_ONLY.
- [ ] Inventaris akses kolaborator dan pihak yang dapat mengunduh data.
- [ ] Validasi bahwa fixture dan demo tetap fiktif, bukan data hewan/pemilik/pegawai asli.
- [ ] Aturan rahasia, kunci dan koneksi hanya melalui konfigurasi aman di luar repository.
- [ ] Kebijakan bukti, arsip, retensi dan akses wilayah disepakati dengan unit berwenang.
- [ ] Rencana penanganan insiden serta rotasi credential jika ditemukan paparan.
- [ ] Pemeriksaan kelayakan security, SPBE dan proses perubahan resmi sebelum integrasi riil.

**Status:** TERBUKA. Jangan menandai selesai hanya karena dokumen ini ada.
