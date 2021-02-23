import config, { configEnabled } from '../config';

// restore to initial state
afterEach(() => {
    config('no_securities_cache');
    config('implicit_token_refresh');
});

// By default, the securities_cache feature is disabled but the implicit_refresh_token
// feature is not.
test('config initial state', () => {
    expect(configEnabled('securities_cache')).toBe(false);
    expect(configEnabled('implicit_token_refresh')).toBe(true);
});

// Disable features that are currently enabled
test('config allows features to be disabled', () => {
    expect(configEnabled('implicit_token_refresh')).toBe(true);
    config('no_implicit_token_refresh');
    expect(configEnabled('implicit_token_refresh')).toBe(false);
});

// Disable features that are currently disabled
test('config allows features to be disabled', () => {
    expect(configEnabled('securities_cache')).toBe(false);
    config('no_securities_cache');
    expect(configEnabled('securities_cache')).toBe(false);
});

// Enable features that are currently disabled
test('config allows features to be enabled', () => {
    expect(configEnabled('securities_cache')).toBe(false);
    config('securities_cache');
    expect(configEnabled('securities_cache')).toBe(true);
});

// Enable features that are currently enabled
test('config allows features to be disabled', () => {
    expect(configEnabled('implicit_token_refresh')).toBe(true);
    config('implicit_token_refresh');
    expect(configEnabled('implicit_token_refresh')).toBe(true);
});

// Throw error for an unsupported feature
test('config throws error for unsupported features', () => {
    expect(() => config('unsupported')).toThrow(`'unsupported' is not supported!`);
    expect(() => config('no_unsupported')).toThrow(`'no_unsupported' is not supported!`);
});

// Throw error for bad feature values
test('config throws error for null/undefined', () => {
    expect(() => config(undefined)).toThrow(`'undefined' is not supported!`);
    expect(() => config(null)).toThrow(`'null' is not supported!`);
});