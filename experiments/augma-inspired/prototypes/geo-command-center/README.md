# Geo Command Center Lab

**Prototipe:** garis geografis provinsi Sumatera Barat + 19 wilayah (12 kabupaten, 7 kota), marker mendekati pusat pemerintahan dan **pratinjau poligon ADM2 yang diimpor secara lokal**. Bukan peta operasional.

## Jalankan

```sh
cd experiments/augma-inspired/prototypes
python3 -m http.server 8767 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8767/geo-command-center/`.

## Fitur

- Outline Provinsi Sumatera Barat dari GeoJSON **yang sudah dibundel**, digambar SVG tanpa tile/API eksternal.
- 19 entri referensi berdasarkan cakupan administratif, pencarian, filter kabupaten/kota, pilih marker, zoom dan reset.
- **ADM2 opsional:** pengguna dapat mengimpor file GeoJSON (maksimum 8 MB) dari disk. Validator mengharuskan **tepat 19 Polygon/MultiPolygon** dengan identitas wilayah cocok, tidak duplikat, ring tertutup dan koordinat masuk rentang Sumbar. Poligon ditampilkan di atas outline dan dapat dipilih.
- Saat file ditolak, peta dan daftar utama tidak hilang. Berkas **tidak diunggah dan tidak dipertahankan** saat browser ditutup.
- Data pelayanan Puskeswan dan pelaporan tetap `null` / belum tersedia. Tidak ada data asli.

**Penting:** 19 fitur adalah *syarat minimum struktur*, bukan bukti akurasi batas wilayah. Peta tidak melakukan uji self-intersection, gap, overlap, kesesuaian batas laut, perubahan pemerintahan, atau lisensi secara otomatis. Jika data nama ambigu (misalnya hanya `Solok` tanpa jenis/kode), impor ditolak.

## Data dan atribusi

- Outline provinsi: [mashadinoor/Indonesia-Geojson-2026](https://github.com/mashadinoor/Indonesia-Geojson-2026), `Provinsi/Sumatera_Barat.json`, commit `c95911f3f23af6e01c3bf706c80e36a9f3958588`; lisensi yang diklaim repo MIT, hak cipta awal Ardian Saputra Hasibuan (lihat [data/LICENSE-DATA.txt](data/LICENSE-DATA.txt)).
- Referensi cakupan 19 wilayah: [UU 17 Tahun 2022](https://peraturan.bpk.go.id/Details/217800/uu-no-17-tahun-2022).
- Sumber ADM2 yang sedang ditelaah: [GEO_DATA_SOURCES.md](../../docs/GEO_DATA_SOURCES.md). **Belum ada dataset poligon kab/kota permanen yang dimasukkan dalam repo.**
- Marker adalah posisi perkiraan sekitar ibu kota kabupaten/kota. Bukan centroid, titik Puskeswan atau acuan hukum.

## Tes

```sh
node --test tests/core.test.mjs tests/boundary-loader.test.mjs
```

Tes browser manual di `../BROWSER_TESTING.md`. Perlu QGIS dan sumber resmi sebelum data ADM2 digunakan untuk keputusan geospasial.

## Isolasi

Tidak mengakses `yandikvo.my.id`, API perusahaan, akun, token, bot trading, atau server produksi. Mengimpor data di browser tidak memodifikasi GitHub atau database.
