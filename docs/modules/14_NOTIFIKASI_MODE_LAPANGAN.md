# MOD-14 | Notifikasi, Pengingat dan Mode Lapangan (PWA)

**Milestone:** M09  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Ada fitur notifikasi dasar di aplikasi; mode offline/draf dan pengalaman HP yang konsisten belum terverifikasi sebagai lengkap.

## 2. Tujuan
Petugas tidak melewatkan laporan, pemeriksaan dan tindak lanjut, serta tetap dapat bekerja saat jaringan lambat.

## 3. Pengguna dan hak akses
- Semua pengguna, sesuai hak akses masing-masing
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Tugas saya dan pengingat laporan APEL bulanan
- Notifikasi pemeriksaan terjadwal, dokumen hampir kedaluwarsa, koreksi data
- Pengingat usulan bantuan dan tindak lanjut temuan melewati tenggat
- Kotak masuk notifikasi dalam aplikasi, preferensi dan riwayat dibaca
- Draf formulir tahan gangguan jaringan serta retry sinkronisasi aman
- Mode PWA dapat dipasang di HP tanpa membuat aplikasi Android khusus
- Desain anti-spam, ringkasan harian dan tidak mengirim data pribadi di isi pesan

## 5. Alur kerja pengguna
Tugas muncul di beranda → buka kegiatan → simpan draf (offline bila tersedia) → sinkron saat terkoneksi → lihat bukti berhasil.

## 6. Objek data (usulan, belum migrasi final)
- notification_id, event_type, recipient_scope
- delivery_channel, dedupe_key, read_at
- offline_draft, sync_status, conflict_resolution
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
APEL, profil, pengawasan, Support, dokumen, pembinaan; kanal Telegram/WhatsApp/email hanya opsional setelah izin dan kebijakan.

## 8. Checklist pengembangan
- [ ] MOD-14-01: Susun katalog event yang benar-benar penting dan prioritas
- [ ] MOD-14-02: Implementasi notifikasi dalam aplikasi dan anti-duplicate
- [ ] MOD-14-03: Rancang penyimpanan draf yang aman dan indikator sinkronisasi
- [ ] MOD-14-04: Uji konflik perubahan data ketika perangkat offline
- [ ] MOD-14-05: Uji pada HP sederhana dan internet tidak stabil

## 9. Kriteria selesai
Tugas penting terlihat tanpa harus mencari menu; satu kejadian tidak menghasilkan spam; draf tidak hilang atau terkirim ganda saat koneksi terputus.

## 10. Catatan batasan, risiko, dan UX
Jangan menyimpan token atau dokumen sensitif sembarangan di cache browser; konten notifikasi tidak memuat detail rahasia.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
