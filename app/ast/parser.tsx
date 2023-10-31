import { AST, NODE } from "@/components/outputs/ast";
import { LEX } from "@/components/outputs/lex";

import { grammer } from "./grammer";

let ast: AST;
let lex: LEX;
let Push: Function;
let Pop: Function;

export function* init(
  _ast: AST,
  _lex: LEX,
  _Push: Function,
  _Pop: Function,
) {
  ast = _ast;
  lex = _lex;
  Push = _Push;
  Pop = _Pop;

  Push("PROGRAM");
  yield;

  for (const message of PROGRAM()) yield message;
}

/////////////////////////////////////////////////////////////////////
// Tokens
/////////////////////////////////////////////////////////////////////
function* newline(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing newline at ${ast.iter}`);
  else if (top.includes("newline") === false) throw new Error(`Top of stack is not newline, got ${top} at ${ast.iter}`);

  if (token.type === "NEWLINE") {
    ast.iter += 1;
    const node: NODE = { name: "newline", attributes: {}, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected newline, got ${token.type} at ${token.line}:${token.column}`);
}

function* whitespace(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing whitespace at ${ast.iter}`);
  else if (top.includes("whitespace") === false) throw new Error(`Top of stack is not whitespace, got ${top} at ${ast.iter}`);

  if (token.type === "WHITESPACE") {
    ast.iter += 1;
    const node: NODE = { name: "whitespace", attributes: {}, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected whitespace, got ${token.type} at ${token.line}:${token.column}`);
}

function* comment(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing comment at ${ast.iter}`);
  else if (top.includes("comment") === false) throw new Error(`Top of stack is not comment, got ${top} at ${ast.iter}`);

  if (token.type === "COMMENT") {
    ast.iter += 1;
    const node: NODE = { name: "comment", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected comment, got ${token.type} at ${token.line}:${token.column}`);
}

function* reserved(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing reserved at ${ast.iter}`);
  else if (top.includes("reserved") === false) throw new Error(`Top of stack is not reserved, got ${top} at ${ast.iter}`);

  if (token.type === "RESERVED") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "reserved", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected reserved, got ${token.type} at ${token.line}:${token.column}`);
}

function* none(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing none at ${ast.iter}`);
  else if (top.includes("none") === false) throw new Error(`Top of stack is not none, got ${top} at ${ast.iter}`);

  if (token.type === "NONE") {
    ast.iter += 1;
    const node: NODE = { name: "none", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected none, got ${token.type} at ${token.line}:${token.column}`);
}

function* boolean(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing boolean at ${ast.iter}`);
  else if (top.includes("boolean") === false) throw new Error(`Top of stack is not boolean, got ${top} at ${ast.iter}`);

  if (token.type === "BOOLEAN") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "boolean", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected boolean, got ${token.type} at ${token.line}:${token.column}`);
}

function* int(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing int at ${ast.iter}`);
  else if (top.includes("int") === false) throw new Error(`Top of stack is not int, got ${top} at ${ast.iter}`);

  if (token.type === "INT") {
    ast.iter += 1;
    const node: NODE = { name: "int", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected int, got ${token.type} at ${token.line}:${token.column}`);
}

function* float(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing float at ${ast.iter}`);
  else if (top.includes("float") === false) throw new Error(`Top of stack is not float, got ${top} at ${ast.iter}`);

  if (token.type === "FLOAT") {
    ast.iter += 1;
    const node: NODE = { name: "float", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected float, got ${token.type} at ${token.line}:${token.column}`);
}

function* string(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing string at ${ast.iter}`);
  else if (top.includes("string") === false) throw new Error(`Top of stack is not string, got ${top} at ${ast.iter}`);

  if (token.type === "STRING") {
    ast.iter += 1;
    const node: NODE = { name: "string", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected string, got ${token.type} at ${token.line}:${token.column}`);
}

function* operator(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing operator at ${ast.iter}`);
  else if (top.includes("operator") === false) throw new Error(`Top of stack is not operator, got ${top} at ${ast.iter}`);

  if (token.type === "OPERATOR") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "operator", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected operator, got ${token.type} at ${token.line}:${token.column}`);
}

function* comparator(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing comparator at ${ast.iter}`);
  else if (top.includes("comparator") === false) throw new Error(`Top of stack is not comparator, got ${top} at ${ast.iter}`);

  if (token.type === "COMPARATOR") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "comparator", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected comparator, got ${token.type} at ${token.line}:${token.column}`);
}

function* bitwise(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing bitwise at ${ast.iter}`);
  else if (top.includes("bitwise") === false) throw new Error(`Top of stack is not bitwise, got ${top} at ${ast.iter}`);

  if (token.type === "BITWISE") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "bitwise", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected bitwise, got ${token.type} at ${token.line}:${token.column}`);
}

function* identifier(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing identifier at ${ast.iter}`);
  else if (top.includes("identifier") === false) throw new Error(`Top of stack is not identifier, got ${top} at ${ast.iter}`);

  if (token.type === "IDENTIFIER") {
    ast.iter += 1;
    const node: NODE = { name: "identifier", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected identifier, got ${token.type} at ${token.line}:${token.column}`);
}

function* assignment(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing assignment at ${ast.iter}`);
  else if (top.includes("assignment") === false) throw new Error(`Top of stack is not assignment, got ${top} at ${ast.iter}`);

  if (token.type === "ASSIGNMENT") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "assignment", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected assignment, got ${token.type} at ${token.line}:${token.column}`);
}

function* punctuation(parent: NODE) {
  const top = Pop() as string;
  const token = lex.tokens[ast.iter];
  const required = top[top.length - 1] !== "?";
  const expected = top.split(/(^.*?\:|\?$)/)[2];

  if (top === null) throw new Error(`Stack empty before reducing punctuation at ${ast.iter}`);
  else if (top.includes("punctuation") === false) throw new Error(`Top of stack is not punctuation, got ${top} at ${ast.iter}`);

  if (token.type === "PUNCTUATION") {
    if (expected && token.lexeme !== expected) throw new Error(`Expected '${expected}', got ${token.lexeme} at ${token.line}:${token.column}`);

    ast.iter += 1;
    const node: NODE = { name: "punctuation", attributes: { lex: token.lexeme }, children: [] };
    parent.children.push(node);
    yield;
  }
  else if (required) throw new Error(`Expected punctuation, got ${token.type} at ${token.line}:${token.column}`);
}

/////////////////////////////////////////////////////////////////////
// Productions
/////////////////////////////////////////////////////////////////////
function* PROGRAM(parent?: NODE) {
  const top = Pop() as string;
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing PROGRAM at ${ast.iter}`);
  else if (top.includes("PROGRAM") === false) throw new Error(`Top of stack is not PROGRAM, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "PROGRAM", attributes: {}, children: [] };
  if (parent === undefined)
    ast.tree = node;
  else
    parent.children.push(node);

  Push("PROGRAM?");
  Push("newline?");
  Push("comment?");
  Push("whitespace?");
  Push("STATEMENT");
  yield;

  for (const message of STATEMENT(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of PROGRAM(node)) yield message;
}

function* BLOCK(parent: NODE) {
  const top = Pop() as string;
  const required = top[top.length - 1] !== "?";

  if (top === null) throw new Error(`Stack empty before reducing BLOCK at ${ast.iter}`);
  else if (top.includes("BLOCK") === false) throw new Error(`Top of stack is not BLOCK, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "BLOCK", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BLOCK?");
  Push("newline?");
  Push("comment?");
  Push("whitespace?");
  Push("STATEMENT");
  Push("whitespace");
  yield;

  for (const message of whitespace(node)) yield message;
  for (const message of STATEMENT(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of BLOCK(node)) yield message;
}

function* STATEMENT(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing STATEMENT at ${ast.iter}`);
  else if (top.includes("STATEMENT") === false) throw new Error(`Top of stack is not STATEMENT, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "STATEMENT", attributes: {}, children: [] };
  parent.children.push(node);

  try {
    if (lookahead.type === "RESERVED") {
      Push("COMPOUND");
      yield;

      for (const message of COMPOUND(node)) yield message;
    } else {
      Push("SIMPLE");
      yield;

      for (const message of SIMPLE(node)) yield message;
    }
  } catch (error) {
    yield; // Episilon
  }
}

function* SIMPLE(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing SIMPLE at ${ast.iter}`);
  else if (top.includes("SIMPLE") === false) throw new Error(`Top of stack is not SIMPLE, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "SIMPLE", attributes: {}, children: [] };
  parent.children.push(node);

  if (lookahead.type === "RESERVED") {
    if (lookahead.lexeme === "return") {
      Push("EXPRESSION");
      Push("whitespace");
      Push("reserved:return");
      yield;

      for (const message of reserved(node)) yield message;
      for (const message of whitespace(node)) yield message;
      for (const message of EXPRESSION(node)) yield message;
    } else {
      Push("reserved");
      yield;

      for (const message of reserved(node)) yield message;
    } // reserved
  } else if (lookahead.type === "IDENTIFIER") {
    if (
      lex.tokens[ast.iter + 1].type === "ASSIGNMENT" ||
      lex.tokens[ast.iter + 2].type === "ASSIGNMENT"
    ) {
      Push("EXPRESSION");
      Push("whitespace?");
      Push("assignment");
      Push("whitespace?");
      Push("identifier");
      yield;

      for (const message of identifier(node)) yield message;
      for (const message of whitespace(node)) yield message;
      for (const message of assignment(node)) yield message;
      for (const message of whitespace(node)) yield message;
      for (const message of EXPRESSION(node)) yield message;
    } else {
      Push("EXPRESSION");
      yield;

      for (const message of EXPRESSION(node)) yield message;
    } // identifier
  } else if (lookahead.type === "COMMENT") {
    Push("comment");
    yield;

    for (const message of comment(node)) yield message;
  }
}

function* COMPOUND(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing COMPOUND at ${ast.iter}`);
  else if (top.includes("COMPOUND") === false) throw new Error(`Top of stack is not COMPOUND, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "COMPOUND", attributes: {}, children: [] };
  parent.children.push(node);

  if (lookahead.type === "RESERVED") {
    if (lookahead.lexeme === "if") {
      Push("IF");
      yield;

      for (const message of IF(node)) yield message;
    } else if (lookahead.lexeme === "while") {
      Push("WHILE");
      yield;

      for (const message of WHILE(node)) yield message;
    } else if (lookahead.lexeme === "for") {
      Push("FOR");
      yield;

      for (const message of FOR(node)) yield message;
    } else if (lookahead.lexeme === "def") {
      Push("FUNCTION");
      yield;

      for (const message of FUNCTION(node)) yield message;
    }
  }
}

function* IF(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing IF at ${ast.iter}`);
  else if (top.includes("IF") === false) throw new Error(`Top of stack is not IF, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "IF", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ELIF?");
  Push("BLOCK");
  Push("newline");
  Push("comment?");
  Push("whitespace?");
  Push("punctuation::");
  Push("whitespace?");
  Push("EXPRESSION");
  Push("whitespace");
  Push("reserved:if");
  yield;

  for (const message of reserved(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of EXPRESSION(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of BLOCK(node)) yield message;
  for (const message of ELIF(node)) yield message;
}

function* ELIF(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing ELIF at ${ast.iter}`);
  else if (top.includes("ELIF") === false) throw new Error(`Top of stack is not ELIF, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "ELIF", attributes: {}, children: [] };
  parent.children.push(node);

  if (lookahead.type === "RESERVED") {
    if (lookahead.lexeme === "elif") {
      Push("ELIF?");
      Push("BLOCK");
      Push("newline");
      Push("comment?");
      Push("whitespace?");
      Push("punctuation::");
      Push("whitespace?");
      Push("EXPRESSION");
      Push("whitespace");
      Push("reserved:elif");
      yield;

      for (const message of reserved(node)) yield message;
      for (const message of whitespace(node)) yield message;
      for (const message of EXPRESSION(node)) yield message;
      for (const message of whitespace(node)) yield message;
      for (const message of punctuation(node)) yield message;
      for (const message of comment(node)) yield message;
      for (const message of newline(node)) yield message;
      for (const message of BLOCK(node)) yield message;
      for (const message of ELIF(node)) yield message;
    } else if (lookahead.lexeme === "else") {
      Push("ELSE");
      yield;

      for (const message of ELSE(node)) yield message;
    }
  }
}

function* ELSE(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing ELSE at ${ast.iter}`);
  else if (top.includes("ELSE") === false) throw new Error(`Top of stack is not ELSE, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "ELSE", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BLOCK");
  Push("newline");
  Push("comment?");
  Push("whitespace?");
  Push("punctuation::");
  Push("whitespace?");
  Push("reserved:else");
  yield;

  for (const message of reserved(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of BLOCK(node)) yield message;
}

function* WHILE(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing WHILE at ${ast.iter}`);
  else if (top.includes("WHILE") === false) throw new Error(`Top of stack is not WHILE, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "WHILE", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ELSE?");
  Push("BLOCK");
  Push("newline");
  Push("comment?");
  Push("whitespace?");
  Push("punctuation::");
  Push("whitespace?");
  Push("EXPRESSION");
  Push("whitespace");
  Push("reserved:while");
  yield;

  for (const message of reserved(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of EXPRESSION(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of BLOCK(node)) yield message;
  for (const message of ELSE(node)) yield message;
}

function* FOR(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing FOR at ${ast.iter}`);
  else if (top.includes("FOR") === false) throw new Error(`Top of stack is not FOR, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "FOR", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ELSE?");
  Push("BLOCK");
  Push("newline");
  Push("comment?");
  Push("whitespace?");
  Push("punctuation::");
  Push("whitespace?");
  Push("EXPRESSION");
  Push("whitespace?");
  Push("reserved:in");
  Push("whitespace?");
  Push("identifier");
  Push("whitespace");
  Push("reserved:for");
  yield;

  for (const message of reserved(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of identifier(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of reserved(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of EXPRESSION(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of BLOCK(node)) yield message;
  for (const message of ELSE(node)) yield message;
}

function* FUNCTION(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing FUNCTION at ${ast.iter}`);
  else if (top.includes("FUNCTION") === false) throw new Error(`Top of stack is not FUNCTION, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "FUNCTION", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BLOCK");
  Push("newline");
  Push("comment?");
  Push("whitespace?");
  Push("punctuation::");
  Push("whitespace?");
  Push("punctuation:)");
  Push("whitespace?");
  Push("ARGS?");
  Push("whitespace?");
  Push("punctuation:(");
  Push("whitespace?");
  Push("identifier");
  Push("whitespace");
  Push("reserved:def");
  yield;

  for (const message of reserved(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of identifier(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of ARGS(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of comment(node)) yield message;
  for (const message of newline(node)) yield message;
  for (const message of BLOCK(node)) yield message;
}

function* ARGS(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing ARGS at ${ast.iter}`);
  else if (top.includes("ARGS") === false) throw new Error(`Top of stack is not ARGS, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "ARGS", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ARGS_PRIME?");
  Push("identifier");
  yield;

  for (const message of identifier(node)) yield message;
  for (const message of ARGS_PRIME(node)) yield message;
}

function* ARGS_PRIME(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing ARGS_PRIME at ${ast.iter}`);
  else if (top.includes("ARGS_PRIME") === false) throw new Error(`Top of stack is not ARGS_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "ARGS_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ARGS_PRIME?");
  Push("identifier");
  Push("whitespace?");
  Push("punctuation:,");
  Push("whitespace?");
  yield;

  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of identifier(node)) yield message;
  for (const message of ARGS_PRIME(node)) yield message;
}

function* FUNCTION_CALL(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing FUNCTION_CALL at ${ast.iter}`);
  else if (top.includes("FUNCTION_CALL") === false) throw new Error(`Top of stack is not FUNCTION_CALL, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "FUNCTION_CALL", attributes: {}, children: [] };
  parent.children.push(node);

  Push("punctuation:)");
  Push("whitespace?");
  Push("PARAMS?");
  Push("whitespace?");
  Push("punctuation:(");
  Push("whitespace?");
  Push("identifier");
  yield;

  for (const message of identifier(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of PARAMS(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
}

function* PARAMS(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing PARAMS at ${ast.iter}`);
  else if (top.includes("PARAMS") === false) throw new Error(`Top of stack is not PARAMS, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "PARAMS", attributes: {}, children: [] };
  parent.children.push(node);

  Push("PARAMS_PRIME?");
  Push("EXPRESSION");
  yield;

  for (const message of EXPRESSION(node)) yield message;
  for (const message of PARAMS_PRIME(node)) yield message;
}

function* PARAMS_PRIME(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing PARAMS_PRIME at ${ast.iter}`);
  else if (top.includes("PARAMS_PRIME") === false) throw new Error(`Top of stack is not PARAMS_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "PARAMS_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("PARAMS_PRIME?");
  Push("EXPRESSION");
  Push("whitespace?");
  Push("punctuation:,");
  Push("whitespace?");
  yield;

  for (const message of whitespace(node)) yield message;
  for (const message of punctuation(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of EXPRESSION(node)) yield message;
  for (const message of PARAMS_PRIME(node)) yield message;
}

function* EXPRESSION(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing EXPRESSION at ${ast.iter}`);
  else if (top.includes("EXPRESSION") === false) throw new Error(`Top of stack is not EXPRESSION, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "EXPRESSION", attributes: {}, children: [] };
  parent.children.push(node);

  Push("EXPRESSION_PRIME?");
  Push("whitespace?");
  Push("COMPARISON");
  yield;

  for (const message of COMPARISON(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of EXPRESSION_PRIME(node)) yield message;
}

function* EXPRESSION_PRIME(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing EXPRESSION_PRIME at ${ast.iter}`);
  else if (top.includes("EXPRESSION_PRIME") === false) throw new Error(`Top of stack is not EXPRESSION_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "EXPRESSION_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  if (lookahead.lexeme === "and") {
    Push("EXPRESSION_PRIME?");
    Push("whitespace?");
    Push("COMPARISON");
    Push("whitespace?");
    Push("operator:and");
    yield;

    for (const message of operator(node)) yield message;
    for (const message of whitespace(node)) yield message;
    for (const message of COMPARISON(node)) yield message;
    for (const message of whitespace(node)) yield message;
    for (const message of EXPRESSION_PRIME(node)) yield message;
  } else if (lookahead.lexeme === "or") {
    Push("EXPRESSION_PRIME?");
    Push("whitespace?");
    Push("COMPARISON");
    Push("whitespace?");
    Push("operator:or");
    yield;

    for (const message of operator(node)) yield message;
    for (const message of whitespace(node)) yield message;
    for (const message of COMPARISON(node)) yield message;
    for (const message of whitespace(node)) yield message;
    for (const message of EXPRESSION_PRIME(node)) yield message;
  } else {
    yield `Expected + or -, got ${lookahead.lexeme} at ${lookahead.line}:${lookahead.column}`;
  }
}

function* COMPARISON(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing COMPARISON at ${ast.iter}`);
  else if (top.includes("COMPARISON") === false) throw new Error(`Top of stack is not COMPARISON, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "COMPARISON", attributes: {}, children: [] };
  parent.children.push(node);

  Push("COMPARISON_PRIME?");
  Push("whitespace?");
  Push("BITWISE");
  yield;

  for (const message of BITWISE(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of COMPARISON_PRIME(node)) yield message;
}

function* COMPARISON_PRIME(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing COMPARISON_PRIME at ${ast.iter}`);
  else if (top.includes("COMPARISON_PRIME") === false) throw new Error(`Top of stack is not COMPARISON_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "COMPARISON_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("COMPARISON_PRIME?");
  Push("whitespace?");
  Push("BITWISE");
  Push("whitespace?");
  if (lookahead.lexeme === "<=") {
    Push("comparator:<=");
  } else if (lookahead.lexeme === ">=") {
    Push("comparator:>=");
  } else if (lookahead.lexeme === "<") {
    Push("comparator:<");
  } else if (lookahead.lexeme === ">") {
    Push("comparator:>");
  } else if (lookahead.lexeme === "==") {
    Push("comparator:==");
  } else if (lookahead.lexeme === "!=") {
    Push("comparator:!=");
  }
  yield;

  for (const message of comparator(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of BITWISE(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of COMPARISON_PRIME(node)) yield message;
}

function* BITWISE(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing BITWISE at ${ast.iter}`);
  else if (top.includes("BITWISE") === false) throw new Error(`Top of stack is not BITWISE, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "BITWISE", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BITWISE_PRIME?");
  Push("whitespace?");
  Push("TERM");
  yield;

  for (const message of TERM(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of BITWISE_PRIME(node)) yield message;
}

function* BITWISE_PRIME(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing BITWISE_PRIME at ${ast.iter}`);
  else if (top.includes("BITWISE_PRIME") === false) throw new Error(`Top of stack is not BITWISE_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "BITWISE_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BITWISE_PRIME?");
  Push("whitespace?");
  Push("TERM");
  Push("whitespace?");
  if (lookahead.lexeme === "<<") {
    Push("operator:<<");
  } else if (lookahead.lexeme === ">>") {
    Push("operator:>>");
  } else if (lookahead.lexeme === "&") {
    Push("operator:&");
  } else if (lookahead.lexeme === "|") {
    Push("operator:|");
  } else if (lookahead.lexeme === "^") {
    Push("operator:^");
  }
  yield;

  for (const message of operator(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of TERM(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of BITWISE_PRIME(node)) yield message;
}

function* TERM(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing TERM at ${ast.iter}`);
  else if (top.includes("TERM") === false) throw new Error(`Top of stack is not TERM, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "TERM", attributes: {}, children: [] };
  parent.children.push(node);

  Push("TERM_PRIME?");
  Push("whitespace?");
  Push("OPERAND");
  yield;

  for (const message of OPERAND(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of TERM_PRIME(node)) yield message;
}

function* TERM_PRIME(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing TERM_PRIME at ${ast.iter}`);
  else if (top.includes("TERM_PRIME") === false) throw new Error(`Top of stack is not TERM_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "TERM_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("TERM_PRIME?");
  Push("whitespace?");
  Push("OPERAND");
  Push("whitespace?");
  if (lookahead.lexeme === "+") {
    Push("operator:+");
  } else if (lookahead.lexeme === "-") {
    Push("operator:-");
  }
  yield;

  for (const message of operator(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of OPERAND(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of TERM_PRIME(node)) yield message;
}

function* OPERAND(parent: NODE) {
  const top = Pop() as string;

  if (top === null) throw new Error(`Stack empty before reducing OPERAND at ${ast.iter}`);
  else if (top.includes("OPERAND") === false) throw new Error(`Top of stack is not OPERAND, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "OPERAND", attributes: {}, children: [] };
  parent.children.push(node);

  Push("OPERAND_PRIME?");
  Push("whitespace?");
  Push("FACTOR");
  yield;

  for (const message of FACTOR(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of OPERAND_PRIME(node)) yield message;
}

function* OPERAND_PRIME(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing OPERAND_PRIME at ${ast.iter}`);
  else if (top.includes("OPERAND_PRIME") === false) throw new Error(`Top of stack is not OPERAND_PRIME, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "OPERAND_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("OPERAND_PRIME?");
  Push("whitespace?");
  Push("FACTOR");
  Push("whitespace?");
  if (lookahead.lexeme === "*") {
    Push("operator:*");
  } else if (lookahead.lexeme === "/") {
    Push("operator:/");
  } else if (lookahead.lexeme === "//") {
    Push("operator://");
  } else if (lookahead.lexeme === "%") {
    Push("operator:%");
  }
  yield;

  for (const message of operator(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of FACTOR(node)) yield message;
  for (const message of whitespace(node)) yield message;
  for (const message of OPERAND_PRIME(node)) yield message;
}

function* FACTOR(parent: NODE) {
  const top = Pop() as string;
  const lookahead = lex.tokens[ast.iter];

  if (top === null) throw new Error(`Stack empty before reducing FACTOR at ${ast.iter}`);
  else if (top.includes("FACTOR") === false) throw new Error(`Top of stack is not FACTOR, got ${top} at ${ast.iter}`);

  const node: NODE = { name: "FACTOR", attributes: {}, children: [] };
  parent.children.push(node);

  if (lookahead.type === "NONE") {
    Push("none");
    yield;

    for (const message of none(node)) yield message;
  } else if (lookahead.type === "BOOLEAN") {
    Push("boolean");
    yield;

    for (const message of boolean(node)) yield message;
  } else if (lookahead.type === "INT") {
    Push("int");
    yield;

    for (const message of int(node)) yield message;
  } else if (lookahead.type === "FLOAT") {
    Push("float");
    yield;

    for (const message of float(node)) yield message;
  } else if (lookahead.type === "STRING") {
    Push("string");
    yield;

    for (const message of string(node)) yield message;
  } else if (lookahead.lexeme === "(") {
    Push("punctuation:)");
    Push("whitespace?");
    Push("EXPRESSION");
    Push("whitespace?");
    Push("punctuation:(");
    yield;

    for (const message of punctuation(node)) yield message;
    for (const message of whitespace(node)) yield message;
    for (const message of EXPRESSION(node)) yield message;
    for (const message of whitespace(node)) yield message;
    for (const message of punctuation(node)) yield message;
  } else if (lookahead.type === "IDENTIFIER") {
    if (
      lex.tokens[ast.iter + 1].lexeme === "(" ||
      lex.tokens[ast.iter + 2].lexeme === "("
    ) {
      Push("FUNCTION_CALL");
      yield;

      for (const message of FUNCTION_CALL(node)) yield message;
    } else {
      Push("identifier");
      yield;

      for (const message of identifier(node)) yield message;
    }
  } else {
    throw new Error(`Expected FACTOR, got ${lookahead.type} at ${lookahead.line}:${lookahead.column}`);
  }
}
