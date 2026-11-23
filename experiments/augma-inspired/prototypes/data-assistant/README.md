# Evidence Assistant Lab (modul terpisah)

**Tujuan:** membantu menjawab pertanyaan dengan *evidence* yang terlihat, tidak mengarang angka dan membedakan status **tidak tersedia** dari **nol**.

## Kondisi saat ini

**Modul UI dan mesin jawaban berbasis aturan sudah dibuat. Ini belum LLM atau AI agent sungguhan.** Modul tidak mengakses website, database, atau sumber pribadi; hanya membaca berkas registry yang ada di lab (dibagi read-only dengan prototipe peta). Tidak mengeksekusi aksi apa pun.

Halaman dan logika berada di direktori ini; tidak ditanam ke halaman map. Dependensi data registry lokal ada di `../geo-command-center/regions.mjs`. Bila nanti dibutuhkan isolasi deployment penuh, pindahkan registry ke package bersama dan beri versi yang diverifikasi.

## Jalan lokal

```sh
cd experiments/augma-inspired/prototypes
python3 -m http.server 8767 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8767/data-assistant/`.

> Karena impor registry melintasi direktori proyek, server harus dijalankan dari `prototypes/`, bukan dari `data-assistant/`.

Tes dengan Node.js 20+: `node --test data-assistant/tests/assistant.test.mjs`.

## Fitur saat ini

- Jawaban cakupan 12 kabupaten / 7 kota dengan sumber.
- Daftar kabupaten/kota, kode dan lokasi indikatif bila ada pada registry.
- Tolak angka layanan, pelaporan, penyakit, fasilitas yang belum diberikan.
- Permintaan kredensial atau akses produksi ditolak.
- Semua jawaban memiliki status (`answered`, `unavailable`, `refused`, `help`) dan sumber.
- `prepareEvidencePackage()` menyediakan kontrak untuk kemungkinan integrasi LLM *kelak*, tetapi **tidak memanggil provider apa pun**.

## Gerbang agar menjadi asisten AI nyata

1. Tentukan pertanyaan tugas yang benar-benar diperlukan petugas dan data apa yang boleh dibaca.
2. Buat adapter lokal/terisolasi dengan autentikasi, rate limit, validasi dan audit.
3. Gunakan retrieval dokumen yang disetujui dan kutipan/sumber nyata; evaluasi halusinasi, salah sumber, privasi, dan penolakan.
4. Uji dengan data anonim yang disetujui, **bukan** langsung ke API produksi.
5. Baru ajukan review keamanan, legal, dan tata kelola sebelum integrasi.

Ini fitur eksperimen, bukan pemberi keputusan administratif.
