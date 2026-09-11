"""Bundle a sampled open Terrarium tile per harbor; no runtime map API/key.
Requires Pillow. Source/decoding/attribution: tilezen/joerd docs.
"""
import re, math, json, urllib.request, io, concurrent.futures
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
rows=re.findall(r"def\('([^']+)','[^']*','[^']*','[A-Z]+',([\d.]+),([\d.]+)", (root/'src/harbor-data.js').read_text())
out=root/'public/maps/terrain';out.mkdir(parents=True,exist_ok=True)
def build(row):
    name,lat,lon=row;lat=float(lat);lon=float(lon);zoom=10;n=2**zoom
    fx=(lon+180)/360*n;fy=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n
    x,y=int(fx),int(fy);url=f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{zoom}/{x}/{y}.png'
    img=Image.open(io.BytesIO(urllib.request.urlopen(url,timeout=60).read())).convert('RGB')
    heights=[]
    for j in range(129):
        for i in range(129):
            r,g,b=img.getpixel((min(255,i*2),min(255,j*2)));heights.append(round(r*256+g+b/256-32768))
    data=dict(size=129,heights=heights,origin=[fx-x,fy-y],tile=[zoom,x,y],source=url,metresPerTile=40075016.686*math.cos(math.radians(lat))/n)
    (out/f'{name}.json').write_text(json.dumps(data,separators=(',',':')))
    return name,max(heights)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for result in pool.map(build,rows): print(*result)
