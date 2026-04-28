const { pickRandom, sampleSize, moodKeys, queriesForMood } = require('../src/config/moods');

describe('config/moods', () => {
  test('moodKeys returns a non-empty ordered list', () => {
    const keys = moodKeys();
    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain('happy');
  });

  test('queriesForMood returns phrases for known mood', () => {
    const q = queriesForMood('happy');
    expect(Array.isArray(q)).toBe(true);
    expect(q.length).toBeGreaterThan(0);
  });

  test('queriesForMood is undefined for unknown mood', () => {
    expect(queriesForMood('not_a_real_mood')).toBeUndefined();
  });

  test('pickRandom returns an element from the array', () => {
    const arr = ['a', 'b', 'c'];
    for (let i = 0; i < 20; i++) {
      expect(arr).toContain(pickRandom(arr));
    }
  });

  test('sampleSize returns at most k elements', () => {
    const base = [1, 2, 3, 4, 5];
    expect(sampleSize(base, 2)).toHaveLength(2);
    expect(sampleSize(base, 99)).toHaveLength(5);
    expect(sampleSize([], 3)).toHaveLength(0);
  });
});
