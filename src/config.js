// Conditional features that are currently supported by wstrade-api
const supportedFeatures = ['implicit_token_refresh', 'securities_cache'];
const supported = (feature) => {
  if (!feature?.startsWith('no_')) {
    return supportedFeatures.includes(feature);
  }

  return supportedFeatures.includes(feature.substring('no_'.length));
};

// Holds optional features that have been disabled.
const disabled = ['securities_cache'];
export const configEnabled = (feature) => !disabled.includes(feature);

/**
 * Enable or disable a optional feature within wstrade-api.
 *
 * Examples:
 * ---
 * config('implicit_token_refresh')
 * Enables implicit refreshing of tokens.
 *
 * config('no_implicit_token_refresh')
 * Disables implicit refreshing of tokens.
 *
 * @param {*} feature The string identifier for the feature, starting with "no_" if
 *                    you wish to disable it.
 */
export default function config(feature) {
  if (!supported(feature)) {
    throw new Error(`'${feature}' is not supported!`);
  }

  if (feature?.startsWith('no_')) {
    const cut = feature.substring(feature.indexOf('_') + 1);

    // We will only append this if it isn't already in there.
    if (configEnabled(cut)) {
      disabled.push(cut);
    }

  // Only delete the feature if it's already disabled.
  } else if (!configEnabled(feature)) {
    disabled.splice(disabled.indexOf(feature), 1);
  }
}
