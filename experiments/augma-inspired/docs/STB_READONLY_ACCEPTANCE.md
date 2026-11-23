# Gerbang pemeriksaan STB atau laptop uji (read-only)

**Belum diuji pada perangkat nyata.** Tujuan dokumen ini adalah memeriksa kompatibilitas perangkat untuk lab YANDIK+ berisi data sintetis. Tidak ada izin deploy produksi yang diberikan.

## Pemeriksaan aman

1. Pastikan perangkat milik pribadi atau ada izin pengelola tertulis untuk aset kantor.
2. Catat merek/model/SoC, sistem operasi dan arsitektur CPU. Android TV stock belum tentu mendukung Linux Bash, Python, Node atau Chromium.
3. Jika **Bash sudah tersedia tanpa rooting/flashing**, profil baca-saja dapat dijalankan:

   ```sh
   bash experiments/augma-inspired/prototypes/tools/device-profile-readonly.sh
   ```

   Output bisa berisi hostname dan mountpoint. Redaksi informasi identitas sebelum berbagi laporan.
4. Bila Bash tidak tersedia, catat RAM, penyimpanan, model dan versi sistem secara manual melalui menu informasi perangkat. Jangan mengubah firmware/partisi untuk sekadar diagnosis.
5. Setelah kompatibilitas terbukti, uji *lab* lokal saja: suhu dan adaptor, RAM tersedia, disk HDD, kestabilan jaringan dan restart, pembukaan halaman browser, error JavaScript, serta cadangan dan pemulihan data fiktif.

## Tabel bukti

| Gerbang | Bukti yang diperlukan | Hasil |
|---|---|---|
| Perizinan penggunaan | Konfirmasi aset sendiri/izin pengelola | Belum tersedia |
| Hardware dan OS | SoC/CPU, ARM, Android/Linux, Bash | Belum tersedia |
| RAM dan HDD | Kapasitas, ruang kosong, kondisi HDD | Belum diukur |
| Panas dan daya | Temperatur, adaptor, pulih setelah listrik padam | Belum diuji |
| Jaringan lokal | Akses localhost, stabil setelah putus jaringan | Belum diuji |
| Browser dan server | Load UI demo, JS errors, RAM, response | Belum diuji |
| Backup/keamanan | Uji data sintetis dan pembatasan akses | Belum diuji |

**Keputusan saat ini: `PENDING_PHYSICAL_DEVICE`.** Browser GitHub CI berjalan pada runner cloud, bukan STB/HP. Dilarang memindahkan APEL/DB produksi, membuka port publik, memasang tunnel, root, flashing, atau menggunakan aset kantor tanpa otorisasi. Jika perangkat terlalu terbatas, evaluasi opsi NAS/backup lokal lebih dulu.
