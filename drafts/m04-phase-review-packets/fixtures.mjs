/** YANDIK+ M04-S9Q | HANYA FIXTURE DEMO. KODE DITULIS, BELUM DIUJI. */
import {MATERIAL_MATRIX_DEMO,HANDOFF_DEMO}
  from "../m04-material-gap-sequence/fixtures.mjs";
import {buildMaterialGapSequence}
  from "../m04-material-gap-sequence/sequence.mjs";
export const SEQUENCE_DEMO=
  buildMaterialGapSequence(MATERIAL_MATRIX_DEMO,HANDOFF_DEMO);
export {HANDOFF_DEMO};
