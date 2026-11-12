# M04-S1 | Rancangan Berkas Pertimbangan Administratif Dukungan Puskeswan

**Kedudukan:** KODE DITULIS, **BELUM DIUJI**, dan **BELUM DIGUNAKAN SECARA RESMI**.  
**Tanggal:** 11 November 2026 (WIB)  
**Lingkup:** konsep alur administrasi setelah kebutuhan diverifikasi, **bukan** keputusan pemberian bantuan atau pengelolaan dana.  
**Lokasi kode:** [drafts/m04-admin-review](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review), [commit 9051571](https://github.com/dvoriano/yandik-plus/commit/9051571aeee25a2611850aa43406aceb6fe66a04).

## 1. Maksud pengembangan

Pada M03, petugas mengidentifikasi masalah Puskeswan, memeriksa kebutuhan dan melakukan penilaian prioritas percobaan. Proses tersebut **tidak menetapkan penerima bantuan, kelayakan belanja, atau ketersediaan anggaran**.

M04-S1 menambahkan rancangan **berkas administrasi** untuk menjelaskan usulan yang telah terverifikasi, mengumpulkan kelengkapan, dan menyiapkan bahan pembahasan bagi pihak yang berwenang. Berkas administratif **terpisah dari skor M03**, tidak mengubah bobot/skor prioritas, dan tidak mempunyai tombol persetujuan bantuan.

**Semua fasilitas, identitas petugas, barang dan dokumen dalam prototype adalah data fiktif.**

## 2. Alur proses bisnis yang dirancang

| Tahap | Peran dalam simulasi | Kegiatan | Bukan kewenangan |
|---|---|---|---|
| Identifikasi sumber | Penyusun provinsi DEMO | Memilih referensi kebutuhan dengan status `terverifikasi` serta metadata bukti contoh | Tidak menetapkan validitas bukti asli |
| Draf berkas | Penyusun provinsi DEMO | Mengisi tujuan/manfaat, kondisi teknis, keterbatasan dan kode bukti metadata | Tidak membuat nominal belanja |
| Pemeriksaan kelengkapan | Penyusun provinsi DEMO | Menandai status tiap unsur administratif; draf tetap boleh belum lengkap | Checklist "ada" bukan verifikasi sah |
| Pengajuan telaah | Penyusun provinsi DEMO | Menyerahkan data contoh untuk pemeriksaan administratif **apabila lima unsur bertanda "ada"** | Tidak mengusulkan pencairan dana |
| Tinjauan administratif | Penelaah administrasi DEMO | Mengembalikan untuk perbaikan atau mencatat sebagai bahan pertimbangan | Tidak memberi persetujuan resmi |
| Penyiapan bahan | Sistem simulasi | Menyusun teks berkas baca-saja, termasuk histori, untuk diperiksa/disalin manusia | Tidak menerbitkan SK, kontrak, BAST, atau surat resmi |
| Proses resmi | Pejabat dan sistem berwenang (di luar demo) | Menentukan tindak lanjut berdasarkan ketentuan, program, kewenangan dan sumber dana sah | **Belum dibangun pada M04-S1** |

**Urutan status contoh:** `draf → diajukan → perlu_perbaikan → draf`, atau `diajukan → tercatat_untuk_pertimbangan`. Status terakhir hanya berarti dokumen tersedia sebagai **bahan pertimbangan**, tidak pernah berarti disetujui.

## 3. Lima unsur kelengkapan administratif

1. **Identitas fasilitas dan wilayah Puskeswan.**
2. **Referensi kebutuhan yang sudah diverifikasi pada sumber.**
3. **Alasan dan kondisi teknis yang mendasari kebutuhan.**
4. **Referensi bukti administratif** (pada simulasi hanya kode `DEMO-`, tanpa berkas).
5. **Kesesuaian rencana kegiatan/program untuk ditelaah.**

Setiap unsur memiliki pilihan `ada`, `belum_ada`, atau `perlu_klarifikasi`. Draf boleh disimpan sebelum lengkap. **Agar contoh berkas dapat diajukan**, kelimanya harus ditandai `ada`. Pengaturan ini **hanya pemeriksaan input contoh**; tidak menilai legalitas, keaslian, penganggaran atau kelayakan nyata.

## 4. Sumber informasi dan prinsip tidak mengisi ulang

- `need_id`, identitas Puskeswan, wilayah, barang dan jumlah berasal dari **snapshot contoh kebutuhan** dan tidak diminta diketik ulang.
- Status kebutuhan `terverifikasi` diperlukan pada sumber contoh. **Kebutuhan berstatus diajukan atau draf tidak boleh langsung dipakai** untuk menyusun berkas.
- Kode bukti `DEMO-` hanya metadata fiktif, bukan bukti foto/dokumen.
- Kategori skor prioritas M03, bila ada, ditampilkan **sebagai konteks**, tidak menjadi perintah menetapkan penerima.
- Versi snapshot disimpan. Jika nanti terhubung ke sumber nyata, perubahan kebutuhan/versi harus memicu pemeriksaan ulang sebelum keputusan apapun. **Belum ada integrasi M03 yang sesungguhnya.**
- Pembahasan ketersediaan program/kewenangan dan anggaran **tidak dapat disimpulkan dari skor**.

## 5. Pengendalian keputusan dan audit

**Tidak tersedia dalam prototype:** persetujuan pejabat, nomor/tanggal resmi, nominasi penerima, pagu atau nilai belanja, alokasi, pengadaan, pembayaran, paket distribusi, tanda terima dan BAST.

Rancangan membatasi data input berbahaya seperti field `allocation`, `approved_budget`, `recipient_selected`, `bast`, dan nomor SK yang tampak resmi. Catatan telaah menyimpan perubahan di memori browser serta label pelaku DEMO. **Riwayat ini bukan jejak audit yang bisa dijadikan bukti resmi** karena tidak disimpan di server dan tidak memakai akun terautentikasi.

Pemeriksaan formal nanti perlu identitas/peran yang sah, pengendalian wilayah, pemisahan tugas, audit tahan perubahan, pemutakhiran sumber, akses/retensi bukti, dan persetujuan sesuai sistem keuangan/arsip resmi.

## 6. Berkas kode

| Berkas | Fungsi |
|---|---|
| [`dossier.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review/dossier.mjs) | Membuat, merevisi, mengajukan dan menelaah berkas administratif DEMO tanpa status persetujuan resmi |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review/fixtures.mjs) | Contoh kebutuhan fiktif terverifikasi, belum dinilai dan belum diverifikasi |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review/main.mjs) | Form, checklist, label peran, riwayat dan draf teks baca-saja |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review/index.html) | Tampilan rancangan administrasi untuk HP |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review/style.css) | Desain responsif rancangan, belum diperiksa pada HP |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review/README.md) | Instruksi pembaca dan keterbatasan kode |

**Status implementasi kode:** file sudah ada pada branch pengembangan, tetapi **belum dijalankan**. Tidak ada hasil tes yang dapat diklaim. `[skip ci]` digunakan untuk menghindari pekerjaan CI yang tidak diinginkan.

## 7. Antrean pemeriksaan tertunda

- [ ] Jalur kebutuhan terverifikasi vs belum terverifikasi.
- [ ] Kejelasan antara metadata bukti contoh dan pemeriksaan dokumen riil.
- [ ] Draf yang belum lengkap dapat disimpan; submit hanya jika kelima unsur ditandai `ada`.
- [ ] Peran berbeda dan transisi status, termasuk perbaikan dan histori.
- [ ] Perubahan sumber yang membuat berkas usang; potensi input yang mengubah snapshot.
- [ ] Pencegahan field keputusan, nominal, SK, pengadaan, BAST atau alokasi.
- [ ] Form HP 320/375 px, keyboard, screen reader, notifikasi kesalahan dan teks keluaran.
- [ ] Kesesuaian proses dengan aturan kedinasan, penanggung jawab, pemisahan tugas, dan alur SPBE.
- [ ] Integrasi M03, autentikasi server, DB, audit permanen dan pengelolaan lampiran resmi.

Daftar QA terpusat: [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Semua item **BELUM DIUJI** atau **BUTUH KEPUTUSAN**.

## 8. Status dan batas tahapan berikut

- **M04-S1:** coding rancangan berkas administrasi **SEDANG / BELUM DIUJI**.
- **M04 tahap berikut:** pencatatan referensi keputusan yang benar-benar diterbitkan **oleh pejabat/sistem resmi**, perencanaan paket, distribusi, BAST dan evaluasi **RENCANA**. Rancangan tidak boleh meniru otorisasi pejabat hanya dengan mengganti peran.
- **M03-S4A/B/C:** kode simulasi tersimpan, belum diuji.
- **Website, VPS, source Flask produksi, branch `main`, dan bot Indodax:** tidak disentuh.

**Langkah berikut yang logis:** M04-S2 merancang **register referensi keputusan pejabat yang terbit di luar sistem** dengan status *menunggu konfirmasi*, bukan membuat persetujuan atau SK otomatis. Perlu keputusan pemilik proses mengenai dokumen yang boleh dicatat dan siapa yang memeriksa keasliannya sebelum digunakan riil.
