/** Search phrases per mood; one is chosen at random per request. */
const MOOD_QUERIES = {
  happy: [
    'upbeat feel good music full songs',
    'happy pop playlist energy',
    'positive vibes music mix',
    'summer hits upbeat',
  ],
  sad: [
    'sad emotional songs acoustic',
    'melancholic piano music',
    'heartbreak songs slow',
    'rainy day sad music',
  ],
  energetic: [
    'high energy workout music',
    'power rock motivation mix',
    'intense edm drops',
    'adrenaline pump up songs',
  ],
  calm: [
    'calm ambient relaxing music',
    'peaceful meditation sounds',
    'soft acoustic calm',
    'slow peaceful piano',
  ],
  chill: [
    'chill lofi beats study',
    'chillhop relax mix',
    'late night chill music',
    'smooth r&b chill vibes',
  ],
  romantic: [
    'romantic love songs playlist',
    'slow dance love ballads',
    'soulful love songs',
    'date night music soft',
  ],
  angry: [
    'heavy metal aggressive',
    'hard rock rage mix',
    'dark intense music',
    'angry workout metal',
  ],
  nostalgic: [
    '2000s throwback hits',
    '90s nostalgia music',
    'old school hip hop classics',
    'vintage pop memories',
  ],
  party: [
    'party dance hits mix',
    'club bangers night out',
    'house party music',
    'celebration dance songs',
  ],
  sleepy: [
    'sleep music soft ambient',
    'gentle piano for sleeping',
    'quiet night lullaby style',
    'deep relaxation sleep',
  ],
  hopeful: [
    'inspirational uplifting songs',
    'motivational acoustic hope',
    'new beginnings music',
    'sunrise hopeful indie',
  ],
  dreamy: [
    'dreamy ethereal indie',
    'shoegaze atmospheric',
    'spacey synth dreamy',
    'floaty ambient pop',
  ],
  lonely: [
    'late night lonely songs',
    'solo acoustic reflective',
    'empty city night music',
    'melancholy indie alone',
  ],
  confident: [
    'boss energy confident songs',
    'main character playlist',
    'strut anthem hip hop',
    'powerful self love music',
  ],
  hype: [
    'hype pregame playlist',
    'viral tiktok songs energy',
    'bass boosted hype mix',
    'stadium anthem singalong',
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Partial Fisher–Yates: O(k) swaps, returns k random elements (order randomized). */
function sampleSize(arr, k) {
  const n = arr.length;
  if (n === 0) return [];
  const take = Math.min(k, n);
  const a = arr.slice();
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(Math.random() * (n - i));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, take);
}

/** Display order (energy → calm → heavy / rest). */
const MOOD_ORDER = [
  'happy',
  'energetic',
  'hype',
  'party',
  'confident',
  'hopeful',
  'chill',
  'calm',
  'dreamy',
  'nostalgic',
  'romantic',
  'sad',
  'lonely',
  'angry',
  'sleepy',
];

function moodKeys() {
  return MOOD_ORDER.filter((id) => MOOD_QUERIES[id]);
}

function queriesForMood(mood) {
  return MOOD_QUERIES[mood?.toLowerCase()];
}

module.exports = { pickRandom, sampleSize, moodKeys, queriesForMood };
