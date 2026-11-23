# M00-G9 | Pratinjau Penerimaan Source Flask, Metadata DEMO

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | TANPA AKSES FILE.**

`preflight.py` memeriksa **deklarasi metadata sintetis yang diberikan sebagai objek Python**. Ia tidak membuka file, melihat kode, menelusuri direktori, menjalankan Flask, memanggil VPS, membaca log, memeriksa secrets, atau membenarkan keaslian pemilik sumber.

Manifest dibatasi:
- nama berkas Python/dokumen/dependensi ASCII berupa path relatif sederhana;
- tidak menerima dotfiles, traversal, backslash, binary, sejumlah pola nama rahasia/backup, symlink, field ekstra, hash invalid, volume berlebihan, atau duplikasi; **pemeriksaan nama bukan pemeriksaan isi file**;
- daftar route hanyalah contoh `/demo/...` untuk menunjukkan kontrol akses dan wilayah **belum dibuktikan**;
- flag izin resmi maupun hasil scan file secara sengaja tidak bisa diubah menjadi `true` melalui deklarasi.

Bahkan manifest lengkap selalu menghasilkan `ready_for_import:false` dan `ready_for_production:false`. Ini **bukan scanner source maupun pengganti audit source asli**.

[41 skenario QA ditulis, 0 dijalankan](tests/test_preflight.py). [Spesifikasi](../../docs/M00_G9_FLASK_INTAKE_METADATA_DEMO_2026_2030.md). Untuk pemeriksaan sungguhan, harus ada salinan sanitisasi berizin dan reviewer keamanan yang berwenang. Jangan commit source rahasia ke repo publik.
