# M05-4 | Rapor dan Tren APEL 2026–2030

**20 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** M05-4 menyusun lapisan pelaporan deskriptif setelah registry DEMO M05-0, workflow M05-1, checklist M05-2 dan kontrak aturan tahunan M05-3. Kode: \`drafts/m05-apel-dashboard\`. Belum ada sambungan ke Flask/website/database produksi atau data aktual.

## 1. Tujuan dan batas

Menyiapkan format rapor Puskeswan per tahun dan seri tren 2026–2030 tanpa menganggap semua indikator sudah terverifikasi atau sebanding. Ini **bukan** dashboard produksi, penilaian kinerja, pemeringkatan, penghargaan atau laporan resmi.

Prinsip:
- Satu rekaman preview per Puskeswan per tahun; duplikasi ditolak.
- Angka mentah dan status sumber ditampilkan terpisah.
- Nilai kosong/tidak tersedia bukan nol. Nol yang benar-benar tercatat tetap nol.
- Rekap hanya dalam tahun dan metrik yang sama, dengan satuan konsisten.
- Tidak mengarang pertumbuhan tahunan, persentase perubahan, target, predikat atau peringkat.
- Tahun tanpa data ditampilkan eksplisit sebagai belum tersedia, bukan capaian nol.
- Semua output tetap DEMO, read-only, tanpa otorisasi resmi.

## 2. Struktur rapor tahunan

| Bagian | Isi | Batas |
|---|---|---|
| Identitas periode | Tahun terpilih, jumlah fasilitas dengan preview | Bukan jumlah seluruh Puskeswan Sumbar |
| Volume layanan | Total nilai DEMO dari M05-0 | Belum diverifikasi dan bukan skor |
| Status pelaporan | Bulan pernah submit DEMO dari M05-2 | Bukan bulan patuh/diterima |
| Ketepatan waktu | Tidak tersedia (\`null\`) | Belum ada timestamp server terverifikasi |
| Realisasi dukungan | Tidak tersedia (\`null\`) | Belum ada denominator dan sumber sah |
| Layanan kab/kota | Tidak tersedia (\`null\`) | Atribusi dan agregasi wilayah belum diverifikasi |
| Cakupan | Fasilitas dengan nilai dan tanpa nilai | Bukan penilaian kepatuhan |

Rekap metrik memiliki \`facility_count\`, \`available_count\`, \`unavailable_count\`, \`total_observed_demo_value\`, satuan dan label sumber. Total hanya diisi ketika sekurang-kurangnya ada observasi dan satuan semua observasi konsisten. Nilai yang tidak tersedia tidak ikut dijumlahkan dan tetap dihitung sebagai unavailable.

## 3. Tren 2026–2030

Tampilan tren menyajikan satu baris per tahun: jumlah fasilitas preview, jumlah nilai tersedia/tidak tersedia, total nilai DEMO dan label sumber. Tahun yang belum masuk data dicatat pada \`missing_years\`.

**Belum boleh menghitung year-over-year growth atau persen perubahan.** Definisi layanan, cakupan fasilitas, sumber, kebijakan dan kelengkapan lintas tahun belum diverifikasi identik. Perubahan nilai absolut bukan bukti kenaikan/penurunan kinerja. Setiap tahun perlu rule-set sendiri; 2026 perlu parity dengan Juknis/Flask, 2027 masih usulan, 2028–2030 belum ditetapkan.

## 4. View-model dashboard

\`buildDashboardViewModel\` menyajikan lima pilihan tahun dan seri untuk lima keluarga indikator. Output memuat pemberitahuan bahwa data belum diverifikasi, submit bukan kepatuhan, missing bukan nol dan angka antar-tahun belum tentu comparable. View-model ini tidak menyediakan UI, chart renderer, endpoint, export atau akses ke sumber live.

## 5. Syarat sebelum produksi

1. Persetujuan owner atas tujuan rapor, audiens, indikator dan ruang lingkup publik/internal.
2. Pencocokan skema dengan form APEL/Flask produksi serta definisi resmi setiap kategori layanan.
3. Rekonsiliasi identitas fasilitas, periode, revisi, status submit, ledger pelayanan dan sumber resmi.
4. Bukti penerimaan server, aturan tenggat WIB, perpanjangan, koreksi dan audit trail untuk indikator ketepatan waktu.
5. Definisi denominator dukungan dan bukti realisasi jika hendak menampilkan realisasi dukungan.
6. Validasi pemetaan kabupaten/kota dan agregasi tanpa duplikasi Puskeswan.
7. Persetujuan klasifikasi, RBAC, privasi, masa simpan, mekanisme koreksi/sanggah dan persetujuan publikasi.
8. Uji kualitas, rekonsiliasi, regresi, akses, performa dan review pengguna setelah izin pengujian diberikan.

## 6. QA tertunda dan tahap selanjutnya

**22 skenario ditulis, 0 dijalankan**. Lihat [skenario M05-4](../drafts/m05-apel-dashboard/tests/dashboard.test.mjs) dan [TEST_BACKLOG](TEST_BACKLOG.md). Status tetap BELUM DIUJI; tidak menjalankan Node, CL, CI, Actions, browser, VPS atau database.

- [Kode report/trends/dashboard](../drafts/m05-apel-dashboard/)
- [M05-3 annual rules](M05_3_ANNUAL_RULES_2026_2030.md)
- **M05-5 (RENCANA):** spesifikasi sumber resmi, rekonsiliasi data, dan kontrak integrasi read-only setelah owner menyetujui akses dan lingkungan uji. Bukan deployment otomatis.

Semua perubahan berada pada branch \`develop/yandik-foundation\`, PR #9 tetap Draft menuju \`main\`. Repo PUBLIC: jangan pernah memasukkan data personal/riil, dokumen internal, kredensial atau rahasia.
