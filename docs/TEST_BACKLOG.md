# TEST BACKLOG | Menumpuk Kode Dulu, Periksa Bersama Nanti

**Berlaku mulai 11 November 2026 atas instruksi pemilik proyek.**

**JANGAN JALANKAN CL, CI, test runner, workflow_dispatch, GitHub Actions manual, Node test, unittest, Chromium/Playwright atau tes browser untuk perubahan YANDIK+ baru sampai pemilik proyek memberi izin eksplisit.** Tidak perlu meminta setup lokal atau VPS. Hanya tulis kode GitHub dan tandai status.

## Status
- **BELUM DIUJI:** kode/berkas baru telah dibuat, tetapi benar-salah dan fungsinya belum diketahui.
- **TERTUNDA UJI:** menunggu persetujuan pemilik proyek untuk sesi penyisiran bersama.
- **TERUJI SEBELUMNYA:** capaian terakhir yang sudah punya run SUCCESS; tidak berlaku otomatis untuk kode yang baru ditambahkan.
- **BUTUH KEPUTUSAN:** memerlukan review pemilik proses/kebijakan, tidak cukup dengan tes teknis.

## Antrean M03-S4: laboratorium fairness

| ID | Yang nanti perlu diperiksa | Status |
|---|---|---|
| QA-S4-01 | Review sintaks JS, imports dan file static demo | BELUM DIUJI |
| QA-S4-02 | Semua bobot integer total 100, kontribusi 0–3 tidak melebihi bobot | BELUM DIUJI |
| QA-S4-03 | Nilai kosong ≠ nol, kasus tidak lengkap tidak masuk peringkat | BELUM DIUJI |
| QA-S4-04 | Volume pelayanan fiktif tidak berubah menjadi poin atau tie-breaker | BELUM DIUJI |
| QA-S4-05 | Kasus faktor identik seri, tanpa tiebreak penerima bantuan | BELUM DIUJI |
| QA-S4-06 | Perubahan bobot ditandai sebagai sensitivitas, bukan pengesahan prioritas | BELUM DIUJI |
| QA-S4-07 | Invalid ID/faktor/bukti dan field pendanaan ditolak, input ditampilkan aman | BELUM DIUJI |
| QA-S4-08 | Browser HP, keyboard, screen reader, kontras, overflow, error | BELUM DIUJI |
| QA-S4-09 | Penyisiran dengan kondisi riil Puskeswan, wilayah dan SOP resmi | BUTUH KEPUTUSAN |
| QA-S4-10 | Integrasi ke modul aktif, role server/DB dan regression suite | TERTUNDA UJI |

## Antrean lintas modul yang belum diujikan
- Flask legacy belum tersedia lengkap di repo; perlu audit integrasi, startup dan regresi APEL jika sudah tersedia.
- Akun/otorisasi API per wilayah, audit persisten, CSRF, password reset dan akses bukti.
- Pengguna nonteknis di HP fisik dan jaringan terbatas.
- M04: baru rencana, tidak boleh menganggap keputusan bantuan sudah tersedia.

**Terakhir lulus sebelum mode kode-saja:** M03-S3, [GitHub Actions 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270). Itu **bukan** pengujian M03-S4 atau kode draft berikutnya.

## Cara menutup backlog (nanti)
1. Dapatkan instruksi eksplisit: "boleh mulai uji".
2. Inventaris semua commit berlabel **BELUM DIUJI**, urutkan lintas modul.
3. Sisir review statis, keamanan, lalu tes modular, baru E2E/GitHub Actions jika anggaran dan izin memungkinkan.
4. Bila ada kegagalan, perbaiki tanpa menghapus bukti temuan.
5. Hanya setelah bukti lulus, ubah status tiap item dan kaitkan tautan pemeriksaan di ROADMAP/WORKLOG.
