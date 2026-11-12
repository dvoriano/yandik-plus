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

## Antrean M04-S4: Dashboard antrean administratif (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S4-01 | Impor, fixture lintas M04-S1/S2/S3/S4; semua data hanya DEMO | BELUM DIUJI |
| QA-M04S4-02 | Total sebelum filter, jumlah aktif/ditutup/dibatalkan, perbaikan dan menunggu telaah | BELUM DIUJI |
| QA-M04S4-03 | Tanggal acuan eksplisit, tanggal tidak sah dan kondisi lewat/tiba tenggat | BELUM DIUJI |
| QA-M04S4-04 | Tugas ditutup/dibatalkan tidak ikut hitungan aktif terlambat | BELUM DIUJI |
| QA-M04S4-05 | Sumber berubah/stale, indikator gabungan dan klasifikasi perhatian utama | BELUM DIUJI |
| QA-M04S4-06 | Filter status, penanggung jawab DEMO, kategori perhatian serta reset | BELUM DIUJI |
| QA-M04S4-07 | Pengurutan perhatian dan tenggat, kasus tanpa data, tampilan tabel | BELUM DIUJI |
| QA-M04S4-08 | Rekap teks baca-saja, status sebelum/sesudah filter, tanpa angka kebijakan/keuangan | BELUM DIUJI |
| QA-M04S4-09 | HP 320/375 px, keyboard, screen reader, pesan kesalahan, tabel dapat digulir | BELUM DIUJI |
| QA-M04S4-10 | API mutasi/approval absent, privasi DEMO, tidak ada penyimpanan/kirim otomatis | BELUM DIUJI |
| QA-M04S4-11 | SOP definisi keterlambatan, penugasan, klasifikasi data, keamanan/akses dan SPBE | BUTUH KEPUTUSAN |
| QA-M04S4-12 | Integrasi data/akun riil, backend, audit permanen dan monitoring operasional | TERTUNDA UJI |

[Dokumen M04-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md). Tidak ada pemeriksaan baru yang dieksekusi.

## Antrean M04-S5: Kendala dan eskalasi administratif (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S5-01 | Kontrak impor M04-S1/S2/S3/S5 dan data fiktif, tidak ada koneksi ke produksi | BELUM DIUJI |
| QA-M04S5-02 | Hanya assignee aktif M04-S3 yang dapat membuat draf; sumber stale atau ditutup ditolak | BELUM DIUJI |
| QA-M04S5-03 | Draf, revisi, pelaporan, penerusan, tanggapan, klarifikasi ulang, penutupan/batal dan histori | BELUM DIUJI |
| QA-M04S5-04 | Pemisahan pelapor/koordinator/penerima/penelaah DEMO; identitas peran bukan autentikasi | BELUM DIUJI |
| QA-M04S5-05 | Duplikat aktif kategori sama pada tugas yang sama, ID unik dan kapasitas 25 | BELUM DIUJI |
| QA-M04S5-06 | Perubahan tugas sumber/referensi, versi dan snapshot membuat tindakan tertahan | BELUM DIUJI |
| QA-M04S5-07 | Kategori/urgensi/teks/tanggal kode DEMO, field keputusan/anggaran/BAST dilarang | BELUM DIUJI |
| QA-M04S5-08 | Penutupan administratif tidak mengubah M04-S3 dan tidak mengesahkan surat/bantuan | BELUM DIUJI |
| QA-M04S5-09 | Rekap total/aktif/perlu klarifikasi/lewat tanggal manual dan histori teks | BELUM DIUJI |
| QA-M04S5-10 | Form dan pilihan kendala 320/375px, keyboard, pembaca layar, status error/empty | BELUM DIUJI |
| QA-M04S5-11 | SOP alur eskalasi, siapa berwenang menerima, retensi dan keamanan/SPBE | BUTUH KEPUTUSAN |
| QA-M04S5-12 | Integrasi login, otorisasi wilayah, API/DB, audit dan notifikasi resmi kelak | TERTUNDA UJI |

[Spesifikasi M04-S5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md). Seluruh kode BELUM DIUJI, belum ada CL/CI baru.

## Antrean M04-S6: matriks eskalasi administratif DEMO (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S6-01 | Impor M04-S1/S2/S3/S5/S6 dan fixture sumber DEMO tanpa data riil | BELUM DIUJI |
| QA-M04S6-02 | Matriks lima kategori dan tiga urgensi (15 rute), label/tujuan/penjelasan konsisten | BELUM DIUJI |
| QA-M04S6-03 | Urgensi mendesak hanya usulan pembahasan koordinator, bukan penetapan bantuan | BELUM DIUJI |
| QA-M04S6-04 | Draf, belum dilaporkan, ditutup/dibatalkan atau sumber usang tidak bisa dipilih | BELUM DIUJI |
| QA-M04S6-05 | Alasan override minimum 60 karakter; unit tujuan harus termasuk daftar DEMO | BELUM DIUJI |
| QA-M04S6-06 | Draf → submit → review/return/revise, pemisahan pelaku dan kelengkapan histori | BELUM DIUJI |
| QA-M04S6-07 | Sumber eskalasi berubah setelah draf/pengajuan, tidak dapat melanjutkan tanpa kaji ulang | BELUM DIUJI |
| QA-M04S6-08 | Tidak ada `routeEscalation()` otomatis, notifikasi atau mutasi status M04-S5 | BELUM DIUJI |
| QA-M04S6-09 | Atribut persetujuan, anggaran, penerima, pengadaan dan BAST tidak diterima | BELUM DIUJI |
| QA-M04S6-10 | Tabel 15 opsi, form, aksesibilitas dan HP 320/375px, filter, navigasi keyboard | BELUM DIUJI |
| QA-M04S6-11 | Format rekap, perubahan status, catatan review dan sanitasi input teks | BELUM DIUJI |
| QA-M04S6-12 | Validitas alur kelembagaan, petugas pengampu, SPO/SOP, tata naskah, SPBE | BUTUH KEPUTUSAN |
| QA-M04S6-13 | Integrasi backend dengan login, kontrol akses wilayah, audit tahan perubahan setelah disetujui | TERTUNDA UJI |

[Spesifikasi M04-S6](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S6_ROUTING_MATRIX.md); semua tes ditunda sesuai instruksi owner.

## Antrean M04-S7: Katalog unit, matriks RACI dan draf SOP (SEMUA BELUM DIUJI)

| ID | Pemeriksaan nanti | Status |
|---|---|---|
| QA-M04S7-01 | Import M04-S1/S2/S3/S5/S6/S7 dan fixture DEMO | BELUM DIUJI |
| QA-M04S7-02 | Empat unit/kode/prasyarat/batas konsisten dengan M04-S6 | BELUM DIUJI |
| QA-M04S7-03 | Enam aktivitas RACI, peran R/A/C/I tepat dan tidak mengklaim jabatan/kewenangan resmi | BELUM DIUJI |
| QA-M04S7-04 | Hanya note M04-S6 ditelaah `dicatat_untuk_pembahasan` yang dapat jadi sumber | BELUM DIUJI |
| QA-M04S7-05 | Kendala M04-S5 stale, batal/ditutup, perubahan note M04-S6 dan sumber tidak konsisten harus ditolak | BELUM DIUJI |
| QA-M04S7-06 | Unit proposal harus sama dengan unit M04-S6, tidak boleh mengubah rute diam-diam | BELUM DIUJI |
| QA-M04S7-07 | Draf, submit, review, return, revisi, histori; penelaah DEMO berbeda | BELUM DIUJI |
| QA-M04S7-08 | Tanggal, teks minimum/maksimum dan atribut SOP resmi/approval/anggaran/BAST dilarang | BELUM DIUJI |
| QA-M04S7-09 | Tidak mengirim surat/disposisi, tidak mengubah sumber M04-S5/S6 atau memicu CI | BELUM DIUJI |
| QA-M04S7-10 | Tabel katalog/RACI, form HP 320/375px, keyboard, screen reader, pesan kesalahan | BELUM DIUJI |
| QA-M04S7-11 | Rekap baca-saja dan klaim status `dicatat_untuk_bahan_sop` tidak jadi SOP berlaku | BELUM DIUJI |
| QA-M04S7-12 | Telaah kewenangan resmi, tupoksi, bagan organisasi, SOP, SPBE, tata naskah/arsip | BUTUH KEPUTUSAN |
| QA-M04S7-13 | Integrasi autentikasi/role/wilayah nyata, DB, audit permanen dan dokumen resmi setelah disahkan | TERTUNDA UJI |

[Spesifikasi M04-S7](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S7_UNIT_CATALOG_RACI.md). Mode kode saja tetap berlaku, tidak ada tes baru.

## Antrean M04-S9J: catatan pembahasan contoh per fungsi (BELUM DIUJI)

| ID | Pemeriksaan tertunda setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9J-01 | Rantai impor dari M04-S9I hingga S9J hanya fixture sintetis, tidak tersambung produksi | BELUM DIUJI |
| QA-M04S9J-02 | Enam fungsi dan 18 butir tepat satu lembar masing-masing tanpa hilang/duplikat | BELUM DIUJI |
| QA-M04S9J-03 | Tiga kolom hanya berisi teks fiktif; nilai kosong, trim, panjang maksimal 500 dan kontrol karakter | BELUM DIUJI |
| QA-M04S9J-04 | Revisi demo bertambah tepat bila nilai berubah, histori tidak menimpa catatan lama, input tidak memutasi sumber | BELUM DIUJI |
| QA-M04S9J-05 | Perubahan tidak menambah revisi saat isinya sama, dan pengosongan kolom berfungsi | BELUM DIUJI |
| QA-M04S9J-06 | Menolak butir/fungsi tidak cocok, extra keys dan sumber yang berubah/stale tanpa konsistensi referensi | BELUM DIUJI |
| QA-M04S9J-07 | Menolak book non-DEMO, fake approval, fake meeting/decision, fake verified evidence dan unauthorized deploy | BELUM DIUJI |
| QA-M04S9J-08 | Tidak ada API, fetch, localStorage, DB, email, notifikasi, upload atau persistensi antar-reload | BELUM DIUJI |
| QA-M04S9J-09 | Reset ke buku DEMO kosong, limit 200 edit, dan kewajaran jejak revisi lokal | BELUM DIUJI |
| QA-M04S9J-10 | Rekap per fungsi/semua fungsi, teks panjang, empty state, label eksplisit bukan berita acara resmi | BELUM DIUJI |
| QA-M04S9J-11 | Responsif 320/375px, keyboard, fokus, pembaca layar, live region dan keamanan teks/XSS | BELUM DIUJI |
| QA-M04S9J-12 | Dua belas skenario pada tests/confirmation.test.mjs ditulis, TIDAK DIJALANKAN | BELUM DIUJI |
| QA-M04S9J-13 | Pemilik proses menilai batas penggunaan hasil pembahasan terhadap SOP, SPBE, arsip dan kewenangan | BUTUH KEPUTUSAN |
| QA-M04S9J-14 | Regresi, QA keamanan dan staging sesudah izin owner, tanpa mengubah perhitungan APEL historis | TERTUNDA UJI |

[Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9J_DISCUSSION_CONFIRMATION.md). CODE_ONLY tetap melarang pengujian dan deployment.

## Antrean M04-S9I: agenda telaah per fungsi (SEMUA BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9I-01 | Rantai impor M04-S9H→S9I hanya menggunakan fixture sintetik DEMO | BELUM DIUJI |
| QA-M04S9I-02 | Enam paket fungsi unik dan 18 butir tercakup tanpa duplikasi/hilang | BELUM DIUJI |
| QA-M04S9I-03 | Pengampu penyiap dan penelaah tetap usulan; tanpa nama atau surat tugas resmi | BELUM DIUJI |
| QA-M04S9I-04 | Semua butir membawa bukti diminta dan dependensi yang sama dengan M04-S9H | BELUM DIUJI |
| QA-M04S9I-05 | Pertanyaan telaah per item tidak hilang dan pertanyaan khusus SEC-01/QA tampak | BELUM DIUJI |
| QA-M04S9I-06 | Snapshot PUBLIC memunculkan peringatan klasifikasi; PRIVATE tidak mengesahkan keamanan | BELUM DIUJI |
| QA-M04S9I-07 | Sumber stale tetap memberi peringatan dan tidak mengubah status sumber | BELUM DIUJI |
| QA-M04S9I-08 | Non-DEMO, MODE LIVE, fake approval, keputusan/QA berjalan, ID duplikat atau pendahulu invalid ditolak | BELUM DIUJI |
| QA-M04S9I-09 | Seluruh undangan, rapat, notulen resmi, keputusan serta bukti terverifikasi tetap nol/false | BELUM DIUJI |
| QA-M04S9I-10 | Filter fungsi, hasil kosong, teks panjang, HP 320/375px, keyboard, fokus, screen reader | BELUM DIUJI |
| QA-M04S9I-11 | Tidak ada XSS, innerHTML dinamis, fetch, API, storage, pengiriman, unggah berkas atau mutasi sumber | BELUM DIUJI |
| QA-M04S9I-12 | Sebelas skenario tes Node pada tests/agendas.test.mjs ditulis, TIDAK DIJALANKAN | BELUM DIUJI |
| QA-M04S9I-13 | Penentuan fungsi/jabatan sebenarnya, tata naskah, SPBE, keamanan, kearsipan dan batas SOP | BUTUH KEPUTUSAN |
| QA-M04S9I-14 | QA regresi, penelaahan nyata, staging dan rollback hanya setelah izin eksplisit | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9I_FUNCTION_REVIEW_AGENDAS.md). CODE_ONLY tetap melarang tes dan deploy.

## Antrean M04-S9H: konsolidasi hambatan dan bahan bukti (BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S9H-01 | Rantai impor M04-S9F/G/H dengan fixture DEMO tanpa produksi | BELUM DIUJI |
| QA-M04S9H-02 | Seluruh 18 butir unik, pendahulu serta urutan sumber tetap konsisten | BELUM DIUJI |
| QA-M04S9H-03 | Bukti diminta, pengampu usulan dan penelaah usulan tidak diklaim sudah resmi | BELUM DIUJI |
| QA-M04S9H-04 | Snapshot PUBLIC menyoroti klasifikasi repo, PRIVATE tidak otomatis berarti aman | BELUM DIUJI |
| QA-M04S9H-05 | Source stale mengutamakan kaji ulang tanpa mengubah sumber | BELUM DIUJI |
| QA-M04S9H-06 | Dua topik tanpa pendahulu tetap tidak diberi izin eksekusi | BELUM DIUJI |
| QA-M04S9H-07 | Semua bukti, penelaah, keputusan, izin tes/deploy tetap nol/false | BELUM DIUJI |
| QA-M04S9H-08 | Penolakan data non-DEMO, duplicate, fake approval, invalid dependensi dan fase | BELUM DIUJI |
| QA-M04S9H-09 | Filter fase/perhatian, HP 320/375px, keyboard, fokus, screen reader dan pesan kosong | BELUM DIUJI |
| QA-M04S9H-10 | XSS/input teks, tanpa API, storage, fetch, data rahasia, notifikasi atau mutasi sumber | BELUM DIUJI |
| QA-M04S9H-11 | Sebelas skenario pada tests/triage.test.mjs tertulis, tidak dijalankan | BELUM DIUJI |
| QA-M04S9H-12 | Kesesuaian tupoksi, pengampu, SOP/SPBE, klasifikasi data, keamanan, arsip dan kewenangan | BUTUH KEPUTUSAN |
| QA-M04S9H-13 | QA regresi/keamanan/HP dan review staging setelah izin owner | TERTUNDA UJI |

[Spesifikasi M04-S9H](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9H_BLOCKER_TRIAGE.md). Mode CODE_ONLY tetap berlaku.

## Antrean M04-S9G: matriks ketergantungan prasyarat integrasi (BELUM DIUJI)

| ID | Rencana pemeriksaan setelah izin eksplisit | Status |
|---|---|---|
| QA-M04S9G-01 | Import berantai M04-S9F sampai S9G, fixture DEMO dan tanpa akses produksi | BELUM DIUJI |
| QA-M04S9G-02 | Tepat 18 butir, semua ID unik, fase P0–P3 lengkap, rujukan pendahulu dikenal | BELUM DIUJI |
| QA-M04S9G-03 | Topological order: setiap prasyarat muncul sebelum turunan langsung dan tidak melompat fase mundur | BELUM DIUJI |
| QA-M04S9G-04 | Penolakan ID asing, dependensi duplikat, self-loop, siklus, dan fase mundur | BELUM DIUJI |
| QA-M04S9G-05 | Hitungan jumlah hubungan langsung, lapisan serta downstream affected sesuai graph | BELUM DIUJI |
| QA-M04S9G-06 | Sumber non-DEMO, status selesai palsu, wave sudah dijalankan, dan izin tes otomatis ditolak | BELUM DIUJI |
| QA-M04S9G-07 | Sumber stale menjadi perhatian tanpa mengubah status M04-S9F dan tidak menyatakan layak integrasi | BELUM DIUJI |
| QA-M04S9G-08 | Snapshot PRIVATE/UNKNOWN tidak dianggap bukti keamanan atau izin deployment; PUBLIC memberi peringatan | BELUM DIUJI |
| QA-M04S9G-09 | Item tanpa pendahulu hanya usulan diskusi; seluruh authorized_to_act=false dan verified=false | BELUM DIUJI |
| QA-M04S9G-10 | UI HP 320/375px, keyboard, label, screen reader, overflow, filter fase/domain dan empty state | BELUM DIUJI |
| QA-M04S9G-11 | Input XSS/text, tidak ada innerHTML dinamis, fetch, storage, mutasi, API atau pengiriman | BELUM DIUJI |
| QA-M04S9G-12 | 11 skenario Node di tests/dependencies.test.mjs tertulis namun belum dijalankan | BELUM DIUJI |
| QA-M04S9G-13 | Telaah dependensi dengan pemilik proses, tupoksi, RACI, SPBE, keamanan, pengelola APEL dan pengampu IT | BUTUH KEPUTUSAN |
| QA-M04S9G-14 | Pengujian regresi M03/M04, review staging, audit dan rollback hanya setelah owner izinkan | TERTUNDA UJI |

[Dokumen M04-S9G](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9G_DEPENDENCY_PLAN.md). CODE_ONLY tetap berlaku, tidak ada CL/CI/tes/deploy.

## Antrean M04-S9F: prasyarat integrasi lintas modul (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S9F-01 | Impor berantai M04-S9C/S9D/S9E/S9F dengan data sintetis, tidak menyentuh produksi | BELUM DIUJI |
| QA-M04S9F-02 | Jumlah 18 prasyarat, ID unik, pembagian 6 kelompok dan rujukan sumber terdokumentasi | BELUM DIUJI |
| QA-M04S9F-03 | Semua item menampilkan butuh keputusan, belum dibuktikan, atau menunggu izin uji, tanpa status lulus otomatis | BELUM DIUJI |
| QA-M04S9F-04 | Tidak ada mutasi M04-S9E, APEL, master Profil/SDM, basis data atau API | BELUM DIUJI |
| QA-M04S9F-05 | Repo PUBLIC diperhatikan; snapshot PRIVATE sekalipun tidak menyatakan aman atau layak integrasi | BELUM DIUJI |
| QA-M04S9F-06 | Sumber M04-S9E berubah menampilkan perhatian, bukan kelulusan atau pembatalan otomatis | BELUM DIUJI |
| QA-M04S9F-07 | Menolak sumber non-DEMO, schema salah, agenda duplikat, mode uji/produksi yang dilarang | BELUM DIUJI |
| QA-M04S9F-08 | Empat gelombang P0-P3 tetap BELUM DIMULAI, tanpa jalur mengeksekusi tes dari UI | BELUM DIUJI |
| QA-M04S9F-09 | Export teks eksplisit menyatakan belum diverifikasi dan belum izin deploy | BELUM DIUJI |
| QA-M04S9F-10 | UI HP 320/375px, navigasi keyboard, filter, label, teks panjang, error, aksesibilitas dan XSS | BELUM DIUJI |
| QA-M04S9F-11 | Sepuluh skenario Node pada tests/checklist.test.mjs ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9F-12 | Klasifikasi data, risiko repo publik, SPO/SOP, tupoksi, RACI, SPBE, retensi dan persetujuan pejabat | BUTUH KEPUTUSAN |
| QA-M04S9F-13 | Role/wilayah, integritas APEL historis, security review, staging, backup, rollback dan regresi setelah izin owner | TERTUNDA UJI |

[Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9F_CROSS_MODULE_READINESS.md). Empat gelombang hanya rencana dan **seluruh pengujian tetap ditahan** oleh CODE_ONLY.

## Antrean M04-S9E: peta perhatian kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S9E-01 | Import berantai M04-S7/S8/S9/S9B/S9C/S9D/S9E dengan DEMO, tanpa backend | BELUM DIUJI |
| QA-M04S9E-02 | Seluruh agenda tetap tampil saat register M04-S9D kosong | BELUM DIUJI |
| QA-M04S9E-03 | Satu catatan M04-S9D dan agenda lain tanpa catatan dihitung tanpa duplikasi | BELUM DIUJI |
| QA-M04S9E-04 | Pembatalan tidak dianggap selesai dan tetap terlacak | BELUM DIUJI |
| QA-M04S9E-05 | Tenggat DEMO berdasar tanggal acuan manual, termasuk tanggal kalender invalid | BELUM DIUJI |
| QA-M04S9E-06 | Perubahan snapshot M04-S9C menandai semua agenda untuk peninjauan ulang | BELUM DIUJI |
| QA-M04S9E-07 | Klasifikasi status prioritas: stale, kosong, batal, terlambat, revisi, menunggu, draf, bahan | BELUM DIUJI |
| QA-M04S9E-08 | Semua catatan sebagai bahan tidak pernah menghasilkan status siap integrasi | BELUM DIUJI |
| QA-M04S9E-09 | Sumber bukan DEMO, ID agenda salah dan duplikasi ditolak | BELUM DIUJI |
| QA-M04S9E-10 | Tampilan HP 320/375px, keyboard, fokus, empty state, label, teks panjang dan status filter | BELUM DIUJI |
| QA-M04S9E-11 | Text injection/XSS dan tidak ada fetch, storage, mutasi register, endpoint atau pengiriman | BELUM DIUJI |
| QA-M04S9E-12 | Sembilan skenario tes Node yang ditulis pada tests/oversight.test.mjs belum dijalankan | BELUM DIUJI |
| QA-M04S9E-13 | Telaah tupoksi, pemilik proses, SPBE, keamanan, SOP, arsip, retensi dan wewenang | BUTUH KEPUTUSAN |
| QA-M04S9E-14 | Pengujian regresi lintas modul, autentikasi/DB/audit setelah izin owner | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9E_OVERSIGHT_BOARD.md). Kode belum dieksekusi, mode CODE_ONLY tetap berlaku.

## Antrean M04-S9D: catatan pembahasan kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S9D-01 | Import berantai M04-S8/S9/S9B/S9C/S9D dengan fixture sintetik DEMO | BELUM DIUJI |
| QA-M04S9D-02 | Semua agenda M04-S9C tetap terlihat jika register masih kosong | BELUM DIUJI |
| QA-M04S9D-03 | Satu catatan per agenda, kode unik, batas jumlah 40 dan histori tidak terhapus | BELUM DIUJI |
| QA-M04S9D-04 | Validasi kode DEMO, field berbahaya/unknown, teks minimum/maksimum dan tanggal kalender | BELUM DIUJI |
| QA-M04S9D-05 | Alur draf → telaah → perbaikan/revisi atau catat sebagai bahan; pembatalan beralasan | BELUM DIUJI |
| QA-M04S9D-06 | Penelaah berbeda dari sekretariat/penanggung jawab; bukan autentikasi riil | BELUM DIUJI |
| QA-M04S9D-07 | Snapshot agenda berubah menahan mutasi, namun daftar historis masih terbaca | BELUM DIUJI |
| QA-M04S9D-08 | Rekap total/terbuka/telat berdasarkan tanggal acuan manual, status sumber berubah | BELUM DIUJI |
| QA-M04S9D-09 | Semua catatan ditutup sebagai bahan tetap tidak menghasilkan status siap integrasi | BELUM DIUJI |
| QA-M04S9D-10 | Tampilan HP 320/375px, fokus, keyboard, reader, label, pesan error, filter dan status kosong | BELUM DIUJI |
| QA-M04S9D-11 | XSS/sanitasi teks, memori browser, tanpa API, mutasi M04-S9C, penyimpanan atau pengiriman | BELUM DIUJI |
| QA-M04S9D-12 | Delapan skenario tes pada tests/register.test.mjs yang sudah ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9D-13 | Telaah struktur/tupoksi, SOP, kewenangan, retensi, SPBE, keamanan, klasifikasi data | BUTUH KEPUTUSAN |
| QA-M04S9D-14 | Keputusan/perubahan repo PRIVATE 14 Nov masih rencana sampai metadata terverifikasi | TERTUNDA |
| QA-M04S9D-15 | Uji API/DB/otorisasi serta persetujuan owner untuk menjalankan QA lintas modul | TERTUNDA UJI |

[Dokumen M04-S9D](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9D_DISCUSSION_NOTES.md). Kode MODE CODE_ONLY tanpa pengujian/CI/CL.

## Antrean M04-S9C: agenda telaah kelembagaan dan akses repository (BELUM DIUJI)

| ID | Pemeriksaan | Status |
|---|---|---|
| QA-M04S9C-01 | Import M04-S7/S8/S9/S9B/S9C dan fixture DEMO tanpa backend | BELUM DIUJI |
| QA-M04S9C-02 | Tepat 10 persyaratan wajib masuk agenda sekalipun bahan DEMO tersedia | BELUM DIUJI |
| QA-M04S9C-03 | Repo PUBLIC teramati diberi perhatian dan tidak mengubah setting GitHub | BELUM DIUJI |
| QA-M04S9C-04 | Status PRIVATE/UNKNOWN tetap memerlukan penetapan manusia, tidak otomatis siap | BELUM DIUJI |
| QA-M04S9C-05 | Tanggal observasi invalid dan label visibilitas di luar kontrak ditolak | BELUM DIUJI |
| QA-M04S9C-06 | Ringkasan sumber usang dan perubahan katalog tidak disembunyikan | BELUM DIUJI |
| QA-M04S9C-07 | Setiap baris memiliki rujukan, pengampu usulan dan daftar bukti tanpa menerbitkan keputusan | BELUM DIUJI |
| QA-M04S9C-08 | Semua status bersifat belum diputuskan; tidak ada atribut approval/SOP/anggaran/BAST | BELUM DIUJI |
| QA-M04S9C-09 | UI HP 320/375px, keyboard, label, error, status dan filter kelompok | BELUM DIUJI |
| QA-M04S9C-10 | Sanitasi teks, tanpa innerHTML dinamis, fetch, storage, perubahan sumber atau pengiriman | BELUM DIUJI |
| QA-M04S9C-11 | Tujuh skenario Node di file draft tests/decision_matrix.test.mjs ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9C-12 | Pemilik repo memutuskan privacy/klasifikasi dan penanganan kemungkinan paparan historis | BUTUH KEPUTUSAN |
| QA-M04S9C-13 | Pengampu institusi menguji kecocokan tupoksi/RACI/SOP/arsip/keamanan/SPBE | BUTUH KEPUTUSAN |
| QA-M04S9C-14 | Pengujian fungsional/regresi setelah izin eksplisit owner, tanpa mengubah produksi | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9C_INSTITUTIONAL_REVIEW.md) · [kajian akses](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/REPOSITORY_ACCESS_DECISION.md). Mode CODE_ONLY tetap berlaku.

## Antrean M04-S9B: rekap eksekutif kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang perlu dilakukan | Status |
|---|---|---|
| QA-M04S9B-01 | Impor berantai M04-S7/S8/S9/S9B dan fixture DEMO tanpa memerlukan sumber produksi | BELUM DIUJI |
| QA-M04S9B-02 | Tepat 12 unsur, 10 wajib/2 opsional, status bahan tersedia bukan bukti telah disahkan | BELUM DIUJI |
| QA-M04S9B-03 | Seluruh kekurangan wajib yang belum diperiksa/perlu klarifikasi tetap terlihat walau tanpa register aktif | BELUM DIUJI |
| QA-M04S9B-04 | Hubungan temuan ketiga jenis sumber dengan perbaikan, penanggung jawab, keluaran, status dan histori | BELUM DIUJI |
| QA-M04S9B-05 | Jumlah item aktif, menunggu telaah, revisi, terlambat berdasar tanggal manual dan sumber berubah benar | BELUM DIUJI |
| QA-M04S9B-06 | Docket M04-S8 atau SOP M04-S7 yang berubah mendapat penanda tanpa menutup atau mengubah register | BELUM DIUJI |
| QA-M04S9B-07 | Input invalid, tanggal kalender tidak sah dan sumber non-DEMO/gagal validasi ditolak | BELUM DIUJI |
| QA-M04S9B-08 | Empty state, semua catatan tertutup, katalog kosong, filter tanpa hasil, keluaran teks paparan | BELUM DIUJI |
| QA-M04S9B-09 | UI HP 320/375px, urutan keyboard, label, pembaca layar, fokus, pesan error, teks panjang | BELUM DIUJI |
| QA-M04S9B-10 | Tidak ada script injection melalui teks, mutasi M04-S8/M04-S9, storage, API atau pengiriman | BELUM DIUJI |
| QA-M04S9B-11 | Status kesiapan tetap BELUM DINILAI, termasuk bila tidak ada item aktif atau semua item ditutup | BELUM DIUJI |
| QA-M04S9B-12 | Telaah tupoksi, pemilik proses, tata naskah, SOP, retensi, keamanan, SPBE dan akuntabilitas | BUTUH KEPUTUSAN |
| QA-M04S9B-13 | Autentikasi, kontrol akses wilayah, DB, audit persisten dan keamanan API untuk integrasi nanti | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_EXECUTIVE_BRIEFING.md). Tidak ada eksekusi tes maupun CI/CL.

## Antrean M04-S9: register tindak lanjut kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S9-01 | Impor lintas M04-S1/S2/S3/S5/S6/S7/S8/S9 dan fixture DEMO | BELUM DIUJI |
| QA-M04S9-02 | Sumber M04-S8 belum ditelaah, bukan DEMO atau SOP M04-S7 usang harus ditolak | BELUM DIUJI |
| QA-M04S9-03 | Tiga jenis temuan, validasi ID checklist/usulan/kode DEMO topik diskusi | BELUM DIUJI |
| QA-M04S9-04 | Duplikasi item aktif dari sumber sama, ID unik serta kapasitas 35 temuan | BELUM DIUJI |
| QA-M04S9-05 | Validasi deskripsi, dampak, rencana perbaikan, keluaran, penanggung jawab dan tanggal | BELUM DIUJI |
| QA-M04S9-06 | Draf/revisi, catat penugasan, mulai, progres, hasil, return/revise/close dan pembatalan | BELUM DIUJI |
| QA-M04S9-07 | Pemisahan koordinator, petugas dan reviewer DEMO; bukan autentikasi resmi | BELUM DIUJI |
| QA-M04S9-08 | Sumber berubah atau temuan tidak relevan membuat tindakan tertahan | BELUM DIUJI |
| QA-M04S9-09 | Histori tidak hilang, hasil/bukti hanya metadata, catatan ditutup bukan syarat resmi terpenuhi | BELUM DIUJI |
| QA-M04S9-10 | Rekap tanggal acuan manual, aktif/tertunda/telaah/stale, kasus data kosong dan filter | BELUM DIUJI |
| QA-M04S9-11 | Semua catatan ditutup tidak membuat hasil siap integrasi, SOP sah atau anggaran disetujui | BELUM DIUJI |
| QA-M04S9-12 | UI HP 320/375px, keyboard, pembaca layar, form kode topik DEMO dan pesan kesalahan | BELUM DIUJI |
| QA-M04S9-13 | Pembatasan akses, integritas data, XSS, input berbahaya dan tidak ada pengiriman/persistensi | BELUM DIUJI |
| QA-M04S9-14 | Proses kelembagaan nyata, SPBE, kewenangan, arsip, SOP dan tata naskah | BUTUH KEPUTUSAN |
| QA-M04S9-15 | Autentikasi/DB, audit tahan perubahan, keamanan API dan dokumen resmi | TERTUNDA UJI |

[Spesifikasi M04-S9](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9_INSTITUTIONAL_FOLLOWUP.md). Tidak ada eksekusi kode/tes baru.

## Antrean M04-S8: kesiapan SOP dan perubahan unit (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S8-01 | Import berantai M04-S1/S2/S3/S5/S6/S7/S8 dan fixtures | BELUM DIUJI |
| QA-M04S8-02 | Sumber M04-S7 harus `dicatat_untuk_bahan_sop` dan versi tepat | BELUM DIUJI |
| QA-M04S8-03 | 12 unsur, 10 wajib/2 opsional, ID unik dan rekap | BELUM DIUJI |
| QA-M04S8-04 | Bukti `DEMO-`, alasan, pilihan tidak berlaku hanya bagi opsional | BELUM DIUJI |
| QA-M04S8-05 | Berkas parsial dapat diajukan tanpa status pengesahan/siap produksi | BELUM DIUJI |
| QA-M04S8-06 | Usulan unit tambah/ubah/nonaktif, ID, profil dan no-duplicate aktif | BELUM DIUJI |
| QA-M04S8-07 | Dampak alur M04-S6, RACI M04-S7, SOP/arsip, rollback tertulis | BELUM DIUJI |
| QA-M04S8-08 | Telaah usulan, pengembalian dan revisi dengan histori tidak hilang | BELUM DIUJI |
| QA-M04S8-09 | Telaah checklist dan katalog terpisah, penelaah bukan penyusun | BELUM DIUJI |
| QA-M04S8-10 | Perubahan source/versi menahan pencatatan dan penelaahan | BELUM DIUJI |
| QA-M04S8-11 | Katalog sumber tidak dimutasi, tidak ada apply SOP/approval bantuan/BAST | BELUM DIUJI |
| QA-M04S8-12 | Input tidak sah, teks baca-saja, kebersihan/privasi data DEMO | BELUM DIUJI |
| QA-M04S8-13 | HP 320/375px, keyboard, pembaca layar dan kontrol form tersembunyi | BELUM DIUJI |
| QA-M04S8-16 | Membuka kembali unsur `bahan_tersedia`: referensi bukti DEMO terisi dan kolom dapat diedit; selain status itu kolom dinonaktifkan | BELUM DIUJI |
| QA-M04S8-14 | Tupoksi, arsip, tata naskah, SPBE dan pemilik kewenangan | BUTUH KEPUTUSAN |
| QA-M04S8-15 | Integrasi akun riil, API/DB, audit dan approval resmi di luar demo | TERTUNDA UJI |

[Dokumen M04-S8](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S8_SOP_GOVERNANCE.md). Tidak ada pengujian dijalankan.


## Antrean lintas modul yang belum diujikan
- Flask legacy belum tersedia lengkap di repo; perlu audit integrasi, startup dan regresi APEL jika sudah tersedia.
- Akun/otorisasi API per wilayah, audit persisten, CSRF, password reset dan akses bukti.
- Pengguna nonteknis di HP fisik dan jaringan terbatas.
- M04-S1 sampai S9: kode draft administrasi, referensi, tindak lanjut, dashboard, eskalasi, matriks/rute, katalog RACI, kesiapan SOP dan register koreksi kelembagaan tersimpan, **BELUM DIUJI**; keputusan resmi, anggaran, distribusi dan BAST M04-S10+ tetap RENCANA.

**Terakhir lulus sebelum mode kode-saja:** M03-S3, [GitHub Actions 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270). Itu **bukan** pengujian M03-S4 atau kode draft berikutnya.

## Cara menutup backlog (nanti)
1. Dapatkan instruksi eksplisit: "boleh mulai uji".
2. Inventaris semua commit berlabel **BELUM DIUJI**, urutkan lintas modul.
3. Sisir review statis, keamanan, lalu tes modular, baru E2E/GitHub Actions jika anggaran dan izin memungkinkan.
4. Bila ada kegagalan, perbaiki tanpa menghapus bukti temuan.
5. Hanya setelah bukti lulus, ubah status tiap item dan kaitkan tautan pemeriksaan di ROADMAP/WORKLOG.
