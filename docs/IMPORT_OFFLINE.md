# M00 | Impor Source YANDIK+ untuk Pengembangan Offline

**Status:** SEDANG. Source Flask hasil salinan 10 November 2026 **belum diunggah sebagai folder kode pada branch GitHub ini**. Jangan mengubah status sampai ada commit kode yang diverifikasi.

## Tujuan
Memindahkan salinan *sanitized* dari source aktif YANDIK+ ke branch `develop/yandik-foundation`, **tanpa VPS, token AI Telegram, atau database produksi**. Website https://yandikvo.my.id/ tidak diubah.

## Paket sumber
Paket **YANDIK_PLUS_M00_IMPORT_KIT.zip** disediakan sebagai artefak dalam percakapan ChatGPT proyek YANDIK+. Berisi:
- `YANDIK_PLUS_OFFLINE_SOURCE_2026-11-10.zip`: source Flask, template, aset dan tes dasar (171 file).
- `YANDIK_PLUS_OFFLINE_MANIFEST.csv`: ukuran dan hash SHA-256 masing-masing file.
- `IMPORT_YANDIK_M00.ps1`: impor sekali melalui Git for Windows.
- `README_IMPORT_M00.txt`: petunjuk singkat.

Checksum ZIP source: `ce21f0abe0e91e2f35e317e37d8fdb5fefff0b28b9805bc597a2afb781814d58`

Kit sengaja **tidak disimpan sebagai arsip binary besar di GitHub**, karena sumber seharusnya diimpor sebagai folder kode yang dapat ditinjau per file.

## Persiapan satu kali (Windows)
1. Unduh file **YANDIK_PLUS_M00_IMPORT_KIT.zip** dari percakapan ini.
2. Ekstrak ke folder lokal baru di Windows.
3. Pastikan Git for Windows dan Python 3 sudah tersedia; akun GitHub yang digunakan punya izin menulis ke repo private `dvoriano/yandik-plus`.
4. Buka PowerShell di folder kit dan baca file `IMPORT_YANDIK_M00.ps1`. Jalankan:
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\IMPORT_YANDIK_M00.ps1
   ```
5. Skrip meng-clone **hanya** branch `develop/yandik-foundation`, memverifikasi checksum, mengekstrak kode ke folder kerja Windows yang terpisah, menjalankan dua tes sintaks dasar, menjalankan `scripts/verify_import.py`, dan menampilkan ringkasan file.
6. Ketik `PUSH` setelah membaca ringkasannya. Skrip membuat commit dan mengirim ke branch. Jika tidak mengetik `PUSH`, tidak ada commit/push.

**Tidak pernah jalankan script ini di VPS produksi.** Script ini tidak memiliki perintah SSH, restart, deployment, atau perubahan database.

## Pemeriksaan yang sudah berhasil dilakukan secara lokal
- Integritas ZIP: PASS
- Seluruh 171 entri sesuai hash manifest: PASS
- File wajib: 6/6
- Temuan pola token dari daftar pemeriksaan dasar: 0
- Dua tes standard library pada salinan offline: PASS

Ini **bukan audit keamanan menyeluruh** dan tidak membuktikan aplikasinya sudah bisa dijalankan. Legacy Flask masih memerlukan konfigurasi dan dependensi anonim, regresi APEL, serta perbaikan otorisasi/login/upload sebelum deployment.

## Setelah push
1. Periksa perubahan pada [Draft PR #9](https://github.com/dvoriano/yandik-plus/pull/9).
2. Jalankan ulang `python -B -m unittest discover -s tests -q` dan `python -B scripts/verify_import.py .`.
3. Periksa bahwa `data/`, `uploads/`, `backups/`, `.env`, `ai_config.json`, dan kredensial tidak masuk repo.
4. **M00 masih SEDANG** sampai dependensi, fixture anonim, smoke test dan review akses siap. Status naik ke SELESAI hanya dengan bukti kode dan tes.
5. Setelah M00 selesai, lanjut M01 → M02 → M03 → M04. Semua tetap offline.

Tidak boleh auto-merge ke `main` atau deploy tanpa persetujuan baru.
