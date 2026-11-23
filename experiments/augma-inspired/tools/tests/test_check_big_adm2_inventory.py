import json
import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path
sys_path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_big_adm2_inventory import inspect_file, inspect_inventory, registry_names

CODES = [f'13.{i:02d}' for i in range(1,13)] + [f'13.{i}' for i in range(71,78)]
NAMES = [
    'Kabupaten Pesisir Selatan', 'Kabupaten Solok', 'Kabupaten Sijunjung',
    'Kabupaten Tanah Datar', 'Kabupaten Padang Pariaman', 'Kabupaten Agam',
    'Kabupaten Lima Puluh Kota', 'Kabupaten Pasaman', 'Kabupaten Kepulauan Mentawai',
    'Kabupaten Dharmasraya', 'Kabupaten Solok Selatan', 'Kabupaten Pasaman Barat',
    'Kota Padang', 'Kota Solok', 'Kota Sawahlunto', 'Kota Padang Panjang',
    'Kota Bukittinggi', 'Kota Payakumbuh', 'Kota Pariaman'
]
NAMES_BY_CODE = dict(zip(CODES, NAMES))


def sample(compact=False):
    return {'objectIdFieldName': 'OBJECTID', 'features': [
        {'attributes': {'OBJECTID': i + 1, 'KDPKAB': code.replace('.', '') if compact else code,
                        'WADMPR': 'SUMATERA BARAT', 'WADMKK': name,
                        'TIPADM': 5 if name.startswith('Kota ') else 4}}
        for i,(code,name) in enumerate(zip(CODES,NAMES))]}


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.registry = self.root / 'regions.mjs'
        self.registry.write_text('\n'.join('{ code: "' + c + '", name: "' + n + '" },'
                                             for c,n in zip(CODES,NAMES)), encoding='utf-8')

    def validate(self, obj):
        return inspect_inventory(obj, registry_names(self.registry))

    def test_exactly_19_dotted_codes_pass_technical_only(self):
        out = self.validate(sample())
        self.assertEqual(out['status'], 'ATTRIBUTE_INVENTORY_PASS_REVIEW_REQUIRED')
        self.assertEqual(out['region_count'], 19)
        self.assertFalse(out['geometry_verified'])
        self.assertFalse(out['redistribution_permission_verified'])

    def test_undotted_13xx_codes_are_normalized(self):
        self.assertEqual(self.validate(sample(compact=True))['status'], 'ATTRIBUTE_INVENTORY_PASS_REVIEW_REQUIRED')

    def test_malformed_document_fails(self):
        self.assertEqual(self.validate({'error': {'code': 403}})['status'], 'REJECTED')
        self.assertEqual(self.validate([])['status'], 'REJECTED')

    def test_missing_feature_fails(self):
        doc = sample(); doc['features'].pop()
        self.assertEqual(self.validate(doc)['status'], 'REJECTED')

    def test_duplicate_code_fails(self):
        doc = sample(); doc['features'][-1]['attributes']['KDPKAB'] = CODES[0]
        self.assertTrue(any('duplikat' in e for e in self.validate(doc)['errors']))

    def test_duplicate_objectid_fails(self):
        doc = sample(); doc['features'][1]['attributes']['OBJECTID'] = 1
        self.assertTrue(any('OBJECTID' in e for e in self.validate(doc)['errors']))

    def test_wrong_province_fails(self):
        doc = sample(); doc['features'][0]['attributes']['WADMPR'] = 'JAMBI'
        self.assertEqual(self.validate(doc)['status'], 'REJECTED')

    def test_wrong_name_even_if_code_matches_fails(self):
        doc = sample(); doc['features'][0]['attributes']['WADMKK'] = 'Solok'
        self.assertEqual(self.validate(doc)['status'], 'REJECTED')

    def test_wrong_administrative_type_fails(self):
        doc = sample(); doc['features'][0]['attributes']['TIPADM'] = 5
        self.assertEqual(self.validate(doc)['status'], 'REJECTED')

    def test_geometry_presence_fails_closed(self):
        doc = sample(); doc['features'][0]['geometry'] = {'type': 'Polygon', 'coordinates': []}
        self.assertEqual(self.validate(doc)['status'], 'REJECTED')

    def test_truncated_arcgis_result_fails(self):
        doc = sample(); doc['exceededTransferLimit'] = True
        self.assertEqual(self.validate(doc)['status'], 'REJECTED')

    def test_symlink_file_fails(self):
        file = self.root / 'inventory.json'; file.write_text(json.dumps(sample()))
        link = self.root / 'shortcut.json'; link.symlink_to(file)
        with self.assertRaisesRegex(ValueError, 'Symlink'):
            inspect_file(link, self.registry)


if __name__ == '__main__':
    unittest.main()
