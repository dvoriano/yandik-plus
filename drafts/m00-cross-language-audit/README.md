# M00-G8 | Format Audit JavaScript ↔ Python (DEMO)

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | TANPA MIGRASI.**

Dua format audit lama berbeda: M00-G5 memakai sequence log global dan JSON.stringify objek, sedangkan M00-G7 memakai revisi stream per-link dan json.dumps dengan pengurutan kunci. Hash lama **tidak kompatibel langsung**.

File `bridge.mjs` dan `bridge.py` mendefinisikan proyeksi baca-saja format yang sama:
- Terima hanya event **DEMO** dengan daftar field tepat, satu link per stream, revisi berurutan dan status tidak resmi.
- Hasilkan array JSON kanonik dengan **urutan field tetap, ASCII-only**, lalu SHA-256 untuk format baru. Sumber legacy tidak dimutasi.
- Hash asli hanya diverifikasi *bentuknya*; nilai, rantai, sesi, izin data dan status database asli **tidak diverifikasi**. Maka kesamaan digest baru hanya berarti **kesetaraan representasi data yang diberikan**, bukan kebenaran audit atau bukti kejadian.
- Tidak ada API, import file produksi, migrasi SQLite/Flask atau sync APEL/iSIKHNAS.

`demo_vectors.json` adalah dua record rekaan dengan isi semantik sama tetapi bentuk dan hash sumber berbeda. `export_vectors.mjs` adalah bantuan QA lintas runtime; **belum dijalankan**. QA JavaScript dan Python termasuk pemeriksaan digest Node↔Python tertunda, bukan hasil teruji.

Lanjutan sebelum integrasi: audit sumber asli dengan izin, definisi satu stream per link yang kompatibel lintas modul, validasi ulang hash asal masing-masing backend, identitas host tepercaya, dan tes lintas bahasa dengan izin owner.

[Spesifikasi](../../docs/M00_G8_CROSS_LANGUAGE_AUDIT_BRIDGE_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
