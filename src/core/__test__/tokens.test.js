import epochSeconds from '../../helpers/time';
import tokens from '../tokens';

test('tokens update with a valid state', () => {
    tokens.store({ access: 'abcde', refresh: 'fghij', expires: 1000 });
    expect(tokens.access).toBe('abcde');
    expect(tokens.refresh).toBe('fghij');
    expect(tokens.expires).toBe(1000);
});

test('tokens update with empty state', () => {
    tokens.store({});
    expect(tokens.access).toBe(undefined);
    expect(tokens.refresh).toBe(undefined);
    expect(tokens.expires).toBe(undefined);
});

test('tokens module detects expired tokens', () => {
    tokens.store({ access: 'abcde', refresh: 'fghij', expires: epochSeconds() });
    expect(tokens.expired()).toBe(true);
});

test('tokens module detects valid tokens', () => {
    // set the expiry time to 2 seconds from now
    tokens.store({ access: 'abcde', refresh: 'fghij', expires: epochSeconds() + 2 });

    expect(tokens.expired()).toBe(false);
});
