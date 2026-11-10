# MOD-00 | Core Platform, Hak Akses dan Komponen Bersama

**Milestone:** M01  
**Status implementasi GitHub:** SEDANG (prototype role/territory + workflow offline diuji; belum terintegrasi Flask).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Snapshot memuat modul auth, user, role/permission, organisasi, wilayah, audit, dan sebagian utilitas platform. Belum dianggap siap sebagai sistem hak akses lintas modul.

## 2. Tujuan
Satu pondasi keamanan, identitas, dan proses pekerjaan yang dipakai oleh semua modul tanpa menambah formulir ganda.

## 3. Pengguna dan hak akses
- Admin provinsi
- verifikator provinsi
- koordinator kab/kota
- petugas Puskeswan
- pengawas
- pimpinan baca saja
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Master Puskeswan dengan ID stabil dan wilayah/organisasi
- Pengguna dan role-teritorial, izin tiap aksi API serta field sensitif
- Pusat tugas pengguna, audit perubahan, log aktivitas penting
- Mesin workflow, bukti, antrian verifikasi dan generator dokumen bersama
- Konfigurasi environment anonim dan migrasi skema versioned
- Pengujian keamanan: akun, upload, reset password, CSRF dan password hashing

## 5. Alur kerja pengguna
Login → lihat tugas sesuai peran → isi kegiatan → kirim → verifikasi → tindak lanjut → rekap.

## 6. Objek data (usulan, belum migrasi final)
- puskeswan_id, wilayah_id, organisasi_id
- user_id, role_id, scope wilayah
- workflow_case, evidence_ref, status_history, audit_event
- metadata dokumen dan retensi
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Seluruh modul di bawah harus memakai ID, hak akses, audit, workflow, dan sumber identitas ini.

## Progres prototype yang sudah terbukti
- [x] Role/territory check default deny untuk Puskeswan, kab/kota, provinsi, pimpinan.
- [x] Workflow in-memory dengan audit append-only, koreksi, alasan, dan batas wilayah.
- [x] 12 tes tambahan pada [CI GitHub: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867).
- [ ] Adaptasi ke endpoint, database dan pengesahan matriks kewenangan sebenarnya.

## 8. Checklist pengembangan
- [ ] MOD-00-01: Peta role dan aksi per jenis pengguna disepakati
- [ ] MOD-00-02: Refactor izin API, data minimization, unggah aman dan credential handling di salinan
- [ ] MOD-00-03: Buat master Puskeswan dan migration contoh sintetis
- [ ] MOD-00-04: Buat workflow dan audit reusable yang diuji
- [ ] MOD-00-05: Buat beranda sederhana dan uji tugas via HP

## 9. Kriteria selesai
Tidak ada pengguna dapat melihat atau mengubah data di luar perannya; jejak setiap perubahan ada; master ID dipakai lintas modul; semua tes negatif otorisasi dan smoke lulus.

## 10. Catatan batasan, risiko, dan UX
P0. Tidak melakukan auth terhadap website produksi; sumber risiko teridentifikasi pada snapshot harus diatasi sebelum suatu versi baru dinyatakan siap untuk deployment.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
