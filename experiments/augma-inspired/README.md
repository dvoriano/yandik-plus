# YANDIK+ Innovation Lab: Augma-Inspired Experiments

> **BRANCH TERPISAH / TIDAK DIPAKAI PRODUKSI** · Lab riset 2026–2030

Ruang eksperimen interaksi visual dan asisten data untuk mendukung kemungkinan pengembangan YANDIK+. Terinspirasi oleh **konsep umum** teknologi Augma Imaginarium, tetapi **tidak mengimpor atau menyalin kode/aset Augma**.

## Pilihan prototipe

| Prototipe | Apa yang sudah berfungsi | Status |
|---|---|---|
| [Command Center Demo](prototypes/command-center/) | Dashboard enam wilayah dan tanya-data berbasis aturan dengan **semua angka fiktif** | Versi awal |
| [Geo Command Center](prototypes/geo-command-center/) | **Outline geografi provinsi** dari GeoJSON lokal, 19 wilayah, penanda posisi indikatif, pencarian dan zoom; tanpa angka pelayanan | PoC mandiri |
| [Evidence Assistant](prototypes/data-assistant/) | UI tanya-data **berbasis aturan**, jawaban mencantumkan bukti sumber dan menolak angka yang tak tersedia | Fondasi asisten, **belum LLM** |

## Jalankan ketiga prototipe di komputer uji

```sh
cd experiments/augma-inspired/prototypes
python3 -m http.server 8767 --bind 127.0.0.1
```

Lalu buka:

- `http://127.0.0.1:8767/geo-command-center/`
- `http://127.0.0.1:8767/data-assistant/`
- `http://127.0.0.1:8767/command-center/`

Semua file diproses lokal di browser. Tidak memakai token, database, atau koneksi ke server YANDIK+.

Tes logika (Node.js 20+), dari folder `prototypes/`:

```sh
node --test command-center/tests/core.test.mjs geo-command-center/tests/core.test.mjs data-assistant/tests/assistant.test.mjs
```

## Batas yang tidak boleh dilanggar

- Semua commit hanya di branch `lab/augma-inspired-experiments`, folder `experiments/augma-inspired/`.
- Tidak ada perubahan `main`, `develop`, situs `yandikvo.my.id`, VPS, database maupun konfigurasi sistem.
- Tidak ada pull request, merge, deploy, API produksi, atau kredensial.
- Geo Command Center menggunakan peta geografis nyata tetapi **hanya outline provinsi**, belum poligon batas kab/kota. Koordinat marker hanyalah perkiraan sekitar pusat pemerintahan.
- Tidak ada data pelayanan/pelaporan nyata. **Null = belum tersedia, bukan 0**. Angka dalam prototipe pertama seluruhnya sintetis.
- Evidence Assistant **belum memakai AI generatif/LLM**. Komponen provider kelak harus diuji dan diizinkan terpisah.
- Prototipe bukan pengganti prosedur dan keputusan resmi.

## Dokumen riset

- [Radar teknologi](docs/TECHNOLOGY_RADAR.md)
- [Roadmap eksperimen 2026–2030](docs/ROADMAP_2026_2030.md)
- [Keamanan, izin, dan lisensi](docs/SAFETY_AND_LICENSE.md)
- [Dokumentasi Geo Command Center](prototypes/geo-command-center/README.md)
- [Dokumentasi Evidence Assistant](prototypes/data-assistant/README.md)

## Referensi

- [Augma Imaginarium repository](https://repo.augmaimaginarium.com/) sebagai inspirasi antarmuka, **bukan sumber kode lab**.
- [UU 17/2022 tentang Sumatera Barat](https://jdih.bpkp.go.id/dokumen/data_dokumen/Salinan%20UU%20Nomor%2017%20Tahun%202022.pdf): cakupan 12 kabupaten dan 7 kota.
- [mashadinoor/Indonesia-Geojson-2026](https://github.com/mashadinoor/Indonesia-Geojson-2026): sumber outline geometri yang dipakai dengan atribusi dan lisensi upstream dicantumkan. Geometrinya bukan acuan penetapan batas hukum.

Tidak ada fitur lab yang dapat diintegrasikan ke sistem resmi tanpa review manfaat, lisensi, keamanan, sumber data, izin, dan keputusan penerapan.
