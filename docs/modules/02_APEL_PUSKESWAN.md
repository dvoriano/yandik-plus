# MOD-02 | APEL Puskeswan 2.0: Pelaporan dan Apresiasi

**Milestone:** M05  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Pengisian pelayanan bulanan, dashboard, Data Saya, checklist kepatuhan, profil, rekap dan penghargaan sudah menjadi bagian website. Detail aturan berdasarkan juknis APEL harus dipertahankan.

## 2. Tujuan
Pelaporan bulanan yang makin mudah, rapor kinerja dan pengambilan keputusan tanpa menyuruh Puskeswan memasukkan ulang seluruh pelayanan.

## 3. Pengguna dan hak akses
- Pelapor Puskeswan
- verifikator provinsi
- koordinator wilayah
- pimpinan
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Form bulanan dengan validasi angka, keterangan, draf dan riwayat revisi
- Pelacakan pelaporan per bulan dan tenggat, termasuk cek bulan kosong
- Tren bulanan/triwulan/tahunan dan komparasi internal yang adil
- Rapor Puskeswan dengan dimensi pelayanan, kepatuhan laporan, kesiapan dan pembinaan
- Aturan penilaian apresiasi berversi per tahun dan parameter/tie-breaker terdokumentasi
- Peringatan data tak wajar untuk ditinjau, bukan koreksi otomatis
- Ekspor rekap Excel/PDF dan format berita/pengumuman yang mudah dibaca

## 5. Alur kerja pengguna
Puskeswan pilih bulan → angka + bukti → pratinjau → kirim → koreksi jika diminta → rekap/rapor otomatis diperbarui.

## 6. Objek data (usulan, belum migrasi final)
- laporan_bulanan, puskeswan_id, periode YYYY-MM
- jumlah per jenis layanan, sumber dan bukti
- report_revision, validation_flag, scoring_rule_version
- annual_report_card, audit_verification
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Satu profil dan SDM, dashboard pimpinan, dukungan berbasis kebutuhan. Integrasi iSIKHNAS bersifat impor/rekap sesuai izin, bukan mewajibkan input ganda.

## 8. Checklist pengembangan
- [ ] MOD-02-01: Tuliskan regresi aturan penghitungan APEL 2026
- [ ] MOD-02-02: Rancang simpan draf, status terlambat dan perbaikan data
- [ ] MOD-02-03: Versikan rumus penilaian 2027 tanpa mengubah 2026
- [ ] MOD-02-04: Buat rapor & peringatan anomali terjelaskan
- [ ] MOD-02-05: Buat generator laporan triwulan/semester/tahunan

## 9. Kriteria selesai
Untuk contoh data yang sama, rekap 2026 identik dengan sebelum pengembangan; satu entri layanan bulanan per Puskeswan; laporan 2027 memakai aturan yang disetujui.

## 10. Catatan batasan, risiko, dan UX
Juknis: nol bila tidak ada kegiatan; investigasi berdasarkan lokasi/kejadian; pemeriksaan hewan kurban ante dan post pada satu hewan tidak dihitung dua; APEL melaporkan pelayanan Puskeswan, bukan per individu; tenggat bulanan sesuai ketentuan (umumnya tanggal 9, publikasi 10). Tidak menjadikan papan apresiasi sebagai pembanding mutlak daerah.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
