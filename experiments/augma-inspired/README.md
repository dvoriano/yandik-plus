# YANDIK+ Innovation Lab: Augma-Inspired Experiments

> **TERISOLASI | Riset / prototipe | Bukan fitur produksi**

Eksperimen teknologi visual, peta situasional, dan AI assistant untuk mendukung arah pengembangan YANDIK+ hingga 2030. Terinspirasi oleh pendekatan interaksi Augma Imaginarium, **bukan** salinan kode, desain, atau produk Augma.

## Batas pengembangan

- Lokasi: hanya branch `lab/augma-inspired-experiments`, di folder `experiments/augma-inspired/`.
- **Tidak mengubah** branch `main`, `develop`, kode APEL, VPS Sumopod, layanan produksi, atau database.
- Tidak membuat pull request/merge/deploy otomatis.
- Gunakan **data sintetis/demonstrasi**; tidak ada data pribadi, kredensial, atau API produksi.
- Integrasi dengan YANDIK+ hanya setelah peninjauan manfaat, akses data, keamanan, lisensi, dan keputusan eksplisit.
- Semua komponen prototipe di folder ini ditulis sendiri. Tidak mengunduh atau menyalin source code Augma.

## Isi lab

| Dokumen/eksperimen | Status |
|---|---|
| [Radar pemanfaatan teknologi](docs/TECHNOLOGY_RADAR.md) | Riset awal |
| [Roadmap 2026–2030](docs/ROADMAP_2026_2030.md) | Rencana eksperimen |
| [Ketentuan keamanan dan lisensi](docs/SAFETY_AND_LICENSE.md) | Guardrail |
| [Command Center Demo](prototypes/command-center/README.md) | Prototipe mandiri, **data fiktif** |

## Prioritas

1. **Command Center Puskeswan:** ringkasan visual dan lokasi skematis, dengan sumber data demonstrasi.
2. **Tanya Data:** antarmuka pertanyaan sederhana; awalnya berbasis aturan, **belum AI**.
3. **Eksperimen 3D/gestur:** setelah ada kasus penggunaan dan uji kompatibilitas perangkat.
4. **AI agent lokal:** setelah kebijakan akses, audit, dan kualitas data terdefinisi.

## Menjalankan prototipe

Dari root repo:

```sh
cd experiments/augma-inspired/prototypes/command-center
python3 -m http.server 8765 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8765/`. Tidak perlu token atau internet. Prototipe menggunakan browser untuk render, sehingga beban visual tidak harus dijalankan server STB.

Menjalankan tes logika (Node.js 20+): `node --test tests/core.test.mjs`.

## Referensi dan atribusi

- [Augma Repo](https://repo.augmaimaginarium.com/) (akses katalog; unduh/read source mensyaratkan registrasi).
- [Portofolio Augma Imaginarium](https://www.augmaimaginarium.com/projects/).
- Per 23 November 2026, katalog Augma menampilkan Holo-Explorer (Three.js, lisensi tertera CC BY-NC 4.0). **Lisensi dan isi tiap file harus dicek sebelum menyalin apa pun.** Di lab ini tidak ada kode Augma yang digunakan ulang.

Status prototipe ≠ persetujuan penerapan pada sistem resmi.
