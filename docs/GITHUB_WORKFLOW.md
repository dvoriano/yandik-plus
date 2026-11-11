# Protokol Pengembangan YANDIK+ | GitHub-only

**Keputusan pemilik pada 10 November 2026:** ChatGPT bekerja **langsung di repository GitHub**. Tidak meminta pengguna mengunduh, menyiapkan laptop, memasang Git/Python, atau menjalankan perintah SSH/VPS untuk fase ini.

## Sumber kebenaran yang dibaca setiap chat
1. `PROJECT_STATE.md` (root): handoff singkat, keputusan final, posisi pekerjaan dan langkah berikut.
2. `docs/ROADMAP.md`: **satu sumber status milestone** dan checklist.
3. `docs/WORKLOG.md`: catatan kronologis tiap sesi/commit.
4. `docs/modules/*.md`: spesifikasi, alur dan checklist per modul.
5. `docs/CHANGELOG_ROADMAP.md`: keputusan menambah/mengubah/menghapus ruang lingkup.

## Mode aktif sejak 11 November 2026: coding tanpa CL/CI
- Perintah owner: **tulis kode dulu, jangan gunakan CL maupun menjalankan tes/CI**, simpan jatah CL untuk bot Indodax.
- Baca [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md) dan simpan item QA di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Kode baru yang belum perlu terintegrasi masuk direktori `drafts/`, bukan `prototypes/` atau `foundation/` yang dapat memicu workflow.
- Commit tambahkan `[skip ci]`, tidak menjalankan `workflow_dispatch` atau tes otomatis/manusia.
- Status wajib **KODE DITULIS, BELUM DIUJI** sampai owner mengizinkan penyisiran. Tidak mengubah status SUCCESS kode lama.

## Satu siklus pekerjaan
1. **READ**: GitHub fetch state + roadmap + log + branch head + issue/PR relevan.
2. **DO**: kerjakan satu unit kecil melalui GitHub connector, di branch pengembangan dan gunakan data sintetis.
3. **VERIFY**: fetch file yang dibuat/diubah untuk memastikan commit ada dan isi cocok. Jika tes tidak dapat dijalankan, tulis **BELUM DIUJI**; jangan klaim lulus.
4. **RECORD**: update dokumen modul, roadmap, worklog, dan root PROJECT_STATE setelah hasil nyata. Perubahan desain juga masuk changelog.
5. **REPORT**: jawab pengguna dengan hasil, tautan GitHub, status terbaru dan langkah selanjutnya, tanpa menuntut langkah manual di laptop.

## Aturan status
- **RENCANA → SEDANG** hanya bila ada pekerjaan awal nyata dalam GitHub.
- **SEDANG → SELESAI** hanya bila kriteria penerimaan + bukti terkait terpenuhi.
- **TERTUNDA** untuk kendala yang tidak bisa diatasi dengan konektor; jangan meminta setup eksternal.
- **DIBATALKAN** hanya dengan catatan alasan dan dampak di CHANGELOG.
- Jika modul hanya baru punya spesifikasi, tulis **"spesifikasi selesai, implementasi rencana"**.

## Batas tindakan
- Jangan menulis ke website atau VPS produksi, basis data hidup, atau repo Indodax.
- Jangan memasukkan data pribadi, kredensial atau file internal produksi.
- Jangan melakukan auto-merge PR draft atau mengklaim kode sudah deployed.
- Gunakan GitHub issue/PR/commit sebagai bukti, **bukan teks chat**.
- Jika pengguna mengganti prioritas, catat di changelog dan perbarui state/roadmap supaya chat berikutnya tidak mengerjakan instruksi lama.

## Saat diminta "cek GitHub"
Jawaban harus selalu berdasarkan **isi terbaru hasil fetch GitHub** dan menjelaskan: tugas selesai, sedang, berikutnya, terblokir, bukti commit, dan status produksi; bukan berdasarkan ringkasan memori lama.

## Aturan pergantian chat
Jangan mengandalkan ringkasan dialog panjang. Sebelum akhir setiap sesi, perbarui `PROJECT_STATE.md` agar chat berikut cukup membaca satu file lalu membuka yang relevan. Tetap pertahankan ROADMAP sebagai satu-satunya status milestone.
