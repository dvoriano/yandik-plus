# M00-G3 | Kontrak Batas API Baca-Saja Surveilans DEMO

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | TANPA ENDPOINT HTTP.**

\`gateway.mjs\` memperlihatkan pemisahan **permintaan pemanggil** (hanya operasi \`GET\` list/detail dan ID kejadian fiktif) dari **host backend yang dipercaya** (callback sesi, wilayah, manifest dan rekaman DEMO). Contoh ini bukan autentikasi atau backend HTTP sebenarnya.

- Pemanggil tidak dapat memilih \`role\`, \`region\`, sumber, tindakan tulis, atau URL lain lewat objek request; bentuk yang memiliki kunci ekstra ditolak.
- Setiap pembacaan mewajibkan sumber valid M00-G2 dan hak wilayah M00-G1 melalui M13-S1. Klaim identitas server ini belum dibuktikan secara runtime.
- Respons hanya status kejadian terbatas. Lokasi detail, snapshot/source ID, data mentah, identitas pemanggil dan koordinat dikeluarkan.
- Tidak ada otorisasi untuk menulis, mengesahkan kasus, melaporkan penyakit, mengirim notifikasi atau mempublikasikan.
- \`tests/gateway.test.mjs\`: **19 skenario QA tertulis, 0 dijalankan**.

Sebelum menjadi API nyata perlu pemeriksaan sumber Flask, pembatasan jaringan, autentikasi sesi, CSRF, audit akses, rate limit, kontrol mutasi dan uji negatif. Jangan menghubungkan ke produksi.

[Spesifikasi](../../docs/M00_G3_READ_API_BOUNDARY_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
