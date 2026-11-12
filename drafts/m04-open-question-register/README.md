# YANDIK+ M04-S9N | Register Pertanyaan Terbuka DEMO

**KODE DITULIS, BELUM DIUJI. 12 November 2026.**

- `questions.mjs` memecah daftar pertanyaan M04-S9M menjadi register satu baris per pertanyaan dengan ID `DEMO-Q-{butir}-{nomor}` dan sumber fixture **sintetis**.
- Setiap pertanyaan mengandung ID/fungsi/fase/revisi butir, kebutuhan bukti, catatan kekurangan yang ditulis pada DEMO, pengampu/penelaah **usulan**, serta dependensi.
- Banyak pertanyaan dihitung dari sumber; tidak dikarang sebagai jumlah keputusan, temuan audit, maupun capaian kelembagaan.
- **Seluruh pertanyaan tidak memiliki jawaban resmi**. Tidak ada formulir pengisian jawaban, verifikasi bukti, penetapan pejabat, keputusan, tenggat, undangan atau izin QA/deploy.
- Filter `written_gap` menunjukkan ada teks kekurangan bukti DEMO; `no_written_gap` berarti teks belum diisi, **bukan bukti cukup atau selesai**.
- Antarmuka baca-saja meliputi ringkasan enam fungsi, filter fungsi/kekurangan, daftar pertanyaan, dan textarea ringkasan untuk disalin secara manual.
- **12 skenario uji tertulis BELUM DIJALANKAN** sesuai CODE_ONLY. Tidak ada API, login, fetch, storage, data asli, ataupun pengiriman.
- Repo PUBLIC menurut metadata 12 November 2026, pengingat perubahan PRIVATE Sabtu 14 November aktif tetapi belum dilaksanakan.

Spesifikasi: `docs/M04_S9N_OPEN_QUESTIONS.md`.