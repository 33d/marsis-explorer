import json
import sys

out = {
  "type": "FeatureCollection",
  "features": []
}

coords = {}

for f in sys.argv[1:]:
  j = json.load(open(f, "r"))
  key = (j["orbit"], j["line"])
  c = coords.get(key, [])
  c.append((j["longitude"], j["latitude"]))
  coords[key] = c

for k, v in coords.items():
  o = {
    "type": "Feature",
    "geometry": {
      "type": "MultiPoint",
      "coordinates": v,
    },
    "properties": {
      "orbit": k[0],
      "line": k[1] 
    }
  }
  out["features"].append(o)
  
print json.dumps(out)

