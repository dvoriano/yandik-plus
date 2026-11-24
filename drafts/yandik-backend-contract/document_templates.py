"""K4-C7 | CODE_ONLY. Deterministic structured DEMO document templates.
No legal form, signature, file export, official number, or delivery.
"""
from apel_payload import require
from coachdoc_payload import DOC_TYPES,EVIDENCE
VERSION="DEMO-PAPERLESS-ID-V1"
NOTICE="DRAF DEMO | BUKAN DOKUMEN RESMI"
MONTHS=("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember")
WORDS={
 "HASIL_TERCATAT_DEMO":"Hasil tercatat (DEMO)",
 "PERLU_PENDALAMAN_DEMO":"Memerlukan pendalaman (DEMO)",
 "PERBARUI_DATA_DEMO":"Pembaruan data (DEMO)",
 "PEMBINAAN_LANJUT_DEMO":"Pembinaan lanjutan (DEMO)",
 "TELAAH_TEKNIS_DEMO":"Telaah teknis (DEMO)",
 "TINDAK_LANJUT_TERCATAT_DEMO":"Tindak lanjut tercatat (DEMO)",
 "HASIL_DITELAAH_DEMO":"Hasil ditelaah (DEMO)",
 "PLANNED":"Direncanakan",
 "RESULT_DRAFT":"Hasil draf",
 "FOLLOWUP_OPEN":"Tindak lanjut terbuka",
 "CLOSED_DEMO":"Ditutup DEMO",
 "DRAFT":"Draf",
 "CORRECTION":"Perlu koreksi",
 "REVIEW":"Dalam telaah",
 "ARCHIVED_DEMO":"Arsip DEMO",
}
def shown(v):
    if v is None:return "Belum tercatat"
    return WORDS.get(v,v) if isinstance(v,str) else str(v)
def date_text(v):
    if v is None:return "Belum tercatat"
    y,m,d=v.split("-");return f"{int(d)} {MONTHS[int(m)-1]} {y}"
def section(title,rows=(),paragraphs=()):
    return {"title":title,"rows":[{"label":k,"value":shown(v)} for k,v in rows],"paragraphs":list(paragraphs)}
def render(s,identity,document_id,revision,version=VERSION):
    require(version==VERSION and s["kind"] in DOC_TYPES,"TEMPLATE_VERSION_INVALID")
    r=s["snapshot"];kind=s["kind"]
    require(r["result"] is not None and r["attendance"] is not None,"RESULT_REQUIRED")
    event=[("Puskeswan",identity["facility_label"]),("Wilayah",identity["region_label"]),("Jenis kegiatan",r["type"]),("Topik",r["topic"]),("Tanggal kegiatan",date_text(r["date"]))]
    results=[("Rencana peserta",r["planned"]),("Kehadiran aktual",r["attendance"]),("Tanggal pencatatan hasil",date_text(r["recorded_on"])),("Hasil kegiatan",r["result"])]
    follow=[("Rekomendasi",r["recommendation"]),("Tenggat",date_text(r["due"])),("Penyelesaian",r["completion"]),("Tanggal penyelesaian",date_text(r["completed_on"]))]
    attachments=section("Kelengkapan metadata bukti",[(k,next((x["ref"] for x in s["evidence"] if x["kind"]==k),None)) for k in EVIDENCE],["Referensi sintetis, bukan berkas bukti yang diverifikasi."])
    if kind=="HASIL":
        sections=[section("I. Identitas kegiatan",event),section("II. Pelaksanaan dan hasil",results),section("III. Rekomendasi dan tindak lanjut",follow),attachments]
    elif kind=="BA":
        sections=[section("I. Keterangan kegiatan",event+[("Nomor berita acara","[Belum ditetapkan]")]),section("II. Catatan pelaksanaan",results,["Catatan ini disusun dari hasil kegiatan yang tercatat pada revisi sumber."]),section("III. Catatan tindak lanjut",follow),attachments,section("IV. Pihak terkait",[( "Pihak pertama","[Belum ditetapkan]"),("Pihak kedua","[Belum ditetapkan]")],["Belum ada pengesahan atau tanda tangan."])]
    elif kind=="PENGANTAR":
        sections=[section("Keterangan surat",[( "Nomor surat","[Belum ditetapkan]"),("Tanggal surat","[Belum ditetapkan]"),("Tujuan","[Belum ditetapkan]"),("Perihal","Penyampaian draf hasil kegiatan"),("Lampiran resmi","[Belum ditetapkan]")]),section("Isi pengantar",event,["Draf ini disiapkan sebagai bahan penyampaian hasil kegiatan untuk ditelaah oleh pihak berwenang."]),section("Ringkasan bahan yang disampaikan",[("Hasil kegiatan",r["result"]),("Rekomendasi",r["recommendation"])]),attachments,section("Penutup",paragraphs=["Draf belum dikirim. Identitas penandatangan dan tujuan surat menunggu penetapan melalui proses resmi."])]
    else:
        sections=[section("I. Identitas kegiatan",event),section("II. Matriks tindak lanjut",follow+[("Tahap kegiatan sumber",r["stage"])]),section("III. Catatan evaluasi",[("Hasil kegiatan",r["result"]),("Kehadiran aktual",r["attendance"])],["Status penyelesaian mengikuti revisi sumber, bukan penilaian otomatis."]),attachments]
    return {"notice":NOTICE,"title":DOC_TYPES[kind].upper(),"template_version":version,"document_id":document_id,"document_revision":revision,"draft_version":s["version"],"stage":s["stage"],"activity_id":identity["activity_id"],"source_revision":s["source_revision"],"identity":dict(identity),"sections":sections,"official_authorization":False,"may_sign":False,"may_send":False}
def as_text(doc):
    lines=[doc["notice"],doc["title"],f"Template {doc['template_version']} | Versi draf {doc['draft_version']} | Revisi dokumen {doc['document_revision']}",f"Sumber {doc['activity_id']} revisi {doc['source_revision']}","Status: "+shown(doc["stage"])]
    for s in doc["sections"]:
        lines.extend(["",s["title"]])
        lines.extend(f"{r['label']}: {r['value']}" for r in s["rows"])
        lines.extend(s["paragraphs"])
    lines.extend(["",doc["notice"],"Tanpa nomor resmi, tanda tangan, pengesahan atau pengiriman."])
    return "\n".join(lines)
