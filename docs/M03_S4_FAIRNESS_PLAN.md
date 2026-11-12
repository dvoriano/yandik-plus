# M03-S4 | Laboratorium Perbandingan Keadilan Puskeswan

**Status 11 November 2026: KODE DITULIS, BELUM DIUJI. BUKAN FITUR RESMI.**  
**Lokasi:** [drafts/m03-s4-fairness](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness)  
**Commit:** [3e30ac4](https://github.com/dvoriano/yandik-plus/commit/3e30ac406a24ec17ee604b654251c7b3eb1cee7c) (berpesan `[skip ci]`).  
**Permintaan owner:** jangan gunakan CL dan jangan jalankan tes/CI untuk pekerjaan ini sampai ada izin berikutnya.

## Apa yang telah ditulis (keberadaan file, bukan hasil pengujian)

- `comparison.mjs`: menghitung skor penjelasan berdasarkan validator indikator M03-S3, tiga profil bobot percobaan dan penanda sensitivitas urutan; skor sama diperlakukan setara dan data tidak lengkap tidak diberi skor.
- `fixtures.mjs`: enam Puskeswan **sepenuhnya fiktif**, tanpa nama asli, data layanan nyata atau identitas petugas.
- `app.mjs`, `index.html`, `style.css`: rancangan tampilan mandiri untuk melihat profil bobot, urutan indikatif, serta alasan/sumber tiap indikator.
- `README.md` di direktori draft menjelaskan status dan batasan.

**Kode sengaja ditempatkan di `drafts/`**, di luar jalur `foundation/**` dan `prototypes/**` yang memicu workflow GitHub Actions saat push. Belum dihubungkan ke website, aplikasi Flask maupun prototype yang sebelumnya sudah diuji.

## Tiga bobot simulasi yang akan dibandingkan

| Indikator | M03-S3 baseline | Akses & SDM | Kontinuitas |
|---|---:|---:|---:|
| Kesenjangan fasilitas | 25 | 20 | 20 |
| Risiko kontinuitas layanan | 30 | 25 | 40 |
| Kesulitan akses wilayah | 20 | 30 | 15 |
| Keterbatasan SDM | 15 | 20 | 15 |
| Kesenjangan persediaan | 10 | 5 | 10 |
| Total | **100** | **100** | **100** |

Semua ini hanya bobot **eksperimental**. Penilaian sumber 0–3 dan alasan per indikator tetap mengikuti kontrak M03-S3; nilai belum diketahui tetap kosong. **Volume layanan APEL fiktif tidak menjadi penambah skor**, hanya ditampilkan sebagai contoh konteks.

## Enam skenario

1. `DEMO-TERPENCIL-01`: akses sulit, layanan sedikit, risiko pelayanan tinggi.
2. `DEMO-PADAT-02`: lokasi perkotaan dengan volume tinggi tetapi fasilitas relatif memadai.
3. `DEMO-SDM-TERBATAS-03`: kekurangan tenaga, kebutuhan operasional sedang.
4. `DEMO-RANTAI-DINGIN-04`: gangguan rantai dingin berat.
5. `DEMO-TIDAK-LENGKAP-05`: informasi SDM kosong, **tidak boleh** dipaksa menjadi nol.
6. `DEMO-NILAI-SAMA-06`: faktor sama dengan skenario lain, untuk mengecek perlakuan skor seri.

**Keluaran yang direncanakan:** tabel urutan indikatif untuk tiap profil bobot, pemisahan kasus belum lengkap, rincian kontribusi per faktor, flag ketika peringkat berubah ≥2 posisi, dan kebutuhan review manusia. **Tidak boleh menghasilkan status penerima, pagu, alokasi, BAST, surat keputusan atau pengadaan.**

## Tambahan M03-S4B: pencatatan telaah metodologi
- [x] **Kode ditulis, BELUM DIUJI:** [form & model review](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) untuk alasan pilihan bobot, keterbatasan, perbandingan urutan, dan hasil review oleh peran provinsi (simulasi).
- [x] [Spesifikasi M03-S4B](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md), termasuk pembatasan agar review tidak menyatakan persetujuan bantuan atau anggaran.
- [ ] Belum dijalankan/diperiksa via tes. Status M03-S4A maupun M03-S4B tetap **BELUM DIUJI**.
- [ ] Proses review yang sah, sumber data riil, identitas petugas terautentikasi dan dokumen resmi memerlukan keputusan instansi.

## Tambahan M03-S4C: draf bahan berita acara
- [x] Teks draf dapat dirancang dari catatan kajian M03-S4B dengan histori rekomendasi, pengembalian dan perbaikan; [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness), [commit](https://github.com/dvoriano/yandik-plus/commit/93a0d7df9e446af1db4f350ac47b34c56faf1c79).
- [x] [Dokumen M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md) dan catatan uji tertunda.
- [ ] **KODE BELUM DIUJI.** Tidak ada nomor resmi, pengesahan, atau keputusan bantuan/anggaran.

## Perlu disisir nanti, tidak diuji pada sesi ini

| ID | Pemeriksaan | Status |
|---|---|---|
| M03-S4-QA01 | Peninjauan sintaks modul, impor relatif dan struktur HTML | **BELUM DIUJI** |
| M03-S4-QA02 | Validasi tiga bobot dan rentang skor, hasil deterministik | **BELUM DIUJI** |
| M03-S4-QA03 | Data kosong tidak dihitung nol, skor sama berbagi peringkat | **BELUM DIUJI** |
| M03-S4-QA04 | Volume layanan fiktif tidak memengaruhi skor | **BELUM DIUJI** |
| M03-S4-QA05 | Profil bobot berbeda dapat mengubah urutan, perubahan terlacak | **BELUM DIUJI** |
| M03-S4-QA06 | Input cacat, duplikat ID, kebocoran data pribadi, field pendanaan ditolak | **BELUM DIUJI** |
| M03-S4-QA07 | Interaksi browser, akses keyboard, HP 320/375 px, kontras dan overflow | **BELUM DIUJI** |
| M03-S4-QA08 | Validasi bobot/kriteria dengan pemilik proses dan fairness nyata lintas wilayah | **BELUM DILAKUKAN** |
| M03-S4-QA09 | Integrasi ke prototype M03 aktif hanya atas izin dan setelah QA | **TERTUNDA** |

Semua item juga tercatat di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Uji jangan dikerjakan otomatis. Tugas ini tidak menambah klaim 176 tes lama, karena [176 tes terakhir](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270) hanya untuk M03-S3.

## Keputusan tata kelola
- **M03-S4: SEDANG, KODE DITULIS, BELUM DIUJI**, bukan SELESAI.
- **M03 keseluruhan: SEDANG**, **M04: RENCANA**.
- Bobot tidak boleh menjadi kebijakan dinas sebelum uji keadilan dan persetujuan yang sah.
- Produksi, VPS, `main`, aplikasi APEL, Indodax, serta anggaran tidak disentuh.
- Mode kerja selanjutnya: [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
