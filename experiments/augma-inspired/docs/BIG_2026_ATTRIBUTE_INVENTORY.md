# Gerbang inventaris BIG ADM2: 19 wilayah Sumatera Barat

**Status 23 November 2026:** pemeriksa dan 12 tes unit selesai, 12/12 lulus lokal dengan fixture sintetis. Belum ada respons query atribut nyata BIG yang diperoleh atau disahkan dalam lab. **Bukan** konfirmasi 19 poligon berizin dan bukan izin produksi.

## Mengapa didahulukan

Sebelum mengambil poligon atau mengintegrasikan data, kita perlu membuktikan bahwa hasil layer administrasi BIG punya **19 identitas berbeda** yang cocok dengan registry Sumbar: **12 kabupaten dan 7 kota**, bukan sekadar jumlah fitur 19. Sumber: [BIG GeoServices, Area Batas Wilayah Administrasi Kabupaten/Kota](https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0). Metadata layer mencantumkan atribut OBJECTID, KDPKAB, WADMKK, WADMPR dan TIPADM (4=Kabupaten, 5=Kota). Data geometrinya **belum** diunduh atau divalidasi.

## Permintaan baca-saja yang aman (manual, di luar GitHub)

Jika memperoleh izin mengakses data sumber publik, gunakan hanya metode Query pada layer resmi:

- Endpoint: `https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0/query`
- Parameter filter: `where=WADMPR = 'SUMATERA BARAT'` (perlu diperiksa ejaan nilai aktual pada server).
- `outFields=OBJECTID,KDPKAB,WADMKK,WADMPR,TIPADM`
- **`returnGeometry=false`** agar tidak mengambil koordinat poligon.
- `f=json`; jangan sertakan token, cookie, kunci API, atau data APEL.
- Simpan respons JSON sebagai `sumbar-big-attributes.json` di folder uji **di luar repository**. Jangan mengubah isi respons sebelum menghitung checksum.

**Jangan batasi respons secara artifisial menjadi 19 baris.** Jika server mengirim lebih/kurang dari 19 atau `exceededTransferLimit=true`, gerbang harus menolak hingga penyebabnya diselidiki. Filter dan nilai kode asli mungkin berbeda dari registry lab; ketidaksesuaian harus dicatat, bukan dipaksakan menjadi cocok.

## Pemeriksaan offline

Dari folder `experiments/augma-inspired`:

```sh
python3 tools/check_big_adm2_inventory.py /path/luar-repo/sumbar-big-attributes.json \
  --registry prototypes/geo-command-center/regions.mjs
```

Pemeriksa menerima respons JSON ArcGIS **atribut saja**. Kode KDPKAB `13.01` atau `1301` dinormalisasi secara eksplisit; nama wilayah cocok dengan nama penuh atau nama tanpa awalan Kabupaten/Kota; nilai provinsi wajib Sumatera Barat; `TIPADM` harus 4 atau 5 sesuai jenis wilayah. `OBJECTID` wajib berupa bilangan bulat positif unik. File terlalu besar/symlink, geometri, error server, response terpotong, kode ganda, nama/kode tak cocok, atau cakupan kurang lengkap akan ditolak.

Hasil `ATTRIBUTE_INVENTORY_PASS_REVIEW_REQUIRED` hanyalah kesesuaian identitas administratif **teknis**, bukan bukti akurasi batas, hak pakai, atau edisi data. `input_sha256` dicatat agar hasil atribut dapat dibandingkan dengan berkas asli di luar GitHub.

## Gerbang lanjutan

- [x] Pemeriksa inventaris tanpa geometri tersedia, dengan 12 tes sintetis lulus lokal.
- [x] Pembuktian penolakan respons duplikat, terpotong, provinsi/tipe salah, dan geometri yang ikut terambil.
- [ ] Pastikan endpoint BIG dan nilai filter menghasilkan respons JSON atribut riil yang utuh (jaringan tidak tersedia dari lingkungan pengujian ini).
- [ ] Tinjau kecocokan kode/nama dengan registry dan penyebab selisih jika ada.
- [ ] Pastikan izin penggunaan, versi, dan atribusi BIG sebelum memperoleh geometri.
- [ ] Setelah itu barulah gunakan [audit geometri dan provenance](ADM2_2026_REVIEW_PROTOCOL.md) untuk dataset poligon berizin.
- [ ] Validasi 19 poligon, pulau Mentawai, garis pantai, overlap, dan selisih terhadap outline lewat reviewer GIS independen.

Tidak ada file BIG yang di-commit, tidak ada integrasi APEL produksi, dan tidak ada auto-deploy.
