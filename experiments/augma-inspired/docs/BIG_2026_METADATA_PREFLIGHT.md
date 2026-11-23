# BIG 2026: pemeriksaan metadata ADM2 sebelum mengambil geometri

**Ruang lingkup:** YANDIK+ Innovation Lab, 23 November 2026. Pemeriksaan offline dari file JSON yang disimpan manual. Tidak mengunduh poligon BIG dan tidak menyentuh sistem produksi.

## Fakta dari sumber publik

1. [BATAS_KABKOTA_AR_2026, Portal Satu Data](https://data.go.id/dataset/dataset/batas_kabkota_ar_2026): penerbit BIG, dipublikasikan dan dimodifikasi **21 Agustus 2026**, identitas katalog **1897ac11-744b-466e-bea4-17602ec7c3bc**. Label "Terbuka" pada portal tidak otomatis membuktikan hak redistribusi data turunan.
2. Deskripsi katalog menyebut **edisi Juni 2026** sebagai pemutakhiran dari **Desember 2026**. Karena bulan sumber yang dinyatakan justru lebih baru daripada edisi dan publikasi, catat sebagai **konflik metadata untuk diklarifikasi ke BIG**, bukan pernyataan bahwa datasetnya tidak sah.
3. [Layanan BIG GeoServices](https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0): poligon administrasi, sistem koordinat **EPSG:4326**, format **JSON/geoJSON**, atribut **OBJECTID, KDPKAB, WADMPR, WADMKK, NAMOBJ**.
4. Layanan masih memiliki cakupan nasional. Metadata yang terbaca belum membuktikan bahwa tepat **19 wilayah Sumatera Barat** sudah diperoleh, memiliki geometri valid, atau telah diizinkan untuk publikasi.

## Implementasi pada branch lab

- **tools/check_big_adm2_metadata.py** memeriksa file JSON lokal: geometri Polygon, geoJSON, EPSG:4326, ObjectID unik, atribut wajib, serta menolak error ArcGIS, symlink dan file besar.
- **catalogue_conflict('2026-08', '2026-06', '2026-12')** mengembalikan status **CATALOGUE_CONFLICT_REVIEW_REQUIRED**. Kronologi konsisten pun tidak otomatis mengesahkan edisi.
- **tools/tests/test_check_big_adm2_metadata.py** berisi **12 tes sintetis**, semuanya lulus lokal. Suite Python lab kini **54/54 lulus lokal** setelah dua berkas baru dimasukkan.
- Pemeriksa bukti CI sekarang menetapkan ambang **54 Python, 31 Node, 19 Playwright**. Hasil CI untuk commit terbaru **belum dikonfirmasi**.

Perintah manual, dari folder experiments/augma-inspired:

    python3 tools/check_big_adm2_metadata.py /path/luar-repo/big-layer-metadata.json
    python3 -m unittest discover -s tools/tests -v

File metadata harus diperoleh dengan izin dan disimpan di luar repository, tanpa credential. Hasil **METADATA_STRUCTURE_PASS_REVIEW_REQUIRED** hanya berarti struktur layer lolos. Pemeriksaan asal sumber, hak penggunaan, edisi, kode 19 wilayah, poligon, gap/overlap, dan Kepulauan Mentawai tetap memerlukan audit geospasial tersendiri.

**Status:** PREFLIGHT_CODE_AND_SYNTHETIC_TEST_PASS; SOURCE_VERSION_AND_GEOMETRY_PENDING; PRODUCTION_INTEGRATION_NOT_AUTHORIZED.

## Tahap setelah metadata: inventaris tanpa geometri

Pemeriksaan metadata kini diikuti [inventaris atribut 19 wilayah](BIG_2026_ATTRIBUTE_INVENTORY.md). Dengan `returnGeometry=false`, identitas kode, provinsi, tipe dan duplikasi dapat diaudit sebelum poligon dikumpulkan. **12 tes unit baru lulus lokal**, tetapi query respons BIG asli belum berhasil diambil dan verifikasi lengkap tetap pending. Ambang CI Python menjadi **66**, bukan 54.
