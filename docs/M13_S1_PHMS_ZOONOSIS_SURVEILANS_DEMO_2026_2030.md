# M13-S1 | Register PHMS, Zoonosis dan Surveilans DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | DATA FIKTIF.** Milestone M13, modul MOD-07.

## Yang dibuat
- [Register dan proyeksi kejadian baca-saja](../drafts/m13-surveillance/surveillance.mjs), [fixture sintetis](../drafts/m13-surveillance/fixtures.mjs).
- Tiga kejadian contoh 2026 dalam satu wilayah DEMO, ID lokasi fiktif, tanpa titik koordinat, identitas pemilik/hewan, foto asli, nomor kasus ataupun lab asli.
- [28 skenario QA tertulis](../drafts/m13-surveillance/tests/surveillance.test.mjs), **0 dijalankan**.
- Setiap kejadian harus terhubung dengan snapshot manifest lokal M00-G2 yang sama; tiap fasilitas/wilayah dipagari dengan M00-G1. Tidak ada koneksi iSIKHNAS.

## Kamus status rancangan
| Elemen | Status DEMO | Batasan penafsiran |
|---|---|---|
| Dugaan/observasi | SUSPECTED_UNVERIFIED_DEMO atau FIELD_OBSERVATION_UNVERIFIED_DEMO | Bukan kasus terkonfirmasi |
| Investigasi | NOT_STARTED_DEMO atau FIELD_NOTES_RECORDED_UNVERIFIED_DEMO | Bukan pengesahan pemeriksaan |
| Sampel/lab | NOT_LOGGED_DEMO, SAMPLE_LOGGED_UNVERIFIED_DEMO, RESULT_PENDING_UNVERIFIED_DEMO, RESULT_NOTES_RECORDED_UNVERIFIED_DEMO | Catatan hasil tidak berarti lab mengonfirmasi penyakit |
| Tindak lanjut | NOT_RECORDED_DEMO atau DRAFT_REVIEW_ONLY | Bukan perintah penanganan atau notifikasi |
| Jumlah terkonfirmasi | null | Tidak ada sumber resmi; tidak boleh dinyatakan 0 |
| Lokasi | DEMO-LOCATION-... | Tidak memuat koordinat riil |
| Sumber | DEMO-SOURCE / DEMO-SNAPSHOT | Tidak sah dianggap impor iSIKHNAS |

## Penghitungan
- Event register menghitung **rekaman kejadian sintetis**, bukan kejadian luar biasa, kasus resmi, hewan sakit, atau total layanan APEL.
- Investigasi APEL berdasarkan lokasi/kejadian mengikuti juknis tersendiri; model ini tidak menganggap catatan kejadian otomatis menjadi laporan layanan.
- Tidak ada sinkronisasi, deduplikasi resmi iSIKHNAS/APEL, penilaian risiko, pemetaan kasus, diagnosis, peringatan dini ataupun pemberitahuan kesehatan masyarakat.
- Bahan telaah dapat menunjukkan perlu peninjauan investigasi, tetapi tanpa petugas, jadwal, surat, keputusan, atau pengiriman.

## Gerbang integrasi nyata
1. Definisikan penyakit yang relevan, definisi kasus, batas peran/lab dan syarat pelaporan **berdasarkan kebijakan yang berlaku serta pemilik proses**; kode DEMO tidak menentukan klasifikasi klinis.
2. Audit asal, izin, versi, waktu dan batas penggunaan data iSIKHNAS serta source APEL tanpa membuat input ganda.
3. Terapkan autentikasi server, akses per wilayah dan per unit, perlindungan lokasi kasus yang sensitif, audit, sanitasi sumber, serta kebijakan retensi.
4. Persyaratan bantuan lapangan, validasi laboratorium dan notifikasi resmi hanya melalui prosedur berwenang, bukan flag dalam kode.
5. Uji 28 QA + 24 QA M00-G2 setelah ada izin pemilik proyek.

**Status:** M13-S1 CODE_WRITTEN_NOT_TESTED. Keseluruhan MOD-07 BELUM SELESAI.

## Pengembangan lanjut M13-S2
[Kandidat pencocokan investigasi APEL ↔ kejadian surveilans](M13_S2_APEL_SURVEILLANCE_CROSSWALK_DEMO_2026_2030.md) sudah ditulis, **24 QA tertulis, 0 dijalankan**. Tidak menyamakan dua sumber, tidak menyinkronkan data atau menghasilkan kasus terkonfirmasi.
