import prepareBins from './prepareBins.testutil';
import { actionTypes } from './characterTestActions';
import characterTestReducer, {
  scoreStatistics,
  currentCard,
  statusEnum,
  characterSetEnum,
  missedCards
} from './characterTestReducer';

describe('characterTestReducer', () => {
  it('has defaults', () => {
    expect(characterTestReducer()).toEqual({
      bins: [],
      seed: -1,
      isShowDefinition: false,
      state: 'READY',
      currentSectionIndex: 0,
      currentCardIndex: 0,
      resultData: null,
      characterSet: 'SIMPLIFIED'
    });
  });

  describe('loading', () => {
    it('starts loading character samples', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START
      })).toEqual({
        bins: [],
        state: 'LOADING'
      });
    });

    it('successfully loads character samples and starts the test', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        sampleData: {
          seed: 9999,
          characters: [
            {
              range: [0, 2],
              sample: [
                { i: 1, cs: '的', ct: '的', p: 'de', d: '(possessive particle)' },
                { i: 2, cs: '一', ct: '一', p: 'yi1', d: 'one' },
              ]
            },
            {
              range: [2, 3],
              sample: [
                { i: 3, cs: '从', ct: '從', p: 'cong2', d: 'from' }
              ]
            }
          ]
        }
      })).toEqual({
        seed: 9999,
        bins: [
          {
            range: [0, 2],
            sample: [
              {
                index: 1,
                simplified: '的',
                traditional: '的',
                pinyin: 'de',
                definition: '(possessive particle)',
                score: NaN
              },
              {
                index: 2,
                simplified: '一',
                traditional: '一',
                pinyin: 'yi1',
                definition: 'one',
                score: NaN
              },
            ]
          },
          {
            range: [2, 3],
            sample: [
              {
                index: 3,
                simplified: '从',
                traditional: '從',
                pinyin: 'cong2' ,
                definition: 'from',
                score: NaN
              }
            ]
          }
        ],
        state: 'TESTING'
      });
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
    it('does not mark if not testing', () => {
      const bins = prepareBins(
        [0, 0, 0, 0, 0],
        [NaN, NaN, NaN, NaN, NaN],
      );
      expect(characterTestReducer({
        bins,
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        bins,
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    it('marks current as unknown', () => {
      expect(characterTestReducer({
        bins: [
          { sample: [
            { score: NaN },
            { score: NaN },
          ] },
          { sample: [
            { score: NaN }
          ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_UNKNOWN
      })).toEqual({
        bins: [
          { sample: [
            { score: 0 },
            { score: NaN },
          ] },
          { sample: [
            { score: NaN }
          ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    it('marks current as known', () => {
      expect(characterTestReducer({
        bins: [
          { sample: [
            { score: NaN },
            { score: NaN },
          ] },
          { sample: [
            { score: NaN }
          ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        bins: [
          { sample: [
            { score: 1 },
            { score: NaN },
          ] },
          { sample: [
            { score: NaN }
          ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    it('clears current card mark', () => {
      expect(characterTestReducer({
        bins: [
          { sample: [
            { score: 0 },
            { score: NaN },
          ] },
          { sample: [
            { score: NaN }
          ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_CLEAR
      })).toEqual({
        bins: [
          { sample: [
            { score: NaN },
            { score: NaN },
          ] },
          { sample: [
            { score: NaN }
          ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });
  });

  describe('discarding', () => {
    it('discards current and moves to next card', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_DISCARD
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 1,
        isShowDefinition: false
      });
    });

    it('does not discard current when not testing', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_DISCARD
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    describe('the current section was not failed', () => {
      const bins = prepareBins(
        [1, 0, 0, 0, 0],
        [NaN, NaN, NaN, NaN, NaN]
      );

      it('discards current and moves to next section', () => {
        expect(characterTestReducer({
          bins,
          state: 'TESTING',
          currentSectionIndex: 0,
          currentCardIndex: 4
        }, {
          type: actionTypes.TEST_CARD_DISCARD
        })).toEqual({
          bins,
          state: 'TESTING',
          currentSectionIndex: 1,
          currentCardIndex: 0,
          isShowDefinition: false
        });
      });
    });

    describe('the current section was aced', () => {
      const bins = prepareBins(
        [1, 1, 1, 1, 1],
        [NaN, NaN, NaN, NaN, NaN],
        [NaN, NaN, NaN, NaN, NaN]
      );

      it('discards current and moves ahead 2 sections', () => {
        expect(characterTestReducer({
          bins,
          state: 'TESTING',
          currentSectionIndex: 0,
          currentCardIndex: 4
        }, {
          type: actionTypes.TEST_CARD_DISCARD
        })).toEqual({
          bins,
          state: 'TESTING',
          currentSectionIndex: 2,
          currentCardIndex: 0,
          isShowDefinition: false
        });
      });
    });

    describe('the current section is the first failed', () => {
      const bins = prepareBins(
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [NaN, NaN, NaN, NaN, NaN]
      );

      it('discards current and moves to next section', () => {
        expect(characterTestReducer({
          bins,
          state: 'TESTING',
          currentSectionIndex: 1,
          currentCardIndex: 4
        }, {
          type: actionTypes.TEST_CARD_DISCARD
        })).toEqual({
          bins,
          state: 'TESTING',
          currentSectionIndex: 2,
          currentCardIndex: 0,
          isShowDefinition: false
        });
      });
    });

    describe('the current section is the 2nd failed', () => {
      const bins = prepareBins(
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [NaN, NaN, NaN, NaN, NaN]
      );

      it('discards current and completes the test', () => {
        expect(characterTestReducer({
          bins,
          state: 'TESTING',
          currentSectionIndex: 2,
          currentCardIndex: 4
        }, {
          type: actionTypes.TEST_CARD_DISCARD
        })).toEqual({
          bins,
          state: 'COMPLETE',
          currentSectionIndex: 0,
          currentCardIndex: 0,
          isShowDefinition: false
        });
      });
    });

    describe('the current section is the 1st section and it was failed', () => {
      const bins = prepareBins(
        [0, 0, 0, 0, 0],
        [NaN, NaN, NaN, NaN, NaN],
        [NaN, NaN, NaN, NaN, NaN]
      );

      it('discards current and completes the test', () => {
        expect(characterTestReducer({
          bins,
          state: 'TESTING',
          currentSectionIndex: 0,
          currentCardIndex: 4
        }, {
          type: actionTypes.TEST_CARD_DISCARD
        })).toEqual({
          bins,
          state: 'COMPLETE',
          currentSectionIndex: 0,
          currentCardIndex: 0,
          isShowDefinition: false
        });
      });
    });
  });

  describe('undoing', () => {
    it('does not undo the previous mark when not testing', () => {
      const bins = prepareBins(
        [0, 0, 0, 0, 0],
        [NaN, NaN, NaN, NaN, NaN],
        [NaN, NaN, NaN, NaN, NaN]
      );

      expect(characterTestReducer({
        bins,
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 2
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        bins,
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 2
      });
    });

    it('un-does the previous mark back to the previous card', () => {
      expect(characterTestReducer({
        bins: [
          { sample: [
              { index: 1, score: 1 },
              { index: 2, score: 1 },
              { index: 3, score: NaN }
            ] },
          { sample: [
              { index: 4, score: NaN },
            ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 2
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        bins: [
          { sample: [
              { index: 1, score: 1 },
              { index: 2, score: NaN },
              { index: 3, score: NaN }
            ] },
          { sample: [
              { index: 4, score: NaN },
            ] }
        ],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 1,
        isShowDefinition: false
      });
    });

    it('un-does the previous mark back to the previous section', () => {
      expect(characterTestReducer({
        bins: prepareBins(
          [1, 1, 0],
          [NaN, NaN],
        ),
        state: 'TESTING',
        currentSectionIndex: 1,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        bins: prepareBins(
          [1, 1, NaN],
          [NaN, NaN],
        ),
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 2,
        isShowDefinition: false
      });
    });

    it('un-does the previous mark back to the last scored section', () => {
      const { bins: resultBins, ...result } = characterTestReducer({
        bins: prepareBins(
          [1, 1, 1],
          [1, 1, 1],
          [NaN, NaN, NaN],
          [NaN, NaN, NaN],
          [NaN, NaN, NaN]
        ),
        state: 'TESTING',
        currentSectionIndex: 4,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      });

      expect(result).toEqual({
        state: 'TESTING',
        currentSectionIndex: 1,
        currentCardIndex: 2,
        isShowDefinition: false
      });
      expect(resultBins).toEqual(prepareBins(
        [1, 1, 1],
        [1, 1, NaN],
        [NaN, NaN, NaN],
        [NaN, NaN, NaN],
        [NaN, NaN, NaN]
      ));
    });

    it('does not undo beyond the first card', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_DISCARD_UNDO
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0,
        isShowDefinition: false
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
    describe('scoreStatistics', () => {
      it('calculates the current statistics', () => {
        expect(scoreStatistics({
          characterTestReducer: {
            bins: prepareBins(
              [1, 1, 1, 1, 0],
              [NaN, NaN, NaN, NaN, NaN],
              [0, 0, 0, 0, 0],
              [1, 0, NaN, NaN, NaN],
            )
          }
        })).toEqual({
          lastTestedSectionIndex: 3,
          failedSectionCount: 1,
          sectionStats: [
            { range: [0, 5], isTested: true, knownPercent: 80 },
            { range: [5, 10], isTested: false, knownPercent: NaN },
            { range: [10, 15], isTested: true, knownPercent: 0 },
            { range: [15, 20], isTested: true, knownPercent: NaN }
          ]
        });
      });

      it('memoizes the result on the "bins" instance', () => {
        const binsA = prepareBins([1]);
        const binsB = prepareBins([0]);

        const results = [
          scoreStatistics({ characterTestReducer: { bins: binsA }}),
          scoreStatistics({ characterTestReducer: { bins: binsA }}),
          scoreStatistics({ characterTestReducer: { bins: binsB }}),
          scoreStatistics({ characterTestReducer: { bins: binsB }}),
          scoreStatistics({ characterTestReducer: { bins: binsA }})
        ];

        expect(results[0]).toBe(results[1]);
        expect(results[1]).not.toBe(results[2]);
        expect(results[2]).toBe(results[3]);
        expect(results[3]).not.toBe(results[4]);
      })
    });

    describe('currentCard', () => {
      function exampleState({ state = statusEnum.TESTING, characterSet } = {}) {
        return {
          characterTestReducer: {
            state,
            characterSet,
            currentSectionIndex: 1,
            currentCardIndex: 1,
            bins: [{}, {
              sample: [{}, {
                simplified: '从',
                traditional: '從'
              }]
            }]
          }
        };
      }

      it('returns null when not testing', () => {
        expect(currentCard(exampleState({
          state: statusEnum.RESULTS_READY
        }))).toEqual(null)
      });

      it('returns the simplified card (default)', () => {
        expect(currentCard(exampleState()))
          .toEqual({ character: '从' })
      });

      it('returns the simplified card (default)', () => {
        expect(currentCard(exampleState({
          characterSet: characterSetEnum.TRADITIONAL
        })))
          .toEqual({ character: '從' })
      });
    });

    describe('missedCards', () => {
      const { bins, missedCardsResult } = require('./__testdata__/characterTestReducer_missedCards.testutil');

      it('returns a list of cards which were missed', () => {
        expect(missedCards({ characterTestReducer: { bins } }))
          .toEqual(missedCardsResult);
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
