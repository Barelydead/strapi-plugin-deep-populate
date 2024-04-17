# Strapi plugin populate-deep

This plugin allows for easier population of deep content structures using the rest API.

# Installation

`npm install strapi-plugin-populate-deep`

`yarn add strapi-plugin-populate-deep`

# Usages

## Examples

Populate a request with the default max depth.

`/api/articles?populate=deep`

Populate a request with the a custom depth

`/api/articles?populate=deep,10`

Populate a request with the a custom depth

`/api/articles/1?populate=deep,10`

## Good to know

The default max depth is 5 levels deep.

The populate deep option is available for all collections and single types using the `findOne` and `findMany` methods.

# Configuration

The default depth and custom depth for certain fields can be customized via the plugin config. To do so create or edit you `plugins.js` file.

To avoid cyclic population you might need to ignore certain fields.

To avoid too much data, especially when you are working with parent-child relationships, adjust the depth of population of these fields using the `fields` option.

To find out what collections and fields are populated, set the debug option to true.

## Example configuration

`config/plugins.js`

```js
module.exports = ({ env }) => ({
  'strapi-plugin-populate-deep': {
    config: {
      defaultDepth: 3, // Default is 5
      ignore: ['field1', 'collectionName.field2'], // default is []
      fields: [
        { collectionName: 'collectionName', field: 'field1', depth: 1 },
        { field: 'field2', depth: 3 }, // for all collections
      ],
      debug: true, // default is false
      skipCreatorFields: true, // default is false, skips all fields of model admin::user
    }
  },
});
```

# Contributions

The original idea for getting the populate structure was created by [tomnovotny7](https://github.com/tomnovotny7) and can be found in [this](https://github.com/strapi/strapi/issues/11836) github thread
