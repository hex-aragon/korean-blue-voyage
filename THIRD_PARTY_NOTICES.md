# Third-party notices

Three.js and `public/waternormals.jpg` are from the Three.js project.
Source: https://github.com/mrdoob/three.js
License: MIT

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Noto Sans KR and Gowun Batang are served by Google Fonts under the SIL Open Font License.

Natural Earth land data is used in `public/maps/east-asia.json`, clipped from the 1:50m land GeoJSON.
Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson
Terms: https://www.naturalearthdata.com/about/terms-of-use/
License: Public domain. Made with Natural Earth.

Official port maps were consulted as references; their images and proprietary 3D tiles are not bundled. See MAP_REFERENCES.md.

## Mapzen Terrain Tiles / Terrarium

`public/maps/terrain/*.json` are decoded, sampled derivatives of 18 Terrarium tiles distributed through the AWS Open Data elevation-tiles-prod bucket. Source URL and tile coordinates are embedded in each JSON.

- Mapzen / Tilezen terrain processing: https://github.com/tilezen/joerd
- Global GMTED2010 and SRTM terrain data courtesy of the U.S. Geological Survey.
- Global ETOPO1 terrain data: U.S. National Oceanic and Atmospheric Administration.
- Global source datasets used here are public domain; attribution retained as requested.
- Provider attribution and terms: https://github.com/tilezen/joerd/blob/master/docs/attribution.md
- Decoding: https://github.com/tilezen/joerd/blob/master/docs/formats.md

These are elevation grids, not satellite photographs or building/port survey models. Game rendering compresses horizontal scale, exaggerates elevation by 1.4 and flattens the harbor play corridor.

## Belfast Sunset (Pure Sky) HDRI — CC0

`public/environments/belfast-sunset.hdr`: 2K original from [Poly Haven](https://polyhaven.com/a/belfast_sunset_puresky). Photography: Dimitrios Savva. Processing: Greg Zaal. Sky edits: Jarod Guest. Licensed CC0. Used for sunset background and outdoor image-based lighting; this sky photograph is not a photograph of a Korean harbor.
