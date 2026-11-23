# Geo Command Center: Peta Provinsi Sumatera Barat

Prototipe **geografis nyata** yang terpisah dari Command Center skematis versi awal. Menggambar *outline* provinsi dari GeoJSON dan 19 titik indikatif pusat pemerintahan kabupaten/kota. Tidak menggunakan layanan peta berbayar, tile eksternal, atau koneksi produksi.

## Cakupan dan batas

- Peta garis provinsi merupakan geometri geografis pihak ketiga yang dikonversi secara lokal ke SVG (bukan denah ilustratif).
- Data registry memuat **12 kabupaten dan 7 kota** berdasarkan UU 17/2022. Kode 13.xx untuk navigasi UI.
- **Titik marker mendekati lokasi pusat pemerintahan**, bukan titik GPS kantor/puskeswan dan bukan centroid resmi. Cocok untuk proof of concept, perlu validasi GIS sebelum dipakai untuk keputusan geografis.
- Ini **belum** peta poligon 19 kabupaten/kota: outline provinsi saja + 19 marker. Batas resmi ADM2 dan lokasi sebenarnya memerlukan sumber GIS yang tervalidasi terpisah.
- Pelaporan, fasilitas, dan pelayanan = **null / tidak tersedia** di seluruh 19 wilayah. Jangan dimaknai 0.
- Tidak ada data personal, layanan produksi, token, atau API. Semua berjalan lokal dan read-only.

## Jalan lokal

```sh
cd experiments/augma-inspired/prototypes/geo-command-center
python3 -m http.server 8766 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8766/`. Tersedia pencarian, penyaringan kabupaten/kota, pemilihan marker, detail wilayah, dan zoom.

Tes struktur dengan Node.js 20+: `node --test tests/core.test.mjs`.

## Atribusi geometri

`data/sumbar-outline.geojson` diperoleh dari:
- [mashadinoor/Indonesia-Geojson-2026](https://github.com/mashadinoor/Indonesia-Geojson-2026), path `Provinsi/Sumatera_Barat.json`, commit `c95911f3f23af6e01c3bf706c80e36a9f3958588`.
- Fork dari `ardian28/GeoJson-Indonesia-38-Provinsi`; repo menyebut sumber geometri BIG, tetapi **kami belum memverifikasi provenance/akurasi legal aslinya secara independen**.
- Repositori upstream mencantumkan lisensi MIT, hak cipta 2024 Ardian Saputra Hasibuan. Naskah lisensi disalin di [LICENSE-DATA.txt](data/LICENSE-DATA.txt).

Penggunaan **hanya untuk demonstrasi peta**, tidak untuk batas hukum. Tidak ada aset, kode, maupun model 3D Augma yang digunakan.

## Pengembangan berikutnya

- Geometri ADM2 19 kab/kota dari layanan resmi, versi & atribut diverifikasi; jangan menjadikan marker sebagai poligon.
- Mapping ID wilayah ke data Puskeswan setelah ada spesifikasi sumber read-only dan kontrol akses.
- Audit akurasi, batas kepulauan Mentawai, penanganan data kosong, responsivitas, dan performa pada HP.
