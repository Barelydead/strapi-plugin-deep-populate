'use strict';
const { getFullPopulateObject } = require('./helpers')

module.exports = ({ strapi }) => {
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeFindMany' || event.action === 'beforeFindOne') {
      const populate = event.params?.populate;
      const defaultDepth = strapi.plugin('strapi-plugin-populate-deep')?.config('defaultDepth') || 5
      const ignore = strapi.plugin('strapi-plugin-populate-deep')?.config('ignore') || []
      const debug = strapi.plugin('strapi-plugin-populate-deep')?.config('debug') || false

      /** @type {import('./helpers').FieldPopulateConfiguration[]} */
      const fields = strapi.plugin('strapi-plugin-populate-deep')?.config('fields') || {}

      if (populate && populate[0] === 'deep') {
        const depth = populate[1] ?? defaultDepth
        debug && console.debug(`[strapi-plugin-populate-deep] DEBUG Deep populating for model ${event.model.uid}`, {
          depth, ignore, fields
        })
        const modelObject = getFullPopulateObject(event.model.uid, depth, ignore, fields, debug);
        event.params.populate = modelObject.populate
      }
    }
  });
};
