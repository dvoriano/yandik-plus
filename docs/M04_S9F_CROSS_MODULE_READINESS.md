# M04-S9F | Checklist Prasyarat Integrasi Lintas Modul YANDIK+

**Tanggal:** 11 November 2026 (WIB)  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Kedudukan:** rancangan inventaris kebutuhan bukti, bukan penilaian kepatuhan, persetujuan SPBE, izin integrasi ataupun pengesahan teknis.

## Sumber dan kegunaan
Model menggunakan **papan M04-S9E fiktif** yang merangkum agenda M04-S9C dan catatan M04-S9D. M04-S9F tidak membaca data YANDIK+ aktif, tidak terhubung ke API, dan tidak menetapkan status hasil telaah manusia.
Setiap butir memuat ID tetap, kelompok, bukti minimum yang perlu dicari, pengampu yang diusulkan, status pekerjaan tertunda serta rujukan dokumen. Pengampu adalah **usulan fungsi**, bukan nama pejabat yang resmi ditugaskan.

## Cakupan 18 prasyarat
| Kelompok | Jumlah | Lingkup utama |
|---|---:|---|
| Kelembagaan | 4 | Tupoksi/proses, RACI/SOP, SPBE dan retensi/tata naskah |
| Keamanan | 4 | Status repo, login/peran/wilayah, audit permanen, rahasia dan kredensial |
| Data | 3 | ID Puskeswan, integritas APEL historis, asal-usul/koreksi dan deduplikasi |
| Alur Support | 3 | Fairness M03, kontrak M03→M04 dan keputusan eksternal |
| QA | 2 | Regresi kode draft dan keamanan/aksesibilitas HP |
| Integrasi | 2 | Staging/backup/rollback serta otorisasi deployment |

Seluruh butir diberi salah satu label **BUTUH_KEPUTUSAN**, **BELUM_DIBUKTIKAN**, atau **MENUNGGU_IZIN_UJI**. Tidak tersedia status lulus atau disetujui, sehingga hitungan bukti resmi yang diverifikasi selalu **nol dalam DEMO**. Hitungan nol berarti *model belum memiliki bukti*, bukan hasil penilaian kinerja instansi.

## Ketergantungan modul
- M00/M01: akun dan otorisasi wilayah, workflow, audit, lingkungan dan identitas master.
- M02: profil Puskeswan/SDM/sarpras sebagai dasar kebutuhan, pemetaan ID stabil dan sumber bukti.
- APEL: harus tetap memakai definisi dan periode pelayanan yang benar; tidak boleh ada perubahan formula historis tanpa keputusan dan regresi.
- M03: kebutuhan, bukti, deduplikasi, prioritas/fairness dan review pengampu.
- M04-S1 sampai S9E: administrasi berkas, referensi keputusan dari sistem resmi, eskalasi, SOP/organisasi DEMO, register kelembagaan dan peta perhatian. Catatan atau bahan telaah **bukan** dokumen persetujuan bantuan.
- Sistem di luar YANDIK+: iSIKHNAS, SRIKANDI, pengadaan dan arsip resmi berada pada pengampu/kewenangannya masing-masing; bukan endpoint yang otomatis diaktifkan.

## Rencana empat gelombang QA, belum dijalankan
| Urutan | Isi | Prasyarat sebelum eksekusi |
|---|---|---|
| P0 | Pembatasan akses, sumber dan dokumen | Owner secara eksplisit mengizinkan tes; klasifikasi data dan kontrol repo disepakati |
| P1 | Tes impor serta perilaku M03-S4 sampai M04-S9F dengan data sintetis | P0, versi dependency dan fixture ditetapkan |
| P2 | Keamanan, role/wilayah, APEL historis, UX dan regresi | Bukti P1, review pengampu serta catatan temuan |
| P3 | Review staging, rollback, pengawasan dan rencana perubahan | P2, keputusan kelembagaan/SPBE dan pengamanan resmi |

Seluruh gelombang **BELUM DIMULAI**. P3 bukan otomatis izin deploy; segala perubahan aplikasi aktif perlu keputusan pemilik sistem dan prosedur yang sah.

## Pengendalian akses dan penilaian
- Metadata GitHub pada pemeriksaan 11 November menunjukkan repo **PUBLIC**. Rencana menggantinya menjadi PRIVATE pada **Sabtu, 14 November 2026** sudah punya pengingat, **belum terlaksana**.
- Dokumentasi/fixture tidak boleh memakai data atau kredensial nyata. Perubahan visibilitas kelak tidak menghapus penyebaran historis bila sebelumnya pernah public.
- Status kelayakan integrasi adalah konstan **BELUM_DINILAI_TIDAK_ADA_IZIN_INTEGRASI**, tanpa tombol setuju atau deploy.
- UI hanya membaca DEMO, memakai teks DOM aman, filter kelompok/status, dan ringkasan salin manual. Tidak ada database, fetch, storage, autentikasi ataupun endpoint layanan resmi.
- Keberadaan dokumen ini tidak berarti keputusan instansi, legalitas penggunaan, atau kepatuhan regulasi sudah diverifikasi.

## Kode, batas QA dan tahap berikut
- [Kode M04-S9F](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-preintegration-checklist): `checklist.mjs`, `fixtures.mjs`, `main.mjs`, `index.html`, `style.css`, `README.md`, `tests/checklist.test.mjs`.
- Sepuluh skenario tes Node ditulis tetapi **BELUM DIJALANKAN**. Rinciannya pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Setelah keputusan pengampu proses/akses data dan izin eksplisit owner, lakukan QA berurutan serta pemeriksaan keamanan yang sesuai.
- M04-S10+ keputusan resmi, pengadaan, anggaran, penyaluran dan BAST tetap RENCANA.
- Branch `main`, PR #9, VPS, website produksi YANDIK+, dan bot Indodax tidak disentuh.
