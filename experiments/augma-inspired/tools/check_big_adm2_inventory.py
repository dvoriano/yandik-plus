#!/usr/bin/env python3
"""Offline, attribute-only BIG ADM2 inventory preflight for West Sumatra.

No ArcGIS requests, no geometry downloads, no legal boundary certification.
Accepts a saved ArcGIS JSON returnGeometry=false feature response.
"""
import argparse
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

MAX_RESPONSE_BYTES = 256_000
REGEX_REGION = re.compile(r'\bcode:\s*"(13\.\d{2})",\s*name:\s*"([^"]+)"')
VALID_CODES = re.compile(r'13\.(?:0[1-9]|1[0-2]|7[1-7])\Z')


def registry_names(path):
    source = Path(path).read_text(encoding='utf-8')
    matches = REGEX_REGION.findall(source)
    names = dict(matches)
    if len(matches) != 19 or len(names) != 19 or any(not VALID_CODES.fullmatch(c) for c in names):
        raise ValueError('Registry lab harus 19 kode kabupaten/kota Sumbar yang unik')
    return names


def normalize_name(text):
    return ' '.join(re.sub(r'[^\w\s]', ' ', unicodedata.normalize('NFKC', text).casefold()).split())


def canonical_code(value):
    if not isinstance(value, str):
        return None
    raw = value.strip()
    if VALID_CODES.fullmatch(raw):
        return raw
    if re.fullmatch(r'13(?:0[1-9]|1[0-2]|7[1-7])', raw):
        return raw[:2] + '.' + raw[2:]
    return None


def inspect_inventory(document, names):
    result = {'schema': 'yandik.lab.big-attribute-inventory.v1',
              'status': 'REJECTED', 'source_data_verified': False,
              'geometry_verified': False, 'legal_boundary_verified': False,
              'redistribution_permission_verified': False,
              'errors': [], 'region_count': 0, 'region_codes': []}
    err = result['errors']
    if not isinstance(document, dict) or 'error' in document:
        err.append('Respons inventaris ArcGIS tidak valid atau berisi error')
        return result
    features = document.get('features')
    if not isinstance(features, list):
        err.append('features wajib array')
        return result
    if document.get('exceededTransferLimit') is True:
        err.append('Batas transfer ArcGIS tercapai; inventaris mungkin terpotong')
    if document.get('objectIdFieldName', 'OBJECTID') != 'OBJECTID':
        err.append('Nama kolom ObjectID tidak cocok')
    if len(features) != 19:
        err.append('Inventaris wajib tepat 19 fitur; ditemukan ' + str(len(features)))
    seen, object_ids = set(), set()
    for i, feature in enumerate(features):
        if not isinstance(feature, dict):
            err.append(f'Fitur {i}: bukan objek')
            continue
        if feature.get('geometry') is not None:
            err.append(f'Fitur {i}: geometri tidak boleh disertakan dalam pratinjau atribut')
            continue
        attrs = feature.get('attributes')
        if not isinstance(attrs, dict):
            err.append(f'Fitur {i}: attributes wajib objek')
            continue
        oid = attrs.get('OBJECTID')
        if type(oid) is not int or oid < 1 or oid in object_ids:
            err.append(f'Fitur {i}: OBJECTID hilang/duplikat/tidak valid')
        else:
            object_ids.add(oid)
        code = canonical_code(attrs.get('KDPKAB'))
        if code not in names:
            err.append(f'Fitur {i}: kode KDPKAB di luar registry Sumbar')
            continue
        if code in seen:
            err.append(f'Fitur {i}: kode kabupaten/kota duplikat {code}')
        seen.add(code)
        province = attrs.get('WADMPR')
        if not isinstance(province, str) or normalize_name(province) != 'sumatera barat':
            err.append(f'Fitur {i}: bukan provinsi Sumatera Barat')
        actual = attrs.get('WADMKK')
        expected = names[code]
        short = expected.split(' ', 1)[-1]
        if not isinstance(actual, str) or normalize_name(actual) not in (normalize_name(expected), normalize_name(short)):
            err.append(f'Fitur {i}: nama wilayah tidak cocok untuk {code}')
        expected_type = 5 if expected.startswith('Kota ') else 4
        if type(attrs.get('TIPADM')) is not int or attrs.get('TIPADM') != expected_type:
            err.append(f'Fitur {i}: TIPADM kabupaten/kota tidak cocok untuk {code}')
    missing = sorted(set(names) - seen)
    if missing:
        err.append('Kode wilayah tidak ditemukan: ' + ', '.join(missing))
    result['region_count'] = len(seen)
    result['region_codes'] = sorted(seen)
    if not err:
        result['status'] = 'ATTRIBUTE_INVENTORY_PASS_REVIEW_REQUIRED'
    return result


def inspect_file(file_path, registry_path):
    path = Path(file_path)
    registry = Path(registry_path)
    if path.is_symlink() or registry.is_symlink():
        raise ValueError('Symlink file inventaris/registry tidak diizinkan')
    if path.stat().st_size > MAX_RESPONSE_BYTES:
        raise ValueError('Inventaris lebih dari 256 kB')
    names = registry_names(registry)
    raw = path.read_bytes()
    data = json.loads(raw)
    result = inspect_inventory(data, names)
    result['input_sha256'] = hashlib.sha256(raw).hexdigest()
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('inventory_json', type=Path)
    parser.add_argument('--registry', type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        output = inspect_file(args.inventory_json, args.registry)
    except (OSError, ValueError, UnicodeError, TypeError) as exc:
        output = {'status': 'REJECTED', 'errors': [str(exc)], 'geometry_verified': False,
                  'legal_boundary_verified': False, 'redistribution_permission_verified': False}
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0 if output['status'] == 'ATTRIBUTE_INVENTORY_PASS_REVIEW_REQUIRED' else 1


if __name__ == '__main__':
    sys.exit(main())
