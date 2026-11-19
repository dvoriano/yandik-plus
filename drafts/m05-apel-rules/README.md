# M05-3 | Kontrak Penilaian & Apresiasi APEL 2026–2030 (DEMO)

**KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Tidak ada sambungan ke Flask, Puskeswan aktual, data ASN, database produksi, skor atau keputusan resmi. Repository PUBLIC, hanya data dan ID sintetis.

- `rulebook.mjs`: lima tahun dengan versi kebijakan independen. Konsep kategori 2026 adalah **referensi historis yang harus dicocokkan dengan Juknis**; konsep 2027 masih **usulan**. Tahun 2028–2030 **belum mempunyai kategori yang ditetapkan**. Rancangan kategori `proposeYearRules` tidak mengisi rumus, bobot, bonus maupun tie-breaker dengan angka asal.
- `preview.mjs`: hanya menampilkan **fakta DEMO deskriptif** dari M05-0 dan status M05-2. Jumlah pelayanan bersumber dari ledger DEMO yang belum diverifikasi, jumlah bulan dikirim dari workflow DEMO, **keduanya belum direkonsiliasi**. Ketepatan waktu, realisasi dukungan dan agregasi kabupaten/kota tetap `null` karena bukti dan sumbernya belum ada. Tidak ada skor/peringkat/apresiasi.
- `review.mjs`: 12 gerbang pemilik proses, sumber aturan, metode, kualitas data, keadilan, revisi historis dan publikasi. Semua **BELUM_DIBUKTIKAN**; catatan DEMO tidak menutup gerbang atau membentuk persetujuan.
- `fixtures.mjs`: data contoh sintetis, tidak menyatukan dua sumber menjadi satu angka resmi.
- `tests/`: **29 skenario tertulis, 0 dijalankan** (10 rulebook, 11 preview, 8 review).

**Pembeda wajib:** pelaporan, volume pelayanan, ketepatan waktu, realisasi dukungan, dan apresiasi adalah konsep berbeda; tidak boleh dijumlahkan tanpa rumus tahunan yang telah diuji/disetujui. Klasemen atau predikat Platinum/Gold/Silver tidak dihasilkan dari DEMO ini.

[Spesifikasi M05-3](../../docs/M05_3_ANNUAL_RULES_2026_2030.md) · [M05-2](../../docs/M05_2_CHECKLIST_COMPLIANCE_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
