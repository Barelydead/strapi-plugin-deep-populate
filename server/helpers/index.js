const { isEmpty, merge } = require("lodash/fp");

const getModelPopulationAttributes = (model) => {
  if (model.uid === "plugin::upload.file") {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

/**
 * @typedef {Object} FieldPopulateConfiguration
 * @property {string?} collectionName - optional, if not given, it will be considered for all collections
 * @property {string} field
 * @property {number} depth
 * @exports FieldPopulateConfiguration
 */

/**
 * @param {string} modelUid 
 * @param {number} maxDepth 
 * @param {string[]?} ignore 
 * @param {FieldPopulateConfiguration[]?} fieldPopulateConfigurations 
 * @param {boolean?} debug
 * @returns 
 */
const getFullPopulateObject = (modelUid, maxDepth = 20, ignore, fieldPopulateConfigurations, debug = false) => {
  const skipCreatorFields = strapi.plugin('strapi-plugin-populate-deep')?.config('skipCreatorFields');

  if (maxDepth <= 1) {
    return true;
  }
  if (modelUid === "admin::user" && skipCreatorFields) {
    return undefined;
  }

  const populate = {};
  const model = strapi.getModel(modelUid);

  for (const [key, value] of Object.entries(
    getModelPopulationAttributes(model)
  )) {
    if (ignore?.includes(key) || ignore?.includes(model.collectionName + '.' + key)) {
      debug && console.debug(`[strapi-plugin-populate-deep] DEBUG Ignoring collectionName: ${model.collectionName}, field: ${key}`)
      continue
    }

    let depth = maxDepth
    if (fieldPopulateConfigurations) {
      debug && console.debug(`[strapi-plugin-populate-deep] DEBUG collectionName: ${model.collectionName}, field: ${key}`)
      const fieldPopulateConfiguration = fieldPopulateConfigurations.find(f => f.field === key && (!f.collectionName || f.collectionName === model.collectionName))
      if (fieldPopulateConfiguration) {
        debug && console.debug(`[strapi-plugin-populate-deep] DEBUG Overriding depth for collectionName: ${model.collectionName}, field: ${key} to ${fieldPopulateConfiguration.depth}`)
        depth = fieldPopulateConfiguration.depth
      }
    }

    if (value) {
      if (value.type === "component") {
        populate[key] = getFullPopulateObject(value.component, depth - 1, ignore, fieldPopulateConfigurations, debug);
      } else if (value.type === "dynamiczone" && depth > 1) {
        const dynamicPopulate = value.components.reduce((prev, cur) => {
          const curPopulate = getFullPopulateObject(cur, depth - 1, ignore, fieldPopulateConfigurations, debug);
          return curPopulate === true ? prev : merge(prev, curPopulate);
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : dynamicPopulate;
      } else if (value.type === "relation" && depth > 1) {
        const relationPopulate = getFullPopulateObject(
          value.target,
          (key === 'localizations') && depth > 2 ? 1 : depth - 1,
          ignore,
          fieldPopulateConfigurations,
          debug,
        );
        if (relationPopulate) {
          populate[key] = relationPopulate;
        }
      } else if (value.type === "media") {
        populate[key] = true;
      }
    }
  }
  return isEmpty(populate) ? true : { populate };
};

module.exports = {
  getFullPopulateObject
}
