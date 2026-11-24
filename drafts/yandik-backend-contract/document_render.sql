-- CODE_ONLY | Rendered draft snapshot per immutable document revision, no migration.
CREATE TABLE contract_document_render (
 record_id TEXT NOT NULL,
 revision INTEGER NOT NULL CHECK(revision>0),
 template_version TEXT NOT NULL,
 render_json TEXT NOT NULL,
 render_digest TEXT NOT NULL CHECK(length(render_digest)=64),
 PRIMARY KEY(record_id,revision),
 FOREIGN KEY(record_id,revision) REFERENCES contract_document_source(document_id,document_revision)
);
CREATE TRIGGER contract_document_render_update_deny BEFORE UPDATE ON contract_document_render BEGIN SELECT RAISE(ABORT,'RENDER_IMMUTABLE'); END;
CREATE TRIGGER contract_document_render_delete_deny BEFORE DELETE ON contract_document_render BEGIN SELECT RAISE(ABORT,'RENDER_IMMUTABLE'); END;
