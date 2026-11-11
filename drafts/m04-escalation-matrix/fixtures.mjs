/**
 * M04-S6 | KODE DITULIS, BELUM DIUJI.
 * One M04-S5 ticket is reported solely within DEMO in-memory fixtures.
 */
import { TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,TASK_ID_DEMO,
  REPORTER_DEMO,COMPLAINT_DEMO } from "../m04-admin-escalations/fixtures.mjs";
import { createEscalationBook,openEscalation,reportEscalation } from "../m04-admin-escalations/escalations.mjs";
export { TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO };
const draft=openEscalation(createEscalationBook(),TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
  TASK_ID_DEMO,COMPLAINT_DEMO,REPORTER_DEMO);
export const BOOK_DEMO=reportEscalation(draft,"DEMO-ESK-001",TASKS_DEMO,REGISTER_DEMO,
  DOSSIER_DEMO,REPORTER_DEMO);
export const TICKET_ID_DEMO="DEMO-ESK-001";
export const COORDINATOR_DEMO={
  role:"koordinator_matriks_demo",id:"DEMO-KOORDINATOR-MATRIX-01",
};
export const REVIEWER_DEMO={
  role:"penelaah_matriks_demo",id:"DEMO-PENELAAH-MATRIX-02",
};
export const DEFAULT_NOTE={
  reason:"Rute awal dibahas untuk mengidentifikasi pihak yang dapat membantu klarifikasi metadata fiktif.",
  source_note:"Identitas penerbit dan isi surat belum dibuktikan, sehingga keputusan resmi tetap di luar simulasi.",
};
