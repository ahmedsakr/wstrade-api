// Optional features that have been disabled
let disabled = [];

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
    let cut = feature.substring(feature.indexOf("_") + 1);

    // We will only append this if it isn't already in there.
    if (!configDisabled(cut)) {
      disabled.push(cut);
    }
  } else {

    // Only delete the feature if it's already disabled.
    if (configDisabled(feature)) {
      disabled.splice(disabled.indexOf(feature), 1);
    }
  }
}

export const configDisabled = (feature) => disabled.includes(feature);
