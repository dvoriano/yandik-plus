# MASTER QA YANDIK+ | K7 | 2026–2030

**24 November 2026 | RENCANA QA, BELUM DIJALANKAN | CODE_ONLY tetap berlaku.**
Baseline pembacaan: `3bee6913693f288a7650c50c52a9ae1fa3f217e0`. Ini matriks eksekusi yang direncanakan, bukan laporan lulus. PR #9 Draft. Tidak ada browser, test runner, SQL, CI, deployment atau data asli yang dipakai pada penyusunan.

## 1. Lingkup dan inventaris
- [Matriks machine-readable](../drafts/yandik-qa/qa-plan.json): 36 skenario manual/integrasi/gerbang, semuanya NOT_RUN atau BLOCKED. 15 MOD terwakili. Q01–Q29 preview; Q30 DDL rehearsal; Q31–Q35 backend belum tersedia; Q36 keputusan rilis. Tidak menjumlahkan skenario manual dengan kasus unit sebagai total unik.
- [Template hasil](../drafts/yandik-qa/result-template.json): isi hanya setelah izin dan bukti.
- 11 file unit prioritas dibaca melalui GitHub (10 portal + satu kontrak backend). 178 kasus portal dan 22 kasus backend = 200 kasus **dirancang**, bukan discovered runner atau PASS. Kasus konsolidasi 31 berasal dari 25 deklarasi termasuk dua loop 4 domain. Tes lama di [TEST_BACKLOG](TEST_BACKLOG.md) tetap diinventaris per paket; 176 tes historis bukan bukti commit baru. Jangan mengklaim 200 sebagai seluruh tes repo.

| File suite | Kasus dirancang | Cakupan |
|---|---:|---|
| [consolidated.test.mjs](../drafts/yandik-portal/tests/consolidated.test.mjs) | 31 | 25 deklarasi + dua loop masing-masing empat domain |
| [personnel.test.mjs](../drafts/yandik-portal/tests/personnel.test.mjs) | 19 | Profil/SDM |
| [inventory.test.mjs](../drafts/yandik-portal/tests/inventory.test.mjs) | 16 | Inventaris |
| [coaching.test.mjs](../drafts/yandik-portal/tests/coaching.test.mjs) | 16 | Pembinaan |
| [paperless.test.mjs](../drafts/yandik-portal/tests/paperless.test.mjs) | 14 | Dokumen |
| [library.test.mjs](../drafts/yandik-portal/tests/library.test.mjs) | 17 | Pustaka |
| [leadership.test.mjs](../drafts/yandik-portal/tests/leadership.test.mjs) | 17 | Dashboard |
| [gis.test.mjs](../drafts/yandik-portal/tests/gis.test.mjs) | 18 | GIS |
| [notifications.test.mjs](../drafts/yandik-portal/tests/notifications.test.mjs) | 20 | Notifikasi/antrean |
| [navigation.test.mjs](../drafts/yandik-portal/tests/navigation.test.mjs) | 10 | Navigasi |
| [test_contract.py](../drafts/yandik-backend-contract/test_contract.py) | 22 | Kontrak backend |
| Total prioritas | 200 | 0 dijalankan pada tahap ini |

## 2. Urutan izin dan eksekusi
1. **Gate A — preview lokal:** hanya setelah owner eksplisit mengizinkan preview portal. Catat SHA, checkout terisolasi, fixture fiktif, server loopback. Q01–Q04 dulu, berhenti jika impor gagal, data keluar atau scope tidak aman. Kemudian Q05–Q29 mengikuti dependensi; P0 dahulu bila dependency siap. Perbaikan di branch pengembangan, bukan main. Jangan gunakan izin preview sebagai izin unit/DDL.
2. **Gate B — unit:** hanya jika owner juga mengizinkan runner unit. Jalankan paket per suite, jangan broad discovery atau CI. Catat per suite jumlah sebenarnya, PASS/FAIL/SKIP/error. Lanjut regresi paket terdahulu berdasarkan TEST_BACKLOG dan dependency perubahan (M00–M16 termasuk M04/M05, register dan foundation). Jangan mewariskan izin preview lama.
3. **Gate C — DDL:** izin terpisah untuk rehearsal `:memory:`. Q30 hanya skema rancangan, tidak membuktikan writer/HTTP. Hentikan bila ada path file DB, attached DB atau source nyata. Jangan menjalankan migrasi.
4. **Gate D — integrasi:** Q31–Q35 BLOCKED hingga source disanitasi/berizin, backend/typed writer/otorisasi dan PWA terkait tersedia. QA preview tidak menghapus gap ini.
5. **Gate E — rilis:** Q36 BLOCKED; keputusan instansi, keamanan, backup/restore dan persetujuan owner terpisah. Tidak auto-merge, auto-deploy atau publish.

## 3. Matriks prioritas
P0 = integritas, akses, data hilang, blocking render atau rilis; P1 = fungsi/UX penting. Status awal tidak ada PASS.
| ID | Prioritas | MOD | Fase | Skenario | Prasyarat | Status |
|---|---|---|---|---|---|---|
| Q01 | P0 | MOD-00 | PREVIEW | Katalog dan impor portal |  | NOT_RUN |
| Q02 | P0 | MOD-00 | PREVIEW | Navigasi dan state sesi | Q01 | NOT_RUN |
| Q03 | P0 | MOD-00 | PREVIEW | HP dan aksesibilitas | Q01 | NOT_RUN |
| Q04 | P0 | MOD-00 | PREVIEW | Batas DEMO | Q01 | NOT_RUN |
| Q05 | P0 | MOD-01 | PREVIEW | Profil tahunan | Q02 | NOT_RUN |
| Q06 | P0 | MOD-01 | PREVIEW | Inventaris tahunan | Q02 | NOT_RUN |
| Q07 | P0 | MOD-01 | PREVIEW | Kunci inventaris | Q06 | NOT_RUN |
| Q08 | P0 | MOD-02 | PREVIEW | Cakupan dan angka APEL | Q02 | NOT_RUN |
| Q09 | P0 | MOD-02 | PREVIEW | Workflow pelaporan | Q08 | NOT_RUN |
| Q10 | P0 | MOD-02 | PREVIEW | Grain kegiatan | Q09 | NOT_RUN |
| Q11 | P0 | MOD-02 | PREVIEW | Draf belum disimpan | Q09 | NOT_RUN |
| Q12 | P0 | MOD-03 | PREVIEW | Mutasi SDM | Q05 | NOT_RUN |
| Q13 | P1 | MOD-03 | PREVIEW | Kompetensi | Q12 | NOT_RUN |
| Q14 | P0 | MOD-04 | PREVIEW | Siklus support | Q02 | NOT_RUN |
| Q15 | P0 | MOD-04 | PREVIEW | Pemisahan master | Q14 | NOT_RUN |
| Q16 | P1 | MOD-05 | PREVIEW | Register obat | Q02 | NOT_RUN |
| Q17 | P1 | MOD-06 | PREVIEW | Register praktik | Q02 | NOT_RUN |
| Q18 | P0 | MOD-07 | PREVIEW | Surveilans sumber kosong | Q02 | NOT_RUN |
| Q19 | P0 | MOD-08 | PREVIEW | Register sertifikat | Q02 | NOT_RUN |
| Q20 | P1 | MOD-09 | PREVIEW | Pembinaan | Q02 | NOT_RUN |
| Q21 | P1 | MOD-10 | PREVIEW | Dokumen dari sumber | Q20 | NOT_RUN |
| Q22 | P0 | MOD-10 | PREVIEW | Sumber dokumen berubah | Q21 | NOT_RUN |
| Q23 | P0 | MOD-11 | PREVIEW | Dashboard lintas modul | Q05, Q06, Q08, Q12, Q14, Q20, Q21 | NOT_RUN |
| Q24 | P1 | MOD-12 | PREVIEW | GIS sintetis | Q06, Q12, Q20 | NOT_RUN |
| Q25 | P1 | MOD-13 | PREVIEW | Pustaka satu sesi | Q02 | NOT_RUN |
| Q26 | P0 | MOD-14 | PREVIEW | Pengingat | Q09, Q20, Q22 | NOT_RUN |
| Q27 | P0 | MOD-14 | PREVIEW | Antrean tiruan | Q02 | NOT_RUN |
| Q28 | P0 | MOD-14 | PREVIEW | Konflik antrean | Q27 | NOT_RUN |
| Q29 | P0 | MOD-00 | PREVIEW | Regresi lintas sesi | Q02 | NOT_RUN |
| Q30 | P0 | MOD-00 | UNIT_DDL | Rehearsal skema |  | NOT_RUN |
| Q31 | P0 | MOD-00 | BLOCKED_BACKEND | Auth dan akses objek | Q30 | BLOCKED |
| Q32 | P0 | MOD-00 | BLOCKED_BACKEND | Transaksi dan audit | Q30, Q31 | BLOCKED |
| Q33 | P0 | MOD-02 | BLOCKED_BACKEND | Migrasi dan rekonsiliasi | Q31, Q32 | BLOCKED |
| Q34 | P0 | MOD-00 | BLOCKED_BACKEND | Keamanan file dan operasi | Q31, Q32 | BLOCKED |
| Q35 | P1 | MOD-14 | BLOCKED_BACKEND | PWA/offline nyata | Q31, Q32 | BLOCKED |
| Q36 | P0 | MOD-00 | BLOCKED_RELEASE | Gerbang rilis | Q31, Q32, Q33, Q34 | BLOCKED |

## 4. Langkah dan kriteria penerimaan
### Q01 — Katalog dan impor portal
- Langkah: Checkout SHA; buka index.html dan review.html melalui loopback
- Ekspektasi: 15 MOD katalog, 12 menu kerja, tidak ada error impor yang memblokir; tidak ada jaringan eksternal
- Bukti: console, screenshot katalog, daftar menu

### Q02 — Navigasi dan state sesi
- Langkah: Buka #layanan, ubah draf DEMO; pindah menu, Back/Forward, anchor langsung
- Ekspektasi: Panel benar; state tersimpan dalam halaman; prototipe teknis terpisah di tab baru
- Bukti: before/after, URL, console

### Q03 — HP dan aksesibilitas
- Langkah: 320/375/768/1280 px; tab, Enter, fokus, menu mobile, tabel
- Ekspektasi: Tidak ada overflow halaman; tabel dapat digulir; menu dapat dioperasikan keyboard
- Bukti: 4 screenshot, catatan keyboard

### Q04 — Batas DEMO
- Langkah: Pantau network dan storage saat seluruh alur; reload
- Ekspektasi: Tidak ada data riil/API/pesan/persistensi; reload memulihkan fixture, bukan klaim autosave
- Bukti: network log sintetis, storage checklist

### Q05 — Profil tahunan
- Langkah: Pilih Alpha 2027; simpan bagian, ajukan, koreksi, telaah; ganti Beta/2030
- Ekspektasi: Histori utuh, isolasi ID/tahun, snapshot bukan profil resmi
- Bukti: status, histori, scope

### Q06 — Inventaris tahunan
- Langkah: Isi 0/tersedia/tidak diketahui, minimum eksplisit, salin 2026 ke 2027, konfirmasi item/grup
- Ekspektasi: 198 butir/15 kelompok menurut katalog DEMO; salinan belum konfirmasi; jumlah butir bukan aset; pengajuan hanya lengkap
- Bukti: rekap, source ref, histori

### Q07 — Kunci inventaris
- Langkah: Konfirmasi semua item fiktif, ajukan, coba edit, minta koreksi dan simpan
- Ekspektasi: Tidak dapat edit saat diajukan; koreksi tidak menghapus histori; reset terisolasi
- Bukti: status, histori

### Q08 — Cakupan dan angka APEL
- Langkah: Bandingkan bulan laporan nol, ada pelayanan, dan belum melapor; pilih 2030
- Ekspektasi: 0 eksplisit berbeda dari null; tidak menaksir total; tidak ada skor resmi
- Bukti: angka dan sumber per periode

### Q09 — Workflow pelaporan
- Langkah: Pilih periode belum ada draf; buat draf, kirim, koreksi, revisi, kirim ulang
- Ekspektasi: Transisi/riwayat benar; ledger tetap; draf belum disimpan menahan kirim
- Bukti: histori dan angka ledger sebelum/sesudah

### Q10 — Grain kegiatan
- Langkah: Tambah pasangan investigasi event/lokasi dan hewan ante/post; coba duplikat
- Ekspektasi: Pasangan kejadian/lokasi unik; satu hewan ante+post sekali; penolakan duplikat
- Bukti: contoh draf, pesan validasi

### Q11 — Draf belum disimpan
- Langkah: Edit angka; ubah filter lalu batalkan; ulang dan setujui; reset dengan batal
- Ekspektasi: Batal mempertahankan scope/isian; setuju membuang secara eksplisit; tidak ada pengiriman diam-diam
- Bukti: scope, isian dan dialog

### Q12 — Mutasi SDM
- Langkah: Mutasi tenaga DEMO aktif mulai bulan berikut; lihat sumber/tujuan dan rekap Desember
- Ekspektasi: Interval tidak tumpang tindih; histori sebelumnya tetap; cakupan parsial bukan nol
- Bukti: rekap bulan dan tahun

### Q13 — Kompetensi
- Langkah: Catat kompetensi contoh; coba duplikat dan mutasi mundur bertentangan
- Ekspektasi: Tolak duplikat/konflik; bukan sertifikat kompetensi
- Bukti: status dan histori

### Q14 — Siklus support
- Langkah: Pada M04 pilih skenario layak, lanjut tujuh tahap; coba skenario tidak layak
- Ekspektasi: Kebutuhan/paket hingga monitoring berurutan; blokir tahap tidak sah; bukan bantuan resmi
- Bukti: tahap, alasan penolakan

### Q15 — Pemisahan master
- Langkah: Bandingkan M04 001/002/003 dengan M05 ALPHA/BETA/GAMMA; ubah tahap
- Ekspektasi: Tidak join berdasarkan label; angka APEL/GIS M05 tidak berubah; dashboard hanya panel M04
- Bukti: before/after lintas panel

### Q16 — Register obat
- Langkah: Pilih wilayah dan entri; periksa detail/checklist, ubah wilayah saat memuat
- Ekspektasi: Detail wilayah lama tidak muncul; kolom minimal; bukan inspeksi resmi
- Bukti: scope dan detail

### Q17 — Register praktik
- Langkah: Pilih entri praktik, baca checklist, ganti wilayah
- Ekspektasi: Detail sesuai scope; tidak ada aksi izin/approval
- Bukti: scope dan detail

### Q18 — Surveilans sumber kosong
- Langkah: Bandingkan Utara dan Selatan; buka detail yang tersedia
- Ekspektasi: Sumber tidak tersedia ≠ nol kasus; lokasi sensitif tidak tampil; tidak ada sinkronisasi
- Bukti: status sumber dan kolom

### Q19 — Register sertifikat
- Langkah: Buka permohonan DEMO dan detail
- Ekspektasi: Tidak ada penerbitan, tanda tangan atau klaim sertifikat sah
- Bukti: detail, aksi yang tersedia

### Q20 — Pembinaan
- Langkah: Rencana kegiatan, hasil dengan hadir nol, telaah/koreksi, tindak lanjut dan tutup
- Ekspektasi: Status dan histori konsisten; hadir nol berbeda dari belum dicatat
- Bukti: rekap, histori

### Q21 — Dokumen dari sumber
- Langkah: Buat empat jenis draf dari kegiatan; metadata bukti fiktif; telaah/koreksi/arsip
- Ekspektasi: Identitas berasal dari sumber; duplikat bukti ditolak; bukan dokumen resmi
- Bukti: versi, metadata, status

### Q22 — Sumber dokumen berubah
- Langkah: Ubah sumber setelah draf; coba ajukan/arsip; refresh versi
- Ekspektasi: Sumber stale memblokir tindakan; versi lama tetap; metadata baru diperiksa
- Bukti: versi sebelum/sesudah

### Q23 — Dashboard lintas modul
- Langkah: Filter tahun/wilayah/fasilitas; bandingkan detail setelah edit sumber
- Ekspektasi: Metrik terpisah; denominator benar; tidak menganggap unknown nol; M04/register independen
- Bukti: rekonsiliasi kartu/detail

### Q24 — GIS sintetis
- Langkah: Pilih enam layer, filter wilayah/tahun, titik dan tombol; ubah sumber
- Ekspektasi: Kisi fiktif; nol/unknown berbeda; tidak ada GPS/rute/lokasi kasus
- Bukti: layer dan detail

### Q25 — Pustaka satu sesi
- Langkah: Cari/filter 14 referensi dan 5 FAQ; favorit, usulan, telaah; kembali dari menu
- Ekspektasi: Favorit/usulan sesi tetap; dua kandidat tanpa naskah resmi; tidak publikasi
- Bukti: hasil cari dan versi

### Q26 — Pengingat
- Langkah: Pilih 9 Jan 2027 dan wilayah; bandingkan nol/missing; buat koreksi dan stale dokumen; tandai baca/mute
- Ekspektasi: Tenggat Desember lintas tahun; dedupe, revisi baru, status stale dan sumber gagal terlihat; tidak mengirim pesan
- Bukti: daftar kunci/status

### Q27 — Antrean tiruan
- Langkah: Simpan jumlah nol offline, coba kirim, online, ACK hilang lalu retry
- Ekspektasi: Satu revisi server tiruan; tidak mengubah APEL; bukan offline durable
- Bukti: receipt, histori

### Q28 — Konflik antrean
- Langkah: Ubah sumber tiruan, kirim draf lama; buang atau buat draf baru
- Ekspektasi: Konflik tidak menimpa sumber; requeue ID/revisi baru dan perlu klik kirim
- Bukti: histori dan revisi

### Q29 — Regresi lintas sesi
- Langkah: Reset pembinaan/dokumen; buat kegiatan baru; pindah menu; reset inti dan inventaris terpisah
- Ekspektasi: Tidak reuse ID kegiatan/dokumen pada sesi; tidak menandai pengingat baru sebagai dibaca; reset tidak memengaruhi domain lain
- Bukti: ID, status, panel terkait

### Q30 — Rehearsal skema
- Langkah: Jalankan DDL hanya pada SQLite :memory: setelah izin khusus; insert fixture sintetik, FK, unik, overlap
- Ekspektasi: FK aktif, duplikasi ditolak, interval bersebelahan diterima, histori update/delete ditolak; catat invariant yang belum ditegakkan
- Bukti: output SQL sintetis

### Q31 — Auth dan akses objek
- Langkah: Setelah source sah: uji sesi palsu/nonaktif, role dari client, lintas fasilitas/wilayah, pimpinan detail, CSRF
- Ekspektasi: Deny default, tidak ada kebocoran PII atau enumerasi; otorisasi ulang retry
- Bukti: route/role matrix dan hasil negatif

### Q32 — Transaksi dan audit
- Langkah: Setelah typed writer: dua penulis, revisi stale, command ID sama beda payload, fault injection, rollback
- Ekspektasi: Revisi+audit+receipt atomik; retry tidak menggandakan; gagal tanpa state parsial
- Bukti: log sintetis, revision count

### Q33 — Migrasi dan rekonsiliasi
- Langkah: Setelah source sah: dry mapping namespace, histori, null/0, ledger/workflow, SDM interval inklusif
- Ekspektasi: Tidak join otomatis; diff diverifikasi; nilai asli dan histori tetap; backup/restore dibuktikan
- Bukti: mapping dan rekonsiliasi sintetis

### Q34 — Keamanan file dan operasi
- Langkah: Setelah backend: CSRF, rate limit, password KDF, reset, uploads/downloads, secrets, audit akses, backup/restore
- Ekspektasi: Tidak ada fallback password/secret; akses bukti per objek; log minim; restore sesuai rencana
- Bukti: hasil security QA terisolasi

### Q35 — PWA/offline nyata
- Langkah: Setelah implementasi dan izin: putus jaringan, reload, retry, konflik, logout, perangkat bersama
- Ekspektasi: Draf durable aman, tidak bocor antar akun; sinkron idempoten; tidak cache token/PII
- Bukti: bukti perangkat dan network

### Q36 — Gerbang rilis
- Langkah: Review keputusan sumber, kelembagaan, QA, keamanan, rollback, persetujuan terpisah
- Ekspektasi: Tidak ada merge/deploy tanpa keputusan eksplisit; demo lulus tidak sama dengan siap produksi
- Bukti: register keputusan dan bukti


## 5. Cara menjalankan nanti (bukan perintah untuk dieksekusi sekarang)
Rujuk [panduan Codex](CODEX_PREVIEW_YANDIK.md). Dari root checkout terisolasi, setelah izin yang sesuai:
- Preview: `python -m http.server 8765 --bind 127.0.0.1` lalu buka `http://127.0.0.1:8765/drafts/yandik-portal/review.html#layanan`. Tidak perlu VPS/Flask. Jangan membuka port publik.
- Unit portal: `node --test drafts/yandik-portal/tests/consolidated.test.mjs` sebagai contoh satu suite; ulang per daftar di atas dengan izin. Periksa versi Node dan kompatibilitas sebelum mulai; dependency yang gagal dicatat sebagai BLOCKED.
- Kontrak backend: dari `drafts/yandik-backend-contract`, `python -m unittest -v test_contract`. Tidak mengeksekusi SQL. Jangan menjalankan command ini untuk scope preview-only.
- DDL: belum ada runner Q30; desain uji khusus disposable SQLite memory setelah izin. Jangan copy-paste schema ke DB riil.

## 6. Register bukti dan stop rules
Setiap hasil mengikat ID kasus/suite, SHA yang benar-benar diuji, lingkungan, langkah, expected/actual, status PASS/FAIL/BLOCKED/SKIP, bukti sintetis, severity dan issue. NOT_RUN berbeda dari FAIL. PASS memerlukan bukti aktual dan kondisi ekspektasi; screenshot saja tidak cukup untuk validasi model. Jika kode berubah, hasil lama historis; tandai kasus terdampak untuk regresi. Hentikan P0 bila integritas/akses/source gagal; jangan lanjut ke gate bergantung. Catat temuan P1 dan keputusan triase. Tidak menyimpan token, data kedinasan asli, credential, log nyata atau screenshots sensitif di repo publik.

## 7. Kriteria selesai tahap QA
Semua kasus P0 pada scope yang disetujui harus PASS dengan bukti, P1 ditriase, seluruh blocker jelas, tidak ada hasil yang diubah diam-diam. Preview dapat dinyatakan lulus hanya dalam cakupan demo dan commit itu; **tidak** membuktikan backend atau rilis. K4/K7 tetap tertunda. Sumber status resmi ROADMAP; TEST_BACKLOG tetap daftar rinci, matriks ini merupakan urutan kerja terarah.

## Addendum setelah baseline Master QA
25 kasus K4-A1 ditulis setelah inventaris 200 kasus prioritas. 0 dijalankan. Bukan hasil QA atau perubahan baseline historis. 17 memerlukan rehearsal SQLite; izin unit saja tidak cukup. Rujuk TEST_BACKLOG dan K4_A1_APEL_TYPED_WRITER_2026_2030.md. Preview ditunda owner.

## Addendum K4-A2
24 kasus tambahan setelah baseline 200 dan K4-A1; 0 dijalankan. 14 rehearsal butuh izin SQL/DDL selain unit. Rujuk TEST_BACKLOG. Preview ditunda.

## Addendum K4-A3
26 kasus tambahan (10 pure, 16 rehearsal) setelah K4-A2; 0 dijalankan. Izin unit dan DDL terpisah diperlukan. TEST_BACKLOG tetap rinci. Preview ditunda.

## Addendum K4-A4
26 kasus tambahan, 0 dijalankan; regresi tiga writer dan hook profil perlu izin. 18 rehearsal memerlukan DDL. Preview tetap ditunda.

## Addendum K4-A5
20 kasus tambahan, 0 dijalankan. 14 rehearsal memerlukan izin DDL. Regresi schema dan writer sebelum integrasi. Preview ditunda.

## Addendum K4-A6
20 kasus tambahan, 0 dijalankan. 13 rehearsal memerlukan izin DDL. Regresi command namespace lintas stream. Preview ditunda.

## Addendum K4-A7
22 kasus tambahan, 0 dijalankan. 16 rehearsal memerlukan izin DDL. Regresi penulis sebelumnya dan source binding perlu QA. Preview ditunda.

## Addendum K4-A8
20 kasus tambahan, 0 dijalankan. 15 rehearsal memerlukan izin DDL; adapter JS dan seluruh command/HTTP masih perlu QA. Preview ditunda.

## Addendum K4-A9
24 kasus tambahan, 0 dijalankan. 18 rehearsal perlu izin DDL. Seluruh A1–A9 masih code written, belum gate K4/K7. Preview ditunda.

## Addendum K4-B
Manifest K4 backend 241 declared (92 pure, 149 memory rehearsal), 0 executed. Tidak menghitung ulang baseline portal/historical. Lihat TEST_BACKLOG dan manifest; semua gate tetap tertunda.

## Addendum K4-C1
10 QA pure JS baru, 0 dijalankan. DOM host integration, parity dan full preview pending; backend 241 manifest terpisah.

## Addendum K4-C2
20 QA backend baru; manifest 261 (97 pure + 164 rehearsal), 0 dijalankan. UI/HTTP/handoff resmi tidak tersedia.
