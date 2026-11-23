# M00-G3 | Kontrak Gateway API Baca-Saja DEMO, 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | TANPA ENDPOINT HTTP.**

## Kode
- [Gateway baca-saja](../drafts/m00-read-api-gate/gateway.mjs) menerima objek permintaan yang **hanya** berisi \`method\`, \`operation\`, dan \`event_id\`; operasi daftar serta detail disimulasikan dengan \`GET\` saja.
- [Fixture sintetis](../drafts/m00-read-api-gate/fixtures.mjs) memisahkan bentuk permintaan dari objek \`host\` yang menyediakan sumber, wilayah dan resolver sesi contoh.
- [19 QA tertulis](../drafts/m00-read-api-gate/tests/gateway.test.mjs), **0 dijalankan**. Dilarang menyebut PASS.
- Pemeriksaan role, wilayah dan sumber diulang dari [M00-G1](M00_G1_SCOPED_OVERSIGHT_READ.md), [M00-G2](M00_G2_SOURCE_API_BOUNDARY_2026_2030.md) dan M13-S1.

## Kontrak batas
| Input | Perilaku | Bukan |
|---|---|---|
| Permintaan pembaca | GET + LIST_EVENTS / REVIEW_EVENT + ID DEMO atau null | HTTP API nyata |
| Role, identitas, dan wilayah | Hanya berasal dari objek host yang seharusnya dipercaya | Verifikasi server terimplementasi |
| Body/form/header, metode POST, role/query tambahan | Ditolak oleh validasi ketat DEMO | Pelindung CSRF/rate limiting |
| Sumber | Manifest dan event DEMO yang diberikan host | Database resmi atau izin data |
| Response | ID kejadian DEMO, bulan dan beberapa status observasi | Catatan lengkap, lokasi, PII, source ID, diagnosis |
| Status izin | Semua write/approve/notify/publish = false | Izin operasional |

**Batas utama:** siapa pun yang dapat membangun objek \`host\` sesuka hati pada lingkungan yang tidak tepercaya dapat memalsukan sumber dan sesi. Oleh karena itu gateway ini **tidak boleh** dihubungkan langsung ke browser atau dipandang sebagai autentikasi. Hanya rancangan pemisahan request dari context server.

## Gerbang P0 yang tersisa
Audit source Flask yang disanitasi, identitas server sah, otorisasi setiap API dan objek, audit log, proteksi CSRF, revokasi sesi, izin akses sumber, rate-limit, pelindung data wilayah sensitif, dan tes negatif akses dengan izin owner.

**Status:** CODE_WRITTEN_NOT_TESTED, NO_HTTP_ENDPOINT, PRODUCTION_NO_GO.
