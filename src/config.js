// Conditional features that have been disabled
let disabled = [];

/**
 * Enable or disable a conditional feature within wstrade-api.
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
    disabled.push(feature.substring(feature.indexOf("_") + 1));
  } else {
    if (!configEnabled(feature)) {
      disabled.splice(disabled.indexOf(feature), 1);
    }
  }
}

export const configEnabled = (feature) => !disabled.includes(feature);