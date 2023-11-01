import { GRAMMAR } from "@/components/outputs/parser";

// Grammer for python like language
export const grammer: GRAMMAR = {};

grammer["START"] = [
  ["STATEMENT", "START?"],
];

grammer["BLOCK"] = [
  ["whitespace", "STATEMENT", "BLOCK?"],
];
grammer["STATEMENT"] = [
  ["SIMPLE", "whitespace?", "comment?", "newline"],
  ["COMPOUND"],
  ["newline"],
];

grammer["SIMPLE"] = [
  ["whitespace"],
  ["comment"],
  ["EXPRESSION"],
  ["identifier", "whitespace?", "assignment", "whitespace?", "EXPRESSION"],
  ["reserved:return", "whitespace", "EXPRESSION"],
  ["reserved:pass"],
  ["reserved:break"],
  ["reserved:continue"],
];

grammer["COMPOUND"] = [
  ["IF"],
  ["WHILE"],
  ["FOR"],
  ["FUNCTION"],
];

grammer["IF"] = [
  ["reserved:if", "whitespace", "EXPRESSION", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK", "ELIF?"],
];
grammer["ELIF"] = [
  ["whitespace?", "reserved:elif", "whitespace", "EXPRESSION", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK", "ELIF?"],
  ["ELSE?"],
];
grammer["ELSE"] = [
  ["whitespace?", "reserved:else", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK"],
];

grammer["WHILE"] = [
  ["reserved:while", "whitespace", "EXPRESSION", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK", "ELSE?"],
];

grammer["FOR"] = [
  ["reserved:for", "whitespace", "identifier", "whitespace", "reserved:in",
    "whitespace", "EXPRESSION", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK", "ELSE?"],
];

grammer["FUNCTION"] = [
  ["reserved:def", "whitespace", "identifier", "whitespace?", "punctuation:(",
    "whitespace?", "ARGS?", "whitespace?", "punctuation:)",
    "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK"],
];
grammer["ARGS"] = [
  ["identifier", "ARGS_PRIME?"],
];
grammer["ARGS_PRIME"] = [
  ["whitespace?", "punctuation:,", "whitespace?", "identifier", "ARGS_PRIME?"],
];
grammer["FUNCTION_CALL"] = [
  ["identifier", "whitespace?", "punctuation:(", "whitespace?", "PARAMS?", "whitespace?", "punctuation:)"],
];
grammer["PARAMS"] = [
  ["EXPRESSION", "PARAMS_PRIME?"],
];
grammer["PARAMS_PRIME"] = [
  ["whitespace?", "punctuation:,", "whitespace?", "EXPRESSION", "PARAMS_PRIME?"],
];

grammer["EXPRESSION"] = [
  ["COMPARISION", "whitespace?", "EXPRESSION_PRIME?"],
];
grammer["EXPRESSION_PRIME"] = [
  ["operator:and", "whitespace?", "COMPARISION", "whitespace?", "EXPRESSION_PRIME?"],
  ["operator:or", "whitespace?", "COMPARISION", "whitespace?", "EXPRESSION_PRIME?"],
];

grammer["COMPARISION"] = [
  ["BITWISE", "whitespace?", "COMPARISION_PRIME?"],
];
grammer["COMPARISION_PRIME"] = [
  ["comparator:<=", "whitespace?", "BITWISE", "whitespace?", "COMPARISION_PRIME?"],
  ["comparator:>=", "whitespace?", "BITWISE", "whitespace?", "COMPARISION_PRIME?"],
  ["comparator:<", "whitespace?", "BITWISE", "whitespace?", "COMPARISION_PRIME?"],
  ["comparator:>", "whitespace?", "BITWISE", "whitespace?", "COMPARISION_PRIME?"],
  ["comparator:==", "whitespace?", "BITWISE", "whitespace?", "COMPARISION_PRIME?"],
  ["comparator:!=", "whitespace?", "BITWISE", "whitespace?", "COMPARISION_PRIME?"],
];

grammer["BITWISE"] = [
  ["OPERAND", "whitespace?", "BITWISE_PRIME?"],
];
grammer["BITWISE_PRIME"] = [
  ["bitwise:<<", "whitespace?", "OPERAND", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:>>", "whitespace?", "OPERAND", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:&", "whitespace?", "OPERAND", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:|", "whitespace?", "OPERAND", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:^", "whitespace?", "OPERAND", "whitespace?", "BITWISE_PRIME?"],
];

grammer["OPERAND"] = [
  ["TERM", "whitespace?", "OPERAND_PRIME?"],
];
grammer["OPERAND_PRIME"] = [
  ["operator:+", "whitespace?", "TERM", "whitespace?", "OPERAND_PRIME?"],
  ["operator:-", "whitespace?", "TERM", "whitespace?", "OPERAND_PRIME?"],
];

grammer["TERM"] = [
  ["FACTOR", "whitespace?", "TERM_PRIME?"],
];
grammer["TERM_PRIME"] = [
  ["operator:%", "whitespace?", "FACTOR", "whitespace?", "TERM_PRIME?"],
  ["operator://", "whitespace?", "FACTOR", "whitespace?", "TERM_PRIME?"],
  ["operator:/", "whitespace?", "FACTOR", "whitespace?", "TERM_PRIME?"],
  ["operator:*", "whitespace?", "FACTOR", "whitespace?", "TERM_PRIME?"],
];

grammer["FACTOR"] = [
  ["punctuation:(", "whitespace?", "EXPRESSION", "whitespace?", "punctuation:)"],
  ["FUNCTION_CALL"],
  ["none"],
  ["boolean"],
  ["int"],
  ["float"],
  ["string"],
  ["identifier"],
];
