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

## Antrean M03-S4B: telaah metodologi DEMO (semuanya BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-S4B-01 | Struktur kode, relative import dan form HTML tanpa menjalankan CL/CI | BELUM DIUJI |
| QA-S4B-02 | Kontrak draf, pengajuan, review, pengembalian dan revisi mempertahankan histori | BELUM DIUJI |
| QA-S4B-03 | Koreksi/alasan 30–700 karakter, peran/ID DEMO dan referensi harus valid | BELUM DIUJI |
| QA-S4B-04 | Skor baseline dan alternatif, data kosong, skor seri, perubahan peringkat sesuai sumber | BELUM DIUJI |
| QA-S4B-05 | Cegah keputusan anggaran, persetujuan bobot, BAST atau penerima dari form/output | BELUM DIUJI |
| QA-S4B-06 | Pemeriksaan tampilan HP, keyboard, screen reader, pesan error dan hilangnya data saat reload | BELUM DIUJI |
| QA-S4B-07 | Review kebijakan/otorisasi riil dan sumber data terverifikasi sebelum integrasi | BUTUH KEPUTUSAN |
| QA-S4B-08 | Keamanan backend, transaksi DB dan audit independen ketika ada sistem riil | TERTUNDA UJI |

Dokumen: [M03-S4B metodologi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md). Belum pernah diuji pada sesi coding ini.

## Antrean M03-S4C: draf bahan berita acara (SEMUA BELUM DIUJI)

| ID | Pemeriksaan kelak | Status |
|---|---|---|
| QA-S4C-01 | Impor `draft_minutes.mjs` dan jembatan baca `review_ledger.mjs`; struktur output | BELUM DIUJI |
| QA-S4C-02 | Rekap seluruh histori dari draf, submit, review, pengembalian, revisi tanpa kehilangan catatan lama | BELUM DIUJI |
| QA-S4C-03 | Catatan tanpa review tidak disebut hasil sah; status ditolak/dikembalikan tidak berubah menjadi diterima | BELUM DIUJI |
| QA-S4C-04 | Format poin, bobot, urutan, kasus seri dan data kosong tetap sesuai sumber simulasi | BELUM DIUJI |
| QA-S4C-05 | Sanitasi Markdown, teks panjang, karakter khusus, masukan tak sah dan field resmi terlarang | BELUM DIUJI |
| QA-S4C-06 | Form agenda/tindak lanjut, keluaran baca-saja, stale output dan interaksi HP 320/375 px + keyboard | BELUM DIUJI |
| QA-S4C-07 | Pastikan tidak ada nomor/tanggal resmi, tanda tangan, persetujuan anggaran, pengadaan, BAST atau surat keputusan | BELUM DIUJI |
| QA-S4C-08 | SOP tata naskah, verifikator resmi, arsip dan klasifikasi informasi sebelum penggunaan kedinasan | BUTUH KEPUTUSAN |

[Dokumen M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md). Tidak ada uji otomatis atau manual pada sesi ini.

## Antrean M04-S1: berkas administrasi Support (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S1-01 | Kontrak sumber DEMO terverifikasi vs diajukan; status bukti metadata, versi dan fasilitas | BELUM DIUJI |
| QA-M04S1-02 | Draf belum lengkap boleh disimpan; pengajuan wajib seluruh lima checklist `ada` | BELUM DIUJI |
| QA-M04S1-03 | Penelaah DEMO berbeda dari penyusun, hak transisi, pengembalian/perbaikan dan histori | BELUM DIUJI |
| QA-M04S1-04 | Larangan field allocation/approved_budget/recipient/SK/BAST dalam dokumen dan output | BELUM DIUJI |
| QA-M04S1-05 | Kategori prioritas sumber tidak menjadi auto-approve; angka pelayanan tidak memicu keputusan | BELUM DIUJI |
| QA-M04S1-06 | Source stale, perubahan versi dan penguncian referensi kebutuhan saat revisi | BELUM DIUJI |
| QA-M04S1-07 | Teks keluaran, karakter tak aman, validasi error, batas field dan penyimpanan memori saja | BELUM DIUJI |
| QA-M04S1-08 | UI HP 320/375 px, keyboard, pembaca layar, overflow dan navigasi | BELUM DIUJI |
| QA-M04S1-09 | Kesesuaian proses kewenangan, bukti, tata naskah, SPBE dan SOP daerah | BUTUH KEPUTUSAN |
| QA-M04S1-10 | Adapter sumber M03 asli, autentikasi, API/DB, audit, transaksi dan retensi resmi | TERTUNDA UJI |

[Dokumen M04-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md). Tidak ada CL, tes atau workflow yang dijalankan. Angka 176 tes lama hanya berlaku sampai M03-S3.

## Antrean M04-S2: register referensi eksternal (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S2-01 | Import relatif dari M04-S1, bentuk data DEMO dan kompatibilitas antarberkas | BELUM DIUJI |
| QA-M04S2-02 | Sumber dossier belum `tercatat_untuk_pertimbangan` ditolak, status sumber dan versi valid | BELUM DIUJI |
| QA-M04S2-03 | Nomor referensi DEMO ganda, penambahan beberapa entri dan pergantian referensi | BELUM DIUJI |
| QA-M04S2-04 | Validasi jenis dokumen, tanggal kalender, kode penerbit, kode metadata dan batas teks | BELUM DIUJI |
| QA-M04S2-05 | Alur draf → submit → catat metadata/klarifikasi/tidak sesuai, revisi dan histori | BELUM DIUJI |
| QA-M04S2-06 | Penelaah berbeda dari pencatat, pernyataan batas pemeriksaan wajib diisi | BELUM DIUJI |
| QA-M04S2-07 | Perubahan source M04-S1 membuat referensi stale dan menghalangi review tanpa konfirmasi ulang | BELUM DIUJI |
| QA-M04S2-08 | Tidak ada API/aksi menerbitkan SK, mengesahkan keputusan, menyetujui bantuan, anggaran atau BAST | BELUM DIUJI |
| QA-M04S2-09 | Keamanan teks/kebocoran data, ringkasan, UI HP 320/375 px, keyboard dan screen reader | BELUM DIUJI |
| QA-M04S2-10 | SOP, pemilik keputusan resmi, konfirmasi penerbit, pencabutan/masa berlaku, arsip/retensi/SPBE | BUTUH KEPUTUSAN |
| QA-M04S2-11 | Integrasi nanti dengan akun riil, API, database, audit dan keamanan file | TERTUNDA UJI |

[Dokumen M04-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md). Kode tidak dijalankan; 176 tes lama hanya sampai M03-S3.

## Antrean M04-S3: tindak lanjut administrasi (SELURUHNYA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S3-01 | Kesesuaian import dan kontrak antara model M04-S1/S2/S3 dengan fixture fiktif | BELUM DIUJI |
| QA-M04S3-02 | Sumber bukan `metadata_tercatat`, catatan M04-S2 tanpa review dan source stale ditolak | BELUM DIUJI |
| QA-M04S3-03 | Draf, penugasan, mulai catatan, submit, telaah, revisi, pembatalan dan histori | BELUM DIUJI |
| QA-M04S3-04 | Pemisahan koordinator, petugas dan penelaah; label DEMO bukan autentikasi | BELUM DIUJI |
| QA-M04S3-05 | Duplikasi tugas satu jenis pada referensi aktif, hingga 30 tugas, penanganan ID dan tanggal | BELUM DIUJI |
| QA-M04S3-06 | Referensi berubah setelah pembuatan tugas, operasi diblokir tanpa review ulang | BELUM DIUJI |
| QA-M04S3-07 | Field alokasi, penerima, pembayaran, pengadaan, keputusan dan BAST dilarang | BELUM DIUJI |
| QA-M04S3-08 | Status `ditutup_administratif` tidak mengubah keaslian surat, alokasi/BAST, atau makna M04-S2 | BELUM DIUJI |
| QA-M04S3-09 | UI 320/375 px, tombol rencana baru, cancel beralasan, keyboard, screen reader dan kesalahan form | BELUM DIUJI |
| QA-M04S3-10 | SOP pemberi tugas, konfirmasi dokumen penerbit asli, keamanan, arsip/retensi dan SPBE | BUTUH KEPUTUSAN |
| QA-M04S3-11 | Integrasi Flask/DB/role nyata, audit tahan perubahan dan pengingat tenggat yang sah | TERTUNDA UJI |

[Spesifikasi M04-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md). Tidak ada kode baru yang diuji pada sesi ini.

## Antrean lintas modul yang belum diujikan
- Flask legacy belum tersedia lengkap di repo; perlu audit integrasi, startup dan regresi APEL jika sudah tersedia.
- Akun/otorisasi API per wilayah, audit persisten, CSRF, password reset dan akses bukti.
- Pengguna nonteknis di HP fisik dan jaringan terbatas.
- M04-S1/S2/S3: kode draft administrasi, register referensi dan tindak lanjut tersimpan, **BELUM DIUJI**; keputusan resmi, anggaran, distribusi dan BAST M04-S4+ tetap RENCANA.

**Terakhir lulus sebelum mode kode-saja:** M03-S3, [GitHub Actions 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270). Itu **bukan** pengujian M03-S4 atau kode draft berikutnya.

## Cara menutup backlog (nanti)
1. Dapatkan instruksi eksplisit: "boleh mulai uji".
2. Inventaris semua commit berlabel **BELUM DIUJI**, urutkan lintas modul.
3. Sisir review statis, keamanan, lalu tes modular, baru E2E/GitHub Actions jika anggaran dan izin memungkinkan.
4. Bila ada kegagalan, perbaiki tanpa menghapus bukti temuan.
5. Hanya setelah bukti lulus, ubah status tiap item dan kaitkan tautan pemeriksaan di ROADMAP/WORKLOG.
