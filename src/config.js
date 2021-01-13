// Holds optional features that have been disabled.
const disabled = ['securities_cache'];

export const configEnabled = (feature) => !disabled.includes(feature);

/**
 * Enable or disable a optional feature within wstrade-api.
 *
 * Examples:
 * ---
 * config('pancakes')
 * Enables the fictitious pancakes feature.
 *
 * config('no_pancakes')
 * Disables the fictitious pancakes feature.
 *
 * @param {*} feature The string identifier for the feature, starting with "no_" if
 *                    you wish to disable it.
 */
export default function config(feature) {
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
