"""Synthetic master-data contracts linking Puskeswan, SDM, sarpras and APEL.

Offline-only prototype. No live database, uploads, APIs, credentials or
government approvals. Missing source data is NOT treated as a measured zero.
"""

from __future__ import annotations

import re
from collections import defaultdict
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

from .contracts import (
    ContractError,
    FixtureBundle,
    _load_list,
    period_ok,
    required_id,
    required_text,
    reporting_status,
    validate_bundle,
)

DATE_FORMAT = re.compile(r"^\d{4}-\d{2}-\d{2}$")
STAFF_KINDS = frozenset({"dokter_hewan", "paramedik"})
ASSET_KINDS = frozenset({"alat_klinik", "bangunan", "obat_bhp", "rantai_dingin"})
ASSET_CONDITIONS = frozenset({"baik", "rusak", "perlu_perbaikan", "belum_diketahui"})
PROFILE_FIELDS = frozenset({
    "legalitas_status", "bangunan_kondisi", "obat_bhp_ketersediaan",
    "peralatan_kondisi", "wilayah_kerja_keterangan",
})
DATA_SOURCES = frozenset({"profiling", "sdm", "observasi", "survei"})


def _date(value: Any, field: str) -> date:
    if not isinstance(value, str) or not DATE_FORMAT.fullmatch(value):
        raise ContractError(f"{field} must be an ISO YYYY-MM-DD date")
    try:
        parsed = date.fromisoformat(value)
    except ValueError as exc:
        raise ContractError(f"{field} is not a calendar date") from exc
    if not 2000 <= parsed.year <= 2100:
        raise ContractError(f"{field} outside supported planning years")
    return parsed


def _row(row: Any, entity: str) -> Mapping[str, Any]:
    if not isinstance(row, Mapping):
        raise ContractError(f"{entity} must be a mapping")
    return row


@dataclass(frozen=True, slots=True)
class Staff:
    sdm_id: str
    jenis: str
    aktif: bool

    @classmethod
    def parse(cls, source: Any) -> Staff:
        row = _row(source, "SDM")
        kind = required_text(row, "jenis")
        if kind not in STAFF_KINDS:
            raise ContractError("unsupported SDM category")
        active = row.get("aktif")
        if type(active) is not bool:
            raise ContractError("SDM aktif must be boolean")
        return cls(required_id(row, "sdm_id"), kind, active)


@dataclass(frozen=True, slots=True)
class Placement:
    placement_id: str
    sdm_id: str
    puskeswan_id: str
    mulai: date
    selesai: date | None

    @classmethod
    def parse(cls, source: Any) -> Placement:
        row = _row(source, "placement")
        start = _date(row.get("mulai"), "mulai")
        end_raw = row.get("selesai")
        end = _date(end_raw, "selesai") if end_raw is not None else None
        if end is not None and end < start:
            raise ContractError("placement end earlier than start")
        return cls(
            required_id(row, "placement_id"),
            required_id(row, "sdm_id"),
            required_id(row, "puskeswan_id"),
            start,
            end,
        )

    def covers(self, day: date) -> bool:
        return self.mulai <= day and (self.selesai is None or day <= self.selesai)


@dataclass(frozen=True, slots=True)
class AssetObservation:
    asset_id: str
    puskeswan_id: str
    kategori: str
    kondisi: str
    observed_on: date
    sumber: str
    terverifikasi: bool

    @classmethod
    def parse(cls, source: Any) -> AssetObservation:
        row = _row(source, "asset observation")
        category = required_text(row, "kategori")
        condition = required_text(row, "kondisi")
        origin = required_text(row, "sumber")
        if category not in ASSET_KINDS or condition not in ASSET_CONDITIONS:
            raise ContractError("invalid asset kind or condition")
        if origin not in DATA_SOURCES:
            raise ContractError("unsupported observation source")
        verified = row.get("terverifikasi")
        if type(verified) is not bool:
            raise ContractError("asset verification must be boolean")
        return cls(
            required_id(row, "asset_id"),
            required_id(row, "puskeswan_id"),
            category,
            condition,
            _date(row.get("observed_on"), "observed_on"),
            origin,
            verified,
        )


@dataclass(frozen=True, slots=True)
class ProfileDatum:
    puskeswan_id: str
    bidang: str
    nilai: str | None
    observed_on: date
    sumber: str
    terverifikasi: bool

    @classmethod
    def parse(cls, source: Any) -> ProfileDatum:
        row = _row(source, "profile data")
        field = required_text(row, "bidang")
        if field not in PROFILE_FIELDS:
            raise ContractError("unsupported profile field")
        value = row.get("nilai")
        if value is not None and (not isinstance(value, str) or not value.strip()):
            raise ContractError("profile value must be text or null")
        if isinstance(value, str) and value != value.strip():
            raise ContractError("profile value cannot have outer spaces")
        origin = required_text(row, "sumber")
        if origin not in DATA_SOURCES:
            raise ContractError("unsupported profile source")
        verified = row.get("terverifikasi")
        if type(verified) is not bool:
            raise ContractError("profile verification must be boolean")
        return cls(
            required_id(row, "puskeswan_id"),
            field,
            value,
            _date(row.get("observed_on"), "observed_on"),
            origin,
            verified,
        )


@dataclass(frozen=True, slots=True)
class MasterData:
    sdm: tuple[Staff, ...]
    penempatan: tuple[Placement, ...]
    sarpras: tuple[AssetObservation, ...]
    profil: tuple[ProfileDatum, ...]


@dataclass(frozen=True, slots=True)
class FacilityOverview:
    puskeswan_id: str
    nama: str
    kab_kota: str
    periode: str
    sdm_tercatat: Mapping[str, int]
    pelayanan_bulanan: Mapping[str, int] | None
    sarpras_tercatat: int
    sarpras_butuh_perhatian: int
    profil_terverifikasi: tuple[str, ...]
    profil_belum_terverifikasi: tuple[str, ...]
    kebutuhan_tercatat: int

    @property
    def sudah_melapor(self) -> bool:
        return self.pelayanan_bulanan is not None


def validate_master(master: MasterData, bundle: FixtureBundle) -> None:
    """Referential integrity and histories for demo entities only."""
    validate_bundle(bundle)
    facilities = {f.puskeswan_id for f in bundle.puskeswan}
    staff_ids = [s.sdm_id for s in master.sdm]
    if len(staff_ids) != len(set(staff_ids)):
        raise ContractError("duplicated SDM identifier")
    staff = set(staff_ids)
    placement_ids: set[str] = set()
    by_person: dict[str, list[Placement]] = defaultdict(list)
    for placement in master.penempatan:
        if placement.placement_id in placement_ids:
            raise ContractError("duplicated placement identifier")
        placement_ids.add(placement.placement_id)
        if placement.sdm_id not in staff:
            raise ContractError("placement references unknown SDM")
        if placement.puskeswan_id not in facilities:
            raise ContractError("placement references unknown Puskeswan")
        by_person[placement.sdm_id].append(placement)
    for placements in by_person.values():
        for earlier, later in zip(
            sorted(placements, key=lambda p: p.mulai),
            sorted(placements, key=lambda p: p.mulai)[1:],
        ):
            if earlier.selesai is None or later.mulai <= earlier.selesai:
                raise ContractError("overlapping placement periods for SDM")

    observation_keys: set[tuple[str, date]] = set()
    asset_registry: dict[str, tuple[str, str]] = {}
    for asset in master.sarpras:
        if asset.puskeswan_id not in facilities:
            raise ContractError("asset references unknown Puskeswan")
        key = (asset.asset_id, asset.observed_on)
        if key in observation_keys:
            raise ContractError("duplicated asset observation date")
        observation_keys.add(key)
        identity = (asset.puskeswan_id, asset.kategori)
        if asset.asset_id in asset_registry and asset_registry[asset.asset_id] != identity:
            raise ContractError("asset identity changed facility or category")
        asset_registry[asset.asset_id] = identity

    profile_keys: set[tuple[str, str, date]] = set()
    for field in master.profil:
        if field.puskeswan_id not in facilities:
            raise ContractError("profile references unknown Puskeswan")
        key = (field.puskeswan_id, field.bidang, field.observed_on)
        if key in profile_keys:
            raise ContractError("duplicated profile observation date")
        profile_keys.add(key)


def load_master_data(folder: Path, bundle: FixtureBundle) -> MasterData:
    """Load synthetic fixtures only, without touching runtime data."""
    master = MasterData(
        sdm=tuple(Staff.parse(row) for row in _load_list(folder, "sdm.json")),
        penempatan=tuple(
            Placement.parse(row) for row in _load_list(folder, "penempatan.json")
        ),
        sarpras=tuple(
            AssetObservation.parse(row) for row in _load_list(folder, "sarpras.json")
        ),
        profil=tuple(
            ProfileDatum.parse(row) for row in _load_list(folder, "profil.json")
        ),
    )
    validate_master(master, bundle)
    return master


def facility_overview(
    master: MasterData,
    bundle: FixtureBundle,
    puskeswan_id: str,
    period: str,
    observed_on: str,
) -> FacilityOverview:
    """Assemble joined read model. Counts describe records, not confirmed capacity."""
    validate_master(master, bundle)
    if not period_ok(period):
        raise ContractError("invalid monthly reporting period")
    day = _date(observed_on, "observed_on")
    if period > day.strftime("%Y-%m"):
        raise ContractError("cannot view a future reporting period")
    facilities = {f.puskeswan_id: f for f in bundle.puskeswan}
    if puskeswan_id not in facilities:
        raise ContractError("unknown Puskeswan")
    facility = facilities[puskeswan_id]
    staff = {s.sdm_id: s for s in master.sdm}
    assigned = [
        staff[p.sdm_id]
        for p in master.penempatan
        if p.puskeswan_id == puskeswan_id
        and p.covers(day)
        and staff[p.sdm_id].aktif
    ]
    staff_counts = {kind: sum(s.jenis == kind for s in assigned) for kind in sorted(STAFF_KINDS)}
    latest_assets: dict[str, AssetObservation] = {}
    for item in master.sarpras:
        if item.puskeswan_id != puskeswan_id or item.observed_on > day:
            continue
        previous = latest_assets.get(item.asset_id)
        if previous is None or previous.observed_on < item.observed_on:
            latest_assets[item.asset_id] = item
    current_fields: dict[str, ProfileDatum] = {}
    for item in master.profil:
        if item.puskeswan_id != puskeswan_id or item.observed_on > day:
            continue
        previous = current_fields.get(item.bidang)
        if previous is None or previous.observed_on < item.observed_on:
            current_fields[item.bidang] = item
    good = tuple(sorted(
        name for name, item in current_fields.items()
        if item.terverifikasi and item.nilai is not None
    ))
    unverified = tuple(sorted(PROFILE_FIELDS - set(good)))
    reports = reporting_status(bundle, period)
    service = reports[puskeswan_id]
    return FacilityOverview(
        puskeswan_id=facility.puskeswan_id,
        nama=facility.nama,
        kab_kota=facility.kab_kota,
        periode=period,
        sdm_tercatat=staff_counts,
        pelayanan_bulanan=dict(service) if service is not None else None,
        sarpras_tercatat=len(latest_assets),
        sarpras_butuh_perhatian=sum(
            a.kondisi in {"rusak", "perlu_perbaikan"} for a in latest_assets.values()
        ),
        profil_terverifikasi=good,
        profil_belum_terverifikasi=unverified,
        kebutuhan_tercatat=sum(
            n.puskeswan_id == puskeswan_id
            and n.status in {"draf", "diajukan", "diverifikasi"}
            for n in bundle.needs
        ),
    )
