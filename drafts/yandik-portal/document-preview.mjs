/** CODE_ONLY | Structured preview from pinned server render. No print/export/sign. */
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
export function mountDocumentPreview(parent,row){
 const doc=row.document_render;
 if(!doc){parent.append(el("p","Draf terstruktur belum tersedia."));return;}
 if(doc.official_authorization!==false||doc.may_sign!==false||doc.may_send!==false||doc.document_id!==row.record_id||doc.document_revision!==row.revision||doc.source_revision!==row.snapshot?.source_revision||!Array.isArray(doc.sections)){parent.append(el("p","Preview tidak tersedia: kontrak draf tidak sesuai."));return;}
 const article=el("article");article.className="paperless-preview";article.setAttribute("aria-label","Draf administrasi DEMO");
 const top=el("p",doc.notice);top.className="paperless-notice";article.append(top,el("h3",doc.title),el("p","Template "+doc.template_version+" · Versi "+doc.draft_version+" · Revisi "+doc.document_revision),el("p","Sumber "+doc.activity_id+" · revisi "+doc.source_revision));
 if(row.source_changed)article.append(el("p","SUMBER BERUBAH · bukan draf terkini"));
 if(row.revision!==row.current_revision)article.append(el("p","REVISI HISTORIS · baca saja"));
 for(const s of doc.sections){
  const section=el("section");section.append(el("h4",s.title));
  if(s.rows.length){const dl=el("dl");for(const r of s.rows)dl.append(el("dt",r.label),el("dd",r.value));section.append(dl);}
  for(const t of s.paragraphs)section.append(el("p",t));article.append(section);
 }
 article.append(el("p","DRAF DEMO · tanpa nomor resmi, tanda tangan, pengesahan atau pengiriman."));
 parent.append(article);
}
