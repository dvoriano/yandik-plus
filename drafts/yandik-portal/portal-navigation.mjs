/** Portal routing: DOM stays mounted. No auth, storage or cross-tab state. */
export const GROUPS=Object.freeze([
  {
    "id": "layanan",
    "label": "Pelayanan & pelaporan",
    "sections": [
      "layanan",
      "koreksi",
      "pembinaan"
    ],
    "modules": [
      "MOD-02"
    ]
  },
  {
    "id": "profil-sdm",
    "label": "Profil & SDM",
    "sections": [
      "layanan",
      "profil-sdm"
    ],
    "modules": [
      "MOD-01",
      "MOD-03"
    ]
  },
  {
    "id": "inventaris",
    "label": "Inventaris tahunan",
    "sections": [
      "inventaris"
    ],
    "modules": [
      "MOD-01"
    ]
  },
  {
    "id": "dukungan",
    "label": "Support Puskeswan",
    "sections": [
      "dukungan"
    ],
    "modules": [
      "MOD-04"
    ]
  },
  {
    "id": "pengawasan",
    "label": "Pengawasan & layanan teknis",
    "sections": [
      "pengawasan"
    ],
    "modules": [
      "MOD-05",
      "MOD-06",
      "MOD-07",
      "MOD-08"
    ]
  },
  {
    "id": "kegiatan",
    "label": "Pembinaan & Bimtek",
    "sections": [
      "kegiatan",
      "coach-list"
    ],
    "modules": [
      "MOD-09"
    ]
  },
  {
    "id": "administrasi",
    "label": "Administrasi kegiatan",
    "sections": [
      "coach-list",
      "administrasi"
    ],
    "modules": [
      "MOD-10"
    ]
  },
  {
    "id": "pimpinan",
    "label": "Dashboard pimpinan",
    "sections": [
      "pimpinan"
    ],
    "modules": [
      "MOD-11"
    ]
  },
  {
    "id": "wilayah",
    "label": "GIS & cakupan wilayah",
    "sections": [
      "wilayah"
    ],
    "modules": [
      "MOD-12"
    ]
  },
  {
    "id": "pustaka",
    "label": "Pustaka digital",
    "sections": [
      "pustaka",
      "library-faq",
      "library-issues"
    ],
    "modules": [
      "MOD-13"
    ]
  },
  {
    "id": "notifikasi",
    "label": "Notifikasi",
    "sections": [
      "notifikasi"
    ],
    "modules": [
      "MOD-14"
    ]
  },
  {
    "id": "mode-lapangan",
    "label": "Mode lapangan",
    "sections": [
      "mode-lapangan"
    ],
    "modules": [
      "MOD-14"
    ]
  }
].map(g=>Object.freeze({...g,sections:Object.freeze(g.sections),modules:Object.freeze(g.modules)})));
const aliases=Object.freeze({"koreksi":"layanan","pembinaan":"layanan","coach-list":"kegiatan","library-faq":"pustaka","library-issues":"pustaka"});
export function resolveRoute(hash=""){const id=String(hash).replace(/^#/,"");const direct=GROUPS.find(g=>g.id===id);const alias=Object.hasOwn(aliases,id)?aliases[id]:null;const group=direct??GROUPS.find(g=>g.id===alias)??GROUPS[0];return {group,target:direct||alias?id:group.id};}
export const sectionIds=()=>[...new Set(GROUPS.flatMap(g=>g.sections))];
