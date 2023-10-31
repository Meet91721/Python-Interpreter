import {
  GRAMMAR,
} from "@/components/outputs/ast";

// Grammer for python like language
export const grammer: GRAMMAR = {};

grammer["PROGRAM"] = [
  ["STATEMENT", "whitespace?", "comment?", "newline?", "PROGRAM?"],
];
grammer["BLOCK"] = [
  ["whitespace", "STATEMENT", "whitespace?", "comment?", "newline?", "BLOCK?"],
];
grammer["STATEMENT"] = [
  ["SIMPLE"],
  ["COMPOUND"],
  ["EPSILON"],
];

grammer["SIMPLE"] = [
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
  ["reserved:elif", "whitespace", "EXPRESSION", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK", "ELIF?"],
  ["ELSE"],
];
grammer["ELSE"] = [
  ["reserved:else", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK"],
];

grammer["WHILE"] = [
  ["reserved:while", "whitespace", "EXPRESSION", "whitespace?", "punctuation::",
    "whitespace?", "comment?", "newline",
    "BLOCK", "ELSE?"],
];

grammer["FOR"] = [
  ["reserved:for", "whitespace", "identifier", "whitespace?", "reserved:in",
    "whitespace?", "EXPRESSION", "whitespace?", "punctuation::",
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
  ["TERM", "whitespace?", "BITWISE_PRIME?"],
];
grammer["BITWISE_PRIME"] = [
  ["bitwise:<<", "whitespace?", "TERM", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:>>", "whitespace?", "TERM", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:&", "whitespace?", "TERM", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:|", "whitespace?", "TERM", "whitespace?", "BITWISE_PRIME?"],
  ["bitwise:^", "whitespace?", "TERM", "whitespace?", "BITWISE_PRIME?"],
];

grammer["TERM"] = [
  ["OPERAND", "whitespace?", "TERM_PRIME?"],
];
grammer["TERM_PRIME"] = [
  ["operator:+", "whitespace?", "OPERAND", "whitespace?", "TERM_PRIME?"],
  ["operator:-", "whitespace?", "OPERAND", "whitespace?", "TERM_PRIME?"],
];
grammer["OPERAND"] = [
  ["FACTOR", "whitespace?", "OPERAND_PRIME?"],
];
grammer["OPERAND_PRIME"] = [
  ["operator:%", "whitespace?", "FACTOR", "whitespace?", "OPERAND_PRIME?"],
  ["operator://", "whitespace?", "FACTOR", "whitespace?", "OPERAND_PRIME?"],
  ["operator:/", "whitespace?", "FACTOR", "whitespace?", "OPERAND_PRIME?"],
  ["operator:*", "whitespace?", "FACTOR", "whitespace?", "OPERAND_PRIME?"],
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
