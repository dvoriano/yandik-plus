/** MOD-13/M11. Repository references only; no legal validity claims. */
const internal=(id,title,category,source,task,tags,summary)=>({id,title,category,source,task,tags,summary,origin:"Rancangan YANDIK+",status:"DRAFT_INTERNAL",edition:"Snapshot pengembangan",effective_date:null});
const candidate=(id,title,category,origin,edition,tags,summary)=>({id,title,category,origin,edition,tags,summary,status:"SOURCE_PENDING",source:null,task:"./review.html#inventaris",effective_date:null});
export const CATALOG=Object.freeze([
candidate("REF-01","Permentan 64/Permentan/OT.140/9/2007","Regulasi","Kementerian Pertanian (rujukan dalam pedoman)","2007",["sarpras","peralatan","minimal","puskeswan","inventaris"],"Pasal 13 dan Lampiran III dirujuk dalam spesifikasi inventaris. Naskah resmi dan keberlakuan terkini belum diverifikasi di pustaka."),
candidate("REF-02","Pedoman Pelayanan Pusat Kesehatan Hewan (Puskeswan)","Pedoman teknis","Direktorat Kesehatan Hewan (rujukan owner)","Cetakan 2020",["sarpras","standar","alat","pelayanan","profil"],"Rujukan inventaris hlm. 18–24. Salinan PDF belum tersedia di katalog publik; bukan konfirmasi status regulasi."),
internal("REF-03","Inventaris tahunan sarana dan peralatan Puskeswan","Panduan kerja","../../docs/M02_INVENTARIS_TAHUNAN_PUSKESWAN.md","./review.html#inventaris",["barang","alat","sarpras","stok","salin tahun lalu","jumlah"],"Rancangan pengisian dan penelaahan inventaris tahunan; tidak menetapkan kelayakan resmi."),
internal("REF-04","APEL Puskeswan: pelaporan dan apresiasi","Panduan kerja","../../docs/modules/02_APEL_PUSKESWAN.md","./review.html#koreksi",["lapor","pelayanan","bulan","koreksi","vaksin","kurban","investigasi"],"Spesifikasi pengembangan pelaporan dan koreksi; bukan juknis yang disahkan."),
internal("REF-05","Pembinaan dan pengembangan SDM","Panduan kerja","../../docs/modules/09_PEMBINAAN_BIMTEK.md","./coaching.html",["bimtek","pelatihan","kompetensi","peserta","materi"],"Rancangan kegiatan dan tindak lanjut. Materi pelatihan resmi belum diimpor."),
internal("REF-06","Administrasi kegiatan paperless","Template & administrasi","../../docs/modules/10_ADMINISTRASI_DOKUMEN.md","./coaching.html#administrasi",["laporan","berita acara","surat","arsip","dokumen"],"Spesifikasi draf dokumen; bukan pengganti persuratan resmi."),
internal("REF-07","Pengawasan obat hewan","Panduan kerja","../../docs/modules/05_PENGAWASAN_OBAT_HEWAN.md","./review.html#pengawasan",["obat","distributor","sarana"],"Rancangan register pengawasan."),
internal("REF-08","Klinik dan praktik dokter hewan","Panduan kerja","../../docs/modules/06_KLINIK_PRAKTIK_DOKTER_HEWAN.md","./review.html#pengawasan",["praktik","klinik","izin","dokter"],"Rancangan register klinik dan praktik; bukan izin resmi."),
internal("REF-09","PHMS, zoonosis dan surveilans","Panduan kerja","../../docs/modules/07_PHMS_ZOONOSIS.md","./review.html#pengawasan",["penyakit","surveilans","zoonosis","investigasi"],"Rancangan pencatatan dan telaah, bukan konfirmasi penyakit."),
internal("REF-10","Sertifikat veteriner dan lalu lintas","Panduan kerja","../../docs/modules/08_SERTIFIKAT_LALU_LINTAS.md","./review.html#pengawasan",["sertifikat","lalu lintas","hewan","produk"],"Rancangan register, bukan penerbit sertifikat."),
internal("REF-11","Mesin alur kerja bersama","SOP & proses","../../docs/WORKFLOW_ENGINE.md","./review.html",["workflow","verifikasi","koreksi","persetujuan"],"Standar desain workflow pengembangan; bukan SOP yang berlaku."),
internal("REF-12","Standar UX paperless","SOP & proses","../../docs/UX_PAPERLESS.md","./index.html",["ponsel","hp","formulir","paperless"],"Pedoman desain internal."),
internal("REF-13","Batas keamanan dan data","SOP & proses","../../docs/SECURITY_AND_DATA.md","./index.html",["privasi","akses","akun","keamanan","data"],"Aturan pengembangan, bukan izin pengolahan data resmi."),
internal("REF-14","Masterplan YANDIK+","SOP & proses","../../docs/MASTERPLAN.md","./index.html",["roadmap","modul","rencana"],"Arah pengembangan, bukan kebijakan yang disahkan.")
].map(r=>Object.freeze({...r,tags:Object.freeze(r.tags)})));
export const FAQ=Object.freeze([
{question:"Bagaimana memperbarui inventaris awal tahun?",answer:"Pada DEMO, pilih tahun dan Puskeswan, salin tahun lalu bila tersedia, periksa dan konfirmasi ulang. Status regulasi masih perlu telaah.",ref:"REF-03"},
{question:"Bagaimana memperbaiki laporan pelayanan?",answer:"Gunakan alur draf dan koreksi DEMO. Ledger APEL tidak diubah oleh simulasi.",ref:"REF-04"},
{question:"Bagaimana membuat laporan hasil pembinaan?",answer:"Catat kegiatan dan hasil di Pembinaan, lalu buat naskah pada Administrasi. Naskah belum merupakan dokumen resmi.",ref:"REF-06"},
{question:"Apakah pustaka dapat dipakai tanpa token AI?",answer:"Pencarian katalog dan FAQ ini menggunakan pencocokan teks lokal, tanpa AI.",ref:"REF-14"},
{question:"Di mana mencari materi Bimtek?",answer:"Buka rancangan Pembinaan. Materi Bimtek resmi belum tersedia di katalog ini.",ref:"REF-05"}
]);
