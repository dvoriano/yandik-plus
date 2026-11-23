# M00-G6 | Adaptor Flask Baca-Saja DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | BELUM TERPASANG.**

## Implementasi yang ditulis
- [Factory Blueprint Flask](../drafts/m00-flask-adapter/adapter.py) terpisah dari aplikasi legacy, dengan validasi data sumber dan proyeksi kolom terbatas.
- [Fixture sumber fiktif](../drafts/m00-flask-adapter/fixtures.py) serta [25 QA tertulis](../drafts/m00-flask-adapter/tests/test_adapter.py), **0 dijalankan**.
- Factory hanya menghasilkan blueprint dan **tidak mendaftarkan route**. Host harus memasang sendiri dan mengaktifkan pengaturan `YANDIK_M00_G6_DEMO_ROUTES_ENABLED=True`; keadaan default mengembalikan 404.
- Endpoint konseptual GET daftar dan detail DEMO. POST tidak didukung. Query tambahan ditolak; respons `Cache-Control: no-store`.

## Batas keamanan
| Lapisan | Rancangan M00-G6 | Yang belum ada |
|---|---|---|
| Sesi | Callback `resolve_server_session` dari host, validasi bentuk ID/role DEMO | Auth Flask sesungguhnya, verifikasi sesi, logout dan revokasi |
| Wilayah | Pengguna kab/kota hanya wilayah fiktif yang sama | Sumber kebenaran yurisdiksi dan master wilayah |
| Sumber | `load_synthetic_source` dari host; manifest M00-G2 dan event M13-S1 format DEMO | Autentikasi asal sumber, perizinan iSIKHNAS, data produksi |
| Respons | Event ID, bulan, kategori dugaan dan status catatan; tanpa lokasi/PII | Klasifikasi akses yang disetujui untuk kasus sungguhan |
| Keamanan web | Route nonaktif default, GET-only, query ditolak, no-store | Proteksi sisi server, rate limit, CSRF operasi mutasi dan audit akses |
| Deployment | Tidak dipasang ke Flask legacy | Kesesuaian versi, konfigurasi dan uji integrasi |

**Penting:** host yang tidak tepercaya masih dapat mengembalikan sesi palsu. Format ID yang valid bukan bukti autentikasi. Mengaktifkan flag DEMO bukan izin mengakses sumber resmi. Jangan mendaftarkan route ke produksi tanpa audit sumber dan persetujuan pemilik proses.

**Status:** CODE_WRITTEN_NOT_TESTED, FLASK_NOT_INTEGRATED, API_PRODUCTION_NO_GO.

## Gerbang penerimaan source Flask
[Checklist source sanitisasi/izin dan review keamanan](M00_FLASK_SOURCE_ACCEPTANCE_GATE_2026_2030.md) disiapkan. Belum ada source Flask terotorisasi di repo atau pengujian adaptor terhadap aplikasi nyata.
