import { omit } from 'lodash';
import { EARTHRADIUS, kmToRadians } from './distance-helper';

export function missing(q) {
  const latitude = Number(q.lat) || -38.416097; // Argentina coordinates
  const longitude = Number(q.lng) || -63.616672;
  const radius = kmToRadians(Number(q.radius) || 5000); // 5000km default

  const limit = Number(q.limit) || 25;
  const skip = Number(q.skip) || 0;

  const query = omit(q, ['lat', 'lng', 'limit', 'skip', 'radius']);

  query.isBrowsable = true;
  query.isMissing = true;

  const aggregationPipelines = [{
    $geoNear: {
      near: [longitude, latitude],
      spherical: true,
      distanceField: 'distance',
      distanceMultiplier: EARTHRADIUS,
      maxDistance: radius,
      query,
    },
  }, {
    $skip: skip,
  }, {
    $limit: limit,
  }];

  return aggregationPipelines;
}
