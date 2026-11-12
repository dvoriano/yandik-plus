# M04-S9S | Tindak Lanjut Temuan Statis dan Paket Persiapan QA

**Tanggal:** 12 November 2026 (WIB). **Status:** KODE DITULIS, **BELUM DIUJI**. Bukan persetujuan pengujian, bukti QA berhasil, keputusan kelembagaan atau izin integrasi.

## Tujuan
Menindaklanjuti M04-S9R dengan (1) memperbaiki inventaris impor langsung yang belum lengkap, (2) memperketat skenario audit statis agar membandingkan hubungan modul **dua arah**, dan (3) menyusun paket persiapan QA terstruktur tanpa menjalankan tes atau mengubah produksi.

## Hasil perbaikan kode
- **STATIC-01:** Fingerprint sumber M04-S9J sudah diperluas dalam milestone S9R, namun **belum tervalidasi**. Tidak boleh ditutup hanya karena commit tersedia.
- **STATIC-02:** Seluruh tes tertulis masih menunggu izin owner. Tidak ada test runner atau browser yang dipanggil.
- **STATIC-03:** Repository masih **PUBLIC** menurut metadata GitHub 12 November 2026. Owner perlu memutuskan perubahan PRIVATE dan menelaah histori paparan. Tidak ada perubahan setting di milestone ini.
- **STATIC-04 (temuan M04-S9S):** Manifest S9R semula menghilangkan sebagian dependensi model langsung: `S9L→S9I`, `S9N→S9I`, `S9O→S9I`, `S9P→S9I`, `S9Q→S9G/S9I`. [Manifest diperbaiki](https://github.com/dvoriano/yandik-plus/commit/d4f932e943f015542a4e7771c9a0528ed448bf40), [pemeriksaan teks import diperketat dan pola pencocok dikoreksi](https://github.com/dvoriano/yandik-plus/commit/e03b312ccf04a99ee82c20db007eb6683fa7a961). **Belum dijalankan**.

## Penanganan temuan
| Temuan | Perbaikan atau tindakan | Bukti yang masih diperlukan | Status |
|---|---|---|---|
| STATIC-01 | Perluasan `source_identity` S9J | Regresi perubahan fase/dependensi/peran/metadata dan bukti hasil uji terisolasi | PERBAIKAN KODE TERTULIS, BELUM DIVALIDASI |
| STATIC-02 | Menyiapkan daftar QA dan rantai pengujian | Izin eksplisit owner, hasil PASS/FAIL per kasus dengan commit dan lingkungan | BELUM DIUJI |
| STATIC-03 | Keputusan klasifikasi dan visibility repository oleh owner | Setting PRIVATE bila diputuskan, telaah riwayat paparan dan batas akses | MENUNGGU OWNER |
| STATIC-04 | Menyelaraskan semua impor model langsung di manifest dan deteksi dua arah | Periksa kecocokan impor aktual pada setiap model dengan manifest setelah izin uji | PERBAIKAN KODE TERTULIS, BELUM DIVALIDASI |

**Tidak ada temuan yang ditandai tertutup secara resmi.** Penutupan teknis harus berdasarkan hasil verifikasi, sedangkan penutupan kelembagaan memerlukan keputusan pihak berwenang.

## Rancangan gerbang QA, bukan perintah untuk dijalankan
| Tahap | Ruang lingkup | Ketentuan |
|---|---|---|
| G0 | Owner menetapkan izin dan ruang lingkup uji, lingkungan isolasi, data DEMO dan batas penggunaan | Wajib ada izin eksplisit sebelum pengujian teknis |
| G1 | Pemeriksaan sintaks serta path impor, ekspor dan inventory source | Sesudah G0; jangan menyentuh produksi |
| G2 | Unit S9F–S9J termasuk regresi fingerprint catatan dan input tidak valid | Sesudah G1 |
| G3 | Kontrak antarmodul S9K–S9Q, 18 butir/6 fungsi/P0–P3 dan bukti DEMO | Sesudah G2 |
| G4 | HTML/UI, keyboard, aksesibilitas, mobile, keamanan input, jaringan/storage dan efek samping | Sesudah G3 |
| G5 | Telaah SOP, SPBE, klasifikasi data, arsip dan penanggung jawab oleh instansi | Keputusan manusia, bukan hasil pengujian otomatis |

Model di [folder M04-S9S](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-qa-preflight) menetapkan `approved_to_run:false`, `executed:false`, `passed:false` dan `official_finding_closed:false`. Nilai ini bersifat DEMO dan **bukan penguncian teknis sistem produksi**.

## Perhitungan QA
Pada akhir M04-S9R ada **152 skenario tertulis** pada 12 modul beserta audit statis. M04-S9S menambah **10 skenario preflight tertulis**, sehingga menjadi **162 skenario tertulis**. Semua tes baru **BELUM DIJALANKAN**; tidak ada angka lulus atau cakupan tes.

## Batasan pekerjaan dan tindakan selanjutnya
- Jangan menggunakan data pribadi, dokumen kedinasan, kredensial atau bukti resmi dalam fixture repo yang masih public.
- Jangan menjalankan Node/browser tests, CL, CI, GitHub Actions, workflow, SSH, VPS atau mengubah YANDIK+ produksi, database, branch `main`, maupun bot Indodax.
- PR #9 tetap Draft. Belum ada pengiriman paket ke pejabat, persetujuan SOP/SPBE, penugasan, keputusan bantuan, pengadaan atau BAST.
- Jika owner kelak mengizinkan pengujian, gunakan daftar G0–G4 sebagai *rencana*, lakukan verifikasi berjenjang pada lingkungan isolasi, dan perbarui register temuan berdasarkan bukti aktual. Belum ada izin pada tanggal dokumen ini.

## Lanjutan M04-S9T (12 November 2026)
Jenis bukti yang kelak diperlukan untuk enam gerbang dan empat temuan dijabarkan dalam [M04-S9T](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9T_QA_EVIDENCE_REGISTER.md). Semua bukti tetap **belum diterima/belum diverifikasi** dan tidak ada izin uji atau penutupan temuan. Sepuluh skenario baru masih **BELUM DIJALANKAN**.
