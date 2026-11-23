# Kandidat sumber batas ADM2 Sumatera Barat

Kajian awal 23 November 2026. **Belum ada geometri 19 kabupaten/kota yang diintegrasikan permanen ke repo**. Layer import lokal hanya memeriksa struktur data dan tetap meminta pemeriksaan sumber, lisensi, dan akurasi GIS.

| Kandidat | Keterangan | Kebijakan lab |
|---|---|---|
| [BIG RBI FeatureServer](https://geoservices.big.go.id/rbi/rest/services/Hosted/Wilayah_Administrasi_Kabupaten__Kota/FeatureServer/0) | Sumber otoritas geospasial; akses query sedang perlu verifikasi, endpoint yang dicek mengembalikan error | Prioritas verifikasi resmi sebelum penggunaan operasional |
| [BNPB Sumbar 2022, FeatureServer layer 5](https://gis.bnpb.go.id/server/rest/services/Hosted/DATA_KABKOT_SUMBAR1/FeatureServer/5) | Feature layer 2022 khusus kabupaten/kota Sumbar, mendukung GeoJSON; perizinan dan versi perlu dinilai | Referensi untuk proses verifikasi, belum disalin |
| [OSM KPU boundaries 2026](https://github.com/ahsa29/kpu-osm-boundaries-2026) | Snapshot OSM 9 Oktober 2026, versi data 2026-10-10b memanifestasikan 19 kabupaten/kota Sumbar; berlisensi ODbL | Cocok *evaluasi*, perlu cek pemetaan kode, kelengkapan, ketelitian, dan atribusi |
| [geoBoundaries IDN ADM2](https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM2/) | Versi sumber 2020, build 2023; bersumber BPS/WFP/OCHA dan tertera CC BY 3.0 IGO | Sekunder, perlu cek silang perubahan batas/wilayah |
| [GeoJSON awal provinsi](https://github.com/mashadinoor/Indonesia-Geojson-2026) | Sudah dipakai hanya untuk **outline Sumbar** di lab; lisensi MIT sebagaimana tercantum pada fork | Tidak untuk menentukan garis kabupaten/kota |

## Peringatan data salah cakupan

Beberapa file dari folder `Kabupaten/Sumatera_Barat/` pada dataset awal menampilkan *satu feature kelurahan* pada satu path kabupaten/kota, bukan poligon kabupaten/kota utuh. Karena itu **tidak diimpor sebagai ADM2**.

## Prosedur penerimaan data ADM2

1. Dapatkan berkas dengan sumber, versi, tanggal, dan ketentuan lisensi tertulis.
2. Periksa 19 pasangan kode wilayah (12 kabupaten dan 7 kota) terhadap daftar referensi yang berlaku.
3. Validasi setiap Polygon/MultiPolygon: ring tertutup, koordinat WGS84 `[lon,lat]`, tidak ada duplikasi, dan tidak melampaui rentang Sumbar.
4. Cek geometri spasial pada QGIS: self-intersections, gaps, overlaps, island coverage terutama Mentawai, serta kecocokan dengan outline provinsi.
5. Cocokkan kode dan atribut kab/kota dengan sumber administrasi resmi; cek perubahan batas dan tanggal.
6. Simpan laporan validasi dan atribusi. Baru kemudian dipertimbangkan untuk menjadi berkas peta lokal versi tertentu setelah izin.

Validator browser saat ini hanya menerapkan **langkah 2 dan sebagian langkah 3**. Ia **tidak** memeriksa validitas GIS topologi, akurasi sumber, atau hak pakai. Peta hasil impor hanyalah pratinjau pada sesi browser, tidak dikirim/diunggah.
