export function missing(q) {
  if (!q) return q;
  const query = q;

  if (query.lng && query.lat) {
    query['geo.loc'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [query.lng, query.lat],
        },
        $maxDistance: query.radius || 5000,
      },
    };

    delete query.lng;
    delete query.lat;
    delete query.radius;
  }

  return query;
}
