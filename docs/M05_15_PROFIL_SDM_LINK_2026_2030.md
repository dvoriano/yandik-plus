# M05-15 | Integrasi Kontrak Profil Puskeswan dan SDM Veteriner, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | BUKAN PRODUKSI.**

## Ruang lingkup yang sudah ditulis
- Model baca-saja di [drafts/m05-profile-sdm/model.mjs](../drafts/m05-profile-sdm/model.mjs) menggunakan kunci tunggal \`DEMO-PSW-*\`, \`DEMO-REGION-*\`, tahun 2026–2030 dan referensi sumber rekaan \`DEMO-SOURCE-*\`.
- Data fixture fiktif tanpa nama, NIP, kontak, alamat, atau identitas personal di [fixtures.mjs](../drafts/m05-profile-sdm/fixtures.mjs).
- Penyambung identitas yang sama dengan dashboard APEL M05-14 di [integration.mjs](../drafts/m05-profile-sdm/integration.mjs), read-only tanpa mengubah M05-14.
- [29 skenario QA tertulis](../drafts/m05-profile-sdm/tests/profile_sdm.test.mjs), **0 dijalankan**. Tidak ada klaim hasil tes.

## Kontrak data
| Elemen | Aturan DEMO | Batas |
|---|---|---|
| Puskeswan | ID stabil, label fasilitas, ID dan label wilayah | Tidak ada tabel/ID produksi |
| Profil | 1 snapshot per Puskeswan-tahun, status DRAFT/REVIEW_PENDING/RECORDED | Status bukan verifikasi kedinasan |
| SDM | 1 catatan cakupan per Puskeswan-tahun, COMPLETE_DEMO / PARTIAL_DEMO | Cakupan hanya klaim fixture sintetis |
| Penempatan | ID staf fiktif, peran, bulan mulai dan akhir eksklusif | Penempatan satu orang tidak boleh overlap |
| Tanggal as-of | Desember setiap tahun untuk laporan tahunan | Bukan perhitungan penempatan harian |
| Relasi APEL | Cocokkan ID, wilayah, label, tahun dan filter M05-14 | Nilai layanan tetap dari ledger M05-0; tidak diubah |

## Perbedaan tidak tersedia, parsial, dan nol
- Jika snapshot profil per tahun belum tersedia, status \`NOT_AVAILABLE_DEMO\`, bukan \`RECORDED_DEMO\`.
- Jika tidak ada snapshot cakupan SDM, angka dokter hewan dan paramedik \`null\`, bukan 0.
- Jika cakupan \`PARTIAL_DEMO\`, angka kategori tetap \`null\`; nilai observasi parsial disimpan terpisah.
- Jika fixture secara eksplisit menyatakan \`COMPLETE_DEMO\`, barulah hitungan termasuk angka 0 dapat dihitung sebagai **contoh**, bukan angka resmi.
- Tidak ada pewarisan otomatis data 2026 ke 2027–2030. Status kosong lintas tahun tidak boleh diartikan fasilitas ditutup, SDM nol, atau kewajiban tidak dipenuhi.

## Pengendalian
- Semua keluaran menyatakan \`synthetic=true\`, \`officially_verified=false\`, \`may_publish=false\`, dan tidak memberi izin menilai, merangking, mengirim pemberitahuan, menghubungkan API atau mengubah data.
- Data SDM bukan akun login; verifikator/otorisasi server di luar cakupan.
- Tidak ada file produksi, API, database, storage browser, rekaman pribadi, atau akses jaringan.
- M05-8 sampai M05-12 tetap menjadi gerbang wajib untuk sumber, paritas aturan, pengujian, dan rilis; semua **BLOCKED/NO_GO**.

## Pengujian tertunda
Lihat [TEST_BACKLOG](TEST_BACKLOG.md) untuk 29 skenario QA: ID/label terlarang, sumber yang tidak ada, angka 0 eksplisit, snapshot parsial, pindah tugas, rentang beririsan, filter lintas wilayah, dekade 2026–2030, penolakan data non-DEMO, dan semua flag kewenangan. Unit test belum dijalankan. Uji browser dan integrasi API sebenarnya belum direncanakan untuk dieksekusi dalam mode kode-saja.

## Gerbang berikutnya
1. Rancang M05-16: alur Pelaporan/Koreksi yang menampilkan konteks Profil dan SDM **tanpa mengubah ledger APEL**.
2. Rancang M05-17: Pembinaan/Tindak Lanjut read-only berdasarkan status DEMO dengan keputusan pejabat tetap di luar sistem.
3. Lanjutkan review cakupan 15 modul pada [audit status](STATUS_AUDIT_2026-11-23.md).
4. Hanya setelah izin owner, periksa sumber lama, hak akses, schema, dan hasil QA. Tidak ada klaim siap pakai sebelum itu.

**Keputusan:** M05-15 **KODE DITULIS, BELUM DIUJI**; pengembangan integrasi konseptual, bukan penyelesaian MOD-01/MOD-03 secara keseluruhan.
