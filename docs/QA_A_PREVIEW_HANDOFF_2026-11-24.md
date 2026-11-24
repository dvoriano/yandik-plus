# QA-A | Handoff preview website YANDIK+ | 24 November 2026

**Status: BLOCKED_ENVIRONMENT. Belum ada hasil pengujian browser.** Scope izin owner pada sesi ini: QA-A preview DEMO saja. CODE_ONLY tetap menahan unit, SQL, CI/CL workflow, migrasi, staging dan deployment.

## Percobaan aktual
- Target snapshot: `fe0c77c016ad928907a55d5125c2138a04112d9b` pada branch `develop/yandik-foundation`, PR #9 Draft.
- Lingkungan eksekusi menyediakan Chromium tetapi perintah baca ref GitHub gagal: `Could not resolve host: github.com`. Pengambilan arsip ZIP juga tidak tersedia. Tidak ada checkout utuh; tidak membuka browser dengan halaman palsu.
- Pembacaan statis melalui konektor GitHub pada SHA yang sama menemukan recursive tree tidak terpotong, 669 file, 8 entry module script dan 3 stylesheet yang dirujuk review.html tersedia, serta tidak ada duplikasi ID HTML statis. Ini pemeriksaan keberadaan file langsung, bukan validasi dependency transitif, syntax, runtime, CSS, network, UX atau hasil QA.
- Q01 BLOCKED_ENVIRONMENT. Q02–Q29 NOT_RUN karena prasyarat preview belum tersedia. Semua unit/SQL/integrasi tidak dijalankan. Tidak ada screenshot. Status roadmap tetap belum selesai.

## Prompt serah-terima Codex (gunakan hanya pada workspace yang benar-benar punya akses repository)

```text
Lanjutkan QA-A YANDIK+ dengan izin preview DEMO saja.
Repository: dvoriano/yandik-plus
Branch: develop/yandik-foundation
Snapshot aplikasi yang dituju: fe0c77c016ad928907a55d5125c2138a04112d9b
Baca PROJECT_STATE.md, docs/CODE_ONLY_MODE.md, docs/MASTER_QA_YANDIK_2026_2030.md dan docs/CODEX_PREVIEW_YANDIK.md.
Gunakan checkout seluruh repository di workspace terisolasi; catat SHA aktual.
Jalankan server file statis dari root checkout hanya pada loopback 127.0.0.1 port 8765.
Buka /drafts/yandik-portal/review.html#layanan dan katalog /drafts/yandik-portal/index.html.
Tampilkan preview browser dan ambil bukti screenshot nyata dari halaman yang dirender.
Mulai Q01-Q04: impor dan console, navigasi state sesi, ukuran HP 320/375 dan desktop 1280, network/storage DEMO. Jika Q01 gagal, berhenti dan catat error aktual.
Jika tidak ada blocker, lanjutkan skenario Q05-Q29 sesuai dependensi dan prioritas. Laporkan tiap hasil dengan expected/actual, SHA dan bukti; jangan menyatakan PASS hanya dari screenshot.
Tidak boleh unit test, SQL, GitHub Actions, CI/CL, mengubah main, merge PR #9, menghubungi VPS/produksi, memakai data nyata atau deploy. Bila diperlukan perbaikan kode, laporkan temuan dulu, jangan mengubah scope pengujian.
```

Bila snapshot di atas tidak bisa di-checkout, laporkan BLOCKED; jangan memakai ZIP lama atau membuat mockup sebagai bukti preview. Handoff ini bukan pekerjaan latar belakang atau bukti Codex sudah dijalankan.
