const LOWER_UMLAUT_REGEXP = /u:|v/g;
const UPPER_UMLAUT_REGEXP = /U:|V/g;
const PINYIN_PARTS_REGEXP = /(\D+)([1-5]?)/;
const NUCLEUS_REGEXP = /[ae]|[oiuü](?![aeoiuü])|[oiuü]{2}/i;
const NON_PINYIN_REGEXP = /[^A-Za-z0-9:üÜ]+/g;

const TONE_MAP = {
  'a': 'āáǎà'.split(''),
  'A': 'āáǎà'.toUpperCase().split(''),
  'o': 'ōóǒò'.split(''),
  'O': 'ōóǒò'.toUpperCase().split(''),
  'e': 'ēéěè'.split(''),
  'E': 'ēéěè'.toUpperCase().split(''),
  'i': 'īíǐì'.split(''),
  'I': 'īíǐì'.toUpperCase().split(''),
  'u': 'ūúǔù'.split(''),
  'U': 'ūúǔù'.toUpperCase().split(''),
  'ü': 'ǖǘǚǜ'.split(''),
  'Ü': 'ǖǘǚǜ'.toUpperCase().split('')
};

// https://en.wikipedia.org/wiki/Pinyin#Rules_for_placing_the_tone_mark
// 1. If there is an a or an e, it will take the tone mark
// 2. If there is an ou, then the o takes the tone mark
// 3. Otherwise, the second vowel takes the tone mark

function applyTone(nucleus, toneNumber) {
  if (!toneNumber) {
    return nucleus;
  }

  const toneIndex = parseInt(toneNumber, 10) - 1;
  if (nucleus === 'ou') {
    return `${applyTone(nucleus[0], toneNumber)}${nucleus[1]}`;
  }
  if (nucleus.length === 2) {
    return `${nucleus[0]}${applyTone(nucleus[1], toneNumber)}`;
  }
  return TONE_MAP[nucleus][toneIndex] || nucleus;
}

function processPinyin(p) {
  const [, pron, tone] = p
    .replace(LOWER_UMLAUT_REGEXP, 'ü')
    .replace(UPPER_UMLAUT_REGEXP, 'Ü')
    .match(PINYIN_PARTS_REGEXP);
  return pron.replace(NUCLEUS_REGEXP, match => applyTone(match, tone));
}

function nonUnique() {
  const m = {};
  return (s) => {
    if (m[s]) return false;
    return m[s] = true;
  }
}

const truthy = x => !!x;

export default pinyin => pinyin
  .split(NON_PINYIN_REGEXP)
  .filter(truthy)
  .map(processPinyin)
  .filter(nonUnique())
  .join(', ');
