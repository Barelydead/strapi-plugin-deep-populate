'use strict';
const { getFullPopulateObject } = require('./helpers')

module.exports = ({ strapi }) => {
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeFindMany' || event.action === 'beforeFindOne') {
      const populate = event.params?.populate;
      const defaultDepth = strapi.plugin('strapi-plugin-populate-deep')?.config('defaultDepth') || 5
      const excludeLocalizations = strapi.plugin('strapi-plugin-populate-deep')?.config('excludeLocalizations') || false

      if (populate && populate[0] === 'deep') {
        const depth = populate[1] ?? defaultDepth
        const ignored = []
        if (excludeLocalizations) {
          ignored.push('localizations')
        }
        const modelObject = getFullPopulateObject(event.model.uid, depth, ignored);
        event.params.populate = modelObject.populate
      }
    }
  });
};
