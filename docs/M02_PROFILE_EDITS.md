# M02-S1 | Pembaruan Profil Puskeswan Per Bagian

**Status:** Prototype kode di GitHub, bukan halaman aplikasi Flask yang telah aktif.  
**Tanggal:** 10 November 2026. Data pengujian **sepenuhnya fiktif**.

## Masalah yang ditangani
Petugas tidak perlu mengisi ulang keseluruhan Profiling Puskeswan ketika hanya kondisi bangunan, peralatan, atau obat/BHP yang berubah. Halaman nantinya menampilkan status setiap bagian dan pekerjaan yang perlu diselesaikan.

## Bagian formulir awal
| Bagian | Field prototype | Pengisian ulang? |
|---|---|---|
| Legalitas | legalitas_status | Hanya jika perlu diperbarui |
| Bangunan | bangunan_kondisi | Hanya jika berubah |
| Peralatan klinik | peralatan_kondisi | Hanya jika berubah |
| Obat dan BHP | obat_bhp_ketersediaan | Hanya jika berubah |
| Wilayah kerja | wilayah_kerja_keterangan | Hanya jika berubah |

**SDM dan APEL bukan field input profil baru.** Keduanya diambil dari modul sumber menggunakan ID Puskeswan yang sama. Nama, ID dan wilayah Puskeswan juga tidak dapat diubah melalui pembaruan per bagian.

## Alur paperless yang diprototipekan
1. Petugas membuka **Profil Saya** dan melihat status setiap bagian: *belum lengkap*, *perlu verifikasi*, atau *terverifikasi*.
2. Pilih satu bagian, isi hanya field yang hendak diubah dan simpan **draf**.
3. Klik **Ajukan**; perubahan terkunci hingga keputusan verifikator.
4. Verifikator kab/kota berwenang atau provinsi dapat memilih **setujui**, **minta perbaikan**, atau **tolak**; setiap koreksi/penolakan disertai alasan.
5. Jika perlu perbaikan, petugas mengoreksi dan mengajukan kembali.
6. Hanya data **yang sudah disetujui** masuk ke read model profil terverifikasi. Catatan asal sebelumnya tetap ada.

## Proteksi kode
- **Default deny**: Puskeswan hanya dapat mengedit data miliknya; verifikator kab/kota hanya dalam wilayahnya; pimpinan hanya menerima agregat.
- **Optimistic versioning**: form versi lama tidak boleh menimpa perubahan baru; saat aplikasi nyata menggunakan DB harus memakai transaksi dan unique constraint.
- **Audit append-only**: aktor, waktu berzona, versi dan alasan koreksi dicatat; model immutable saat uji.
- Nilai **null** berarti sengaja mengosongkan data dan harus disertai alasan; tidak disamakan dengan 0, string kosong, atau tidak diisi.
- Edit dilakukan per bagian, field asing ditolak; data pribadi dan password tidak tersedia dalam bagian profil.
- Belum ada unggah foto dalam prototype; mekanisme lampiran akan memerlukan akses objek, tipe file dan kebijakan retensi.
- Tidak ada notifikasi otomatis, approval legal, atau penerbitan dokumen resmi.

## Tahap lanjutan M02-S2
- Antarmuka demo mobile-first dan antrian verifikator kini tersedia pada [prototypes/profil-puskeswan/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan/).
- Tes state-model JavaScript (20 kasus), sintaks skrip, dan 65 tes Python sebelumnya lulus [GitHub Actions](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701).
- **Hanya simulasi:** pergantian role bukan autentikasi; data hilang setelah reload. M02-S3 sudah menambah [6 tes browser Chromium otomatis](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703) namun belum akses Flask.
- Lihat [M02_UI_DEMO.md](M02_UI_DEMO.md).

## Implementasi dan tes
- \`foundation/yandik_base/profile_updates.py\`: model perubahan dan alur verifikasi.
- \`foundation/yandik_base/access.py\`: izin \`VERIFY_PROFILE\` khusus verifikator provinsi/kab-kota.
- \`foundation/tests/test_profile_updates.py\`: pengujian alur, otorisasi, pembaruan sebagian, versi, dan audit.
- [Progres utama](../ROADMAP.md) dan [Progres M01 master data](../M01_MASTER_DATA.md).

## Kriteria prototype
- [x] Model draf per bagian dan validasi field.
- [x] Alur kirim/koreksi/verifikasi dan riwayat.
- [x] Akses role/area dan proteksi pengiriman versi lama.
- [x] 25 tes baru lulus, total 65 tes foundation pada [GitHub Actions #42842163389](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) **SUCCESS**.
- [ ] Pemetaan field Profiling 2026 yang sebenarnya dari source Flask.
- [ ] UI HP untuk petugas nonteknis, penyimpanan DB, upload bukti, notifikasi, audit permanen, tes integrasi.

**Tidak ada koneksi ke VPS, database hidup, atau website yang sedang aktif.**
