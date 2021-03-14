import { Lexeme } from './Lexeme';

export enum LexiconId {
  CHINESE_MANDARIN = 'zh-cn'
}

export interface LexiconProps {
  id: LexiconId;
  lexemes: Lexeme[];
}

export class Lexicon {
  get id(): LexiconId {
    return this.props.id;
  }

  get lexemes(): Lexeme[] {
    return this.props.lexemes;
  }

  static create(props: LexiconProps): Lexicon {
    return new Lexicon(props);
  }

  private constructor(private readonly props: LexiconProps) {
    this.props = props;
  }
}
