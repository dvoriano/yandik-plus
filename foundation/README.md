# M00 | YANDIK+ Offline Foundation

**Status:** kode dan pengujian awal, **belum terintegrasi dengan Flask produksi**.

Folder ini berisi **kontrak data kecil** untuk menyiapkan integrasi bertahap pada modul APEL, profil Puskeswan, dan Support Puskeswan. Semua contoh adalah fiktif. Tidak ada koneksi internet, database, VPS, token AI, atau proses deployment.

## Master data terhubung (prototype)
- Master Puskeswan-SDM-sarpras-profil: [masterdata.py](yandik_base/masterdata.py).
- Data sintetis: [SDM](fixtures/sdm.json), [penempatan](fixtures/penempatan.json), [sarpras](fixtures/sarpras.json), [profil](fixtures/profil.json).
- [18 tes tambahan](tests/test_masterdata.py), total foundation 40 tes dan [GitHub Actions sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).
- Belum ada integrasi Flask, DB, atau website produksi.

## Isi
- \`yandik_base/contracts.py\`: tipe dan validasi Puskeswan, laporan APEL per bulan, serta kebutuhan dukungan.
- \`fixtures/\`: data Puskeswan, laporan, dan usulan bantuan dengan ID \`DEMO-...\` saja.
- \`tests/test_contracts.py\`: pengujian nol vs laporan belum masuk, duplikasi per bulan, validasi nilai, dan integritas referensi.
- \`validate_fixtures.py\`: periksa seluruh relasi data contoh.

## Aturan penting
- Semua nama dan angka pada fixture **contoh buatan**, bukan statistik APEL Sumatera Barat.
- Kategori \`jumlah_layanan\` bersifat ilustrasi, **bukan** rumus resmi total pelayanan.
- Laporan kosong (belum masuk) dibedakan dari laporan sah dengan angka nol.
- Satu baris pelaporan untuk satu Puskeswan dan satu periode.
- **Jangan integrasikan langsung ke kode legacy Flask** sampai field, hitungan dan juknis APEL nyata dipetakan serta diuji.
- Semua perubahan kode harus terjadi di GitHub, bukan VPS.

## Pengujian otomatis
GitHub Actions \`.github/workflows/m00-offline-checks.yml\` akan menjalankan:
\`\`\`text
python -B -m unittest discover -s foundation/tests -v
python -B -m foundation.validate_fixtures
\`\`\`
Perintah tersebut dicatat untuk audit workflow; pengguna **tidak diminta menjalankannya di laptop**.

## Langkah M00 selanjutnya
1. Tambahkan manifest skema dan config dummy jika source legacy Flask bisa diimpor via connector.
2. Petakan field dan hitungan resmi APEL ke kontrak ini, baru migrasikan adaptornya.
3. Selesaikan pemeriksaan keamanan source legacy sebelum aplikasi dapat dijalankan.
