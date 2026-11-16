# M04-I2 | Fondasi Penyimpanan dan Pengendalian Data Terpadu

**16 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Seluruh penggunaan hanya untuk data fiktif. Bukan migrasi atau implementasi server produksi.

## Keputusan desain
Gunakan draf repository SQLite server-side yang menerima koneksi DatabaseSync dari host tepercaya; rencana baseline Node >=22.13 dengan node:sqlite tersedia. SQLite dipilih sebagai sarana pengembangan terisolasi, bukan keputusan final database produksi Flask. Tidak ada database yang dibuka atau dibuat saat perubahan GitHub ini. Repository satu workspace belum memiliki partisi tenant/record, database asli, API HTTP, autentikasi atau adapter Flask.

## Kontrak penyimpanan
| Tabel | Isi |
|---|---|
| workspace_current | State M04-I1 dan revisi aktif, versi snapshot sumber per fasilitas, register koreksi |
| workspace_versions | Snapshot lengkap tiap revisi, termasuk baseline 0 |
| workspace_events | Aktor internal, peran, fasilitas, aksi, outcome dan waktu server, rujukan koreksi |
| workspace_commands | ID permintaan unik, aktor, payload normalisasi dan hasil untuk idempotensi |

BEGIN IMMEDIATE, pemeriksaan revisi optimistis, update bersyarat, insert snapshot/event/command dan COMMIT dirancang satu transaksi. Gagal di tengah transaksi harus rollback; permintaan identik dari aktor yang masih berhak dapat direplay tanpa penggandaan, sedangkan ID sama dengan konten/aktor berbeda ditolak. Audit hanya untuk perubahan yang berhasil dicatat, termasuk konflik rekonsiliasi yang tercatat sebagai outcome; penolakan akses/gagal transaksi tidak memiliki event pada tabel ini. Trigger menahan UPDATE/DELETE histori, bukan jaminan anti-tamper administrator. Idempotensi dan concurrency lintas koneksi belum dibuktikan; seluruh snapshot dan nomor revisi global dapat menimbulkan pertumbuhan penyimpanan dan mengungkap aktivitas agregat lintas scope, sehingga perlu desain partisi/retensi sebelum penggunaan nyata.

## Hak akses usulan
Identitas dibaca melalui lookup tepercaya berdasarkan ID aktor yang kelak berasal dari sesi autentikasi server. Role bukan input command. Fungsi repository bukan endpoint publik; host wajib memastikan aktor tidak dapat menyuplai ID orang lain. Seluruh data DEMO. Kebijakan ini khusus fungsi I2 dan perlu penyelarasan Core Platform serta SOP.

| Peran | Tampilan dan mutasi DEMO |
|---|---|
| Petugas | Fasilitas dan wilayah sendiri; ajukan koreksi |
| Kab/kota | Wilayah sendiri; ajukan/telaah koreksi (bukan atas permintaan sendiri) |
| Verifikator provinsi | Detail lintas fasilitas, telaah koreksi |
| Admin provinsi | Detail lintas fasilitas, skenario I1, pengajuan dan sinkron sumber yang telah ditelaah |
| Pimpinan | Agregat saja, tanpa histori/koreksi/detail atau tindakan mutasi |

Histori pengguna dibatasi fasilitas, maksimal 200 event terakhir; aktor internal disimpan tetapi tidak ikut diproyeksikan (hanya peran). Agregat tetap berasal dari I1. Tujuh langkah I1 adalah simulasi, bukan izin formal pengadaan, pencairan, pengiriman, BAST atau tindakan resmi. Tahap telaah I1 masih skenario gabungan internal dan bukan pemisahan tugas aktual.

## Koreksi dan sinkronisasi
1. Ajukan koreksi per fasilitas dengan alasan dan snapshot versi sumber aktif; satu koreksi terbuka per fasilitas.
2. Penelaah berbeda memilih catat untuk sinkron atau kembalikan, dengan alasan. Tidak ada pengesahan resmi.
3. Admin meminta sinkron dari provider sintetis tepercaya dan sinkron, bukan menerima payload sumber dari klien. Versi envelope harus lebih baru dan cakupan fasilitas harus cocok.
4. Model memeriksa histori baris sumber lama: tidak boleh dihapus, versi mundur, isi versi yang sama berubah, atau histori sebelumnya ditulis ulang. Validasi model M02/M03 dan model M04 dipakai kembali. Provider tetap bertanggung jawab atas validitas isi profil, asal data, kelengkapan dan versi; kontrak ini tidak membuktikan autentisitas.
5. Perubahan binding paket memblokir penggantian sumber, mempertahankan snapshot lama dan mencatat terblokir_rekonsiliasi. Langkah dukungan dibekukan selama koreksi terbuka. Sumber yang tidak menyebabkan konflik dapat disinkron secara atomik.

Belum ada resolusi konflik berantai, pembatalan koreksi terblokir, rekonsiliasi lintas fixture APEL/foundation, sinkronisasi berkala, penulisan balik ke sistem sumber, atau revisi dokumen resmi. Versi baseline awal 1 (0 jika tidak ada snapshot) hanya asumsi fixture. Versi global membatasi writer antar fasilitas; bukan rancangan skala final.

## QA dan batas operasional
[Skema, policy, source dan repository](https://github.com/dvoriano/yandik-plus/commit/a1a5654e0fe9d6a22b3f8b3937e4191c5813ff5e); [penguatan dan 16 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/commit/18931448ba306a66a485e99ed0d24ce177581f65); [folder sumber](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-data-foundation). Tes dirancang untuk SQLite :memory:, termasuk rollback, idempotensi, role, koreksi, konflik sumber dan trigger. **Nol tes dijalankan.** Belum memeriksa persistensi file lintas restart proses, lock lintas koneksi, crash recovery, migrasi/up/down, keamanan sesi, pemetaan kesalahan, backup, pemulihan, retensi, otorisasi API dan beban. Tidak ada Node, CI, server, deployment atau database produksi yang disentuh.

## Rencana berikutnya
M04-I3: penanganan rekonsiliasi sumber yang terblokir melalui revisi/cabang histori dan penelusuran dampak paket sampai monitoring; rancang penyelesaian yang tidak menghapus catatan historis. Kemudian adapter HTTP/sesi server dan migrasi hanya setelah kontrak dan scope disepakati. QA tetap menunggu izin eksplisit G0. M05 tetap mengikuti roadmap.

Repository public; seluruh contoh wajib fiktif. PR #9 Draft dan CODE_ONLY tetap.
