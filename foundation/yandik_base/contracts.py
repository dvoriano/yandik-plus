"""Offline, standalone data contracts for YANDIK+ development.

This module does NOT modify or replace APEL production calculations.
One report = one Puskeswan + one calendar month. Empty is not zero.
All records used here are synthetic fixtures, not actual public data.
"""

from __future__ import annotations

import json
import re
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ID_RE = re.compile(r"^[A-Z0-9][A-Z0-9._-]{2,63}$")
PERIOD_RE = re.compile(r"^\d{4}-(?:0[1-9]|1[0-2])$")
COUNT_NAME_RE = re.compile(r"^[a-z][a-z0-9_]*$")
SUPPORT_KINDS = frozenset({"alat_klinik", "obat_bhp", "rantai_dingin", "lainnya"})
SUPPORT_STATES = frozenset({"draf", "diajukan", "diverifikasi", "ditolak"})


class ContractError(ValueError):
    """A fixture violates a domain contract; never include secret data in errors."""


def required_text(record: Mapping[str, Any], field: str) -> str:
    value = record.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ContractError(f"field {field!r} must be non-empty text")
    if value != value.strip():
        raise ContractError(f"field {field!r} contains outer spaces")
    return value


def required_id(record: Mapping[str, Any], field: str) -> str:
    value = required_text(record, field)
    if not ID_RE.fullmatch(value):
        raise ContractError(f"field {field!r} is not a valid stable identifier")
    return value


def period_ok(value: str) -> bool:
    return bool(PERIOD_RE.fullmatch(value)) and 2000 <= int(value[:4]) <= 2100


@dataclass(frozen=True, slots=True)
class Puskeswan:
    puskeswan_id: str
    nama: str
    kab_kota: str
    status: str

    @classmethod
    def parse(cls, row: Mapping[str, Any]) -> Puskeswan:
        if not isinstance(row, Mapping):
            raise ContractError("Puskeswan row must be a mapping")
        status = required_text(row, "status")
        if status not in {"aktif", "nonaktif"}:
            raise ContractError("unsupported Puskeswan status")
        return cls(
            puskeswan_id=required_id(row, "puskeswan_id"),
            nama=required_text(row, "nama"),
            kab_kota=required_text(row, "kab_kota"),
            status=status,
        )


@dataclass(frozen=True, slots=True)
class APELMonthly:
    puskeswan_id: str
    periode: str
    jumlah_layanan: Mapping[str, int]

    @classmethod
    def parse(cls, row: Mapping[str, Any]) -> APELMonthly:
        if not isinstance(row, Mapping):
            raise ContractError("APEL row must be a mapping")
        period = required_text(row, "periode")
        if not period_ok(period):
            raise ContractError("periode must use YYYY-MM")
        values = row.get("jumlah_layanan")
        if not isinstance(values, Mapping) or not values:
            raise ContractError("jumlah_layanan must be a non-empty mapping")
        clean: dict[str, int] = {}
        for name, value in values.items():
            if not isinstance(name, str) or not COUNT_NAME_RE.fullmatch(name):
                raise ContractError("invalid service category identifier")
            if type(value) is not int or value < 0:
                raise ContractError("service counts must be non-negative integers")
            clean[name] = value
        return cls(required_id(row, "puskeswan_id"), period, clean)


@dataclass(frozen=True, slots=True)
class SupportNeed:
    need_id: str
    puskeswan_id: str
    kategori: str
    jumlah: int
    status: str

    @classmethod
    def parse(cls, row: Mapping[str, Any]) -> SupportNeed:
        if not isinstance(row, Mapping):
            raise ContractError("support row must be a mapping")
        kind = required_text(row, "kategori")
        state = required_text(row, "status")
        amount = row.get("jumlah")
        if kind not in SUPPORT_KINDS:
            raise ContractError("unsupported support need category")
        if state not in SUPPORT_STATES:
            raise ContractError("unsupported support need status")
        if type(amount) is not int or amount < 1:
            raise ContractError("support quantity must be a positive integer")
        return cls(
            need_id=required_id(row, "need_id"),
            puskeswan_id=required_id(row, "puskeswan_id"),
            kategori=kind,
            jumlah=amount,
            status=state,
        )


@dataclass(frozen=True, slots=True)
class FixtureBundle:
    puskeswan: tuple[Puskeswan, ...]
    reports: tuple[APELMonthly, ...]
    needs: tuple[SupportNeed, ...]


def validate_bundle(bundle: FixtureBundle) -> None:
    ids = [p.puskeswan_id for p in bundle.puskeswan]
    if not ids or len(ids) != len(set(ids)):
        raise ContractError("empty or duplicated Puskeswan identifiers")
    available = set(ids)
    report_keys: set[tuple[str, str]] = set()
    for report in bundle.reports:
        if report.puskeswan_id not in available:
            raise ContractError("report has unknown Puskeswan identifier")
        key = (report.puskeswan_id, report.periode)
        if key in report_keys:
            raise ContractError("duplicate monthly report for one Puskeswan")
        report_keys.add(key)
    need_ids: set[str] = set()
    for need in bundle.needs:
        if need.puskeswan_id not in available:
            raise ContractError("support need has unknown Puskeswan identifier")
        if need.need_id in need_ids:
            raise ContractError("duplicated support need identifier")
        need_ids.add(need.need_id)


def _load_list(folder: Path, filename: str) -> list[dict[str, Any]]:
    path = folder / filename
    if path.is_symlink() or not path.is_file():
        raise ContractError(f"fixture {filename!r} is unavailable")
    try:
        content = json.loads(path.read_text(encoding="utf-8"))
    except (UnicodeError, ValueError, OSError) as exc:
        raise ContractError(f"fixture {filename!r} is invalid JSON") from exc
    if not isinstance(content, list):
        raise ContractError(f"fixture {filename!r} must be an array")
    return content


def load_fixture_bundle(folder: Path) -> FixtureBundle:
    """Load demo-only JSON. No database, Flask or external API calls."""
    bundle = FixtureBundle(
        puskeswan=tuple(
            Puskeswan.parse(row) for row in _load_list(folder, "puskeswan.json")
        ),
        reports=tuple(
            APELMonthly.parse(row) for row in _load_list(folder, "apel_monthly.json")
        ),
        needs=tuple(
            SupportNeed.parse(row) for row in _load_list(folder, "support_needs.json")
        ),
    )
    validate_bundle(bundle)
    return bundle


def reporting_status(
    bundle: FixtureBundle, period: str
) -> dict[str, Mapping[str, int] | None]:
    """Return counts or None for a missing report. Zero counts are valid.

    This is NOT an official total-pelayanan formula. Different service
    categories must not be summed without the approved APEL rules.
    """
    if not period_ok(period):
        raise ContractError("periode must use YYYY-MM")
    result: dict[str, Mapping[str, int] | None] = {
        p.puskeswan_id: None for p in bundle.puskeswan
    }
    for report in bundle.reports:
        if report.periode == period:
            result[report.puskeswan_id] = dict(report.jumlah_layanan)
    return result
