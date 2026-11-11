# M03-S2 | Kelengkapan Bukti dan Pemeriksaan Duplikasi Kebutuhan Support

**Tanggal:** 11 November 2026 (WIB)  
**Status:** kode dan UI prototype **teruji** di GitHub; bukan aplikasi Support resmi atau pengelolaan berkas nyata.  
**Cabang:** `develop/yandik-foundation`; tidak ada koneksi VPS, database produksi, atau deploy.

## Tujuan dan keputusan
Menekan usulan bantuan yang tidak memiliki bukti administratif dan mencegah pencatatan barang yang sama berkali-kali **pada Puskeswan yang sama**, tanpa menyamakan pemeriksaan kebutuhan dengan keputusan pemberian bantuan.

## Pemeriksaan bukti metadata, bukan unggah file
- Draf tetap dapat disimpan walaupun belum ada referensi bukti.
- **Pengajuan ditolak** apabila tidak menyertakan minimal satu kode bukti dengan pola `DEMO-...`. Saat ini maksimum tiga catatan metadata per usulan.
- Jenis kode: `foto`, `dokumen`, atau `observasi`; ketiganya masih sekadar referensi tanpa penyimpanan konten berkas.
- URL, path file, kode tidak sesuai format, jenis asing, dan kode bukti berulang ditolak oleh validator prototype.
- Verifikator **harus mencentang pemeriksaan kelengkapan metadata** sebelum memberi status `terverifikasi`; tindakan ini dicatat dalam `evidence_review` dengan role, referensi dan versi revisi.
- Pengajuan yang diminta diperbaiki dapat mengganti kode bukti dan diajukan ulang; riwayat sebelumnya tetap tersedia sebagai event.
- **Tidak ada foto/file yang diunggah, tidak ada bukti yang benar-benar dilihat, tidak ada verifikasi keaslian atau tanda tangan elektronik.** Kode bukti DEMO tidak boleh dipakai sebagai bukti administratif sebenarnya.

## Pencegahan usulan berulang
1. Nama barang dinormalisasi untuk kapitalisasi, spasi berulang dan tanda baca, misalnya `COOLBOX---UNTUK VAKSIN!` dianggap serupa dengan `Coolbox untuk vaksin`.
2. Pencarian dilakukan pada seluruh usulan dalam satu `puskeswan_id` + kab/kota, termasuk yang berasal dari **permasalahan berbeda**; tidak otomatis memblokir Puskeswan lain.
3. Jika ada usulan serupa yang masih aktif (draf, diajukan, perlu perbaikan, terverifikasi), sistem menolak pencatatan usulan kedua.
4. Jika usulan serupa sebelumnya **ditolak**, usulan ulang hanya boleh diajukan dengan alasan tertulis `repeat_reason`; referensi `previous_rejected_need_id` dicatat.
5. Pengecekan saat ini adalah **pencocokan teks sederhana**, bukan pemahaman sinonim atau kesetaraan spesifikasi barang, dan belum menggunakan DB. Pada integrasi nyata diperlukan pencegahan race condition/constraint transaksional dan penilaian manusia atas kebutuhan yang benar-benar berulang.

## Lokasi kode dan uji
| Komponen | Fungsi |
|---|---|
| `prototypes/profil-puskeswan/support_evidence.mjs` | Validasi kode bukti, kelengkapan dan normalisasi item |
| `prototypes/profil-puskeswan/support_needs.mjs` | Pintu pengajuan, verifikasi bukti dan penolakan duplikat |
| `prototypes/profil-puskeswan/main.mjs`, `index.html`, `style.css` | Kolom bukti, alasan pengajuan ulang, checkbox pemeriksaan verifikator |
| `tests/support_evidence.test.mjs` | 15 tes baru untuk bukti, duplikasi lintas masalah dan alasan pengajuan ulang |
| `tests/browser.test.mjs` | 2 tes Chromium baru untuk blokir kirim tanpa bukti dan checkbox verifikasi |

**Bukti GitHub:** [kode](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815) · [tes](https://github.com/dvoriano/yandik-plus/commit/49326c9b9a9d6233dddf25e9e4a132ac607068f4) · [UI](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1) · [browser](https://github.com/dvoriano/yandik-plus/commit/77f0f344127e1d81a404caf041b883260754474e) · [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).

**CI:** 65 Python + 75 Node + 14 Chromium = **154 tes otomatis lulus**, validator fixture juga lulus. Semua tes berjalan dengan data anonim dan simulasi, bukan petugas di HP fisik.

## Status pekerjaan
- [x] Pemeriksaan metadata bukti untuk pengajuan dan verifikasi.
- [x] Riwayat role, kode referensi dan revisi pada pemeriksaan metadata.
- [x] Pencegahan item yang sama dalam satu Puskeswan meski berasal dari masalah berbeda.
- [x] Alasan pengajuan ulang bila usulan serupa pernah ditolak.
- [x] Unit test dan tes browser Chromium otomatis lulus.
- [ ] Belum ada unggah bukti sebenarnya, pemindaian keamanan berkas, pemeriksaan isi foto/dokumen dan retensi.
- [ ] Belum ada database unik transaksional, pencarian sinonim/ekivalensi barang, atau aturan berulang per periode dan tahun.
- [ ] Belum ada autentikasi resmi, izin server kab/kota/provinsi, atau audit bukti yang tidak bisa diubah.
- [ ] Source Flask lama 171 file belum terimpor ke GitHub; belum ada mapping field real.
- [ ] Belum ada uji pengguna nonteknis, HP fisik, screen reader dan aksesibilitas mendalam.
- [ ] **M03-S3** penilaian prioritas transparan dan adil belum dibuat.
- [ ] **M04** keputusan bantuan, alokasi dana, paket, distribusi dan BAST tetap RENCANA.

## Berikutnya: M03-S3
Rancang prioritas bantuan berdasarkan bukti kesenjangan fasilitas, risiko pelayanan, kondisi SDM, jangkauan wilayah dan urgensi, disertai alasan dan kesempatan review manusia. Hindari skema yang sekadar mengutamakan Puskeswan dengan jumlah pelayanan terbesar. Tidak boleh menghasilkan pendanaan atau penetapan bantuan otomatis.

**Rujukan:** [M03-S1](M03_LINKED_SUPPORT_NEEDS.md) · [Support Puskeswan](modules/04_SUPPORT_PUSKESWAN.md) · [ROADMAP](ROADMAP.md) · [PROJECT_STATE](../PROJECT_STATE.md).
