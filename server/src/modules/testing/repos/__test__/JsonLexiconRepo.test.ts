import { JsonLexiconRepo } from '../JsonLexiconRepo';
import { LexiconId } from '../../domain/Lexicon';

describe('JsonLexiconRepo', () => {
  it('gets the Chinese Mandarin lexicon', async () => {
    const repo = new JsonLexiconRepo();
    const result = await repo.getLexicon(LexiconId.CHINESE_MANDARIN);
    expect(result.id).toEqual(LexiconId.CHINESE_MANDARIN);
    expect(result.lexemes).toEqual([]);
  });
});
