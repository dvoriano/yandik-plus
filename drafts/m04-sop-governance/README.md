# M04-S8 | Persyaratan SOP dan Tata Kelola Perubahan Katalog Unit

**KODE DITULIS, BELUM DIUJI.** Draft GitHub-only. Dilarang menjalankan CL, unit test, Chromium, workflow CI, deployment maupun menginput data kedinasan nyata.

## Lingkup
- **12 persyaratan kesiapan kelembagaan** pada lima kelompok: kelembagaan, kewenangan, tata kelola, sistem, dan implementasi.
- Checklist per unsur dengan status belum diperiksa, perlu klarifikasi, bahan tersedia sebagai rujukan DEMO, atau tidak berlaku untuk unsur opsional yang beralasan. Semua catatan memerlukan alasan tertulis. Unsur wajib yang belum tersedia tidak pernah dianggap lolos.
- **Usulan perubahan katalog unit** bertipe tambah, ubah, atau nonaktifkan. Wajib mencantumkan profil DEMO, alasan, dampak pada rute M04-S6, RACI M04-S7, SOP/arsip, serta langkah rollback.
- Telaah perubahan unit terpisah dari telaah checklist kelembagaan. Usulan yang dikembalikan dapat direvisi dengan histori yang tetap tersedia. Hasil hanya untuk pembahasan, tidak ada aksi apply, publish, update catalog, enact SOP, atau approval bantuan.
- Sumber berasal dari catatan M04-S7 yang telah dinyatakan *bahan SOP* pada simulasi, dengan versi dan deteksi perubahan.
- Rekap baca-saja dan histori per draf, seluruhnya hanya memori halaman.

## Berkas
- `governance.mjs`: daftar persyaratan, tata kelola perubahan, guard versi sumber, rekap dan histori.
- `fixtures.mjs`: contoh source M04-S7 fiktif yang dibuat dengan fungsi model sebelumnya.
- `main.mjs`, `index.html`, `style.css`: tampilan checklist, proposal perubahan, review dan handoff.
- [Spesifikasi M04-S8](../../docs/M04_S8_SOP_GOVERNANCE.md) · [QA tertunda](../../docs/TEST_BACKLOG.md).

## Kedudukan hukum dan teknis
Katalog M04-S7 tetap utuh. Hasil `bahan_tersedia` dan `dicatat_untuk_pembahasan` adalah **informasi simulasi**, bukan validasi bukti asli, pengesahan SOP, perubahan struktur organisasi, kewenangan pejabat, pembiayaan, pengadaan, bantuan ataupun BAST. Role DEMO bukan autentikasi; histori memori bukan audit legal.
