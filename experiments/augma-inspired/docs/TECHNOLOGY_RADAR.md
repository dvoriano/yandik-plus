# Radar teknologi: Augma → kemungkinan YANDIK+

**Tanggal kajian awal:** 23 November 2026  
**Sifat:** ide/arsitektur; bukan klaim bahwa seluruh produk pada portofolio tersedia sebagai repo open-source.

| Kandidat | Referensi/konsep | Nilai untuk YANDIK+ | Tingkat | Tahap | Batasan |
|---|---|---|---|---|---|
| Peta dan dashboard situasional | Augma: data maps / immersive visualisation | Sebaran Puskeswan, kepatuhan laporan, rekap pelayanan, kebutuhan lapangan | P1 | PoC mandiri | Peta geografis dan data resmi harus diverifikasi |
| Tanya-data untuk pengelola | Augma: AI tools / assistants | Tanya pelaporan, pencarian laporan, penjelasan indikator | P1 | Mock berbasis aturan | Tidak boleh mengarang data; akses berdasar peran |
| Visualisasi Three.js / XR | Augma Holo-Explorer (Three.js) | Belajar visual 3D, pameran, eksplorasi informasi | P2 | Riset | Performa browser, aksesibilitas, lisensi |
| Gestur tangan / webcam | Augma Holo-Explorer | Media edukasi non-kontak | P3 | Riset | Persetujuan kamera; tidak perlu penyimpanan video |
| AI lokal pada server pribadi | Kajian independen, bukan klaim source Augma | Mendukung pencarian dokumen tanpa kirim data sensitif ke luar | P2 | Kajian teknis | STB kemungkinan tidak cocok untuk model besar; uji RAM/CPU |
| Radar V2 bot trading | Adaptasi pola *visual telemetry*, bukan kode trading | Visualisasi status scanner dan bukti data | P3 | Hanya konsep | Jangan sambungkan API Indodax; bot tetap READ ONLY |

## Prototipe pertama

**Command Center Demo** = dashboard statis dengan ringkasan, diagram titik skematis, filter wilayah yang belum lengkap laporan, dan jawaban berbasis aturan. **Semua angka fiktif**, tidak boleh ditafsirkan sebagai kondisi kab/kota nyata.

## Kriteria penilaian sebelum lanjut

1. Apakah fitur menghemat waktu petugas/pengelola dibanding dashboard biasa?
2. Apakah jelas membedakan data tidak tersedia vs nilai nol?
3. Dapatkah berjalan pada HP/laptop tanpa GPU khusus?
4. Bisakah berjalan offline/dengan koneksi internet buruk?
5. Apakah data dan jejak tindakan bisa diaudit?
6. Apakah lisensi pihak ketiga mengizinkan cara penggunaan yang dimaksud?
7. Apakah tidak mengganggu sistem utama, anggaran, dan tata kelola SPBE?

**Hindari:** membuat hologram sebagai syarat kerja petugas, mencantumkan statistik resmi palsu, serta integrasi langsung ke produksi sebelum uji dan persetujuan.
