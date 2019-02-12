import testData from './formatPinyin.testutil.json';
import formatPinyin from './formatPinyin';

describe('formatPinyin', () => {
  describe('number to diacritic', () => {
    it('applies the 1st tone', () => {
      expect(['ba1', 'bo1', 'he1', 'bi1', 'bu1', 'nü1'].map(formatPinyin))
        .toEqual(['bā', 'bō', 'hē', 'bī', 'bū', 'nǖ']);
    });

    it('applies the 2nd tone', () => {
      expect(['ba2', 'bo2', 'he2', 'bi2', 'bu2', 'nü2'].map(formatPinyin))
        .toEqual(['bá', 'bó', 'hé', 'bí', 'bú', 'nǘ']);
    });

    it('applies the 3nd tone', () => {
      expect(['ba3', 'bo3', 'he3', 'bi3', 'bu3', 'nü3'].map(formatPinyin))
        .toEqual(['bǎ', 'bǒ', 'hě', 'bǐ', 'bǔ', 'nǚ']);
    });

    it('applies the 4th tone', () => {
      expect(['ba4', 'bo4', 'he4', 'bi4', 'bu4', 'nü4'].map(formatPinyin))
        .toEqual(['bà', 'bò', 'hè', 'bì', 'bù', 'nǜ']);
    });

    it('applies the 5th tone', () => {
      expect([
        'ba5', 'bo5', 'he5', 'bi5', 'bu5', 'nü5',
        'ba', 'bo', 'he', 'bi', 'bu', 'nü'
      ].map(formatPinyin))
        .toEqual([
          'ba', 'bo', 'he', 'bi', 'bu', 'nü',
          'ba', 'bo', 'he', 'bi', 'bu', 'nü'
        ]);
    });
  });

  describe('nucleus rules', () => {
    it('places the tone mark on "a"', () => {
      expect(testData.aTest.input.map(formatPinyin))
        .toEqual(testData.aTest.expectedOutput);
    });

    it('places the tone mark on "e"', () => {
      expect(testData.eTest.input.map(formatPinyin))
        .toEqual(testData.eTest.expectedOutput);
    });

    it('places the tone mark on the "o" of "ou"', () => {
      expect(formatPinyin('dou1'))
        .toEqual('dōu');
    });

    it('places the tone mark on the 2nd of 2 vowels', () => {
      expect(['xiong2', 'duo3', 'jiu4', 'tui1', 'lüe4'].map(formatPinyin))
        .toEqual(['xióng', 'duǒ', 'jiù', 'tuī', 'lüè']);
    });
  });

  describe('umlaut logic', () => {
    it('replaces "u:" with "ü"', () => {
      expect(formatPinyin('nu:3')).toEqual('nǚ');
    });

    it('replaces "v" with "ü"', () => {
      expect(formatPinyin('nv3')).toEqual('nǚ');
    });

    it('converts multiple pinyins and deduplicates', () => {
      expect(formatPinyin('nu:3/nv nu:')).toEqual('nǚ, nü');
    });
  });

  describe('capitalization', () => {
    it('leaves capitals as they are', () => {
      expect(['Song2', 'Ao1', 'O2', 'E3', 'I4', 'U1', 'U:3', 'V2'].map(formatPinyin))
        .toEqual(['Sóng', 'Āo', 'Ó', 'Ě', 'Ì', 'Ū', 'Ǚ', 'Ǘ']);
    });
  });

});
