# M03-S1 | Hubungan Permasalahan ke Usulan Kebutuhan Support

**Tanggal:** 11 November 2026 (WIB)  
**Status:** Prototype sumber+UI telah dibuat di GitHub; **bukan** sistem bantuan resmi atau aplikasi Flask/DB yang berjalan.  
**Lingkungan:** GitHub-only, data sepenuhnya **DEMO**. Tidak ada koneksi ke produksi.

## Prinsip pemisahan kewenangan
Permasalahan yang diverifikasi hanya menjadi **referensi** bagi pengajuan kebutuhan. Pengajuan membutuhkan tindakan petugas secara eksplisit. Status **kebutuhan terverifikasi** berarti telah diperiksa sebagai kebutuhan, **bukan** alokasi/penetapan barang, pendanaan, pengadaan, distribusi, atau BAST.

**Alur contoh:**
Permasalahan diajukan → diperiksa dan menjadi "tercatat" → petugas memilih **Usulkan kebutuhan** → mengisi barang, jumlah, satuan, urgensi, dan alasan → **Simpan draf / Ajukan kebutuhan** → verifikator menguji → **Terverifikasi / Perlu perbaikan / Ditolak**.

Persetujuan anggaran, penentuan penerima, BAST dan evaluasi distribusi adalah pekerjaan **M04** terpisah yang **belum** dibangun.

## Kode dan pengujian
- \`prototypes/profil-puskeswan/support_needs.mjs\`: model usulan dan alur pemeriksaan, hanya dari \`problem_id\` yang sudah diverifikasi dan masih aktif.
- \`prototypes/profil-puskeswan/model.mjs\`: state demo memuat \`supportNeeds\`, \`nextNeedId\`, tidak menyalin masalah ke setiap usulan.
- \`prototypes/profil-puskeswan/main.mjs\` + \`index.html\` + \`style.css\`: tombol dari masalah, form usulan, antrian verifikasi kebutuhan, status yang mudah dipahami.
- \`prototypes/profil-puskeswan/tests/support_needs.test.mjs\`: **15 tes Node** validasi kategori, angka, hubungan wilayah, role, duplikasi usulan aktif per masalah+barang, histori, keputusan dan anti-approval.
- \`prototypes/profil-puskeswan/tests/browser.test.mjs\`: **3 tes Chromium baru** (sumber harus diverifikasi, alur draf→ajukan→verifikasi, tidak terlihat bagi pimpinan).

## Data minimum
| Kolom contoh | Arti |
|---|---|
| \`id\` | ID usulan terpisah |
| \`problem_id\` | Referensi **satu arah** ke masalah terverifikasi, bukan salinan judul/uraian |
| \`puskeswan_id\`, \`kab_kota\` | Cakupan yang harus sama dengan masalah dan master |
| \`source_problem_version\` | Versi sumber saat usulan dibuat, untuk penelusuran |
| \`category\`, \`item\` | Kelompok dan nama barang/kebutuhan |
| \`quantity\`, \`unit\` | Jumlah bulat positif dan satuan |
| \`urgency\`, \`reason\` | Penjelasan urgensi dan kebutuhan, bukan skor penetapan otomatis |
| \`status\`, \`version\`, \`history\` | Histori revisi/periksa yang tidak menimpa event lama di state demo |

## Kontrol prototype
- Draf yang sama dapat langsung diajukan tanpa mengisi ulang.
- Petugas tidak dapat memverifikasi usulan sendiri; verifikator tidak bisa mengedit isian petugas.
- Draf tidak ada dalam antrian verifikator; status pengajuan mengunci pengeditan sampai dikembalikan.
- Koreksi/penolakan memerlukan alasan.
- Referensi ke masalah atau wilayah **tidak boleh dipindah** saat mengedit usulan.
- Kebutuhan untuk barang yang sama dari masalah yang sama tidak bisa dibuat berkali-kali saat usulan masih aktif. Banyak barang berbeda tetap mungkin.
- Urgensi "darurat" **bukan** prioritas otomatis atau janji ketersediaan dana.
- Pimpinan tidak melihat detail usulan individu pada prototype.
- Schema demo menolak field \`approved_budget\`, \`funding_approved\`, \`bast\`, \`delivery_id\` yang coba disisipkan.

## Bukti dan batas penyelesaian
- [Commit model dan tes](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926).
- [Commit form, antrian dan tes browser](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7).
- [GitHub Actions #42862700052](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) **SUCCESS**: ketiga job lulus, **65 tes Python + 60 tes Node + 12 tes Chromium = 137 tes otomatis**, validator fixture lulus.

### Yang masih belum
- [ ] Source Flask legacy 171 file belum tersedia di GitHub, sehingga belum ada adaptasi API/DB.
- [ ] Autentikasi real, pembatasan wilayah di server, penyimpanan permanen dan audit transaksional.
- [ ] Upload bukti dengan proteksi akses, anti duplikasi historis antar-Puskeswan, kelengkapan katalog barang.
- [ ] Penilaian prioritas **adil** dengan justifikasi dan tinjauan manusia.
- [ ] Penetapan anggaran dan keputusan pejabat, paket bantuan, distribusi dan BAST **tidak dibangun pada M03-S1**.
- [ ] Uji pemakaian petugas nonteknis di HP sebenarnya, aksesibilitas dan jaringan buruk.
- [ ] Tidak ada koneksi API/website produksi, deployment, GitHub Pages, atau merge ke \`main\`.

## Kelanjutan M03-S2
- [x] Draf tetap boleh tanpa bukti, tetapi pengajuan membutuhkan kode referensi DEMO, bukan file.
- [x] Pemeriksaan metadata eksplisit sebelum verifikasi kebutuhan dan deteksi item serupa di Puskeswan yang sama lintas masalah.
- [x] 154 tes otomatis [GitHub Actions SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527), [rincian](M03_EVIDENCE_AND_DEDUP.md).
- [ ] Unggah file sebenarnya, keamanan dokumen, aturan per periode dan pemadanan barang setara masih terbuka.

## Arah pengembangan
M03-S2: **verifikasi kelengkapan bukti dan pencegahan usulan duplikat lintas waktu** memakai fixture; M03-S3: aturan prioritas berbasis kebutuhan objektif dan manual override beralasan, belum berupa persetujuan; M04 terpisah setelah wewenang/data legal jelas.

**Handoff kanonik:** [PROJECT_STATE](../PROJECT_STATE.md) → [ROADMAP](ROADMAP.md) → [WORKLOG](WORKLOG.md).
