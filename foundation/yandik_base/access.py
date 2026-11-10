"""Fail-closed roles and regional access for offline YANDIK+ prototypes.

This is NOT wired into the existing Flask website.
"""
from dataclasses import dataclass
from enum import Enum


class Role(str, Enum):
    PROVINSI_ADMIN = "provinsi_admin"
    PROVINSI_VERIFIKATOR = "provinsi_verifikator"
    KAB_KOTA = "kab_kota"
    PUSKESWAN = "puskeswan"
    PIMPINAN = "pimpinan"


class Action(str, Enum):
    VIEW_PROFILE = "view_profile"
    EDIT_PROFILE = "edit_profile"
    VIEW_NEED = "view_need"
    SUBMIT_NEED = "submit_need"
    SUBMIT_APEL = "submit_apel"
    VERIFY_NEED = "verify_need"
    RECORD_FOLLOWUP = "record_followup"
    VIEW_AGGREGATE = "view_aggregate"


@dataclass(frozen=True, slots=True)
class Principal:
    user_id: str
    role: Role
    kab_kota: str | None = None
    puskeswan_id: str | None = None


@dataclass(frozen=True, slots=True)
class ResourceScope:
    puskeswan_id: str
    kab_kota: str


def permitted(actor: Principal, action: Action, resource: ResourceScope | None = None) -> bool:
    """Default deny. Aggregated permission NEVER grants individual record access."""
    if not isinstance(actor.role, Role) or not isinstance(action, Action):
        return False
    if not isinstance(actor.user_id, str) or not actor.user_id:
        return False
    if action is Action.VIEW_AGGREGATE:
        return actor.role in {
            Role.PROVINSI_ADMIN, Role.PROVINSI_VERIFIKATOR,
            Role.KAB_KOTA, Role.PIMPINAN,
        }
    if not isinstance(resource, ResourceScope):
        return False
    if not resource.puskeswan_id or not resource.kab_kota:
        return False
    if actor.role is Role.PROVINSI_ADMIN:
        return action in {
            Action.VIEW_PROFILE, Action.EDIT_PROFILE,
            Action.VIEW_NEED, Action.RECORD_FOLLOWUP,
        }
    if actor.role is Role.PROVINSI_VERIFIKATOR:
        return action in {Action.VIEW_PROFILE, Action.VIEW_NEED, Action.VERIFY_NEED}
    if actor.role is Role.KAB_KOTA:
        return actor.kab_kota == resource.kab_kota and action in {
            Action.VIEW_PROFILE, Action.VIEW_NEED, Action.VERIFY_NEED,
        }
    if actor.role is Role.PUSKESWAN:
        return (
            actor.kab_kota == resource.kab_kota
            and actor.puskeswan_id == resource.puskeswan_id
            and action in {
                Action.VIEW_PROFILE, Action.EDIT_PROFILE, Action.VIEW_NEED,
                Action.SUBMIT_NEED, Action.SUBMIT_APEL,
            }
        )
    return False
