# YANDIK+ | Pusat Pengembangan GitHub

> Website produksi https://yandikvo.my.id/ **tidak diubah**. Pengembangan dilakukan secara offline, tanpa VPS, database produksi, atau deployment otomatis.

## Mulai dari sini
1. **[Masterplan](MASTERPLAN.md):** visi satu ruang kerja paperless seluruh aktivitas teknis.
2. **[Roadmap & Progres](ROADMAP.md):** satu sumber status SELESAI, SEDANG, RENCANA, TERTUNDA, DIBATALKAN.
3. **[Katalog Modul](MODULES_INDEX.md):** tautan spesifikasi tersendiri untuk 15 modul.
4. **[Riwayat Perubahan](CHANGELOG_ROADMAP.md):** menambah, mengedit, menunda atau menghapus rencana dengan jejak keputusan.
5. **[UX ramah petugas](UX_PAPERLESS.md) dan [Workflow](WORKFLOW_ENGINE.md):** standar lintas modul.

## Apa yang sudah ada?
- Source snapshot Flask aplikasi tersedia sebagai arsip kerja yang sebelumnya diberikan pengguna, dengan paket offline 171 file.
- **Source aplikasi tersebut belum diimpor ke branch GitHub ini** saat penulisan dokumen, sehingga belum dapat diklaim seluruh fitur telah diuji atau tersedia sebagai repo runnable.
- Branch pengembangan: `develop/yandik-foundation` dengan PR #9 status draft. Branch `main` tetap terpisah.
- Sebagian APEL, profiling, SDM, master wilayah, serta halaman/modul awal pengawasan ada dalam snapshot. Detail masing-masing ada dalam dokumen modul.

## Aturan operasional
- Tidak ada koneksi ke VPS YANDIK+ atau VPS bot Indodax.
- Tidak mengunggah `data/`, `uploads/`, `backups/`, log, data pribadi, akun, token, password, kredensial dan rahasia runtime.
- Gunakan dummy data, sample config dan tes offline.
- Pekerjaan baru melalui GitHub issue/branch/PR, dengan bukti tes untuk memindahkan status.
- Satu status roadmap induk, dan keputusan perubahan wajib dicatat; tidak perlu menciptakan master roadmap lain yang bersaing.

## Dokumen teknis sebelumnya
[BACKLOG.md](BACKLOG.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [SECURITY_AND_DATA.md](SECURITY_AND_DATA.md) · [SUPPORT_PUSKESWAN.md](SUPPORT_PUSKESWAN.md) · [IMPORT_OFFLINE.md](IMPORT_OFFLINE.md).
