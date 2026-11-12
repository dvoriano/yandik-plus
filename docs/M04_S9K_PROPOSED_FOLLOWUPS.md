# M04-S9K | Register Usulan Tindak Lanjut dari Catatan Pembahasan DEMO

**Tanggal:** 12 November 2026 (WIB)  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Kode:** [drafts/m04-proposed-followups/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-proposed-followups)  
**Kedudukan:** bahan pengembangan daftar usulan tindak lanjut, bukan register tugas resmi, nota dinas, penetapan anggaran atau keputusan bantuan.

## Rantai sumber
M04-S9J menyediakan buku catatan simulasi 18 butir pada 6 fungsi, dengan kolom masukan, kekurangan bukti dan usulan tindak lanjut. M04-S9K menyusun **register usulan CONTOH** yang dapat ditelusuri ke M04-S9J dan agenda M04-S9I.
Model membaca view M04-S9J dan agenda M04-S9I, memeriksa kesesuaian ID, fungsi, fase, judul, bukti, pendahulu, versi skema dan snapshot repository sebelum membuat keluaran.

## Cakupan
| Kondisi catatan DEMO | Status yang dihasilkan | Makna |
|---|---|---|
| Kolom `tindak_lanjut_usulan_demo` berisi teks | `USULAN_CONTOH_PERLU_TELAAH` | Usulan contoh untuk dibahas manusia; **bukan tugas atau instruksi** |
| Kolom usulan kosong | `BELUM_ADA_USULAN_CONTOH` | Belum ada redaksi usulan DEMO; **bukan pernyataan tuntas** |

Seluruh **18 butir** tetap ditampilkan, termasuk yang kolomnya kosong. Fixture sintetis memiliki 3 contoh usulan di GOV-01, SEC-01 dan DAT-01, serta 15 butir tanpa usulan contoh. Angka tersebut **bukan laporan capaian atau hasil pembahasan instansi**.

## Jejak sumber dan pemisahan kewenangan
Setiap baris menyimpan ID DEMO `DEMO-FU-{ID}`, ID/fungsi butir sumber, revisi contoh, judul, fase, kebutuhan bukti, hubungan pendahulu, masukan/kekurangan/usulan DEMO, rujukan dokumen dan pengampu/penelaah fungsi **usulan**.
Kolom `assigned_officer` dan `official_deadline` selalu null. Status bukti resmi, review, penugasan, keputusan, izin QA dan deploy selalu false.
Hubungan antara catatan dan register adalah **kontrak data lokal**, bukan jejak audit yang sah atau dokumen pertanggungjawaban resmi.

## Aturan keselamatan
- Tidak boleh mengubah masukan, kekurangan dan usulan menjadi tugas resmi hanya karena teks muncul.
- Kekurangan bukti pada catatan DEMO tidak boleh otomatis menghasilkan keputusan penolakan atau persetujuan.
- Tidak ada prioritas berdasarkan daerah, nominal anggaran, alokasi bantuan, pengadaan, BAST atau pemberian otorisasi.
- Bila snapshot catatan dan agenda tidak cocok, keluaran ditolak; sumber stale tetap diberi catatan perlunya telaah ulang.
- Semua data hanya sintetis. Jangan masukkan data kedinasan, nama petugas, identitas warga, rahasia, dokumen asli atau bukti internal.
- UI hanya baca-saja, memakai `textContent` untuk string, filter fungsi/status dan rekap salin manual. Tidak ada autentikasi, API, database, storage, fetch, pengiriman notifikasi, tanda tangan ataupun perubahan pada aplikasi aktif.
- Repository menurut metadata GitHub pada 12 November 2026 masih **PUBLIC**. Pengingat owner untuk mengubah PRIVATE pada Sabtu 14 November 2026 aktif, tetapi tindakan itu belum dilakukan.

## Status QA dan langkah berikut
- [12 skenario Node tertulis](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-proposed-followups/tests/followups.test.mjs) dan **BELUM DIJALANKAN**, sesuai [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- Backlog QA import, ID/revisi, sumber tidak cocok, HTML/HP, keamanan input, stale source, penyalahgunaan persetujuan dan validasi data ada di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Tahap berikut dapat berupa rancangan rekap lintas fungsi atas usulan dan kekosongan bahan untuk penelaahan manusia, tetap tidak memberi penugasan, keputusan ataupun kewenangan baru.
- M04-S10+ keputusan bantuan, anggaran, pengadaan, distribusi dan BAST tetap **RENCANA**.
- Tidak ada CL, CI, Node/browser tes, workflow, deployment, merge `main`, VPS, database riil, website YANDIK+ aktif ataupun bot Indodax.

## Rekap lintas fungsi setelah M04-S9K
Agregasi enam fungsi dengan catatan usulan, kekurangan bukti tertulis dan pendahulu antar-fungsi terdapat pada [M04-S9L](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9L_CROSS_FUNCTION_RECAP.md). Semua status tetap DEMO dan BELUM DIUJI. Kolom kosong tidak boleh ditafsir sebagai hasil verifikasi atau masalah selesai.
