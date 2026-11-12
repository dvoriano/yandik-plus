"""Immutable, append-only workflow prototype. NOT official government approval."""
from dataclasses import dataclass, replace
from datetime import datetime
from enum import Enum
from .access import Action, Principal, ResourceScope, Role, permitted


class WorkflowError(ValueError):
    """Invalid state transition or missing audit explanation."""


class WorkflowDenied(PermissionError):
    """The actor is not authorized for this transition."""


class State(str, Enum):
    DRAF = "draf"
    DIAJUKAN = "diajukan"
    DALAM_VERIFIKASI = "dalam_verifikasi"
    PERLU_PERBAIKAN = "perlu_perbaikan"
    DIVERIFIKASI = "diverifikasi"
    DITOLAK = "ditolak"
    DITINDAKLANJUTI = "ditindaklanjuti"
    SELESAI = "selesai"
    DIBATALKAN = "dibatalkan"


ALLOWED = {
    State.DRAF: {State.DIAJUKAN, State.DIBATALKAN},
    State.DIAJUKAN: {State.DALAM_VERIFIKASI, State.DIBATALKAN},
    State.DALAM_VERIFIKASI: {State.PERLU_PERBAIKAN, State.DIVERIFIKASI, State.DITOLAK},
    State.PERLU_PERBAIKAN: {State.DIAJUKAN, State.DIBATALKAN},
    State.DIVERIFIKASI: {State.DITINDAKLANJUTI},
    State.DITINDAKLANJUTI: {State.SELESAI},
    State.SELESAI: set(),
    State.DITOLAK: set(),
    State.DIBATALKAN: set(),
}
APPLICANT = {
    (State.DRAF, State.DIAJUKAN),
    (State.PERLU_PERBAIKAN, State.DIAJUKAN),
    (State.DRAF, State.DIBATALKAN),
    (State.DIAJUKAN, State.DIBATALKAN),
    (State.PERLU_PERBAIKAN, State.DIBATALKAN),
}
REVIEWER = {
    (State.DIAJUKAN, State.DALAM_VERIFIKASI),
    (State.DALAM_VERIFIKASI, State.PERLU_PERBAIKAN),
    (State.DALAM_VERIFIKASI, State.DIVERIFIKASI),
    (State.DALAM_VERIFIKASI, State.DITOLAK),
}
FOLLOWUP = {
    (State.DIVERIFIKASI, State.DITINDAKLANJUTI),
    (State.DITINDAKLANJUTI, State.SELESAI),
}
REASON_REQUIRED = {State.PERLU_PERBAIKAN, State.DITOLAK, State.DIBATALKAN}


@dataclass(frozen=True, slots=True)
class AuditEvent:
    actor_id: str
    before: State
    after: State
    at_iso: str
    reason: str


@dataclass(frozen=True, slots=True)
class WorkItem:
    case_id: str
    scope: ResourceScope
    owner_user_id: str
    state: State = State.DRAF
    history: tuple[AuditEvent, ...] = ()


def advance(
    item: WorkItem,
    target: State,
    actor: Principal,
    at: datetime,
    *,
    reason: str = "",
) -> WorkItem:
    if not isinstance(target, State) or target not in ALLOWED.get(item.state, set()):
        raise WorkflowError("transition not permitted")
    if not isinstance(at, datetime) or at.tzinfo is None or at.utcoffset() is None:
        raise WorkflowError("timezone-aware timestamp is required")
    pair = (item.state, target)
    if pair in APPLICANT:
        allowed = (
            actor.user_id == item.owner_user_id
            and permitted(actor, Action.SUBMIT_NEED, item.scope)
        )
    elif pair in REVIEWER:
        allowed = permitted(actor, Action.VERIFY_NEED, item.scope)
    elif pair in FOLLOWUP:
        allowed = (
            actor.role is Role.PROVINSI_ADMIN
            and permitted(actor, Action.RECORD_FOLLOWUP, item.scope)
        )
    else:
        allowed = False
    if not allowed:
        raise WorkflowDenied("not authorized for this workflow step")
    if target in REASON_REQUIRED and not reason.strip():
        raise WorkflowError("reason required for this transition")
    event = AuditEvent(actor.user_id, item.state, target, at.isoformat(), reason.strip())
    return replace(item, state=target, history=item.history + (event,))
