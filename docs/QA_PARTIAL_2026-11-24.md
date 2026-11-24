# QA-P1 | Bukti pengujian parsial YANDIK+ (24 November 2026)
**Status: PARTIAL_RUN.** Tested SHA `fd066c2f4ededcbd2b8d0526a7a5e4b8412477fb`, PR #9 Draft. User meminta lanjut preview/pengujian. Tidak ada izin rilis, CI/CL, sumber produksi, atau seluruh suite. Salinan lokal terbatas, bukan checkout lengkap. [Bukti terstruktur](../drafts/yandik-qa/qa-p1-result.json).

## Hasil nyata
| Suite | Actual | Lulus | Gagal |
|---|---:|---:|---:|
| Python test_contract | 22 | 22 | 0 |
| Python test_apel_store | 25 | 25 | 0 |
| Node backend-client-retry | 4 | 4 | 0 |
Backend 47 dari 319 deklarasi, 30 pure + 17 rehearsal, 272 belum dijalankan. JavaScript terpisah. Tidak ada klaim lulus gate B/C seluruhnya. Runtime Python 3.13.5, Node 22.16.0, Chromium 144.0.7559.96. Masing-masing 12 file ditranskripsi utuh dari connector dan diverifikasi dengan git hash-object terhadap tree SHA; daftar digest di hasil JSON. Test commands dan actual counts tercatat di sana. APEL hanya DemoStore private SQLite :memory:; seed dua fasilitas, tidak AccountStore, tidak ledger; tes termasuk zero, investigation/kurban dedupe, draft/submit/review/correction, cross-scope, spoof/revoke/replay, rollback/immutability/FK. Kontrak pure tidak membuktikan autentikasi nyata.
## Browser
Checkout langsung gagal `Could not resolve host: github.com`; percobaan navigasi virtual-origin lokal `ERR_BLOCKED_BY_ADMINISTRATOR`. Tidak melakukan bypass. Uji komponen terisolasi menggunakan Chromium local page.set_content: kode document-preview.mjs dan backend-workspace.css telah diverifikasi dan di-inline; shell dan JSON fixture sintetis dibuat untuk pengujian, bukan hasil renderer Python/portal terpadu. Empat jenis tampilan di 1280 dan 375 px, no horizontal overflow, stale dan history labels terlihat, may_send true ditolak, nilai mirip HTML tetap literal, no page errors. Screenshot diberikan di chat; file tidak ditambahkan ke repo. Digest screenshot di JSON.
## Next
A full preview blocked; B/C partial. D/E blocked. Buka workspace Codex yang dapat checkout branch develop/yandik-foundation, baca C8 handoff. Verify current SHA, jalankan suite bertahap, catat kegagalan dan perbaikan; kemudian preview terpadu dan QA UI. Jangan menerobos pembatasan browser/akses. Tidak ada source code change dari tes parsial, tidak ada kegagalan pada suite yang dieksekusi; blocker lingkungan tetap. Jangan mengubah status milestone jadi selesai. CODE_ONLY tetap untuk pekerjaan di luar cakupan izin pengujian ini; no CI/CL/merge/deploy.
