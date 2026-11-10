# M00 | Catatan Source Snapshot (Arsip Panduan Impor)

> **Jalur impor Windows/PowerShell/ZIP tidak lagi digunakan.**  
> Sejak keputusan 10 November 2026, pemilik meminta **seluruh pekerjaan hanya di GitHub** dan tidak ingin disuruh mengunduh berkas atau melakukan setup luar. Jangan mengarahkan pengguna ke cara lama.

## Kondisi sebenarnya
- Snapshot aplikasi Flask dari website YANDIK+ sudah pernah diperiksa secara statis dan disalin menjadi arsip offline **171 file** dalam percakapan terdahulu.
- Source tersebut **belum** ditambahkan sebagai file/folder ke GitHub `develop/yandik-foundation`.
- GitHub saat ini berisi spesifikasi dan validator awal `scripts/verify_import.py`. Jangan menyebut GitHub sudah memuat implementasi aplikasi lengkap.
- Arsip di chat mungkin tersedia dalam konteks percakapan tertentu, tetapi tidak dapat disamakan dengan file GitHub. Jangan menganggap chat berikut punya akses otomatis pada arsip.

## Cara melanjutkan TANPA laptop atau VPS
1. Gunakan connector GitHub untuk perubahan dokumen, desain, data contoh dan kode independen yang memungkinkan.
2. Untuk impor source lama: gunakan fasilitas tool yang betul-betul dapat mengirim isi source ke GitHub secara langsung dan aman. Pastikan file benar-benar disimpan pada branch dan diperiksa setelahnya.
3. Jika kemampuan itu belum tersedia, tandai subpekerjaan M00-D **belum selesai / tertunda**, lanjutkan bagian M00 lain yang independen. Tidak perlu meminta manual push.
4. Hindari menyalin `data/`, `uploads/`, `backups/`, kredensial, file lingkungan, database, dan informasi pribadi.
5. Verifikasi source, sintaks, data dummy, dependensi, dan pengujian sebelum M00 berstatus SELESAI.

## Berkas pengembangan terdahulu
Paket `YANDIK_PLUS_OFFLINE_SOURCE_2026-11-10.zip` dan manifest SHA-256 dibuat pada percakapan sebelumnya. Pemeriksaan dasar yang tercatat: 171 berkas; 6/6 berkas wajib; manifest 171/171 sesuai; dua tes sintaks awal lulus. **Hasil ini untuk salinan offline, bukan tes pada kode di GitHub.**

## Tautan kerja aktual
- [PROJECT_STATE.md](../PROJECT_STATE.md)
- [ROADMAP.md](ROADMAP.md)
- [WORKLOG.md](WORKLOG.md)
- [M00 Issue #1](https://github.com/dvoriano/yandik-plus/issues/1)
- [PR #9](https://github.com/dvoriano/yandik-plus/pull/9)

Tidak ada koneksi ke VPS, layanan APEL aktif, atau database produksi.
