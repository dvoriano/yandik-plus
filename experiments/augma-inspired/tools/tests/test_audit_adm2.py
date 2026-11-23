import json
import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path
sys_path.insert(0, str(Path(__file__).resolve().parents[1]))
from audit_adm2 import evaluate


class GeoAuditTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.dir = Path(self.temp.name)
        self.reg = self.dir / 'regions.mjs'
        rows = '\n'.join(f'{{ code: "13.{i:02d}", name: "Kabupaten Test {i}" }},' for i in range(1,13))
        rows += '\n' + '\n'.join(f'{{ code: "13.{i}", name: "Kota Test {i}" }},' for i in range(71,78))
        self.reg.write_text(rows)
        self.features = []
        for i,code in enumerate([f'13.{i:02d}' for i in range(1,13)] + [f'13.{i}' for i in range(71,78)]):
            x,y = 98.5 + (i%5)*0.5,-3 + (i//5)*0.5
            geom = {'type':'Polygon','coordinates':[[[x,y],[x+.12,y],[x+.12,y+.12],[x,y+.12],[x,y]]]}
            self.features.append({'type':'Feature','properties':{'code':code},'geometry':geom})
        self.file = self.dir/'test.geojson'

    def audit(self):
        self.file.write_text(json.dumps({'type':'FeatureCollection','features':self.features}))
        return evaluate(self.file,self.reg)

    def test_valid_technical_only(self):
        r = self.audit()
        self.assertEqual(r['status'], 'PASS_TECHNICAL_NOT_CERTIFIED')
        self.assertFalse(r['source_license_verified'])
        self.assertEqual(len(r['regions']),19)

    def test_duplicate_fails(self):
        self.features[-1]['properties']['code'] = self.features[0]['properties']['code']
        self.assertEqual(self.audit()['status'],'FAIL')

    def test_bowtie_fails(self):
        geom = self.features[0]['geometry']
        geom['coordinates'] = [[[98.5,-3],[98.6,-2.9],[98.6,-3],[98.5,-2.9],[98.5,-3]]]
        self.assertEqual(self.audit()['status'],'FAIL')

    def test_overlap_fails(self):
        self.features[1]['geometry'] = self.features[0]['geometry']
        self.assertTrue(any('tumpang tindih' in e for e in self.audit()['errors']))

    def test_missing_fails(self):
        self.features.pop()
        self.assertEqual(self.audit()['status'],'FAIL')


if __name__ == '__main__': unittest.main()
