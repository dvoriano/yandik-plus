## 2026-11-11 | M03 mulai fase prototype
- M03 dari **RENCANA** menjadi **SEDANG (prototype)** karena kode usulan kebutuhan dari masalah terverifikasi dan form demo sudah dibuat [model](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926), [UI](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7).
- Tidak mengubah rencana cakupan M04: bantuan nyata, alokasi, BAST dan distribusi tetap RENCANA. Verifikasi kebutuhan tidak berarti keputusan penyaluran.
- [Dokumen keputusan](M03_LINKED_SUPPORT_NEEDS.md), [tes](https://github.com/dvoriano/yandik-plus/actions/runs/42862087552).

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
