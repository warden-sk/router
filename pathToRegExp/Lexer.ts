/*
 * Copyright 2021 Marek Kobida
 */

class Lexer {
  private i: number = 0;

  private tokens: Lexer.Token[] = [];

  private addToken(type: Lexer.Token['type'], index: number, atIndex: string): Lexer.Token[] {
    this.tokens.push({ atIndex, index, type });

    return this.tokens;
  }

  test(path: string): Lexer.Token[] {
    while (this.i < path.length) {
      const character = path[this.i];

      if (character === '\\') {
        this.addToken('ESCAPED_CHARACTER', this.i++, path[this.i++]);
        continue;
      }

      if (character === '*' || character === '+' || character === '?') {
        this.addToken('MODIFIER', this.i, path[this.i++]);
        continue;
      }

      if (character === ':') {
        let j = this.i + 1;
        let parameterName = '';

        while (j < path.length) {
          const $ = path[j];

          if (new RegExp('^[0-9A-Z_a-z]+$').test($)) {
            parameterName += path[j++];
            continue;
          }

          break;
        }

        if (!parameterName) throw new TypeError(`The parameter name is not valid at ${this.i}.`);

        this.addToken('PARAMETER_NAME', this.i, parameterName);

        this.i = j;
        continue;
      }

      if (character === '(') {
        let $ = 1;
        let j = this.i + 1;
        let pattern = '';

        if (path[j] === '?') throw new TypeError(`The "?" is not allowed at ${j}.`);

        while (j < path.length) {
          if (path[j] === '\\') {
            pattern += path[j++] + path[j++];
            continue;
          }

          if (path[j] === ')') {
            $--;

            if ($ === 0) {
              j++;
              break;
            }
          } else if (path[j] === '(') {
            $++;

            if (path[j + 1] !== '?') throw new TypeError(`The "${path[j + 1]}" is not allowed at ${j}.`);
          }

          pattern += path[j++];
        }

        if ($) throw new TypeError(`The pattern is not valid at  ${this.i}.`);

        if (!pattern) throw new TypeError(`The pattern is not valid at ${this.i}.`);

        this.addToken('PATTERN', this.i, pattern);

        this.i = j;
        continue;
      }

      this.addToken('CHARACTER', this.i, path[this.i++]);
    }

    this.addToken('END', this.i, '');

    return this.tokens;
  }
}

namespace Lexer {
  export interface Token {
    atIndex: string;
    index: number;
    type: 'CHARACTER' | 'END' | 'ESCAPED_CHARACTER' | 'MODIFIER' | 'PARAMETER_NAME' | 'PATTERN';
  }
}

export default Lexer;
