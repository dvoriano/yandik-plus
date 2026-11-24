/** Lampiran III Permentan 64/2007, cetakan Pedoman 2020, hlm.18–24. Transkripsi struktur kerja, belum telaah resmi. */
export const CATALOG_VERSION="PERMENTAN64-2007-LIII-2020-V1-DEMO";
export const GROUPS=Object.freeze([
  {
    "id": "A1",
    "label": "Bangunan dan sarana fisik"
  },
  {
    "id": "A2",
    "label": "Sarana penunjang"
  },
  {
    "id": "A3",
    "label": "Peralatan kantor"
  },
  {
    "id": "A4",
    "label": "Transportasi dan komunikasi"
  },
  {
    "id": "A5",
    "label": "Obat-obatan dan vaksin"
  },
  {
    "id": "B",
    "label": "Pakaian kerja"
  },
  {
    "id": "C1",
    "label": "Peralatan klinik/diagnostik"
  },
  {
    "id": "C2",
    "label": "Peralatan bedah"
  },
  {
    "id": "D",
    "label": "Bahan"
  },
  {
    "id": "E",
    "label": "Peralatan dan bahan laboratorium"
  },
  {
    "id": "F",
    "label": "Bahan-bahan laboratorium"
  },
  {
    "id": "G",
    "label": "Peralatan pengumpul spesimen"
  },
  {
    "id": "H",
    "label": "Peralatan reproduksi dan kebidanan"
  },
  {
    "id": "I",
    "label": "Peralatan produksi"
  },
  {
    "id": "J",
    "label": "Peralatan khusus peternakan"
  }
]);
export const CATALOG=Object.freeze([
  {
    "id": "A.1",
    "group": "A1",
    "label": "Luas bangunan Puskeswan",
    "kind": "area",
    "minimum": 100,
    "unit": "m²",
    "page": 18,
    "ref": "A.1"
  },
  {
    "id": "A.1.a",
    "group": "A1",
    "label": "Ruang registrasi dan ruang tunggu",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.a"
  },
  {
    "id": "A.1.b",
    "group": "A1",
    "label": "Ruang administrasi",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.b"
  },
  {
    "id": "A.1.c",
    "group": "A1",
    "label": "Ruang pemeriksaan/tindakan medik",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.c"
  },
  {
    "id": "A.1.d",
    "group": "A1",
    "label": "Ruang laboratorium",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.d"
  },
  {
    "id": "A.1.e",
    "group": "A1",
    "label": "Ruang kepala Puskeswan",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.e"
  },
  {
    "id": "A.1.f",
    "group": "A1",
    "label": "Ruang pertemuan dan staf",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.f"
  },
  {
    "id": "A.1.g",
    "group": "A1",
    "label": "Gudang bahan dan peralatan",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.g"
  },
  {
    "id": "A.1.h",
    "group": "A1",
    "label": "Kamar mandi/WC",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.h"
  },
  {
    "id": "A.1.i.1",
    "group": "A1",
    "label": "Tempat tinggal dokter: kamar tidur",
    "kind": "asset",
    "minimum": 2,
    "unit": "ruang",
    "page": 18,
    "ref": "A.1.i.1"
  },
  {
    "id": "A.1.i.2",
    "group": "A1",
    "label": "Tempat tinggal dokter: ruang tamu/makan/keluarga",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.i.2"
  },
  {
    "id": "A.1.i.3",
    "group": "A1",
    "label": "Tempat tinggal dokter: dapur",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.i.3"
  },
  {
    "id": "A.1.i.4",
    "group": "A1",
    "label": "Tempat tinggal dokter: kamar mandi/WC",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.1.i.4"
  },
  {
    "id": "A.2.a",
    "group": "A2",
    "label": "Kandang isolasi/observasi",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.2.a"
  },
  {
    "id": "A.2.b",
    "group": "A2",
    "label": "Kandang jepit",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.2.b"
  },
  {
    "id": "A.2.c",
    "group": "A2",
    "label": "Tempat dipping",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.2.c"
  },
  {
    "id": "A.2.d",
    "group": "A2",
    "label": "Tandu",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.2.d"
  },
  {
    "id": "A.2.e",
    "group": "A2",
    "label": "Peralatan restrain",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.2.e"
  },
  {
    "id": "A.2.f",
    "group": "A2",
    "label": "Kandang portable",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.2.f"
  },
  {
    "id": "A.3.a",
    "group": "A3",
    "label": "Meja dan kursi",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.3.a"
  },
  {
    "id": "A.3.b",
    "group": "A3",
    "label": "Meja dan kursi tamu",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.3.b"
  },
  {
    "id": "A.3.c",
    "group": "A3",
    "label": "Filing cabinet",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.3.c"
  },
  {
    "id": "A.3.d",
    "group": "A3",
    "label": "Rak buku",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.3.d"
  },
  {
    "id": "A.3.e.1",
    "group": "A3",
    "label": "Komputer",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.3.e"
  },
  {
    "id": "A.3.e.2",
    "group": "A3",
    "label": "Printer",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 18,
    "ref": "A.3.e"
  },
  {
    "id": "A.3.f",
    "group": "A3",
    "label": "Kamera",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "A.3.f"
  },
  {
    "id": "A.3.g",
    "group": "A3",
    "label": "Papan tulis",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "A.3.g"
  },
  {
    "id": "A.3.h",
    "group": "A3",
    "label": "Kursi lipat",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "A.3.h"
  },
  {
    "id": "A.3.i",
    "group": "A3",
    "label": "Lemari kaca untuk obat dan peralatan",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "A.3.i"
  },
  {
    "id": "A.4.a",
    "group": "A4",
    "label": "Kendaraan roda empat Puskeswan keliling",
    "kind": "asset",
    "minimum": 1,
    "unit": "unit",
    "page": 19,
    "ref": "A.4.a"
  },
  {
    "id": "A.4.b",
    "group": "A4",
    "label": "Kendaraan roda dua standar",
    "kind": "asset",
    "minimum": 2,
    "unit": "unit",
    "page": 19,
    "ref": "A.4.b"
  },
  {
    "id": "A.4.c",
    "group": "A4",
    "label": "Telepon seluler/telepon",
    "kind": "asset",
    "minimum": 1,
    "unit": "unit",
    "page": 19,
    "ref": "A.4.c"
  },
  {
    "id": "A.4.d",
    "group": "A4",
    "label": "GPS (tertulis GSP dalam pedoman)",
    "kind": "asset",
    "minimum": 1,
    "unit": "unit",
    "page": 19,
    "ref": "A.4.d"
  },
  {
    "id": "A.5.01",
    "group": "A5",
    "label": "Antibiotika",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.02",
    "group": "A5",
    "label": "Antipiretika",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.03",
    "group": "A5",
    "label": "Analgetika",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.04",
    "group": "A5",
    "label": "Adrenalin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.05",
    "group": "A5",
    "label": "Antihistamin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.06",
    "group": "A5",
    "label": "Atropine sulfat",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.07",
    "group": "A5",
    "label": "Corticosteroid",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.08",
    "group": "A5",
    "label": "Sedative",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.09",
    "group": "A5",
    "label": "Anastetikum",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.10",
    "group": "A5",
    "label": "Antidota",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.11",
    "group": "A5",
    "label": "Antitoksin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.12",
    "group": "A5",
    "label": "Cairan infus untuk alkalosis dan asidosis",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.13",
    "group": "A5",
    "label": "Alkohol",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.14",
    "group": "A5",
    "label": "Antiseptik",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.15",
    "group": "A5",
    "label": "Vaksin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.16",
    "group": "A5",
    "label": "Hormon untuk inseminasi buatan",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.17",
    "group": "A5",
    "label": "Pestisida",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.18",
    "group": "A5",
    "label": "Insektisida",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.19",
    "group": "A5",
    "label": "Vitamin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "A.5.20",
    "group": "A5",
    "label": "Mineral",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "A.5"
  },
  {
    "id": "B.1",
    "group": "B",
    "label": "Pakaian lapangan (wearpack)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.1"
  },
  {
    "id": "B.2",
    "group": "B",
    "label": "Jas laboratorium",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.2"
  },
  {
    "id": "B.3",
    "group": "B",
    "label": "Kelengkapan perlindungan diri (PPE)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.3"
  },
  {
    "id": "B.4",
    "group": "B",
    "label": "Sepatu boot panjang",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.4"
  },
  {
    "id": "B.5",
    "group": "B",
    "label": "Topi",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.5"
  },
  {
    "id": "B.6",
    "group": "B",
    "label": "Jas hujan",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.6"
  },
  {
    "id": "B.7",
    "group": "B",
    "label": "Masker",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "B.7"
  },
  {
    "id": "B.8",
    "group": "B",
    "label": "Sarung tangan",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 19,
    "ref": "B.8"
  },
  {
    "id": "B.9",
    "group": "B",
    "label": "Handuk kecil",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 19,
    "ref": "B.9"
  },
  {
    "id": "C.1.a",
    "group": "C1",
    "label": "Stetoscope",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.a"
  },
  {
    "id": "C.1.b",
    "group": "C1",
    "label": "Thermometer",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.b"
  },
  {
    "id": "C.1.c",
    "group": "C1",
    "label": "Percusi hammer",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.c"
  },
  {
    "id": "C.1.d",
    "group": "C1",
    "label": "Infusion set dan tiang infus",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.d"
  },
  {
    "id": "C.1.e",
    "group": "C1",
    "label": "Trocar 12,7 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.e"
  },
  {
    "id": "C.1.f",
    "group": "C1",
    "label": "Zonde",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.f"
  },
  {
    "id": "C.1.g.1",
    "group": "C1",
    "label": "Automatic syringe 1 ml beserta jarum",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.g"
  },
  {
    "id": "C.1.g.2",
    "group": "C1",
    "label": "Automatic syringe 5 ml beserta jarum",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.g"
  },
  {
    "id": "C.1.h",
    "group": "C1",
    "label": "Disposable syringe berbagai ukuran dengan jarum",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 20,
    "ref": "C.1.h"
  },
  {
    "id": "C.1.i",
    "group": "C1",
    "label": "Tuberculine injection set",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.i"
  },
  {
    "id": "C.1.j",
    "group": "C1",
    "label": "Refrigerator AC/DC",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.j"
  },
  {
    "id": "C.1.k",
    "group": "C1",
    "label": "Catheter ukuran 26",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.k"
  },
  {
    "id": "C.1.l",
    "group": "C1",
    "label": "Drenching gun",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.1.l"
  },
  {
    "id": "C.2.a",
    "group": "C2",
    "label": "Pinset",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.a"
  },
  {
    "id": "C.2.b",
    "group": "C2",
    "label": "Tissue Forceps bergigi 14,5 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.b"
  },
  {
    "id": "C.2.c",
    "group": "C2",
    "label": "Dressing Forceps bayonet 14 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.c"
  },
  {
    "id": "C.2.d.1",
    "group": "C2",
    "label": "Scalpel/mata pisau steril",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 20,
    "ref": "C.2.d.1"
  },
  {
    "id": "C.2.d.2",
    "group": "C2",
    "label": "Tangkai pendek 12–14 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.d.2"
  },
  {
    "id": "C.2.d.3",
    "group": "C2",
    "label": "Tangkai panjang 14–17,5 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.d.3"
  },
  {
    "id": "C.2.e.1",
    "group": "C2",
    "label": "Operating scissors",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.1"
  },
  {
    "id": "C.2.e.2",
    "group": "C2",
    "label": "Gunting lurus ujung lekuk 16 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.2"
  },
  {
    "id": "C.2.e.3",
    "group": "C2",
    "label": "Gunting lurus tajam 20 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.3"
  },
  {
    "id": "C.2.e.4",
    "group": "C2",
    "label": "Gunting lurus tumpul tajam 13–15 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.4"
  },
  {
    "id": "C.2.e.5",
    "group": "C2",
    "label": "Gunting bengkok tumpul 13–18 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.5"
  },
  {
    "id": "C.2.e.6",
    "group": "C2",
    "label": "Gunting bengkok tumpul tajam 12,5–16,5 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.6"
  },
  {
    "id": "C.2.e.7",
    "group": "C2",
    "label": "Gunting sudut tumpul 15–17,5 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.e.7"
  },
  {
    "id": "C.2.f.1",
    "group": "C2",
    "label": "Paragon knife handle 20–24 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.f"
  },
  {
    "id": "C.2.f.2",
    "group": "C2",
    "label": "Paragon knife handle 9–12 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.f"
  },
  {
    "id": "C.2.g.1",
    "group": "C2",
    "label": "Arteri Forceps 13–24 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.g.1"
  },
  {
    "id": "C.2.g.2",
    "group": "C2",
    "label": "Dressing Forceps 13 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 20,
    "ref": "C.2.g.2"
  },
  {
    "id": "C.2.h",
    "group": "C2",
    "label": "Cat gut 0,50–0,59 mm",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "C.2.h"
  },
  {
    "id": "C.2.i",
    "group": "C2",
    "label": "Needle Suture otot (bulat) No. 1–8",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "C.2.i"
  },
  {
    "id": "C.2.j",
    "group": "C2",
    "label": "Needle Suture kulit (segitiga) 1–8",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "C.2.j"
  },
  {
    "id": "C.2.k",
    "group": "C2",
    "label": "Pinset (ulangan di lampiran)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.k"
  },
  {
    "id": "C.2.l",
    "group": "C2",
    "label": "Tissue Forceps bergigi 14,5 cm (ulangan)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.l"
  },
  {
    "id": "C.2.m",
    "group": "C2",
    "label": "Dressing Forceps bayonet 14 cm (ulangan)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.m"
  },
  {
    "id": "C.2.n",
    "group": "C2",
    "label": "Tissue Forceps 14,5 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.n"
  },
  {
    "id": "C.2.o",
    "group": "C2",
    "label": "Splinter Forceps 13 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.o"
  },
  {
    "id": "C.2.p",
    "group": "C2",
    "label": "Long disecting Forceps 30 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.p"
  },
  {
    "id": "C.2.q",
    "group": "C2",
    "label": "Dressing Forceps",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.q"
  },
  {
    "id": "C.2.r",
    "group": "C2",
    "label": "Glove (sarung tangan)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "C.2.r"
  },
  {
    "id": "C.2.s",
    "group": "C2",
    "label": "Bone Cutting (gunting tulang)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.s"
  },
  {
    "id": "C.2.t",
    "group": "C2",
    "label": "Needle holder 14–20 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "C.2.t"
  },
  {
    "id": "C.2.u",
    "group": "C2",
    "label": "Mata pisau (detachable blade)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "C.2.u"
  },
  {
    "id": "D.1",
    "group": "D",
    "label": "Kapas",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.1"
  },
  {
    "id": "D.2",
    "group": "D",
    "label": "Kasa",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.2"
  },
  {
    "id": "D.3",
    "group": "D",
    "label": "Alkohol",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.3"
  },
  {
    "id": "D.4",
    "group": "D",
    "label": "Glyserin buffer",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.4"
  },
  {
    "id": "D.5",
    "group": "D",
    "label": "Formalin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.5"
  },
  {
    "id": "D.6",
    "group": "D",
    "label": "Rivanol",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.6"
  },
  {
    "id": "D.7",
    "group": "D",
    "label": "Perhidrol (H2O2)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.7"
  },
  {
    "id": "D.8",
    "group": "D",
    "label": "Aquadest",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.8"
  },
  {
    "id": "D.9",
    "group": "D",
    "label": "PK (Permanganat kalicus)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.9"
  },
  {
    "id": "D.10",
    "group": "D",
    "label": "Plester",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.10"
  },
  {
    "id": "D.11",
    "group": "D",
    "label": "Perban",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.11"
  },
  {
    "id": "D.12",
    "group": "D",
    "label": "Lodium (istilah sumber)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 21,
    "ref": "D.12"
  },
  {
    "id": "E.1",
    "group": "E",
    "label": "Mikroskop binokuler",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "E.1"
  },
  {
    "id": "E.2",
    "group": "E",
    "label": "Mikrotiter/peralatan pemeriksaan serologis titer ND",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "E.2"
  },
  {
    "id": "E.3",
    "group": "E",
    "label": "Paratus 20 ml",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "E.3"
  },
  {
    "id": "E.4",
    "group": "E",
    "label": "Nier becker",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 21,
    "ref": "E.4"
  },
  {
    "id": "E.5",
    "group": "E",
    "label": "Tabung reaksi (volume 10, 15 dan 20 ml)",
    "kind": "asset",
    "minimum": 20,
    "unit": "buah",
    "page": 22,
    "ref": "E.5"
  },
  {
    "id": "E.6",
    "group": "E",
    "label": "Rak tabung reaksi",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.6"
  },
  {
    "id": "E.7",
    "group": "E",
    "label": "Rapid Test Kit (antara lain AI, Rabies, Brucellosis/RBT)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.7"
  },
  {
    "id": "E.8",
    "group": "E",
    "label": "Meja laboratorium",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.8"
  },
  {
    "id": "E.9",
    "group": "E",
    "label": "Botol spesimen",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.9"
  },
  {
    "id": "E.10",
    "group": "E",
    "label": "Cawan Petri",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.10"
  },
  {
    "id": "E.11",
    "group": "E",
    "label": "Gelas objek",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.11"
  },
  {
    "id": "E.12",
    "group": "E",
    "label": "Pipet",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.12"
  },
  {
    "id": "E.13",
    "group": "E",
    "label": "Centrifuge",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.13"
  },
  {
    "id": "E.14",
    "group": "E",
    "label": "Tabung centrifuge",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.14"
  },
  {
    "id": "E.15",
    "group": "E",
    "label": "Microhaematocrite",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.15"
  },
  {
    "id": "E.16",
    "group": "E",
    "label": "Pinset",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.16"
  },
  {
    "id": "E.17",
    "group": "E",
    "label": "Tissue forceps bergigi 14,5 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.17"
  },
  {
    "id": "E.18",
    "group": "E",
    "label": "Dressing forceps bayonet 14 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.18"
  },
  {
    "id": "E.19.a",
    "group": "E",
    "label": "Botol kaca bakteri 50 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.a"
  },
  {
    "id": "E.19.b",
    "group": "E",
    "label": "Botol kaca viral 50 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.b"
  },
  {
    "id": "E.19.c",
    "group": "E",
    "label": "Botol plastik parasiter 100 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.c"
  },
  {
    "id": "E.19.d",
    "group": "E",
    "label": "Botol plastik patologi 100 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.d"
  },
  {
    "id": "E.19.e",
    "group": "E",
    "label": "Botol plastik faeces 50 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.e"
  },
  {
    "id": "E.19.f",
    "group": "E",
    "label": "Tabung kaca serum 10 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.f"
  },
  {
    "id": "E.19.g",
    "group": "E",
    "label": "Venoject tube 10 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.g"
  },
  {
    "id": "E.19.h",
    "group": "E",
    "label": "Venoject needle 21G x 11/5",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "E.19.h"
  },
  {
    "id": "E.19.i",
    "group": "E",
    "label": "Venoject holder",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 22,
    "ref": "E.19.i"
  },
  {
    "id": "F.1.a",
    "group": "F",
    "label": "Alkohol 70% (patologi)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "F.1.a"
  },
  {
    "id": "F.1.b",
    "group": "F",
    "label": "Formalin 10% (patologi)",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "F.1.b"
  },
  {
    "id": "F.2",
    "group": "F",
    "label": "Pewarnaan Gram",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "F.2"
  },
  {
    "id": "F.3",
    "group": "F",
    "label": "Bahan HA dan HI",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "F.3"
  },
  {
    "id": "F.4.a",
    "group": "F",
    "label": "KOH",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 22,
    "ref": "F.4.a"
  },
  {
    "id": "F.4.b",
    "group": "F",
    "label": "Na citrat",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "F.4.b"
  },
  {
    "id": "F.4.c",
    "group": "F",
    "label": "Pewarnaan Giemsa",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "F.4.c"
  },
  {
    "id": "F.4.d",
    "group": "F",
    "label": "Heparin",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "F.4.d"
  },
  {
    "id": "F.4.e",
    "group": "F",
    "label": "EDTA",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "F.4.e"
  },
  {
    "id": "F.5",
    "group": "F",
    "label": "Bahan Rose Bengal Test",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "F.5"
  },
  {
    "id": "G.1.a",
    "group": "G",
    "label": "Botol kaca bakteri 50 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.1.a"
  },
  {
    "id": "G.1.b",
    "group": "G",
    "label": "Botol kaca viral 50 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.1.b"
  },
  {
    "id": "G.2.a",
    "group": "G",
    "label": "Botol plastik parasiter 100 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.2.a"
  },
  {
    "id": "G.2.b",
    "group": "G",
    "label": "Botol plastik patologi 100 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.2.b"
  },
  {
    "id": "G.2.c",
    "group": "G",
    "label": "Botol plastik faeces 50 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.2.c"
  },
  {
    "id": "G.3",
    "group": "G",
    "label": "Tabung kaca serum 10 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.3"
  },
  {
    "id": "G.4",
    "group": "G",
    "label": "Cotton Swab",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.4"
  },
  {
    "id": "G.5.a",
    "group": "G",
    "label": "Venoject tube 10 cc",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.5.a"
  },
  {
    "id": "G.5.b",
    "group": "G",
    "label": "Venoject needle 21G x 11/5",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.5.b"
  },
  {
    "id": "G.5.c",
    "group": "G",
    "label": "Venoject holder",
    "kind": "asset",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.5.c"
  },
  {
    "id": "G.6.1",
    "group": "G",
    "label": "Disposable syringe 5 ml",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.6"
  },
  {
    "id": "G.6.2",
    "group": "G",
    "label": "Disposable syringe 10 ml",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.6"
  },
  {
    "id": "G.7",
    "group": "G",
    "label": "Tas untuk peralatan",
    "kind": "asset",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.7"
  },
  {
    "id": "G.8",
    "group": "G",
    "label": "Thermos es besar dan ice case",
    "kind": "asset",
    "minimum": null,
    "unit": null,
    "page": 23,
    "ref": "G.8"
  },
  {
    "id": "H.1",
    "group": "H",
    "label": "Forceps for caesarian section + serrated rubber jaws",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.1"
  },
  {
    "id": "H.2",
    "group": "H",
    "label": "Finger knife 15,5 cm, 4 1/5",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.2"
  },
  {
    "id": "H.3",
    "group": "H",
    "label": "Obstetric hooks-key schooter 21 cm, 8,25 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.3"
  },
  {
    "id": "H.4",
    "group": "H",
    "label": "Eye hooks 6,5–8 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.4"
  },
  {
    "id": "H.5",
    "group": "H",
    "label": "Double obstetric hooks 14 cm",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.5"
  },
  {
    "id": "H.6",
    "group": "H",
    "label": "Wire saws in coil of 13 yards in plastic box",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.6"
  },
  {
    "id": "H.7",
    "group": "H",
    "label": "Handle for embryotomi wire saw with butterfly screw",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.7"
  },
  {
    "id": "H.8",
    "group": "H",
    "label": "Obstetric chain handle 80 cm, 3,5” (sebagaimana tertulis)",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 23,
    "ref": "H.8"
  },
  {
    "id": "H.9",
    "group": "H",
    "label": "Obstetric chain handle 190 cm, 75”",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.9"
  },
  {
    "id": "H.10.a",
    "group": "H",
    "label": "Rope carries light pattern",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.10.a"
  },
  {
    "id": "H.10.b",
    "group": "H",
    "label": "Rope carries strong pattern",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.10.b"
  },
  {
    "id": "H.11",
    "group": "H",
    "label": "Insemination gun",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.11"
  },
  {
    "id": "H.12",
    "group": "H",
    "label": "Kontainer semen beku",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.12"
  },
  {
    "id": "H.13",
    "group": "H",
    "label": "Straw",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 24,
    "ref": "H.13"
  },
  {
    "id": "H.14",
    "group": "H",
    "label": "Tas peralatan operasional inseminator",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.14"
  },
  {
    "id": "H.15",
    "group": "H",
    "label": "Vagina speculum",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "H.15"
  },
  {
    "id": "I.1.a",
    "group": "I",
    "label": "Bordozzo tang kecil",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "I.1.a"
  },
  {
    "id": "I.1.b",
    "group": "I",
    "label": "Bordozzo tang besar",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "I.1.b"
  },
  {
    "id": "I.2.a",
    "group": "I",
    "label": "Hoof knife – right hand",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "I.2.a"
  },
  {
    "id": "I.2.b",
    "group": "I",
    "label": "Hoof knife – left hand",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "I.2.b"
  },
  {
    "id": "I.2.c",
    "group": "I",
    "label": "Hoof and claw cutting plier",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "I.2.c"
  },
  {
    "id": "J.1",
    "group": "J",
    "label": "Ear marking plier",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.1"
  },
  {
    "id": "J.2",
    "group": "J",
    "label": "Tatooning forceps",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.2"
  },
  {
    "id": "J.3",
    "group": "J",
    "label": "Castraction knife",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.3"
  },
  {
    "id": "J.4",
    "group": "J",
    "label": "Debeaker",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.4"
  },
  {
    "id": "J.5",
    "group": "J",
    "label": "Shear master",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.5"
  },
  {
    "id": "J.6",
    "group": "J",
    "label": "Timbangan ternak",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.6"
  },
  {
    "id": "J.7.a",
    "group": "J",
    "label": "Elastrator",
    "kind": "asset",
    "minimum": null,
    "unit": "unit",
    "page": 24,
    "ref": "J.7.a"
  },
  {
    "id": "J.7.b",
    "group": "J",
    "label": "Rubber rings",
    "kind": "stock",
    "minimum": null,
    "unit": null,
    "page": 24,
    "ref": "J.7.b"
  }
].map(Object.freeze));
