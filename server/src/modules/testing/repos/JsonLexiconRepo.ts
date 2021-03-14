import { LexiconRepo } from './LexiconRepo';
import { Lexicon, LexiconId } from '../domain/Lexicon';

export class JsonLexiconRepo implements LexiconRepo {
  async getLexicon(lexiconId: LexiconId): Promise<Lexicon | null> {
    switch (lexiconId) {
      case LexiconId.CHINESE_MANDARIN:
        return Lexicon.create({ id: LexiconId.CHINESE_MANDARIN, lexemes: [] });
      default:
        return null;
    }
  }
}
