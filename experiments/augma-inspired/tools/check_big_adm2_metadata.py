#!/usr/bin/env python3
"""Offline metadata preflight for a manually supplied BIG ADM2 layer snapshot.

Does not download features or certify vintage, boundaries, or redistributability.
"""
import argparse
import json
import sys
from pathlib import Path

SOURCE = 'https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0'
REQUIRED_FIELDS = {'OBJECTID', 'KDPKAB', 'WADMKK', 'WADMPR', 'NAMOBJ'}
MAX_BYTES = 128_000


def inspect_layer(metadata):
    issues = []
    if not isinstance(metadata, dict):
        return {'status': 'REJECTED', 'issues': ['Metadata wajib objek JSON'],
                'source': SOURCE, 'legal_boundary_verified': False, 'license_verified': False}
    if 'error' in metadata:
        issues.append('Metadata layanan melaporkan error')
    if metadata.get('geometryType') != 'esriGeometryPolygon':
        issues.append('Layer bukan poligon')
    formats = metadata.get('supportedQueryFormats')
    if not isinstance(formats, str) or 'geojson' not in formats.casefold().replace(' ', ''):
        issues.append('Dukungan query GeoJSON belum terbukti')
    extent = metadata.get('extent')
    spatial = extent.get('spatialReference') if isinstance(extent, dict) else None
    if not isinstance(spatial, dict) or spatial.get('wkid') != 4326:
        issues.append('Extent layer belum menyatakan EPSG:4326')
    fields = metadata.get('fields')
    if not isinstance(fields, list):
        issues.append('Daftar atribut tidak ada')
        names, oid = set(), []
    else:
        names = {f.get('name') for f in fields if isinstance(f, dict) and isinstance(f.get('name'), str)}
        oid = [f.get('name') for f in fields if isinstance(f, dict) and f.get('type') == 'esriFieldTypeOID']
    missing = sorted(REQUIRED_FIELDS - names)
    if missing:
        issues.append('Atribut wajib hilang: ' + ', '.join(missing))
    if oid != ['OBJECTID']:
        issues.append('Field ObjectID tidak cocok atau tidak unik')
    capabilities = metadata.get('capabilities')
    if capabilities is not None and (
        not isinstance(capabilities, str) or
        'query' not in {v.strip().casefold() for v in capabilities.split(',')}
    ):
        issues.append('Kapabilitas Query tidak tersedia')
    return {
        'status': 'REJECTED' if issues else 'METADATA_STRUCTURE_PASS_REVIEW_REQUIRED',
        'issues': issues, 'source': SOURCE,
        'required_fields_present': not missing,
        'legal_boundary_verified': False, 'license_verified': False,
        'dataset_edition_verified': False,
        'note': 'No feature data fetched; BIG catalogue record version and reuse rights require human confirmation.'
    }


def catalogue_conflict(publication, edition, claimed_predecessor):
    """Compare YYYY-MM strings from separately transcribed catalogue metadata.

    A claimed predecessor newer than the edition or later than publication is
    a metadata inconsistency, NOT a proof that the official dataset is invalid.
    """
    from datetime import date
    def parse(value):
        if not isinstance(value, str) or len(value) != 7 or value[4] != '-':
            raise ValueError('Tanggal edisi wajib YYYY-MM')
        year, month = int(value[:4]), int(value[5:])
        if not (1 <= month <= 12):
            raise ValueError('Bulan tidak valid')
        return date(year, month, 1)
    p, e, pred = map(parse, (publication, edition, claimed_predecessor))
    inconsistent = pred > e or e > p
    return {
        'status': 'CATALOGUE_CONFLICT_REVIEW_REQUIRED' if inconsistent else 'DATE_ORDER_CONSISTENT_NOT_VERIFIED',
        'publication_month': publication,
        'claimed_edition_month': edition,
        'claimed_predecessor_month': claimed_predecessor,
        'dataset_edition_verified': False,
        'manual_clarification_required': inconsistent,
    }


def inspect_file(path):
    path = Path(path)
    if path.is_symlink() or path.stat().st_size > MAX_BYTES:
        raise ValueError('Metadata symlink / ukuran melebihi batas')
    data = json.loads(path.read_text(encoding='utf-8'))
    return inspect_layer(data)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('metadata_json', type=Path, help='Saved local ArcGIS layer metadata, NOT a URL')
    args = parser.parse_args(argv)
    try:
        result = inspect_file(args.metadata_json)
    except (OSError, ValueError, UnicodeError, json.JSONDecodeError) as exc:
        result = {'status': 'REJECTED', 'issues': [str(exc)],
                  'legal_boundary_verified': False, 'license_verified': False}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result['status'] == 'METADATA_STRUCTURE_PASS_REVIEW_REQUIRED' else 1


if __name__ == '__main__':
    sys.exit(main())
