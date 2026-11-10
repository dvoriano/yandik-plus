# M02-S2 | Prototype Antarmuka Profil Saya dan Verifikasi

**Status:** Prototype interaktif tersimpan di GitHub dan tes model otomatis lulus. **Bukan website produksi atau login sungguhan.**
**Tanggal:** 10 November 2026.

## Yang sudah ada
- [Source HTML/CSS/JS](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan)
- Tampilan responsif berbahasa Indonesia dengan prioritas layar HP.
- Beranda identitas fiktif Puskeswan, 5 kartu status profil, tiga indikator ringkasan.
- Form per bagian: **simpan draf** atau **ajukan verifikasi**.
- Antrian verifikator simulasi: **setujui**, **minta perbaikan**, **tolak** (alasan wajib jika tidak disetujui).
- Petugas dapat memperbaiki lalu mengajukan ulang, tanpa menimpa informasi lain.
- Teks status jelas, label form, skip link, fokus input, tombol minimal 44px dan \`aria-live\` untuk notifikasi.
- Tidak ada pengisian ulang SDM/APEL atau kredensial.

## Verifikasi teknis
- [Commit model dan unit tests](https://github.com/dvoriano/yandik-plus/commit/6c807fa21fd130e0e28093eedb53623b9520e866).
- [Commit antarmuka dan CI](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910).
- [GitHub Actions run #42844096701](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) = **SUCCESS** pada \`offline-contracts\` dan \`profile-ui-demo\`.
- Total 65 tes Python existing + 20 tes Node model baru; **belum browser end-to-end**. Sintaks JS diperiksa melalui \`node --check\`.

## Batasan keamanan dan simulasi
- Fitur **"Lihat sebagai"** hanya pengganti role demonstrasi di browser; bukan identifikasi pengguna. API/backend nanti harus memverifikasi token/session, peran dan wilayah secara independen.
- Semua informasi fiktif dengan prefiks \`DEMO-\`. Tidak ada koneksi API, database, unggahan, penyimpanan lokal, jaringan eksternal, iSIKHNAS, SRIKANDI atau VPS.
- Perubahan hilang saat browser dimuat ulang. Belum ada fitur simpan otomatis atau pencatatan permanen.
- HTML di GitHub **belum** otomatis tersedia sebagai situs live; GitHub Pages tidak diaktifkan. Jangan membuat publikasi tanpa keputusan eksplisit.

## Gap kategori Profiling 2026
Kategori realisasi pelayanan, SDM, surveilans dan Kesmavet tidak boleh ditambah sebagai form pengisian ulang. Terdapat sembilan kelompok Profiling 2026 yang harus dipetakan ke modul sumber; prototype ini baru menampilkan lima kartu ilustratif. Detail di [peta domain](M02_PROFILING_2026_MAPPING.md). Kolom sebenarnya **belum diverifikasi** pada source legacy.

## Kriteria yang masih perlu dipenuhi
- [x] Prototype alur Profil Saya dan Verifikator dalam kode terpisah.
- [x] Unit test dan cek sintaks otomatis.
- [ ] Uji browser sungguhan termasuk responsivitas dan aksesibilitas.
- [ ] Uji pengguna nonteknis: kirim profil, perbaiki, baca status tanpa bantuan.
- [ ] Mapping seluruh Profiling 2026 ke field yang benar.
- [ ] Adapter API Flask, database transaksional, bukti foto, hak akses server, logging audit.
- [ ] Staging dan uji keamanan sebelum eventual deployment, hanya setelah pendanaan/persetujuan.

## Berikutnya
Pilih penambahan **validasi UI** yang bisa tetap dilakukan di GitHub (tanpa meminta user setup), lalu integrasikan ke source Flask lama bila tersedia di repository. Jangan menyatakan M02 SELESAI sebelum tes integrasi dan review UX.
