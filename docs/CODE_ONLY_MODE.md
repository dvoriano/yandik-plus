# MODE KODE SAJA | YANDIK+ Tanpa CL/CI Dulu

**Keputusan owner: 11 November 2026.** Untuk menghemat batas penggunaan CL sekitar US$12/bulan yang ingin disisihkan untuk bot Indodax, pengembangan YANDIK+ berikutnya difokuskan **menulis kode di GitHub saja, tanpa pengujian terlebih dahulu**.

## Aturan wajib setiap chat
1. Baca **PROJECT_STATE → ROADMAP → WORKLOG** dan file kode modul yang berkaitan.
2. Buat kode langsung di repository `dvoriano/yandik-plus`, branch `develop/yandik-foundation`, tanpa download/PowerShell/SSH pengguna.
3. Untuk pekerjaan **yang belum harus terintegrasi**, tempatkan kode baru di `drafts/<modul>/`, bukan `foundation/` atau `prototypes/`. Ini mencegah pemicu workflow otomatis berdasarkan paths yang saat ini dikonfigurasi.
4. Gunakan pesan commit yang jelas dengan **`[skip ci]`** sebagai pengaman tambahan. **Jangan menjalankan workflow_dispatch atau tindakan tes apa pun.** Jika jalur yang diubah berpotensi memicu CI, rancang ulang jalur/commit tanpa mengeksekusi workflow.
5. Tandai setiap file/fitur **KODE DITULIS, BELUM DIUJI**. Jangan menganggap dapat dijalankan atau "sukses" hanya karena file tersimpan.
6. Untuk setiap kode baru, tambahkan daftar QA rinci di [TEST_BACKLOG](TEST_BACKLOG.md).
7. Pada sesi yang sama, perbarui **PROJECT_STATE, ROADMAP, WORKLOG**, dokumen modul dan perubahan keputusan. Perbarui issue/PR jika relevan.
8. **Jangan pernah menaikkan status "SELESAI / TERUJI"** hanya karena kode ada. Bukti tes lama tidak diwariskan ke kode baru.
9. Jangan sentuh `main`, produksi YANDIK+, VPS, database riil atau bot Indodax, dan jangan auto-merge/deploy.

## Akhir mode kode-saja
Hanya berubah setelah pemilik proyek secara eksplisit meminta pengujian atau pencabutan mode ini. Saat itu baru sisir satu per satu commit berlabel BELUM DIUJI dengan estimasi prioritas, tanpa menganggap semua fitur harus diuji sekaligus.

**Catatan istilah:** Kita menghormati permintaan menghemat **CL** tanpa menyamakan layanan CL dengan biaya GitHub Actions. Demi menghindari pemakaian tak diinginkan, **keduanya ditahan** pada pekerjaan YANDIK+ baru.
