import { PATTERN } from "@/components/outputs/lex";

export const reserved = [
  "if",
  "elif",
  "else",
  "in",
  "is",
  "while",
  "for",
  "pass",
  "break",
  "continue",
  "def",
  "return",
]

export const patterns: PATTERN[] = [
  { type: "NEWLINE", re: /^\n/ },
  { type: "WHITESPACE", re: /^( |\t)+/ },
  { type: "COMMENT", re: /^(#.*)/ },
  { type: "RESERVED", re: new RegExp(`^(${reserved.join("|")})`) },
  { type: "NONE", re: /^None/ },
  { type: "BOOLEAN", re: /^(True|False)/ },
  { type: "INT", re: /^([0-9]+)/ },
  { type: "FLOAT", re: /^([0-9]+)(\.[0-9]+)?((e|E)(\+|-)?([0-9]+))?/ },
  { type: "STRING", re: /^(("(\\.|[^"\\])*")|('(\\.|[^'\\])*'))/ },
  { type: "OPERATOR", re: /^(\+|-|\*|\/\/|\/|%|and|or)/ },
  { type: "BITWISE", re: /^(<<|>>|&|\||\^)/ },
  { type: "COMPARATOR", re: /^(<=|>=|<|>|==|!=)/ },
  { type: "IDENTIFIER", re: /^([a-zA-Z_][a-zA-Z0-9_]*)/ },
  { type: "ASSIGNMENT", re: /^(=|\+=|-=|\*=|\/\/=|\/=|%=|<<=|>>=|&=|\|=|\^=)/ },
  { type: "PUNCTUATION", re: /^(\(|\)|\[|\]|\{|\}|,|:|;|\.|@)/ },
]

// Create a lookup for the index of each pattern
const indexLookup = patterns.reduce((acc, { type }, i) => {
  acc[type] = i;
  return acc;
}, { "UNKNOWN": -1, "EOF": -1 } as Record<string, number>);

// Assign a color to each pattern
const gradient = 360 / patterns.length;
function colorize(index: number) {
  const hue = (7 * gradient * (index + 1)) % 360; // 5 is a magic number
  return `hsl(${hue}, 60%, 60%)`;
}

export function colorizeToken(token: string) {
  const index = indexLookup[token];
  return colorize(index);
}
