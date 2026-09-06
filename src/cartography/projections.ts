import { geoEqualEarth, geoMercator, geoPath, geoGraticule } from 'd3-geo';
import type { GeoProjection, GeoPath, GeoPermissibleObjects } from 'd3-geo';

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 500;
export const CENTER_X = CANVAS_WIDTH / 2; // 480
export const CENTER_Y = CANVAS_HEIGHT / 2; // 250

/**
 * Equal Earth Projection (Šavrič, Patterson, Jenny - 2018)
 * Adopted by the UN General Assembly (Resolution A/80/L.104, Sept 4, 2026)
 * Equal-area pseudocylindrical projection.
 */
export function createEqualEarthProjection(): GeoProjection {
  return geoEqualEarth()
    .scale(177)
    .translate([CENTER_X, CENTER_Y])
    .precision(0.1);
}

/**
 * Mercator Projection (Gerardus Mercator - 1569)
 * Conformal cylindrical projection, heavily inflates high latitudes.
 * Clamped to [-85, 85] latitude to avoid infinite pole coordinates.
 */
export function createMercatorProjection(): GeoProjection {
  return geoMercator()
    .scale(152)
    .translate([CENTER_X, CENTER_Y])
    .precision(0.1);
}

export function createGeoPath(projection: GeoProjection): GeoPath<any, GeoPermissibleObjects> {
  return geoPath().projection(projection);
}

export function createGraticule() {
  return geoGraticule().step([15, 15])();
}

export function createGraticuleOutlines() {
  return geoGraticule().outline();
}
