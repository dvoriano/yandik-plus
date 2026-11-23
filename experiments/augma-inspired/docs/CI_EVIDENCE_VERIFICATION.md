# Memeriksa bukti GitHub Actions Innovation Lab

**Status:** mekanisme pengumpulan bukti dan pemeriksa lokal telah dibuat. **Belum ada bukti run baru pada commit terbaru yang berhasil diambil melalui konektor ini.** Jangan menyatakan tes browser baru sudah lulus hanya karena script validasi tersedia.

## Mengapa ada dua paket bukti?

GitHub Actions hanya berjalan pada branch `lab/augma-inspired-experiments`, dengan `contents: read` dan tanpa deployment. Job `geometry-and-acquisition` dan `browser-smoke` berjalan pada runner terpisah sehingga hasilnya disimpan sebagai dua paket artefak yang memuat identitas run dan SHA commit sama.

| Artefak Actions | Berkas penting | Batas pemeriksaan |
|---|---|---|
| `yandik-lab-offline-python-evidence` | `manifest.json`, `python-tests.log` | Minimal 32 tes Python selesai dan OK |
| `yandik-lab-browser-evidence` | `manifest.json`, `node-tests.log`, `playwright-tests.log`, `browser-performance.json`, jejak browser jika ada | Minimal 31 tes Node dan 19 tes Playwright lulus |

Manifest menyimpan `branch_ref`, `commit_sha`, `run_id`, `run_attempt`, `job_kind`, `job_result`, serta penanda `NOT_FOR_PRODUCTION`. Artefak disimpan **7 hari**. Berkas log berasal dari test runner dan tidak memerlukan akun APEL, kredensial, atau akses data operasional.

## Pemeriksaan offline terhadap satu run yang sama

1. Buka [GitHub Actions YANDIK+](https://github.com/dvoriano/yandik-plus/actions/workflows/yandik-innovation-lab-ci.yml), pilih run dari branch lab yang sudah **completed**, lalu catat **SHA commit 40 karakter** dan **run ID** dari URL. Periksa ketiga job berstatus sukses.
2. Ambil kedua artefak dari run yang **sama**. Ekstrak masing-masing pada folder terpisah, misalnya `/tmp/yandik-qa-python/` dan `/tmp/yandik-qa-browser/`. Jangan menggabungkan `manifest.json` kedua job.
3. Jalankan pemeriksa dari clone branch lab yang sudah diambil secara sah. Ganti `<SHA_COMMIT>` dan `<RUN_ID>` dengan identitas **sebenarnya**, bukan angka dari contoh:

```sh
cd experiments/augma-inspired
python3 tools/verify_ci_evidence.py \
  --manifest /tmp/yandik-qa-python/manifest.json \
  --expected-sha <SHA_COMMIT> --expected-run-id <RUN_ID> \
  --python-log /tmp/yandik-qa-python/python-tests.log

python3 tools/verify_ci_evidence.py \
  --manifest /tmp/yandik-qa-browser/manifest.json \
  --expected-sha <SHA_COMMIT> --expected-run-id <RUN_ID> \
  --node-log /tmp/yandik-qa-browser/node-tests.log \
  --playwright-log /tmp/yandik-qa-browser/playwright-tests.log
```

Kedua perintah harus mengembalikan `PASS_OFFLINE_CI_LOG_CONTRACT`, *run ID* sama, SHA sama, dan seluruh angka lulus. Bila berkas tidak ada, log tidak lengkap, status gagal, terlewat, atau ambang tes tidak tercapai, hasilnya harus dianggap **tidak lulus verifikasi**.

## Apa yang tidak terbukti dari artefak?

- Konsistensi log terhadap manifest **bukan** bukti kriptografis bahwa runner GitHub dapat dipercaya. Periksa juga halaman Actions asli.
- Tes GIS hanya memakai geometri sintetis atau permintaan BNPB *mock*. Tidak memverifikasi validitas hukum maupun izin pakai batas administrasi 19 kabupaten/kota.
- Tes viewport HP di Chromium bukan uji pada perangkat HP atau STB fisik, pembaca layar, dan koneksi seluler nyata.
- Tidak ada hak untuk merge, deployment, perubahan database, atau pemindahan VPS produksi.

**Gerbang rilis tetap tertutup:** konfirmasi hasil run pada commit terbaru, sumber geospasial berizin, audit GIS nyata, pengujian perangkat, dan persetujuan kelembagaan harus dilakukan secara terpisah.
