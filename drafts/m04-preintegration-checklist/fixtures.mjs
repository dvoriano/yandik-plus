/** M04-S9F | FIXTURE DEMO, KODE DITULIS BELUM DIUJI. */
import {AGENDA_DEMO,REGISTER_DEMO}
  from "../m04-institutional-oversight/fixtures.mjs";
import {buildOversight} from "../m04-institutional-oversight/oversight.mjs";
export const BOARD_DEMO=buildOversight(AGENDA_DEMO,REGISTER_DEMO,"2026-11-11");
export const CONTEXT_DEMO=Object.freeze({
  mode:"CODE_ONLY",repo_visibility:"public",repo_observed_on:"2026-11-11",
  authorized_testing:false,production_connected:false,
});
