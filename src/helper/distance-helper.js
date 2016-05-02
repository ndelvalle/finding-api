export const EARTHRADIUS = 6378.1;

export function radiansToKm(r) {
  return r * EARTHRADIUS;
}

export function kmToRadians(km) {
  return km / EARTHRADIUS;
}
