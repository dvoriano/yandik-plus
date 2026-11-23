# Local AI adapter: review only

## Prinsip

Modul Evidence Assistant tetap bekerja tanpa LLM. Adapter kandidat lokal hanya **opsi eksplisit** di komputer uji, memanggil endpoint loopback `http://127.0.0.1:11434/api/generate` milik Ollama; sama sekali tidak tersambung dengan VPS, YANDIK+, atau data riil.

Adapter hanya memproses pertanyaan berstatus `answered` yang sudah mempunyai sumber. Pertanyaan tentang angka pelayanan, pelaporan, informasi sensitif dan data yang tidak tersedia **tidak diteruskan** ke model.

Output model adalah **draf tidak terverifikasi untuk ditelaah manusia**, bukan jawaban resmi. Ia harus berupa JSON dengan `draft` dan `citations` yang menunjuk ID sumber yang benar-benar tersedia. Pengujian awal ini tidak melakukan pemeriksaan kebenaran semantik atas parafrasa, sehingga statusnya selalu `review_required`.

## Cara mencoba (opsional, hanya bila Ollama tersedia pada laptop uji)

Default benar-benar nonaktif:

```sh
node cli-local-ollama.mjs "berapa kabupaten di Sumatera Barat?"
```

Jika Ollama dan model yang sesuai sudah dipasang oleh penguji:

```sh
# Di komputer uji, bukan VPS atau STB produksi.
node cli-local-ollama.mjs --enable-local-ollama "berapa kabupaten di Sumatera Barat?"
```

Secara default model yang diminta adalah `qwen2.5:1.5b`; jika belum tersedia, adapter mengembalikan `transport_error` dan tetap memperlihatkan jawaban dasar. Alternatif model dapat dipilih lewat `YANDIK_LAB_LOCAL_MODEL` pada komputer uji. Perintah ini **tidak** melakukan instalasi, `pull`, atau unduhan model otomatis.

## Safety boundary

- Tidak ada koneksi ke API Indodax atau YANDIK+.
- Tidak ada kredensial, token, data pribadi maupun statistik produksi.
- Endpoint dipatok ke loopback dan panggilan harus diaktifkan eksplisit.
- Tidak memiliki alat untuk tindakan administratif.
- Tidak boleh diaktifkan melalui UI browser saat ini.
- Perlu uji privasi, kualitas, dan otorisasi sebelum menjadi fitur operasional.

Tes: `node --test tests/local-adapter.test.mjs`.
