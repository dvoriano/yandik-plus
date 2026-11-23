// Standalone GeoJSON to SVG projection: no external runtime dependencies.
export const VIEW = Object.freeze({ width: 800, height: 650, padding: 36 });

function collectPairs(value, out) {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    if (Number.isFinite(value[0]) && Number.isFinite(value[1])) out.push(value);
    return;
  }
  for (const child of value) collectPairs(child, out);
}

export function boundsOfGeoJSON(featureCollection) {
  if (featureCollection?.type !== "FeatureCollection" ||
      !Array.isArray(featureCollection.features) || !featureCollection.features.length)
    throw new Error("FeatureCollection GeoJSON tidak valid");
  const points = [];
  for (const feature of featureCollection.features) {
    const type = feature?.geometry?.type;
    if (type !== "Polygon" && type !== "MultiPolygon")
      throw new Error("Hanya Polygon/MultiPolygon yang didukung");
    collectPairs(feature.geometry.coordinates, points);
  }
  if (points.length < 3) throw new Error("Koordinat geometri tidak memadai");
  return {
    minLon: Math.min(...points.map(p => p[0])),
    maxLon: Math.max(...points.map(p => p[0])),
    minLat: Math.min(...points.map(p => p[1])),
    maxLat: Math.max(...points.map(p => p[1]))
  };
}

export function createProjection(geojson, view = VIEW) {
  const b = boundsOfGeoJSON(geojson);
  const w = b.maxLon - b.minLon, h = b.maxLat - b.minLat;
  if (!(w > 0 && h > 0 && view.width > 2 * view.padding && view.height > 2 * view.padding))
    throw new Error("Rentang proyeksi tidak valid");
  // Equirectangular local display; adequate for regional overview, not for distances or cadastral use.
  const scale = Math.min((view.width - 2 * view.padding) / w, (view.height - 2 * view.padding) / h);
  const centerLon = (b.minLon + b.maxLon) / 2;
  const centerLat = (b.minLat + b.maxLat) / 2;
  return Object.freeze({
    bounds: b,
    project: ([lon, lat]) => [
      view.width / 2 + (lon - centerLon) * scale,
      view.height / 2 - (lat - centerLat) * scale
    ]
  });
}

export function geometryPaths(geometry, project) {
  if (!geometry || !["Polygon", "MultiPolygon"].includes(geometry.type))
    throw new Error("Tipe geometri tidak didukung");
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap(polygon => {
    const segments = polygon.map(ring => {
      if (!Array.isArray(ring) || ring.length < 3) return "";
      return ring.map((xy, i) => {
        const [x, y] = project(xy);
        if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("Proyeksi gagal");
        return (i ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2);
      }).join(" ") + " Z";
    }).filter(Boolean);
    return segments.length ? [segments.join(" ")] : [];
  });
}
