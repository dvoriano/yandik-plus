import json
import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path
sys_path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_big_adm2_metadata import (inspect_layer, inspect_file, catalogue_conflict)


def sample():
    return {'geometryType': 'esriGeometryPolygon',
            'supportedQueryFormats': 'JSON, geoJSON',
            'extent': {'spatialReference': {'wkid': 4326}},
            'fields': [{'name': key, 'type': 'esriFieldTypeOID' if key == 'OBJECTID' else 'esriFieldTypeString'}
                       for key in ('OBJECTID', 'KDPKAB', 'WADMKK', 'WADMPR', 'NAMOBJ')],
            'capabilities': 'Map,Query,Data'}


class BigSourcePreflightTests(unittest.TestCase):
    def test_expected_layer_metadata_passes_structure_only(self):
        result = inspect_layer(sample())
        self.assertEqual(result['status'], 'METADATA_STRUCTURE_PASS_REVIEW_REQUIRED')
        self.assertFalse(result['legal_boundary_verified'])
        self.assertFalse(result['license_verified'])
        self.assertFalse(result['dataset_edition_verified'])

    def test_reject_service_error_payload(self):
        bad = sample(); bad['error'] = {'code': 403}
        self.assertEqual(inspect_layer(bad)['status'], 'REJECTED')

    def test_reject_non_polygon_layer(self):
        bad = sample(); bad['geometryType'] = 'esriGeometryPoint'
        self.assertEqual(inspect_layer(bad)['status'], 'REJECTED')

    def test_reject_missing_identity_field(self):
        bad = sample(); bad['fields'].pop()
        self.assertIn('NAMOBJ', ' '.join(inspect_layer(bad)['issues']))

    def test_reject_wrong_objectid(self):
        bad = sample(); bad['fields'][0]['name'] = 'fid'
        self.assertEqual(inspect_layer(bad)['status'], 'REJECTED')

    def test_reject_wrong_crs(self):
        bad = sample(); bad['extent']['spatialReference']['wkid'] = 3857
        self.assertEqual(inspect_layer(bad)['status'], 'REJECTED')

    def test_reject_query_disabled(self):
        bad = sample(); bad['capabilities'] = 'Map,Data'
        self.assertEqual(inspect_layer(bad)['status'], 'REJECTED')

    def test_reject_nonjson_shape(self):
        self.assertEqual(inspect_layer([1,2,3])['status'], 'REJECTED')

    def test_edition_future_predecessor_flags_conflict(self):
        result = catalogue_conflict('2026-08', '2026-06', '2026-12')
        self.assertEqual(result['status'], 'CATALOGUE_CONFLICT_REVIEW_REQUIRED')
        self.assertTrue(result['manual_clarification_required'])

    def test_edition_order_consistent_does_not_certify(self):
        result = catalogue_conflict('2026-08', '2026-06', '2025-12')
        self.assertFalse(result['dataset_edition_verified'])
        self.assertEqual(result['status'], 'DATE_ORDER_CONSISTENT_NOT_VERIFIED')

    def test_symlink_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            target = root / 'source.json'; target.write_text(json.dumps(sample()))
            link = root / 'link.json'; link.symlink_to(target)
            with self.assertRaisesRegex(ValueError, 'symlink'):
                inspect_file(link)

    def test_oversized_metadata_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / 'large.json'
            path.write_text(' ' * 128001)
            with self.assertRaisesRegex(ValueError, 'ukuran'):
                inspect_file(path)


if __name__ == '__main__':
    unittest.main()
