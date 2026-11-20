# M05-5 | Kontrak sumber dan rekonsiliasi APEL

**KODE DITULIS, BELUM DIUJI. CODE_ONLY.** Kontrak murni DEMO untuk memeriksa struktur empat keluarga sumber: registry fasilitas, ledger pelayanan, workflow pengiriman, dan rule-set tahunan 2026–2030.

\`reconciliation.mjs\` menerima envelope snapshot sintetik yang eksplisit belum terverifikasi. Ia memeriksa bentuk, duplikasi, versi kebijakan, periode, identitas fasilitas dan selisih antar sumber. Hasil \`structural_match\` hanya berarti tidak ditemukan selisih pada input DEMO tersebut, bukan bukti sumber resmi, integritas digest, snapshot atomik atau kepatuhan.

**Tidak ada** konektor, SQL, akses Flask, file, jaringan, update, auto-repair, delete, scoring, ranking atau publikasi. SHA-256 hanya format string yang dipersyaratkan, bukan dihitung atau diverifikasi oleh modul. Timestamp adalah metadata input, bukan bukti snapshot konsisten.

20 skenario QA tertulis, 0 dijalankan: \`tests/reconciliation.test.mjs\`.
