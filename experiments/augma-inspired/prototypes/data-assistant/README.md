# Evidence Assistant Lab

**Modul terpisah dari peta dan dari produksi.** UI default adalah asisten berbasis aturan, bukan LLM. Memberikan jawaban dari registry 19 kabupaten/kota, sumber referensi, dan penolakan untuk informasi yang tidak tersedia.

## Jalankan halaman

```sh
cd experiments/augma-inspired/prototypes
python3 -m http.server 8767 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8767/data-assistant/`.

- Tidak memanggil API AI dari browser atau sumber luar.
- Tidak ada data pelayanan, penyakit, SDM, pelaporan, atau kredensial produksi.
- Angka yang tak tersedia tidak diubah menjadi 0.
- Jawaban dengan fakta menyertakan ID sumber; status `answered`, `unavailable`, `refused`, atau `help`.

## Adapter model lokal (eksperimen terpisah dari UI)

[Local AI adapter](LOCAL_AI_ADAPTER.md) menyediakan kontrak hasil model terstruktur untuk Ollama lewat CLI Node.js. **Default OFF**. Hanya diaktifkan dengan `--enable-local-ollama` dan endpoint selalu `127.0.0.1` pada komputer uji. Hanya pertanyaan yang sudah dapat dijawab berbasis sumber boleh ditransmisikan. Output model **hanya draf untuk ditinjau manusia**, tidak pernah otomatis dianggap akurat.

## Pengujian

```sh
node --test tests/assistant.test.mjs tests/local-adapter.test.mjs
```

Pengujian browser manual: `../BROWSER_TESTING.md`.

## Sebelum memakai data sungguhan

Dibutuhkan izin data, definisi indikator, API baca-saja sesuai peran, audit, verifikasi dokumen, pembatasan model, pengujian halusinasi dan tata kelola yang disetujui. Tidak ada integrasi ke YANDIK+ sampai proses itu selesai.
