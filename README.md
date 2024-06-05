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

The populate deep option is available for all collections and single types using the findOne and findMany methods.

# Configuration

The default depth can be customized via the plugin config. To do so create or edit you plugins.js file.

## Example configuration

`config/plugins.js`

```
module.exports = ({ env }) => ({
  'strapi-plugin-populate-deep': {
    config: {
      defaultDepth: 3, // Default is 5
      excludeLocalizations: true // do not include localizations for other languages in response if using i18n plugin 
    }
  },
});
```

# Contributions
The original idea for getting the populate structure was created by [tomnovotny7](https://github.com/tomnovotny7) and can be found in [this](https://github.com/strapi/strapi/issues/11836) github thread
