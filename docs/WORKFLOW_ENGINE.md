# Mesin Alur Kerja Bersama | YANDIK+

## Prinsip
Pengawasan, dukungan Puskeswan, pembinaan, investigasi dan administrasi menggunakan komponen bersama; **formulir dan kewenangan setiap kegiatan tetap berbeda**.

## Komponen ulang-pakai
- Nomor kegiatan + pemilik dan wilayah.
- Templat formulir bertipe/versioned dengan validasi.
- Lampiran/bukti terikat objek, uploader dan izin akses.
- Penugasan serta antrian pemeriksaan.
- Status dan transisi; alasan penolakan/perbaikan.
- Berita acara/laporan draft generator berbasis data.
- Catatan aktivitas dan revisi append-only (tanpa informasi rahasia).
- Pengingat jatuh tempo, dashboard status.

## Status dasar
DRAF → DIAJUKAN → DALAM_VERIFIKASI → (PERLU_PERBAIKAN ↔ DIAJUKAN) → DISETUJUI/DITETAPKAN → DITINDAKLANJUTI → SELESAI.  
TERTOLAK dan DIBATALKAN harus menyimpan alasan dan otorisasi. Kegiatan tanpa tahapan persetujuan bisa memakai subset status.

## Aturan penting
1. Status "disetujui sistem" **bukan** pengganti persetujuan pejabat berwenang.
2. Transisi memakai kombinasi role + wilayah + kepemilikan + jenis kegiatan.
3. Tanggal, pelaku, asal data, lampiran dan alasan perubahan wajib dapat diaudit.
4. Generator dokumen hanya menghasilkan draf; tanda tangan/arsip resmi mengikuti sistem dan mekanisme berlaku.
5. Tidak ada input ulang data Puskeswan/wilayah/SDM yang sudah valid.
6. Dokumen dan lampiran harus memiliki aturan retensi dan akses; jangan membuat folder publik terbuka.

## Contoh reuse
- **Support:** usulan → verifikasi → penetapan → distribusi → BAST → evaluasi.
- **Pengawasan:** tugas → pemeriksaan → temuan → rekomendasi → tindak lanjut → tutup.
- **Pembinaan:** rencana → kehadiran/dokumentasi → laporan → rencana perbaikan → verifikasi hasil.
- **PHMS:** laporan kejadian → investigasi → sampel/penanganan → monitoring → tutup.
- **Sertifikat:** permohonan → cek berkas → evaluasi kewenangan → penerbitan pada sistem resmi → rekam hasil.

## Tes minimum
- Transisi ilegal ditolak; termasuk lintas kab/kota yang tidak berwenang.
- Perbaikan tidak menghilangkan audit terdahulu.
- Kegiatan selesai tidak dapat diubah diam-diam.
- Generate dokumen tidak menyertakan data pribadi yang tidak dibutuhkan.
- Simulasi concurrent edit tidak menggandakan persetujuan/BAST.
