## 2026-11-11 | Ringkasan Eksekutif 1.1: kebutuhan AI Agent pembangunan
- Ringkasan diperbaharui menjadi naskah formal untuk bahan pertimbangan pimpinan, Inspektorat dan Diskominfotik.
- **AI Agent untuk pengembangan** dibedakan dari chatbot operasional. Kebutuhan token/kredit/kuota berbasis pemakaian, manfaat dan pengendalian biaya dijelaskan dengan penekanan pengadaan perlu telaah.
- Pengenalan Lengkap dan tautan README diselaraskan; status tetap DRAF dan tidak mengubah status modul.
- [Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) · [Commit revisi](https://github.com/dvoriano/yandik-plus/commit/ad054783b5fec427651b1ea1d57e30b906a61876).

## 2026-11-11 | Penambahan dokumen pengenalan YANDIK+ untuk pimpinan dan unit pengawas
- Dua dokumen baru disusun untuk pembaca nonteknis: [Ringkasan Eksekutif](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) dan [Pengenalan Lengkap](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/PENGENALAN_YANDIK_PLUS.md).
- Penekanan: 15 modul beserta fungsi, sistem kerja/otorisasi/verifikasi/tindak lanjut, manfaat terukur yang **belum diklaim**, pertimbangan SPBE dan pengendalian internal.
- Status **DRAF BAHAN TELAAH**. Tidak mengubah target, membuat alokasi bantuan, menyatakan kepatuhan hukum/SPBE otomatis atau mengubah status rilis fitur.
- Kode M03-S4 tetap BELUM DIUJI; tidak ada CL/CI/tes, penerapan, atau perubahan produksi.
- Dokumen berada dalam repo private. Pendistribusian hanya kepada pembaca yang diberi akses dan sesuai kebijakan organisasi.

## 2026-11-11 | Perubahan cara kerja: coding dahulu, testing nanti
- Instruksi baru owner: **hindari penggunaan CL** karena anggarannya disisihkan untuk bot Indodax; pada YANDIK+ **tidak menjalankan tes/CI dahulu**.
- [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md) diberlakukan: kode draft ditempatkan di luar jalur workflow otomatis, diberi `[skip ci]`, ditandai **BELUM DIUJI**, dan setiap test dicatat di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- M03-S4 ditambahkan sebagai **SEDANG / KODE DITULIS / BELUM DIUJI**, bukan DONE. [Commit kode](https://github.com/dvoriano/yandik-plus/commit/3e30ac406a24ec17ee604b654251c7b3eb1cee7c); [Rencana dan batas](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md).
- M03-S3 memiliki 176 tes lulus sebelumnya, namun keberhasilan tersebut **tidak diwariskan** ke M03-S4 atau kode baru.
- Tidak ada perubahan M04: tetap RENCANA, termasuk alokasi, bantuan, pengiriman dan BAST.

## 2026-11-11 | M03-S3 scorecard prioritas percobaan
- Menambahkan lima indikator berbobot percobaan, alasan/sumber, review kab/kota → provinsi, koreksi kategori rekomendasi beralasan tanpa mengubah skor dasar.
- M03 tetap SEDANG (prototype), M04 tetap RENCANA. Tidak ada alokasi dana, pemilihan penerima, pengadaan atau BAST otomatis.
- Bobot/ambang belum disahkan sebagai kebijakan kedinasan; masih perlu uji keadilan dan persetujuan metodologi.
- [Spesifikasi M03-S3](M03_PRIORITY_ASSESSMENT.md), [GitHub Actions SUCCESS 176 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270).

## 2026-11-11 | M03-S2 kelengkapan metadata dan pencegahan duplikasi
- Pekerjaan baru pada M03: kode bukti DEMO, gate pengajuan/verifikasi, duplikat item di satu Puskeswan lintas masalah dan alasan pengajuan ulang bila sebelumnya ditolak.
- Status M03 tetap **SEDANG (prototype)**, M04 tetap **RENCANA**; tidak mengubah kewenangan pengadaan/penetapan bantuan.
- [Dokumentasi](M03_EVIDENCE_AND_DEDUP.md), [GitHub Actions SUCCESS 154 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).

## 2026-11-11 | M03 mulai fase prototype
- M03 dari **RENCANA** menjadi **SEDANG (prototype)** karena kode usulan kebutuhan dari masalah terverifikasi dan form demo sudah dibuat [model](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926), [UI](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7).
- Tidak mengubah rencana cakupan M04: bantuan nyata, alokasi, BAST dan distribusi tetap RENCANA. Verifikasi kebutuhan tidak berarti keputusan penyaluran.
- [Dokumen keputusan](M03_LINKED_SUPPORT_NEEDS.md), [GitHub Actions SUCCESS: 137 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052).

# Riwayat Keputusan dan Perubahan Roadmap YANDIK+

**Tujuan:** perubahan rencana dapat ditambah, direvisi, ditunda, atau dihapus dari scope aktif tanpa kehilangan jejak keputusan.

| Versi | Tanggal | Jenis | Keputusan | Alasan / dampak |
|---|---|---|---|---|
| 0.1 | 2026-11-10 | AWAL | Roadmap M00–M12 pada branch offline dibuat | Memisahkan pengembangan dari website/VPS |
| 1.0 | 2026-11-10 | PERLUAS | Masterplan dan spesifikasi terpisah untuk setiap modul; roadmap progres bertanda status | Arah paperless seluruh kegiatan kesehatan hewan dan kemudahan pengguna |
| 1.0 | 2026-11-10 | TAMBAH | M13 PHMS/zoonosis, M14 sertifikat/lalu lintas, M15 pembinaan/Bimtek, M16 evaluasi integrasi opsional | Aktivitas teknis belum cukup tercakup |
| 1.0 | 2026-11-10 | BATASAN | Tidak ada perubahan website/VPS, tidak ada data atau rahasia produksi ke GitHub | Pengembangan sampai tersedia biaya dan persetujuan deploy |
| 1.1 | 2026-11-10 | UBAH | Berhenti meminta unduh ZIP, PowerShell, push lokal, SSH atau setup eksternal. Pekerjaan hanya melalui GitHub. | Instruksi eksplisit pemilik proyek; M00-D tetap terbuka sampai bisa diimpor langsung |
| 1.1 | 2026-11-10 | TAMBAH | Dokumen `PROJECT_STATE.md`, `docs/WORKLOG.md`, `docs/GITHUB_WORKFLOW.md` wajib dirawat setiap progres dan dibaca saat chat berganti. | Konteks per chat terbatas; GitHub menjadi memori kerja proyek yang dapat diverifikasi |

## Format perubahan berikutnya
- **ID keputusan:** DEC-YYYYMMDD-NN.
- **Jenis:** TAMBAH / UBAH / HAPUS / TUNDA / AKTIFKAN_KEMBALI.
- **Modul/milestone terdampak dan sebelum → sesudah.**
- **Alasan, manfaat, risiko, dependensi, persetujuan, issue/PR.**
- Ubah ROADMAP dan PROJECT_STATE dalam commit yang sama bila mungkin.

## Aturan hapus
- Hapus dari rencana aktif hanya setelah alasan tercatat.
- Jangan menghapus bukti, laporan historis, atau definisi indikator yang sudah dipakai.
- Bila modul ganti nama, pertahankan alias ID lama.
- Aturan APEL historis tidak boleh diubah diam-diam; revisi harus versioned.
