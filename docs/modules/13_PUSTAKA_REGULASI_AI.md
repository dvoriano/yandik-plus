# MOD-13 | Regulasi, Panduan, SOP dan AI Opsional

**Milestone:** M11  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Website memiliki berita/regulasi/panduan dan konten referensi; AI sebagai asisten kegiatan adalah usulan pengembangan dan tidak harus dipakai untuk fitur inti.

## 2. Tujuan
Petugas dapat menemukan jawaban praktis tentang prosedur dan juknis tanpa harus bertanya berulang melalui grup, dan menyiapkan draf dokumen dengan cepat.

## 3. Pengguna dan hak akses
- Petugas Puskeswan
- pengawas
- admin konten
- verifikator
- pimpinan
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Pustaka regulasi, SOP, juknis, instruksi, FAQ dan formulir contoh
- Pencarian berdasarkan istilah awam, tugas, jenis dokumen dan tanggal berlaku
- Tautan tiap petunjuk ke form atau tahapan kegiatan yang sesuai
- Konten versioned dengan penerbit, tanggal, status aktif/tidak berlaku
- Template draf berita acara, berita, pengumuman dan ringkasan
- AI opsional untuk pencarian/rangkuman/draf berbasis dokumen terverifikasi
- Tombol laporkan informasi keliru dan persetujuan editor untuk perbaikan

## 5. Alur kerja pengguna
Cari pekerjaan/pertanyaan → buka langkah atau dokumen resmi → jalankan formulir terkait → bila perlu buat draf → periksa manusia sebelum dipakai.

## 6. Objek data (usulan, belum migrasi final)
- knowledge_doc, category, version, effective_date
- source_ref, owner, validity_status
- draft_request minimal, review_status
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Seluruh modul dapat menautkan SOP/FAQ; AI menggunakan data yang diizinkan dan memiliki audit, tidak membuat keputusan resmi otomatis.

## 8. Checklist pengembangan
- [ ] MOD-13-01: Inventaris regulasi dan juknis yang sudah tayang
- [ ] MOD-13-02: Standarisasi tag, versi, tanggal berlaku dan kepemilikan konten
- [ ] MOD-13-03: Buat FAQ berbasis tugas dan pencarian non-AI
- [ ] MOD-13-04: Buat generator draf template deterministik
- [ ] MOD-13-05: Rancang AI opsional tanpa menjadikan token berbayar syarat operasional

## 9. Kriteria selesai
Pencarian FAQ/juknis tanpa AI bekerja; setiap dokumen menampilkan sumber dan versi; draf tidak otomatis menjadi keputusan resmi.

## 10. Catatan batasan, risiko, dan UX
Jangan mengunggah data pribadi ke model eksternal tanpa dasar dan pengendalian yang sesuai. Produk harus dapat digunakan penuh tanpa biaya token AI.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
