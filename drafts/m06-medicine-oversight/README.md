# M06-S1 | Pengawasan Obat Hewan, register & checklist DEMO

**KODE DITULIS, BELUM DIUJI.** Semua sarana, wilayah, kunjungan, sumber, dan rujukan bukti fiktif.

\`medicine.mjs\` menyusun tampilan **baca-saja** register sarana pengawasan obat hewan dan checklist observasi DEMO. Data 2026–2030 hanya untuk desain. Empat domain awal (dokumen, penyimpanan, catatan persediaan, kedaluwarsa) adalah **kategori rancangan**, tidak menyatakan standar pemeriksaan resmi atau dasar sanksi.

Setiap pembacaan rincian memakai [gerbang M00-G1](../m00-oversight-access/) untuk memeriksa contoh sesi/role/wilayah. Gerbang ini memerlukan penyedia sesi yang nanti benar-benar autentik di server. **Kode belum menjamin autentikasi nyata**. Pimpinan/petugas Puskeswan tidak melihat detail sarana.

Ada perbedaan jelas antara:
- **Belum ada catatan kunjungan DEMO**: \`latest_visit_month=null\`, bukan klaim sarana tak pernah diperiksa.
- **Observasi masih perlu klarifikasi**: saran pemeriksaan manusia, bukan temuan pelanggaran resmi.
- **Dokumen legalitas belum diverifikasi**: semua \`legal_state=NOT_VERIFIED_DEMO\`, bukan izin sah atau izin tidak sah.

Tidak ada foto asli, dokumen resmi, pemilik sarana, penugasan inspeksi, ekspor, notifikasi, koneksi DB, angka peringkat risiko, persetujuan, atau sanksi. \`tests/medicine.test.mjs\` memuat **24 QA tertulis, 0 dijalankan**.

[Spesifikasi](../../docs/M06_S1_REGISTER_OBAT_HEWAN_DEMO_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
