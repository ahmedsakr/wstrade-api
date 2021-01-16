import { epochSeconds } from '../time';

function wait(seconds) {
    return new Promise((res, rej) => setTimeout(res, seconds * 1000));
}

// Measure the difference in epochSeconds() after waiting 1 second
test('epoch seconds is accurate', async () => {
    let base = epochSeconds();
    await wait(1);
    expect(epochSeconds()).toBe(base + 1);
});