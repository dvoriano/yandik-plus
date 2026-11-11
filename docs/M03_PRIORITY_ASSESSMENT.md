# M03-S3 | Penilaian Prioritas Support yang Transparan

**Tanggal:** 11 November 2026 (WIB)  
**Status:** prototype GitHub teruji, belum integrasi Flask/DB/produksi.  
**Versi kebijakan percobaan:** M03-S3-EXPERIMENTAL-1. Semua bobot dan ambang masih **usulan**, bukan keputusan kedinasan atau dasar penetapan bantuan.

## Tujuan

Memberikan penilaian kebutuhan yang dapat dijelaskan, memberi perhatian pada kesenjangan fasilitas, risiko, akses sulit dan keterbatasan SDM. Jumlah pelayanan APEL mentah tidak dipakai sebagai bonus skor, sehingga Puskeswan dengan jumlah layanan rendah tidak otomatis tersisih.

## Indikator dan bobot rancangan

| Indikator | Bobot | Makna |
|---|---:|---|
| Risiko gangguan pelayanan | 30% | Potensi layanan penting tidak berjalan |
| Kesenjangan fasilitas | 25% | Kondisi alat/sarana yang rusak atau kurang |
| Kesulitan akses wilayah | 20% | Kendala jangkauan pasokan atau pelayanan |
| Keterbatasan SDM | 15% | Kapasitas petugas menghadapi kebutuhan |
| Kesenjangan persediaan | 10% | Kekurangan persediaan esensial |
| **Total** | **100%** | |

Tingkat 0 = tidak ada kesenjangan teridentifikasi, 1 = ringan, 2 = sedang, 3 = berat. **Tidak diketahui berarti belum dinilai, bukan nol.** Masing-masing nilai memerlukan alasan 12–240 karakter dan kode sumber metadata DEMO.

**Rumus contoh:** skor = jumlah (bobot masing-masing × tingkat/3), rentang 0–100. Nilai total hanya dihitung apabila kelima indikator dilengkapi.

- Kurang dari 40: kategori rendah, masih perlu kajian.
- 40 sampai kurang dari 70: kategori sedang, perlu perhatian.
- 70 sampai 100: kategori tinggi, perlu pembahasan lebih dahulu.

Angka dan kategori ini **tidak menentukan penerima bantuan, tidak membuat alokasi dan tidak mengesahkan anggaran**. Urgensi yang ditulis pengusul tidak memberikan bonus skor otomatis.

## Pembagian peran pada simulasi

1. **Petugas Puskeswan:** membuat usulan kebutuhan, bukan memberi skor atau menyetujui prioritas.
2. **Verifikator kab/kota:** setelah kebutuhan terverifikasi dan sumber masalah masih aktif, mengisi scorecard lima indikator, menyimpan draf, atau mengirim penilaian.
3. **Verifikator provinsi:** meninjau rincian bobot, alasan dan sumber. Dapat menerima hasil dasar, mengembalikan untuk perbaikan dengan alasan, atau mengubah **kategori rekomendasi** dengan alasan minimal 20 karakter. Skor dasar tidak pernah ditimpa.
4. **Pimpinan pada demo:** tidak menerima rincian individual; dashboard agregat belum dibangun.

Status "ditinjau" hanya berarti scorecard telah ditelaah. Pemilihan peran di browser adalah simulasi, **bukan autentikasi, identitas pemeriksa independen atau kewenangan hukum**.

## Integritas, versi dan histori

Penilaian memiliki ID tersendiri, ID kebutuhan, versi kebutuhan/masalah sumber, versi metode, faktor+alasan+sumber, rincian kontribusi skor, dan history perubahan. Tidak boleh ada dua penilaian aktif untuk kebutuhan sama. Jika sumber berubah, scorecard lama diberi peringatan historis; review dan pengajuan yang tidak cocok versinya ditolak. Validator menolak upaya menyisipkan alokasi/BAST atau memalsukan alasan, band, sumber versi maupun skor asli.

**Keamanan riil masih terbuka:** kebijakan API per pengguna/wilayah, bukti fisik yang dapat dicek, database transaksional, audit persisten, identitas pemeriksa yang berbeda dan mekanisme keberatan.

## Contoh pengujian keadilan (bukan data riil)

- Skenario fasilitas terpencil dengan layanan sedikit tetapi kesenjangan/risiko tinggi dapat memiliki skor indikatif lebih besar.
- Fasilitas dengan jumlah pelayanan tinggi tetapi tidak memiliki kesenjangan berat tidak otomatis menjadi prioritas pertama.
- Data kosong tidak diubah menjadi nol, dan indikator tidak lengkap tidak dapat dikirim sebagai scorecard final.
- Belum ada pemeringkatan lintas kabupaten dengan populasi/cakupan dan risiko riil, karena memerlukan kajian bobot dan validasi metodologi.

## Kode dan bukti

- [Model dan unit test](https://github.com/dvoriano/yandik-plus/commit/dfc49f323dc36f4526031fd370f93696a5658aae): support_priority.mjs dan tests/support_priority.test.mjs.
- [Antarmuka mobile dan review](https://github.com/dvoriano/yandik-plus/commit/7519ab003375041c46c2bfb7d18febe5beb1e897).
- [Tiga skenario Chromium baru](https://github.com/dvoriano/yandik-plus/commit/192d62537a52d23a60366cd3c11a97a696485a8b).
- [Validasi review palsu dan sumber usang](https://github.com/dvoriano/yandik-plus/commit/87a14fd5d76a387e4b40792fd41c054795bd7b06).
- [GitHub Actions #42939237270](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270) **SUCCESS**: 65 Python + 94 Node + 17 Chromium = **176 tes otomatis**, validator fixture lulus.

## Checklist dan batas

- [x] Lima faktor, bobot, skor terurai dan alasan/sumber.
- [x] Tidak menggunakan total pelayanan APEL mentah dalam skor.
- [x] Nol berbeda dengan kosong; penilaian belum lengkap tidak bisa diajukan.
- [x] Review dua peran pada demo, termasuk koreksi beralasan yang mempertahankan baseline.
- [x] History dan versi sumber, peringatan usang, validasi anti-alokasi/anti-review palsu.
- [x] Tes otomatis lulus termasuk alur Chrome di viewport HP.
- [ ] Review formal bobot, indikator, ambang dan SOP dengan tim/kabupaten/kota.
- [ ] Uji fairness pada data representatif lintas wilayah, aksesibilitas dan petugas nonteknis di HP fisik.
- [ ] Pemetaan field asli Profiling/SDM/APEL/GIS, source Flask lama 171 file masih belum di GitHub.
- [ ] Login server, database asli, bukti fisik dan hak akses legal.
- [ ] **M04** keputusan bantuan/anggaran, alokasi, paket, distribusi dan BAST tetap RENCANA.

## Berikutnya

Buat skenario offline perbandingan Puskeswan secara anonim dan dokumentasi uji keadilan, sambil mempersiapkan review bobot/aturan bersama pemilik proses. Jangan mengubah data/website produksi atau menyebut skor percobaan sebagai keputusan bantuan.

**Rujukan:** [M03-S1](M03_LINKED_SUPPORT_NEEDS.md) · [M03-S2](M03_EVIDENCE_AND_DEDUP.md) · [Modul Support](modules/04_SUPPORT_PUSKESWAN.md) · [Roadmap](ROADMAP.md).
