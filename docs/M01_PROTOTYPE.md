# M01 | Prototype Peran, Wilayah dan Workflow

**Status M01-S1:** SEDANG (kode prototype offline **berhasil diuji**, belum terintegrasi Flask produksi). **Bukti:** [commit](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac), [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867), 12 tes baru.

## Komponen yang dibuat
- \`foundation/yandik_base/access.py\`: role dan scope wilayah/Puskeswan, default deny.
- \`foundation/yandik_base/workflow.py\`: transisi status kegiatan, audit append-only.
- \`foundation/tests/test_access_workflow.py\`: uji izin lintas wilayah, pimpinan agregat saja, pemisahan verifikasi dan tindak lanjut, sejarah perubahan dan penolakan tak beralasan.
- GitHub Actions yang sudah terpasang otomatis menjalankan tes baru dengan Python unittest discovery.

## Matriks izin prototype
| Peran | Profil | Lapor APEL | Verifikasi kebutuhan | Catat tindak lanjut |
|---|---|---|---|---|
| Puskeswan | Milik sendiri | Milik sendiri | Tidak | Tidak |
| Kabupaten/Kota | Wilayah sendiri (baca) | Tidak | Wilayah sendiri | Tidak |
| Verifikator provinsi | Baca | Tidak | Ya | Tidak |
| Admin provinsi | Baca/ubah | Tidak | Tidak | Ya |
| Pimpinan | Agregat saja | Tidak | Tidak | Tidak |

## Transisi dasar
DRAF → DIAJUKAN → DALAM_VERIFIKASI → DIVERIFIKASI → DITINDAKLANJUTI → SELESAI.  
Cabang PERLU_PERBAIKAN, DITOLAK, DIBATALKAN memiliki syarat alasan dan izin sesuai actor. Jejak audit memuat aktor, waktu berzona, asal/tujuan status, alasan.

## Batasan yang tidak boleh dilupakan
- Ini **bukan** sistem persetujuan bantuan resmi dan bukan pengganti kewenangan anggaran.
- Belum ada otorisasi nyata pada endpoint aplikasi lama, belum ada data persisten, belum diuji terhadap database/akses produksi.
- Matriks peran dapat diubah berdasarkan ketentuan yang disahkan, dicatat di changelog.

## Berikutnya
Petakan role existing Flask; tulis tes akses API dan login menggunakan data sintetis setelah source Flask tersedia. Lanjutkan penguatan Core dan Profil Puskeswan di GitHub tanpa VPS.
