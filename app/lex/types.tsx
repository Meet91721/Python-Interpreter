export type pattern = {
  name: string;
  pattern: RegExp;
}

export type token = {
  name: string;
  lexeme: string;
  symbol?: number;
};

export type lex = {
  iter: number;
  tokens: token[];
  table: token[];
};
