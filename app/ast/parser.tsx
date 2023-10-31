"use client";

import { AST, NODE } from "@/components/outputs/ast";
import { LEX } from "@/components/outputs/lex";

declare type GENERATOR = IterableIterator<NODE | undefined>;

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

  Push("START");
  yield;
  for (const _ of START()) yield;
}

export function raise(message: string) {
  throw new Error(message);
}

/////////////////////////////////////////////////////////////////////
// Terminals
/////////////////////////////////////////////////////////////////////
function token(lower: string, upper: string) {
  return function* (parent: NODE) {
    const top = Pop() as string;
    if (top === undefined)
      raise(`Expected token of type ${lower} but stack is empty @${ast.iter}`);

    const [type, expected] = top.split(/^([_a-zA-Z]+)(?::(.*?))?\??$/).filter(x => x);
    const required = top[top.length - 1] !== "?";
    if (type !== lower) {
      if (required)
        raise(`Expected token of type ${lower} but top of the stack is ${type} @${ast.iter}`);
      else return;
    }

    const token = lex.tokens[ast.iter];
    if (token.type !== upper) {
      if (required)
        raise(`Expected token of type ${upper} but got ${token.type} @(${token.line}, ${token.column})`);
      else return;
    }
    if (expected && token.lexeme !== expected) {
      if (required)
        raise(`Expected ${expected} but got ${token.lexeme} @(${token.line}, ${token.column})`);
      else return;
    }

    // Consume the token
    const node: NODE = { name: lower, attributes: { lexval: token.lexeme }, children: [] };
    parent.children.push(node);
    ast.iter++;
    yield node;
  }
}

const newline = token("newline", "NEWLINE");
const whitespace = token("whitespace", "WHITESPACE");
const comment = token("comment", "COMMENT");
const reserved = token("reserved", "RESERVED");
const none = token("none", "NONE");
const boolean = token("boolean", "BOOLEAN");
const int = token("int", "INT");
const float = token("float", "FLOAT");
const string = token("string", "STRING");
const operator = token("operator", "OPERATOR");
const bitwise = token("bitwise", "BITWISE");
const comparator = token("comparator", "COMPARATOR");
const identifier = token("identifier", "IDENTIFIER");
const assignment = token("assignment", "ASSIGNMENT");
const punctuation = token("punctuation", "PUNCTUATION");

/////////////////////////////////////////////////////////////////////
// Non-terminals
/////////////////////////////////////////////////////////////////////
function* START(parent?: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type START but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "START") {
    if (required)
      raise(`Expected token of type START but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "START", attributes: { indent: 0 }, children: [] };
  if (parent) parent.children.push(node);
  else ast.tree = node;

  Push("START?");
  Push("STATEMENT?");
  yield;

  try { for (const _ of STATEMENT(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of START(node)) yield; } catch (e) { /* pass */ }
}

function* BLOCK(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type BLOCK but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "BLOCK") {
    if (required)
      raise(`Expected token of type BLOCK but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.type !== "WHITESPACE")
    return;
  if (lookahead.lexeme.length < (parent.attributes.indent as number))
    return;

  const node: NODE = { name: "BLOCK", attributes: { indent: parent.attributes.indent }, children: [] };
  parent.children.push(node);

  Push("BLOCK?");
  Push("STATEMENT?");
  Push("whitespace");
  yield;

  for (const _ of whitespace(node)) yield;
  try { for (const _ of STATEMENT(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of BLOCK(node)) yield; } catch (e) { /* pass */ }
}

function* STATEMENT(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type STATEMENT but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "STATEMENT") {
    if (required)
      raise(`Expected token of type STATEMENT but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "STATEMENT", attributes: { indent: parent.attributes.indent }, children: [] };
  parent.children.push(node);

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.type === "NEWLINE") {
    Push("newline");
    yield;
    for (const _ of newline(node)) yield;
  } else if (
    lookahead.type !== "RESERVED" ||
    (
      lookahead.lexeme !== "if" &&
      lookahead.lexeme !== "while" &&
      lookahead.lexeme !== "for" &&
      lookahead.lexeme !== "def"
    )
  ) {
    Push("newline");
    Push("comment?");
    Push("whitespace?");
    Push("SIMPLE");
    yield;
    for (const _ of SIMPLE(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
    for (const _ of newline(node)) yield;
  } else {
    Push("COMPOUND");
    yield;
    for (const _ of COMPOUND(node)) yield;
  }
}

function* SIMPLE(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type SIMPLE but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "SIMPLE") {
    if (required)
      raise(`Expected token of type SIMPLE but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "SIMPLE", attributes: {}, children: [] };
  parent.children.push(node);

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.type === "RESERVED") {
    if (lookahead.lexeme === "return") {
      Push("EXPRESSION");
      Push("whitespace");
      Push("reserved:return");
      yield;
      for (const _ of reserved(node)) yield;
      for (const _ of whitespace(node)) yield;
      for (const _ of EXPRESSION(node)) yield;
    } else if (lookahead.lexeme === "pass") {
      Push("reserved:pass");
      yield;
      for (const _ of reserved(node)) yield;
    } else if (lookahead.lexeme === "break") {
      Push("reserved:break");
      yield;
      for (const _ of reserved(node)) yield;
    } else {
      Push("reserved:continue");
      yield;
      for (const _ of reserved(node)) yield;
    }
  } else if (lookahead.type === "COMMENT") {
    Push("comment");
    yield;
    for (const _ of comment(node)) yield;
  } else if (lookahead.type === "WHITESPACE") {
    Push("whitespace");
    yield;
    for (const _ of whitespace(node)) yield;
  } else if (
    lookahead.type === "IDENTIFIER" &&
    (
      lex.tokens[ast.iter + 1].type === "ASSIGNMENT" ||
      lex.tokens[ast.iter + 2].type === "ASSIGNMENT"
    )
  ) {
    Push("EXPRESSION");
    Push("whitespace?");
    Push("assignment");
    Push("whitespace?");
    Push("identifier");
    yield;
    for (const _ of identifier(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    for (const _ of assignment(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    for (const _ of EXPRESSION(node)) yield;
  } else {
    Push("EXPRESSION");
    yield;
    for (const _ of EXPRESSION(node)) yield;
  }
}

function* COMPOUND(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type COMPOUND but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "COMPOUND") {
    if (required)
      raise(`Expected token of type COMPOUND but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "COMPOUND", attributes: { indent: (parent.attributes.indent as number) + 4 }, children: [] };
  parent.children.push(node);

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.lexeme === "if") {
    Push("IF");
    yield;
    for (const _ of IF(node)) yield;
  } else if (lookahead.lexeme === "while") {
    Push("WHILE");
    yield;
    for (const _ of WHILE(node)) yield;
  } else if (lookahead.lexeme === "for") {
    Push("FOR");
    yield;
    for (const _ of FOR(node)) yield;
  } else {
    Push("FUNCTION");
    yield;
    for (const _ of FUNCTION(node)) yield;
  }
}

function* IF(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type IF but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "IF") {
    if (required)
      raise(`Expected token of type IF but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "IF", attributes: { indent: parent.attributes.indent }, children: [] };
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

  for (const _ of reserved(node)) yield;
  for (const _ of whitespace(node)) yield;
  for (const _ of EXPRESSION(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
  for (const _ of newline(node)) yield;
  for (const _ of BLOCK(node)) yield;
  try { for (const _ of ELIF(node)) yield; } catch (e) { /* pass */ }
}

function* ELIF(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type ELIF but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "ELIF") {
    if (required)
      raise(`Expected token of type ELIF but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "ELIF", attributes: { indent: parent.attributes.indent }, children: [] };
  parent.children.push(node);

  const lookahead = lex.tokens[ast.iter];

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
    Push("whitespace?");
    yield;

    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    for (const _ of reserved(node)) yield;
    for (const _ of whitespace(node)) yield;
    for (const _ of EXPRESSION(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    for (const _ of punctuation(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
    for (const _ of newline(node)) yield;
    for (const _ of BLOCK(node)) yield;
    try { for (const _ of ELIF(node)) yield; } catch (e) { /* pass */ }
  } else {
    Push("ELSE?");
    yield;
    for (const _ of ELSE(node)) yield;
  }
}

function* ELSE(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type ELSE but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "ELSE") {
    if (required)
      raise(`Expected token of type ELSE but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  if (
    lex.tokens[ast.iter].lexeme !== "else" &&
    lex.tokens[ast.iter + 1].lexeme !== "else"
  ) return;

  const node: NODE = { name: "ELSE", attributes: { indent: parent.attributes.indent }, children: [] };
  parent.children.push(node);

  Push("BLOCK");
  Push("newline");
  Push("comment?");
  Push("whitespace?");
  Push("punctuation::");
  Push("whitespace?");
  Push("reserved:else");
  Push("whitespace?");
  yield;

  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of reserved(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
  for (const _ of newline(node)) yield;
  for (const _ of BLOCK(node)) yield;
}

function* WHILE(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type WHILE but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "WHILE") {
    if (required)
      raise(`Expected token of type WHILE but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "WHILE", attributes: { indent: parent.attributes.indent }, children: [] };
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

  for (const _ of reserved(node)) yield;
  for (const _ of whitespace(node)) yield;
  for (const _ of EXPRESSION(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
  for (const _ of newline(node)) yield;
  for (const _ of BLOCK(node)) yield;
  try { for (const _ of ELSE(node)) yield; } catch (e) { /* pass */ }
}

function* FOR(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type FOR but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "FOR") {
    if (required)
      raise(`Expected token of type FOR but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "FOR", attributes: { indent: parent.attributes.indent }, children: [] };
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
  Push("reserved:in");
  Push("whitespace");
  Push("identifier");
  Push("whitespace");
  Push("reserved:for");
  yield;

  for (const _ of reserved(node)) yield;
  for (const _ of whitespace(node)) yield;
  for (const _ of identifier(node)) yield;
  for (const _ of whitespace(node)) yield;
  for (const _ of reserved(node)) yield;
  for (const _ of whitespace(node)) yield;
  for (const _ of EXPRESSION(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
  for (const _ of newline(node)) yield;
  for (const _ of BLOCK(node)) yield;
  try { for (const _ of ELSE(node)) yield; } catch (e) { /* pass */ }
}

function* FUNCTION(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type FUNCTION but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "FUNCTION") {
    if (required)
      raise(`Expected token of type FUNCTION but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "FUNCTION", attributes: { indent: parent.attributes.indent }, children: [] };
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

  for (const _ of reserved(node)) yield;
  for (const _ of whitespace(node)) yield;
  for (const _ of identifier(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of ARGS(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of comment(node)) yield; } catch (e) { /* pass */ }
  for (const _ of newline(node)) yield;
  for (const _ of BLOCK(node)) yield;
}

function* ARGS(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type ARGS but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "ARGS") {
    if (required)
      raise(`Expected token of type ARGS but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "ARGS", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ARGS_PRIME?");
  Push("identifier");
  yield;

  for (const _ of identifier(node)) yield;
  try { for (const _ of ARGS_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* ARGS_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type ARGS_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "ARGS_PRIME") {
    if (required)
      raise(`Expected token of type ARGS_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  if (
    lex.tokens[ast.iter].lexeme !== "," &&
    lex.tokens[ast.iter + 1].lexeme !== ","
  ) return;

  const node: NODE = { name: "ARGS_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("ARGS_PRIME?");
  Push("identifier");
  Push("whitespace?");
  Push("punctuation:,");
  Push("whitespace?");
  yield;

  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of identifier(node)) yield;
  try { for (const _ of ARGS_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* FUNCTION_CALL(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type FUNCTION_CALL but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "FUNCTION_CALL") {
    if (required)
      raise(`Expected token of type FUNCTION_CALL but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

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

  for (const _ of identifier(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of PARAMS(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
}

function* PARAMS(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type PARAMS but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "PARAMS") {
    if (required)
      raise(`Expected token of type PARAMS but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "PARAMS", attributes: {}, children: [] };
  parent.children.push(node);

  Push("PARAMS_PRIME?");
  Push("EXPRESSION");
  yield;

  for (const _ of EXPRESSION(node)) yield;
  try { for (const _ of PARAMS_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* PARAMS_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type PARAMS_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "PARAMS_PRIME") {
    if (required)
      raise(`Expected token of type PARAMS_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  if (
    lex.tokens[ast.iter].lexeme !== "," &&
    lex.tokens[ast.iter + 1].lexeme !== ","
  ) return;

  const node: NODE = { name: "PARAMS_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("PARAMS_PRIME?");
  Push("EXPRESSION");
  Push("whitespace?");
  Push("punctuation:,");
  Push("whitespace?");
  yield;

  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of punctuation(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of EXPRESSION(node)) yield;
  try { for (const _ of PARAMS_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* EXPRESSION(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type EXPRESSION but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "EXPRESSION") {
    if (required)
      raise(`Expected token of type EXPRESSION but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "EXPRESSION", attributes: {}, children: [] };
  parent.children.push(node);

  Push("EXPRESSION_PRIME?");
  Push("whitespace?");
  Push("COMPARISION");
  yield;

  for (const _ of COMPARISION(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of EXPRESSION_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* EXPRESSION_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type EXPRESSION_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "EXPRESSION_PRIME") {
    if (required)
      raise(`Expected token of type EXPRESSION_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const lookahead = lex.tokens[ast.iter];

  if (
    lookahead.lexeme !== "and" &&
    lookahead.lexeme !== "or"
  ) return;

  const node: NODE = { name: "EXPRESSION_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("EXPRESSION_PRIME?");
  Push("whitespace?");
  Push("COMPARISION");
  Push("whitespace?");
  if (lookahead.lexeme === "and")
    Push("operator:and");
  else
    Push("operator:or");
  yield;

  for (const _ of operator(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of COMPARISION(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of EXPRESSION_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* COMPARISION(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type COMPARISION but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "COMPARISION") {
    if (required)
      raise(`Expected token of type COMPARISION but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "COMPARISION", attributes: {}, children: [] };
  parent.children.push(node);

  Push("COMPARISION_PRIME?");
  Push("whitespace?");
  Push("BITWISE");
  yield;

  for (const _ of BITWISE(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of COMPARISION_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* COMPARISION_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type COMPARISION_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";

  if (type !== "COMPARISION_PRIME") {
    if (required)
      raise(`Expected token of type COMPARISION_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.type !== "COMPARATOR")
    return;

  const node: NODE = { name: "COMPARISION_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("COMPARISION_PRIME?");
  Push("whitespace?");
  Push("BITWISE");
  Push("whitespace?");
  if (lookahead.lexeme === "<=")
    Push("comparator:<=");
  else if (lookahead.lexeme === ">=")
    Push("comparator:>=");
  else if (lookahead.lexeme === "<")
    Push("comparator:<");
  else if (lookahead.lexeme === "<")
    Push("comparator:<");
  else if (lookahead.lexeme === "==")
    Push("comparator:==");
  else
    Push("comparator:!=");
  yield;

  for (const _ of comparator(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of BITWISE(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of COMPARISION_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* BITWISE(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type BITWISE but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "BITWISE") {
    if (required)
      raise(`Expected token of type BITWISE but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "BITWISE", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BITWISE_PRIME?");
  Push("whitespace?");
  Push("OPERAND");
  yield;

  for (const _ of OPERAND(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of BITWISE_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* BITWISE_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type BITWISE_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "BITWISE_PRIME") {
    if (required)
      raise(`Expected token of type BITWISE_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.type !== "BITWISE")
    return;

  const node: NODE = { name: "BITWISE_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("BITWISE_PRIME?");
  Push("whitespace?");
  Push("OPERAND");
  Push("whitespace?");
  if (lookahead.lexeme === "<<")
    Push("bitwise:<<");
  else if (lookahead.lexeme === ">>")
    Push("bitwise:>>");
  else if (lookahead.lexeme === "&")
    Push("bitwise:&");
  else if (lookahead.lexeme === "|")
    Push("bitwise:|");
  else
    Push("bitwise:^");
  yield;

  for (const _ of bitwise(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of OPERAND(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of BITWISE_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* OPERAND(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type OPERAND but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "OPERAND") {
    if (required)
      raise(`Expected token of type OPERAND but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "OPERAND", attributes: {}, children: [] };
  parent.children.push(node);

  Push("OPERAND_PRIME?");
  Push("whitespace?");
  Push("TERM");
  yield;

  for (const _ of TERM(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of OPERAND_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* OPERAND_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type OPERAND_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "OPERAND_PRIME") {
    if (required)
      raise(`Expected token of type OPERAND_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const lookahead = lex.tokens[ast.iter];

  if (
    lookahead.lexeme !== "+" &&
    lookahead.lexeme !== "-"
  ) return;

  const node: NODE = { name: "OPERAND_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("OPERAND_PRIME?");
  Push("whitespace?");
  Push("TERM");
  Push("whitespace?");
  if (lookahead.lexeme === "+")
    Push("operator:+");
  else
    Push("operator:-");
  yield;

  for (const _ of operator(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of TERM(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of OPERAND_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* TERM(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type TERM but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "TERM") {
    if (required)
      raise(`Expected token of type TERM but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "TERM", attributes: {}, children: [] };
  parent.children.push(node);

  Push("TERM_PRIME?");
  Push("whitespace?");
  Push("FACTOR");
  yield;

  for (const _ of FACTOR(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of TERM_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* TERM_PRIME(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type TERM_PRIME but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "TERM_PRIME") {
    if (required)
      raise(`Expected token of type TERM_PRIME but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const lookahead = lex.tokens[ast.iter];
  if (
    lookahead.lexeme !== "*" &&
    lookahead.lexeme !== "//" &&
    lookahead.lexeme !== "/" &&
    lookahead.lexeme !== "%"
  ) return;

  const node: NODE = { name: "TERM_PRIME", attributes: {}, children: [] };
  parent.children.push(node);

  Push("TERM_PRIME?");
  Push("whitespace?");
  Push("FACTOR");
  Push("whitespace?");
  if (lookahead.lexeme === "*")
    Push("operator:*");
  else if (lookahead.lexeme === "//")
    Push("operator://");
  else if (lookahead.lexeme === "/")
    Push("operator:/");
  else
    Push("operator:%");
  yield;

  for (const _ of operator(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  for (const _ of FACTOR(node)) yield;
  try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
  try { for (const _ of TERM_PRIME(node)) yield; } catch (e) { /* pass */ }
}

function* FACTOR(parent: NODE): GENERATOR {
  const top = Pop() as string;
  if (top === undefined)
    raise(`Expected token of type FACTOR but stack is empty @${ast.iter}`);

  const [type, _] = top.split(/^([_a-zA-Z]+)(\??)$/).filter(x => x);
  const required = _ !== "?";
  if (type !== "FACTOR") {
    if (required)
      raise(`Expected token of type FACTOR but top of the stack is ${top} @${ast.iter}`);
    else return;
  }

  const node: NODE = { name: "FACTOR", attributes: {}, children: [] };
  parent.children.push(node);

  const lookahead = lex.tokens[ast.iter];

  if (lookahead.lexeme === "(") {
    Push("punctuation:)");
    Push("whitespace?");
    Push("EXPRESSION");
    Push("whitespace?");
    Push("punctuation:(");
    yield;

    for (const _ of punctuation(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    for (const _ of EXPRESSION(node)) yield;
    try { for (const _ of whitespace(node)) yield; } catch (e) { /* pass */ }
    for (const _ of punctuation(node)) yield;
  } else if (lookahead.type === "NONE") {
    Push("none");
    yield;

    for (const _ of none(node)) yield;
  } else if (lookahead.type === "BOOLEAN") {
    Push("boolean");
    yield;

    for (const _ of boolean(node)) yield;
  } else if (lookahead.type === "INT") {
    Push("int");
    yield;

    for (const _ of int(node)) yield;
  } else if (lookahead.type === "FLOAT") {
    Push("float");
    yield;

    for (const _ of float(node)) yield;
  } else if (lookahead.type === "STRING") {
    Push("string");
    yield;

    for (const _ of string(node)) yield;
  } else {
    if (
      lex.tokens[ast.iter + 1].lexeme === "(" ||
      lex.tokens[ast.iter + 2].lexeme === "("
    ) {
      Push("FUNCTION_CALL");
      yield;

      for (const _ of FUNCTION_CALL(node)) yield;
    } else {
      Push("identifier");
      yield;

      for (const _ of identifier(node)) yield;
    }
  }
}
