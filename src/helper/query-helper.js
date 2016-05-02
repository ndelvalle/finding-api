import { each } from 'lodash';
import { EARTHRADIUS, kmToRadians } from './distance-helper';

function removeFromObj(obj, attr) {
  const objet = obj;
  each(attr, (attribute) => delete objet[attribute]);
}

export function missing(q) {
  if (!q) return q;

  const latitude = Number(q.lat) || -38.416097; // Argentina coordinates
  const longitude = Number(q.lng) || -63.616672;
  const radius = kmToRadians(Number(q.radius) || 5000); // 5000km default

  const limit = Number(q.limit) || 25;
  const skip = Number(q.skip) || 0;

  removeFromObj(q, ['lat', 'lng', 'limit', 'skip', 'radius']);

  const aggregationPipelines = [{
    $geoNear: {
      near: [longitude, latitude],
      spherical: true,
      distanceField: 'distance',
      distanceMultiplier: EARTHRADIUS,
      maxDistance: radius,
      query: q,
    },
  }, {
    $skip: skip,
  }, {
    $limit: limit,
  }];

  return aggregationPipelines;
}
