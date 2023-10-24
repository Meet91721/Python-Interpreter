import { pattern } from "./types"

export const reserved = [
  "if",
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
  "try",
  "except",
  "finally",
  "raise",
]

export const patterns: pattern[] = [
  { name: "NEWLINE", pattern: /^\n/ },
  { name: "WHITESPACE", pattern: /^( |\t)+/ },
  { name: "COMMENT", pattern: /^(#.*)/ },
  { name: "RESERVED", pattern: new RegExp(`^(${reserved.join("|")})`) },
  { name: "BOOLEAN", pattern: /^(True|False)/ },
  { name: "NUMBER", pattern: /^(\+|-)?([0-9]+)(\.[0-9]+)?((e|E)(\+|-)?([0-9]+))?/ },
  { name: "STRING", pattern: /^(("(\\.|[^"\\])*")|('(\\.|[^'\\])*'))/ },
  { name: "OPERATOR", pattern: /^(\+|-|\*|\/\/|\/|%|<<|>>|&|\||\^|~|<=|>=|<|>|==|!=|and|or|not)/ },
  { name: "IDENTIFIER", pattern: /^([a-zA-Z_][a-zA-Z0-9_]*)/ },
  { name: "ASSIGNMENT", pattern: /^(=|\+=|-=|\*=|\/\/=|\/=|%=|<<=|>>=|&=|\|=|\^=)/ },
  { name: "PUNCTUATION", pattern: /^(\(|\)|\[|\]|\{|\}|,|:|;|\.|@)/ },
]
