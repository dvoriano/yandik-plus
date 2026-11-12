/** M04-S9N | KODE DITULIS, BELUM DIUJI. Synthetic demo source only. */
import {RECAP_DEMO,AGENDA_DEMO}
  from "../m04-human-review-handoff/fixtures.mjs";
import {buildHumanReviewHandoff}
  from "../m04-human-review-handoff/handoff.mjs";
export const HANDOFF_DEMO=buildHumanReviewHandoff(RECAP_DEMO,AGENDA_DEMO);
