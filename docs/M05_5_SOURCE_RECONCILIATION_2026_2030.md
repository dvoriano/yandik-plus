# M05-5 | Kontrak sumber resmi dan rekonsiliasi read-only APEL 2026–2030

**20 November 2026 | KODE DITULIS, BELUM DIUJI.** Semua implementasi di \`drafts/m05-apel-reconciliation\` adalah kontrak DEMO, bukan integrasi sistem. Tidak ada akses ke database, Flask, API, VPS atau website produksi.

## Tujuan
Menentukan struktur bukti dan pemeriksaan sebelum kelak ada keputusan owner untuk integrasi. Cakupan tahun tetap 2026–2030 dengan rule-set per tahun.

## Empat keluarga sumber yang perlu dipertemukan
1. Registry fasilitas: ID Puskeswan dan wilayah yang berlaku pada periode terkait.
2. Ledger pelayanan: satu rekaman per fasilitas-periode, termasuk deklarasi nihil dan rincian kejadian sesuai definisi sumber.
3. Workflow laporan: rekaman draft/kirim/revisi dan identitas periode.
4. Rule-set tahunan: versi aturan terpisah untuk setiap tahun.

Kontrak tidak mengasumsikan schema DEMO identik dengan Flask produksi. Pemetaan aktual perlu disusun setelah pemilik sistem memberikan schema, data dictionary dan akses uji yang sah.

## Pemeriksaan yang dirancang
- Envelope snapshot: identitas snapshot, waktu UTC, digest berformat SHA-256, jumlah baris, status read-only dan label sumber.
- Registry: ID fasilitas unik.
- Ledger/workflow: keunikan fasilitas-periode, pasangan yang hilang pada salah satu sumber, fasilitas tanpa registry.
- Policy: versi aturan cocok dengan tahun dan cakupan 2026–2030.
- Missing dan mismatch ditampilkan eksplisit. Tidak ada pengisian nol, koreksi otomatis atau penghapusan.

## Batas bukti
Semua envelope DEMO menetapkan \`authority_state=DEMO_UNVERIFIED\`, \`digest_verified=false\`, \`source_owner_verified=false\`. Digest tidak dihitung/diverifikasi. Timestamp tidak membuktikan snapshot atomik. \`structural_match=true\` hanya berarti tidak ditemukan perbedaan struktural pada fixture DEMO, bukan validasi sumber resmi atau kelengkapan data aktual. Tidak ada hasil yang dapat dipakai sebagai status kepatuhan, penilaian, ranking atau publikasi.

## Gerbang sebelum integrasi
1. Persetujuan tertulis owner dan pengelola data atas tujuan, ruang lingkup, akun layanan, dan akses minimum.
2. Schema/database dictionary aktual, pemilik setiap tabel, definisi periode, zona waktu, status, revisi dan identitas fasilitas.
3. Snapshot konsisten dari sumber resmi dengan mekanisme transaksi/snapshot yang dijelaskan dan dibuktikan oleh pemilik platform.
4. Digest dihitung dan diverifikasi dengan implementasi tepercaya di lingkungan uji; metadata sumber dan jumlah baris ditandatangani/diaudit.
5. Rekonsiliasi sampling dan total kontrol bersama pengelola APEL; selisih harus diselesaikan manual dengan jejak audit.
6. RBAC, privasi, retensi, backup/restore, log akses dan prosedur insiden disetujui.
7. Uji integrasi hanya di staging/fixture yang disetujui, setelah CODE_ONLY dicabut secara eksplisit.
8. Persetujuan terpisah untuk penggunaan hasil di dashboard internal atau publik.

## QA dan langkah selanjutnya
**20 skenario ditulis, 0 dijalankan.** [Kode M05-5](../drafts/m05-apel-reconciliation/) · [README](../drafts/m05-apel-reconciliation/README.md) · [TEST_BACKLOG](TEST_BACKLOG.md).

**M05-6 (RENCANA):** matriks data dictionary dan mapping schema aktual setelah sumber resmi diberikan dan owner mengizinkan. Tidak ada integrasi otomatis.
