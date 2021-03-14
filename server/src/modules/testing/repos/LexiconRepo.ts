import { Lexicon } from '../domain/Leixcon';

export interface LexiconRepo {
  getLexicon(lexiconName: string): Promise<Lexicon | null>;
}
