/** M04-S9P | HANYA FIXTURE DEMO. KODE DITULIS, BELUM DIUJI. */
import {HANDOFF_DEMO,OPEN_QUESTIONS_DEMO}
  from "../m04-evidence-readiness-matrix/fixtures.mjs";
import {buildEvidenceReadinessMatrix}
  from "../m04-evidence-readiness-matrix/readiness.mjs";
export const MATERIAL_MATRIX_DEMO=
  buildEvidenceReadinessMatrix(OPEN_QUESTIONS_DEMO,HANDOFF_DEMO);
export {HANDOFF_DEMO};
