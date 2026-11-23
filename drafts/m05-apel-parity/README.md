# M05-10 | Matriks Uji Paritas & Kriteria Penerimaan APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.**

M05-10 menyusun **pertanyaan pemeriksaan yang kelak harus dijawab**, bukan menjalankan pengujian ataupun membuktikan angka pelayanan. Ia meneruskan batas M05-0 sampai M05-9: perhitungan 2026 belum dicocokkan dengan Juknis/Flask asli, mapping skema belum terverifikasi, gerbang M05-8 masih BLOCKED, dan tindak lanjut M05-9 tidak mengubah sumber.

**Struktur:**
- `matrix.mjs`: 23 konsep pemeriksaan, dengan 20 berlaku setiap tahun, dua khusus untuk acuan 2026 (investigasi per kejadian/lokasi, kurban per hewan, ditambah satu kasus baseline 2026: total khusus 2026 = 22 karena ada **tiga** kasus 2026 saja? Lihat perhitungan katalog), satu khusus 2027–2030. Keluaran selalu `BLOCKED_NOT_TESTED` dan tanpa comparator/toleransi resmi.
- `references.mjs`: katalog metadata referensi **DEMO-`** saja; tidak memuat file sumber, angka atau keputusan. Menginput kandidat bukan membuktikan referensi sah.
- `acceptance.mjs`: sembilan langkah bukti/persetujuan dan enam gerbang readiness yang selalu BLOCKED. Tidak menghasilkan PASS, verifikasi, nilai, peringkat, atau izin publikasi.
- `tests/parity.test.mjs`: **50 skenario QA ditulis, 0 dijalankan**.

**Catatan cakupan:** 23 definisi terdiri dari 19 lintas tahun, 3 khusus 2026, dan 1 khusus 2027–2030. Sehingga 2026 = 22 skenario; 2027/2028/2029/2030 = 20 skenario per tahun, total 102. Semua adalah rancangan, bukan tes eksekusi. *(Jumlah dihitung dari daftar definisi dan harus diverifikasi saat QA nanti.)*

**Pengaman:** tidak ada konektor, SQL, API, Flask/VPS, akses data resmi, akses rahasia, CI/CL/tes/browser, deploy, merge atau publish. Semua fungsi hanya membentuk objek plain JS dari data DEMO. `may_run_tests`, `may_connect`, `may_write`, `may_score`, `may_rank`, `may_award`, `may_publish` bernilai false.

Lihat [spesifikasi M05-10](../../docs/M05_10_PARITY_ACCEPTANCE_MATRIX_2026_2030.md) dan [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

**M05-11 RENCANA:** rancangan *test execution authorization and staging protocol* sebagai dokumen/kontrak non-eksekusi, tetap menunggu owner secara eksplisit mengizinkan tes dan referensi resmi tersedia.
