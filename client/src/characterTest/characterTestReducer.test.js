import prepareBins from './prepareBins.testutil';
import { actionTypes } from './characterTestActions';
import characterTestReducer, {
  currentCard,
  statusEnum,
  characterSetEnum,
  missedCards
} from './characterTestReducer';

describe('characterTestReducer', () => {
  it('has defaults', () => {
    expect(characterTestReducer()).toEqual({
      binCount: 40,
      subsetSize: 5,
      seed: -1,
      totalCharacterCount: 0,
      binSamples: [],
      markedEntries: [],
      currentBinIndex: 0,
      isShowDefinition: false,
      state: statusEnum.READY,
      resultData: null,
      characterSet: characterSetEnum.SIMPLIFIED
    });
  });

  describe('loading', () => {
    it('starts loading character samples', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START
      })).toEqual({ state: statusEnum.LOADING });
    });

    it('successfully loads character samples and starts the test', () => {
      /**
       * @type {GetBinSamplesResponse}
       */
      let responseData = {
        binCount: 2,
        subsetSize: 2,
        seed: 9999,
        totalCharacterCount: 3,
        binSamples: [
          {
            binIndex: 0,
            characters: [
              { i: 1, cs: '的', ct: '的', p: 'de', d: '(possessive particle)' },
              { i: 2, cs: '一', ct: '一', p: 'yi1', d: 'one' },
            ]
          },
          {
            binIndex: 1,
            characters: [
              { i: 3, cs: '从', ct: '從', p: 'cong2', d: 'from' }
            ]
          }
        ]
      };

      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        response: responseData
      })).toEqual({ ...responseData, state: statusEnum.TESTING });
    });

    it('handles a loading error', () => {
      const error = new Error('Oh no');
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
        error
      })).toEqual({
        state: 'ERROR'
      });
    });
  });

  describe('definition', () => {
    it('shows the current card definition', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW
      })).toEqual({
        isShowDefinition: true
      });
    });

    it('hides the current card definition', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE
      })).toEqual({
        isShowDefinition: false
      });
    });
  });

  describe('marking', () => {
    const characters = [
      { i: 1, cs: '的', ct: '的', p: 'de', d: '(possessive particle)' },
      { i: 2, cs: '一', ct: '一', p: 'yi1', d: 'one' },
    ];
    const binSamples = [{ binIndex: 0, characters }];

    it('does not mark if not testing', () => {
      expect(characterTestReducer({
        binSamples,
        markedEntries: [],
        state: statusEnum.COMPLETE,
        binIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        binSamples,
        markedEntries: [],
        state: statusEnum.COMPLETE,
        binIndex: 0,
      });
    });

    it('marks current as unknown', () => {
      expect(characterTestReducer({
        binSamples,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_UNKNOWN
      })).toEqual({
        binSamples,
        isShowDefinition: false,
        markedEntries: [
          {
            ...characters[0],
            originBinIndex: 0,
            known: false,
          }
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0
      });
    });

    it('marks current as known', () => {
      expect(characterTestReducer({
        binSamples,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        binSamples,
        isShowDefinition: false,
        markedEntries: [
          { ...characters[0], known: true, originBinIndex: 0 }
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });

    it('clears current card mark', () => {
      expect(characterTestReducer({
        binSamples,
        markedEntries: [
          { ...characters[0], known: true, originBinIndex: 0 }
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        binSamples,
        isShowDefinition: false,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0
      });
    });
  });

  describe('discarding', () => {
    const characters = [
      [{ i: 1 }, { i: 2 }],
      [{ i: 3 }, { i: 4 }],
      [{ i: 5 }, { i: 6 }],
    ];
    const binSamples = [
      { binIndex: 0, characters: characters[0] },
      { binIndex: 1, characters: characters[1] },
      { binIndex: 2, characters: characters[2] },
    ];

    it('discards current and moves to next card', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: true }
        ],
        isShowDefinition: false,
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });

    it('does not discard current when not testing', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [],
        state: statusEnum.COMPLETE,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        subsetSize: 2,
        binSamples,
        markedEntries: [],
        state: statusEnum.COMPLETE,
        currentBinIndex: 0,
      });
    });

    describe('the current section was not failed', () => {
      it('discards current and moves to next section', () => {
        expect(characterTestReducer({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: false },
          ],
          state: statusEnum.TESTING,
          currentBinIndex: 0,
        }, {
          type: actionTypes.TEST_CARD_MARK_KNOWN
        })).toEqual({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: false },
            { ...characters[0][1], originBinIndex: 0, known: true },
          ],
          isShowDefinition: false,
          state: statusEnum.TESTING,
          currentBinIndex: 1,
        });
      });
    });

    describe('the current section was aced', () => {
      it('discards current and moves ahead 2 sections', () => {
        expect(characterTestReducer({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: true },
          ],
          state: statusEnum.TESTING,
          currentBinIndex: 0,
        }, {
          type: actionTypes.TEST_CARD_MARK_KNOWN
        })).toEqual({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: true },
            { ...characters[0][1], originBinIndex: 0, known: true },
          ],
          isShowDefinition: false,
          state: statusEnum.TESTING,
          currentBinIndex: 2,
        });
      });
    });

    describe('the current section is the first failed', () => {
      it('discards current and moves to next section', () => {
        expect(characterTestReducer({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: true },
            { ...characters[0][1], originBinIndex: 0, known: true },
            { ...characters[1][0], originBinIndex: 1, known: false },
          ],
          state: statusEnum.TESTING,
          currentBinIndex: 1,
        }, {
          type: actionTypes.TEST_CARD_MARK_UNKNOWN
        })).toEqual({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: true },
            { ...characters[0][1], originBinIndex: 0, known: true },
            { ...characters[1][0], originBinIndex: 1, known: false },
            { ...characters[1][1], originBinIndex: 1, known: false },
          ],
          isShowDefinition: false,
          state: statusEnum.TESTING,
          currentBinIndex: 2,
        });
      });
    });

    describe('the current section is the 2nd failed', () => {
      it('discards current and completes the test', () => {
        expect(characterTestReducer({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: true },
            { ...characters[0][1], originBinIndex: 0, known: true },
            { ...characters[1][0], originBinIndex: 1, known: false },
            { ...characters[1][1], originBinIndex: 1, known: false },
            { ...characters[2][0], originBinIndex: 2, known: false },
          ],
          state: statusEnum.TESTING,
          currentBinIndex: 2,
        }, {
          type: actionTypes.TEST_CARD_MARK_UNKNOWN
        })).toEqual({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: true },
            { ...characters[0][1], originBinIndex: 0, known: true },
            { ...characters[1][0], originBinIndex: 1, known: false },
            { ...characters[1][1], originBinIndex: 1, known: false },
            { ...characters[2][0], originBinIndex: 2, known: false },
            { ...characters[2][1], originBinIndex: 2, known: false },
          ],
          isShowDefinition: false,
          state: statusEnum.COMPLETE,
          currentBinIndex: 2,
        });
      });
    });

    describe('the current section is the 1st section and it was failed', () => {
      it('discards current and completes the test', () => {
        expect(characterTestReducer({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: false },
          ],
          state: statusEnum.TESTING,
          currentBinIndex: 0,
        }, {
          type: actionTypes.TEST_CARD_MARK_UNKNOWN
        })).toEqual({
          subsetSize: 2,
          binSamples,
          markedEntries: [
            { ...characters[0][0], originBinIndex: 0, known: false },
            { ...characters[0][1], originBinIndex: 0, known: false },
          ],
          isShowDefinition: false,
          state: statusEnum.COMPLETE,
          currentBinIndex: 0,
        });
      });
    });
  });

  describe('undoing', () => {
    const characters = [
      [{ i: 1 }, { i: 2 }],
      [{ i: 3 }, { i: 4 }],
      [{ i: 5 }, { i: 6 }],
    ];
    const binSamples = [
      { binIndex: 0, characters: characters[0] },
      { binIndex: 1, characters: characters[1] },
      { binIndex: 2, characters: characters[2] },
    ];

    it('does not undo the previous mark when not testing', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: false },
          { ...characters[0][1], originBinIndex: 0, known: false },
        ],
        state: statusEnum.COMPLETE,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: false },
          { ...characters[0][1], originBinIndex: 0, known: false },
        ],
        state: statusEnum.COMPLETE,
        currentBinIndex: 0,
      });
    });

    it('un-does the previous mark back to the previous card', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: false },
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        subsetSize: 2,
        binSamples,
        isShowDefinition: false,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });

    it('un-does the previous mark back to the previous section', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: false },
          { ...characters[0][1], originBinIndex: 0, known: true },
          { ...characters[1][0], originBinIndex: 0, known: false },
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 1,
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        subsetSize: 2,
        binSamples,
        isShowDefinition: false,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: false },
          { ...characters[0][1], originBinIndex: 0, known: true },
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });

    it('un-does the previous mark back to the last scored section', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: true },
          { ...characters[0][1], originBinIndex: 0, known: true },
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 2,
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        subsetSize: 2,
        binSamples,
        isShowDefinition: false,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: true },
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });

    it('un-does the first card', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [
          { ...characters[0][0], originBinIndex: 0, known: true },
        ],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        subsetSize: 2,
        binSamples,
        isShowDefinition: false,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });

    it('does not undo beyond the first card', () => {
      expect(characterTestReducer({
        subsetSize: 2,
        binSamples,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        subsetSize: 2,
        binSamples,
        isShowDefinition: false,
        markedEntries: [],
        state: statusEnum.TESTING,
        currentBinIndex: 0,
      });
    });
  });

  describe('character set', () => {
    it('sets the character set to "simplified"', () => {
      expect(characterTestReducer({
        characterSet: characterSetEnum.TRADITIONAL
      }, {
        type: actionTypes.TEST_SET_CHARACTER_SET_SIMPLIFIED
      })).toEqual({
        characterSet: characterSetEnum.SIMPLIFIED
      })
    });

    it('sets the character set to "traditional"', () => {
      expect(characterTestReducer({
        characterSet: characterSetEnum.SIMPLIFIED
      }, {
        type: actionTypes.TEST_SET_CHARACTER_SET_TRADITIONAL
      })).toEqual({
        characterSet: characterSetEnum.TRADITIONAL
      })
    });
  });

  describe('selectors', () => {
    const characters = [
      [{ i: 1, cs: '从' }, { i: 2 }],
      [{ i: 3 }, { i: 4 }],
      [{ i: 5 }, { i: 6 }],
    ];
    const binSamples = [
      { binIndex: 0, characters: characters[0] },
      { binIndex: 1, characters: characters[1] },
      { binIndex: 2, characters: characters[2] },
    ];

    describe('currentCard', () => {
      function exampleState({ state = statusEnum.TESTING, characterSet } = {}) {
        return {
          characterTestReducer: {
            state,
            characterSet,
            currentBinIndex: 0,
            binSamples,
            markedEntries: [{ ...characters[0][0], known: true}]
          }
        };
      }

      it('returns undefined when not testing', () => {
        expect(currentCard(exampleState({ state: statusEnum.RESULTS_READY }))).toBeUndefined();
      });

      it('returns the current card', () => {
        expect(currentCard(exampleState())).toEqual({ i: 1, cs: '从' });
      });
    });

    describe('missedCards', () => {
      it('returns a list of cards which were missed', () => {
        const markedEntries = [
          { i: 1, known: false },
          { i: 2, known: true },
          { i: 3, known: false },
          { i: 4, known: true },
          { i: 5, known: false },
        ];
        expect(missedCards({ characterTestReducer: { markedEntries } }))
          .toEqual([
            { i: 1, known: false },
            { i: 3, known: false },
            { i: 5, known: false },
          ]);
      });
    });
  });

  describe('test results', () => {
    it('starts loading test results', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.TEST_RESULTS_SUBMIT_START
      })).toEqual({
        state: 'LOADING_RESULTS',
        resultData: null
      });
    });

    it('receives the curve parameters', () => {
      const resultData = {
        samplePoints: [[125, 0]],
        curvePoints: [[0, 0], [250, 0]],
        knownEstimate: 720,
        knownEstimateUncertainty: 120
      };

      expect(characterTestReducer(null, {
        type: actionTypes.TEST_RESULTS_SUBMIT_SUCCESS,
        resultData
      })).toEqual({
        state: 'RESULTS_READY',
        resultData
      });
    });

    it('receives the curve parameters', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.TEST_RESULTS_SUBMIT_FAIL
      })).toEqual({
        state: 'ERROR'
      });
    });

    it('shows existing test results', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.TEST_RESULTS_SHOW
      })).toEqual({
        state: statusEnum.RESULTS_READY
      });
    });
  });

  describe('review missed characters', () => {
    it('starts loading character samples', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.REVIEW_MISSED_START
      })).toEqual({
        state: statusEnum.REVIEW
      });
    });
  });
});
