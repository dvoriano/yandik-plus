"""Per-section Puskeswan profile changes, with review and optimistic versioning.

Offline prototype: no HTTP endpoints, database, external systems or deployment.
Only explicitly approved changes enter the verified profile read model.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, replace
from datetime import date, datetime
from enum import Enum

from .access import Action, Principal, ResourceScope, permitted
from .contracts import ContractError, FixtureBundle, required_id
from .masterdata import MasterData, ProfileDatum, validate_master


# These are profile fields already represented in the synthetic master-data model.
# APEL and SDM are linked by Puskeswan ID, NOT edited through the profile form.
SECTION_FIELDS: dict[str, tuple[str, ...]] = {
    "legalitas": ("legalitas_status",),
    "bangunan": ("bangunan_kondisi",),
    "peralatan": ("peralatan_kondisi",),
    "obat_bhp": ("obat_bhp_ketersediaan",),
    "wilayah_kerja": ("wilayah_kerja_keterangan",),
}
SECTION_LABELS = {
    "legalitas": "Legalitas",
    "bangunan": "Bangunan",
    "peralatan": "Peralatan klinik",
    "obat_bhp": "Obat dan BHP",
    "wilayah_kerja": "Wilayah kerja",
}


class ProfileDenied(PermissionError):
    """Actor or area is not authorized for this change."""


class VersionConflict(ContractError):
    """A stale form attempted to overwrite a newer revision."""


class ChangeState(str, Enum):
    DRAF = "draf"
    DIAJUKAN = "diajukan"
    PERLU_PERBAIKAN = "perlu_perbaikan"
    DISETUJUI = "disetujui"
    DITOLAK = "ditolak"


@dataclass(frozen=True, slots=True)
class ProfileEvent:
    actor_id: str
    action: str
    before: ChangeState
    after: ChangeState
    at_iso: str
    version: int
    fields: tuple[str, ...] = ()
    reason: str = ""


@dataclass(frozen=True, slots=True)
class ProfileChange:
    change_id: str
    scope: ResourceScope
    owner_user_id: str
    section: str
    fields: tuple[tuple[str, str | None], ...] = ()
    state: ChangeState = ChangeState.DRAF
    version: int = 0
    history: tuple[ProfileEvent, ...] = ()


@dataclass(frozen=True, slots=True)
class SectionSummary:
    section: str
    label: str
    status: str
    terakhir_diperbarui: date | None
    bisa_diperbarui: bool


def _time(at: datetime) -> str:
    if not isinstance(at, datetime) or at.tzinfo is None or at.utcoffset() is None:
        raise ContractError("a timezone-aware event timestamp is required")
    return at.isoformat()


def _version(change: ProfileChange, expected_version: int) -> None:
    if type(expected_version) is not int or expected_version != change.version:
        raise VersionConflict("profile form is out of date; reload before saving")


def _owner(change: ProfileChange, actor: Principal) -> None:
    if (
        actor.user_id != change.owner_user_id
        or not permitted(actor, Action.EDIT_PROFILE, change.scope)
    ):
        raise ProfileDenied("only the authorized submitting Puskeswan may edit")


def begin_profile_change(
    change_id: str,
    scope: ResourceScope,
    section: str,
    owner: Principal,
) -> ProfileChange:
    """Start a one-section draft. Actual facility identity is never editable here."""
    required_id({"change_id": change_id}, "change_id")
    if section not in SECTION_FIELDS:
        raise ContractError("unknown profile section")
    if not permitted(owner, Action.EDIT_PROFILE, scope):
        raise ProfileDenied("actor cannot edit this Puskeswan")
    return ProfileChange(change_id, scope, owner.user_id, section)


def patch_profile_change(
    change: ProfileChange,
    actor: Principal,
    edits: Mapping[str, str | None],
    *,
    expected_version: int,
    at: datetime,
    reason: str = "",
) -> ProfileChange:
    """Edit only fields in the chosen section; None explicitly marks unknown."""
    _version(change, expected_version)
    _owner(change, actor)
    if change.state not in {ChangeState.DRAF, ChangeState.PERLU_PERBAIKAN}:
        raise ContractError("only draft or correction may be edited")
    timestamp = _time(at)
    if not isinstance(edits, Mapping) or not edits:
        raise ContractError("at least one profile field must be supplied")
    allowed_fields = set(SECTION_FIELDS[change.section])
    current = dict(change.fields)
    for key, value in edits.items():
        if key not in allowed_fields:
            raise ContractError("field does not belong to this profile section")
        if value is not None:
            if not isinstance(value, str) or not 1 <= len(value) <= 200:
                raise ContractError("profile values must be short text or null")
            if value != value.strip() or not value.strip():
                raise ContractError("profile values must not be blank")
        if value is None and not reason.strip():
            raise ContractError("clearing a field requires an explanation")
        current[key] = value
    new_fields = tuple(sorted(current.items()))
    if new_fields == change.fields:
        raise ContractError("profile patch did not change any fields")
    version = change.version + 1
    event = ProfileEvent(
        actor.user_id, "edit", change.state, change.state, timestamp,
        version, tuple(sorted(edits)), reason.strip(),
    )
    return replace(change, fields=new_fields, version=version, history=change.history + (event,))


def submit_profile_change(
    change: ProfileChange,
    actor: Principal,
    *,
    expected_version: int,
    at: datetime,
) -> ProfileChange:
    _version(change, expected_version)
    _owner(change, actor)
    if change.state not in {ChangeState.DRAF, ChangeState.PERLU_PERBAIKAN}:
        raise ContractError("profile change is not available for submission")
    if not change.fields:
        raise ContractError("nothing has been updated in this profile section")
    version = change.version + 1
    event = ProfileEvent(
        actor.user_id, "submit", change.state, ChangeState.DIAJUKAN,
        _time(at), version, tuple(k for k, _ in change.fields),
    )
    return replace(
        change, state=ChangeState.DIAJUKAN, version=version,
        history=change.history + (event,),
    )


def review_profile_change(
    change: ProfileChange,
    reviewer: Principal,
    decision: ChangeState,
    *,
    expected_version: int,
    at: datetime,
    reason: str = "",
) -> ProfileChange:
    """Reviewer must be authorized for this Puskeswan and not the owner."""
    _version(change, expected_version)
    if not permitted(reviewer, Action.VERIFY_PROFILE, change.scope):
        raise ProfileDenied("reviewer cannot verify this Puskeswan")
    if reviewer.user_id == change.owner_user_id:
        raise ProfileDenied("a submitter cannot verify their own change")
    if change.state is not ChangeState.DIAJUKAN:
        raise ContractError("only submitted profile changes can be reviewed")
    if decision not in {
        ChangeState.DISETUJUI, ChangeState.PERLU_PERBAIKAN, ChangeState.DITOLAK,
    }:
        raise ContractError("unsupported review decision")
    if decision is not ChangeState.DISETUJUI and not reason.strip():
        raise ContractError("review correction/rejection requires an explanation")
    version = change.version + 1
    event = ProfileEvent(
        reviewer.user_id, "review", change.state, decision,
        _time(at), version, tuple(k for k, _ in change.fields), reason.strip(),
    )
    return replace(
        change, state=decision, version=version, history=change.history + (event,),
    )


def apply_approved_profile_change(
    master: MasterData,
    bundle: FixtureBundle,
    change: ProfileChange,
    *,
    effective_on: date,
) -> MasterData:
    """Append verified observations, never mutate the earlier master snapshot.

    The current example persistence supports one observation per field/day.
    A real database needs change_id uniqueness and transactions as well.
    """
    if change.state is not ChangeState.DISETUJUI:
        raise ContractError("unapproved change cannot update verified master")
    if type(effective_on) is not date:
        raise ContractError("effective date must be a calendar date")
    reviews = [
        event for event in change.history
        if event.action == "review" and event.after is ChangeState.DISETUJUI
    ]
    if len(reviews) != 1:
        raise ContractError("missing approval audit event")
    approved_at = datetime.fromisoformat(reviews[0].at_iso).date()
    if effective_on < approved_at:
        raise ContractError("effective date cannot predate approval")
    if not change.fields:
        raise ContractError("approved change has no profile fields")
    facilities = {p.puskeswan_id: p for p in bundle.puskeswan}
    facility = facilities.get(change.scope.puskeswan_id)
    if facility is None or facility.kab_kota != change.scope.kab_kota:
        raise ContractError("unknown or mismatched Puskeswan scope")
    validate_master(master, bundle)
    additions = tuple(
        ProfileDatum(
            puskeswan_id=change.scope.puskeswan_id,
            bidang=key,
            nilai=value,
            observed_on=effective_on,
            sumber="profiling",
            terverifikasi=True,
        )
        for key, value in change.fields
    )
    result = replace(master, profil=master.profil + additions)
    validate_master(result, bundle)
    return result


def profile_section_summaries(
    master: MasterData,
    bundle: FixtureBundle,
    scope: ResourceScope,
    actor: Principal,
    *,
    at: date,
) -> tuple[SectionSummary, ...]:
    """Simple mobile-friendly section statuses, not a webpage implementation."""
    if type(at) is not date:
        raise ContractError("at must be a calendar date")
    if not permitted(actor, Action.VIEW_PROFILE, scope):
        raise ProfileDenied("not authorized to read profile")
    validate_master(master, bundle)
    facilities = {p.puskeswan_id: p for p in bundle.puskeswan}
    facility = facilities.get(scope.puskeswan_id)
    if facility is None or facility.kab_kota != scope.kab_kota:
        raise ProfileDenied("Puskeswan scope does not match master")
    latest: dict[str, ProfileDatum] = {}
    for record in master.profil:
        if record.puskeswan_id != scope.puskeswan_id or record.observed_on > at:
            continue
        previous = latest.get(record.bidang)
        if previous is None or record.observed_on > previous.observed_on:
            latest[record.bidang] = record
    can_edit = permitted(actor, Action.EDIT_PROFILE, scope)
    result: list[SectionSummary] = []
    for section, keys in SECTION_FIELDS.items():
        records = [latest[k] for k in keys if k in latest]
        if not records or any(x.nilai is None for x in records):
            status = "belum_lengkap"
        elif all(x.terverifikasi for x in records) and len(records) == len(keys):
            status = "terverifikasi"
        else:
            status = "perlu_verifikasi"
        newest = max((x.observed_on for x in records), default=None)
        result.append(SectionSummary(section, SECTION_LABELS[section], status, newest, can_edit))
    return tuple(result)
