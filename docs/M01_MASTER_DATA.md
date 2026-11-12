# M01-S2 | Kontrak Master Data Puskeswan

**Status:** Prototype dibuat dan diuji pada GitHub, bukan modul Flask yang berjalan. **Tanggal:** 10 November 2026.

## Alur data
Master Puskeswan (ID tetap) → SDM/penempatan, Profil/Sarpras, APEL dan usulan Support. Setiap modul mengacu ID yang sama, tanpa menulis identitas Puskeswan berkali-kali.

## Kode dan dataset
- foundation/yandik_base/masterdata.py berisi Staff, Placement, AssetObservation, ProfileDatum, MasterData serta facility_overview.
- foundation/fixtures/sdm.json dan penempatan.json memodelkan mutasi SDM fiktif dengan tanggal.
- foundation/fixtures/sarpras.json menyimpan kondisi alat yang berubah tanpa menimpa histori.
- foundation/fixtures/profil.json menyimpan bidang profil, sumber, waktu observasi dan status verifikasi.
- foundation/tests/test_masterdata.py memeriksa 18 skenario baru dan validator fixture ikut diperluas.

## Aturan integritas
- ID Puskeswan/SDM unik; objek lain harus mengacu ID dikenal.
- Penempatan tenaga per tanggal tidak boleh tumpang tindih, dan mutasi menyimpan catatan sebelumnya.
- Kondisi alat menggunakan observasi terbaru sampai tanggal tertentu, bukan menghapus catatan lama.
- Data profil belum terverifikasi tidak dihitung sebagai sudah diverifikasi.
- Nilai pelayanan nol tidak sama dengan tidak mengirim laporan APEL.
- Jumlah yang tercatat tidak otomatis membuktikan kapasitas layanan/stock riil.
- Tidak menghitung total pelayanan dengan sekadar menjumlah kategori tanpa juknis resmi.

## Bukti
- Commit kode: https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a
- Commit tes: https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854
- GitHub Actions: https://github.com/dvoriano/yandik-plus/actions/runs/42840263033 (SUCCESS, 40 tes foundation dan validator fixture).

## Batasan dan lanjutan
- Source Flask lama belum ada di repository; kode ini tidak mengubah login, API, database ataupun website.
- Rancangan field profiling dan ketentuan riil harus dipetakan dari source/juknis yang telah disahkan.
- Belum tersedia UI mudah digunakan, histori keaktifan SDM yang lengkap, kontrol akses endpoint, atau verifikasi pejabat.
- Selanjutnya: adapter untuk Profil/SDM dan UX pembaruan profil per bagian setelah baseline source tersedia.
