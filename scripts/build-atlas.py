"""Clip Natural Earth 1:50m land to East Asia. Usage: python3 scripts/build-atlas.py source.geojson"""
import json
import sys
from pathlib import Path

def clip(poly, axis, value, keep):
    out = []
    for a, b in zip(poly, poly[1:] + poly[:1]):
        inside_a = (a[axis] - value) * keep >= 0
        inside_b = (b[axis] - value) * keep >= 0
        if inside_a:
            out.append(a)
        if inside_a != inside_b:
            t = (value - a[axis]) / (b[axis] - a[axis])
            out.append([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    return out

source = json.loads(Path(sys.argv[1]).read_text())
polygons = []
for feature in source['features']:
    geometry = feature['geometry']
    arrays = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    for rings in arrays:
        polygon = rings[0]
        for axis, value, keep in [(0, 115, 1), (0, 144, -1), (1, 24, 1), (1, 43, -1)]:
            polygon = clip(polygon, axis, value, keep) if polygon else []
        if len(polygon) > 3:
            polygons.append([[round(x, 4), round(y, 4)] for x, y in polygon])
output = Path(__file__).resolve().parents[1] / 'public/maps/east-asia.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({'source': 'Natural Earth 1:50m land, public domain', 'bounds': [115, 24, 144, 43], 'polygons': polygons}, separators=(',', ':')))
print(f'{len(polygons)} coastal polygons → {output}')
