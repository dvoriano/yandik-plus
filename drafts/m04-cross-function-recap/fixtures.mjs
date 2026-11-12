/** M04-S9L | FIXTURE SYNTHETIC ONLY. KODE DITULIS, BELUM DIUJI. */
import {AGENDA_DEMO,CONFIRMATION_VIEW_DEMO}
  from "../m04-proposed-followups/fixtures.mjs";
import {buildProposedFollowups}
  from "../m04-proposed-followups/followups.mjs";
export const FOLLOWUP_DEMO=buildProposedFollowups(CONFIRMATION_VIEW_DEMO,AGENDA_DEMO);
