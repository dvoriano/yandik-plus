# M00-G9 | Pratinjau Metadata Penerimaan Source Flask, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | TIDAK MEMINDAI BERKAS ASLI.**

## Tujuan
Saat salinan source Flask yang diizinkan dan disanitasi tersedia, tim memerlukan alur pemeriksaan sebelum mengimpornya ke YANDIK+. M00-G9 **belum** melakukan pekerjaan itu pada source asli. Kode ini hanya menilai **deklarasi metadata DEMO** sehingga kebutuhan kontrol, risiko dan format bukti bisa diperiksa lebih dahulu.

## Hasil yang disimpan
- [Model metadata preflight](../drafts/m00-flask-intake-preflight/preflight.py) membuat ringkasan deklarasi file, klaim route, dependency dan entrypoint fiktif.
- [Manifest rekaan](../drafts/m00-flask-intake-preflight/fixtures.py) memuat nama file dan rute \`/demo/...\` yang **bukan** berasal dari aplikasi atau Puskeswan sungguhan.
- [41 skenario QA tertulis](../drafts/m00-flask-intake-preflight/tests/test_preflight.py), **0 dijalankan**. Termasuk uji struktur, tipe, duplikasi, traversal, nama sensitif, symlink, penolakan izin palsu, dan deklarasi route.
- Kode disimpan di \`drafts/\`, commit \`[skip ci]\`, tidak melakukan I/O file, HTTP, import kode Flask, eksekusi script, atau koneksi VPS.

## Kontrak penerimaan
| Risiko | Perlakuan saat ini | Yang belum dapat dinyatakan |
|---|---|---|
| Persetujuan sumber | Manifest hanya menerima \`NOT_REQUESTED_DEMO\` | Izin instansi, perjanjian pemanfaatan, scope pemilik data |
| Nama berkas | ASCII relatif dan ekstensi terbatas; dotfile, path traversal, symlink, pola nama secret/backup dan file biner ditolak | Isi file bebas rahasia; pola nama **bisa meleset** |
| Identitas file | Klaim SHA-256 dan ukuran wajib berbentuk terbatas | SHA-256 isi berkas benar, source utuh |
| Inventory route | Metode, modul, path \`/demo\`, flag kontrol belum teruji | Daftar route lengkap atau mencerminkan aplikasi asli |
| Role/wilayah/CSRF | Status hanya \`NOT_REVIEWED_DEMO\` atau \`CLAIMED_UNVERIFIED_DEMO\` | Login, hak akses dan proteksi CSRF sudah benar |
| Entry/dependency | Tanda apakah metadata mencantumkan \`app.py\`/\`core/app.py\` dan dependency deklarasi | Kode Python valid, dependencies aman, build bisa dijalankan |
| Output | Status ditahan: \`ready_for_import:false\`, \`may_connect:false\`, \`may_deploy:false\` | Lulus quality gate atau izin deploy |

**Perlindungan yang eksplisit:** bahkan metadata dengan seluruh klaim 'ada' **tetap ditolak untuk impor, staging, atau produksi**. Kode tidak menyimpan nama path/detail sumber pada respons proyeksi, dan tidak memberi pengguna keputusan APPROVED.

## Gerbang berikutnya
1. Pemilik sumber mengizinkan salinan source khusus pengembangan, dengan klasifikasi, batas keperluan dan pemisahan data.
2. Pemeriksaan **file bytes** harus dilakukan di lingkungan terbatas dan diaudit terpisah, termasuk secrets, endpoint, SQL schema, dependencies, role/territory, lisensi, unggahan dan PII. **M00-G9 tidak melakukan scan itu.**
3. Sinkronkan hasil inventory nyata dengan manifest sumber serta bukti reviewer, lalu rancang adaptor server Flask; jangan menyamakan deklarasi dengan validasi.
4. Pengujian 41 QA dan regresi modul lain hanya setelah izin owner; dokumentasi dan keputusan keamanan/kelembagaan harus disetujui sebelum staging.

Rujukan: [gerbang penerimaan Flask](M00_FLASK_SOURCE_ACCEPTANCE_GATE_2026_2030.md), [M00-G6 adaptor Flask DEMO](M00_G6_FLASK_ADAPTER_DEMO_2026_2030.md), [M00-G8 audit lintas bahasa](M00_G8_CROSS_LANGUAGE_AUDIT_BRIDGE_2026_2030.md).

**Status:** CODE_WRITTEN_NOT_TESTED; DECLARED_METADATA_ONLY; ACTUAL_SOURCE_UNINSPECTED; IMPORT_NO_GO.
