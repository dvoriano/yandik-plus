# M04-S9V | Paket Persiapan Sesi QA Berjenjang

**16 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Dokumen ini merupakan rencana, bukan izin, hasil tes, pemeriksaan keamanan, atau persetujuan deployment.

## Perbaikan konkret dan inventaris

Pembacaan kode menemukan ketidaksesuaian S9U: sumber S9S menyimpan tanggal pada `source.observed_date`, register S9T menggunakan `snapshot_date`, tetapi pemeriksa S9U membaca `observed_on`. Akibat yang dapat disimpulkan dari kode adalah fixture berpotensi ditolak walaupun tanggal cocok. [Perbaikan kontrak dan penguatan skenario regresi](https://github.com/dvoriano/yandik-plus/commit/0e8d0f422bc9295d047944880b6174e19ef056c9) telah ditulis; **belum diuji**. Temuan tidak dianggap selesai hanya karena commit tersedia. Ini catatan cacat teknis tambahan, bukan penutupan ataupun perubahan jumlah empat temuan awal STATIC-01–04.

Pembacaan teks 16 file tes melalui GitHub menemukan 184 deklarasi `test(...)` sebelum S9V. Delapan deklarasi baru pada [paket sesi](https://github.com/dvoriano/yandik-plus/commit/9e6ac5f9a7a79f33351c18a3b984c3fa8a6705d5) membawa inventaris menjadi 17 suite dan 192 skenario tertulis. Angka tersebut bukan hasil lulus, coverage, atau jumlah pengujian yang telah berlangsung.

## Urutan sesi yang diusulkan

| Gerbang | Ruang lingkup | Skenario Node tertulis | Batas |
|---|---|---:|---|
| G0 | Izin owner, commit, biaya, isolasi dan data sintetis | 0 | Tanpa izin, berhenti |
| G1 | Sintaks dan impor/ekspor; audit kontrak S9R | 12 | Kegagalan atau log tidak lengkap: berhenti |
| G2 | S9F–S9J; unit kontrak dan regresi fingerprint | 56 | Kegagalan: jangan lanjut G3 |
| G3 | S9K–S9Q dan S9S–S9V; integritas fixture dan akurasi paket QA | 124 | Kegagalan fixture, sumber atau klaim otorisasi palsu: berhenti |
| G4 | Pemeriksaan browser secara manual, keamanan dan aksesibilitas | Tidak dihitung | Memerlukan izin browser; jangan lanjut bila ada masalah kritis |
| G5 | Telaah institusi, SOP/SPBE, klasifikasi dan kewenangan | Tidak dihitung | Terpisah dari hasil tes teknis |
| **Total** | **17 suite** | **192** | **0 tes dijalankan pada S9V** |

Model deklaratif [plan.mjs](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-qa-session-plan/plan.mjs) menyediakan path eksplisit semua suite, pembagian gerbang, kriteria masuk/keluar/berhenti, serta 14 kebutuhan bukti berikut empat temuan yang masih terbuka. Tidak ada runner, perintah eksekusi, akses filesystem pada model, jaringan, atau UI persetujuan. File tes baru hanya membaca sumber dalam sesi QA kelak jika diberi izin.

## Protokol sesi yang belum dilaksanakan

1. Owner menyatakan izin eksplisit dan batas lingkungan/biaya. Patok SHA commit yang benar-benar akan diperiksa; jangan menggunakan asumsi branch selalu sama.
2. Pastikan lingkungan pengujian terisolasi, tanpa kredensial, data riil, bot Indodax, VPS atau endpoint produksi. Dependensi luar cakupan (termasuk S9E yang digunakan S9F) harus ditinjau sebagai prasyarat, bukan otomatis dianggap telah diuji.
3. Periksa G1, G2, G3 berurutan sesuai daftar suite. Jangan menjalankan semua tes tanpa memperhatikan cakupan G0. Bila ada kegagalan, catat cacat dan hentikan tahap berikutnya; perbaiki kode dan ulangi pemeriksaan terkait dalam cakupan izin.
4. G4 mencakup halaman S9F–S9Q, S9T, S9U apabila disetujui: ukuran HP, keyboard/fokus, screen reader, pesan error, XSS, state kosong, tidak ada jaringan/storage atau modifikasi di luar yang diizinkan. Daftar ini bukan laporan keamanan.
5. G5 dilakukan manusia sesuai kewenangan dan prosedur institusi, bukan diturunkan dari PASS teknis. Tidak ada izin deploy otomatis.

## Format hasil kelak

Satu baris per kasus: commit SHA; gerbang; path suite atau kasus manual; ID kasus; waktu mulai/selesai; lingkungan; ekspektasi; observasi; status PASS/FAIL/BLOCKED; referensi bukti; ID cacat; referensi pengujian ulang. Bukti dan dokumen riil disimpan hanya melalui kanal yang disetujui, bukan di repo publik.

Saat ini target commit untuk eksekusi, referensi izin owner, hasil dan bukti aktual masih kosong. Tidak ada temuan resmi dinyatakan tertutup.

## Batasan dan keputusan berikutnya

Pada 16 November 2026 metadata GitHub masih menunjukkan repository **PUBLIC**. Snapshot DEMO 12 November tetap merupakan snapshot historis, bukan pemeriksaan live. Jangan menyimpan data pribadi, dokumen kedinasan atau rahasia. Perubahan visibility dan telaah histori memerlukan tindakan owner.

PR #9 tetap Draft. Tidak ada Node/browser test, CL/CI, GitHub Actions, merge main atau deployment.

**Rekomendasi:** hentikan penambahan prototipe QA yang berulang; gunakan paket ini sebagai batas persiapan M04-S9. QA teknis menunggu keputusan G0. Pekerjaan modul fungsional lain yang memang independen dapat dirancang secara CODE_ONLY berdasarkan roadmap, tanpa menyatakan integrasi atau hasil uji berhasil.

## Peralihan fokus M04-S10 (16 November 2026)
Owner meminta melanjutkan rancangan fungsi utama melalui [M04-S10](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S10_SUPPORT_PACKAGE_PLANNING.md). Draf paket independen, 12 skenario baru tercatat terpisah pada TEST_BACKLOG. Paket QA S9V tetap snapshot 17 suite/192 skenario sebelumnya, bukan izin pengujian atau approval integrasi.
