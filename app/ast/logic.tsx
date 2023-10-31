import { LEX } from "@/components/outputs/lex";
import { AST } from "@/components/outputs/ast";

import {
  init,
} from "./parser";

let timer: NodeJS.Timeout | null = null;
let generator: Generator | null = null;

export function reset(
  ast: AST,
  updateTree: Function = () => { },
  setDisabled: Function = () => { }
) {
  ast.iter = 0;
  ast.stack = [];
  ast.tree = null;

  updateTree(null);
  setDisabled(false);

  pause();
}

export function step(
  ast: AST,
  lex: LEX,
  Push: Function,
  Pop: Function,
  updateTree: Function,
  setDisabled: Function,
) {
  if (ast.iter >= lex.tokens.length) {
    setDisabled(true);
    return;
  }

  if (generator === null)
    generator = init(ast, lex, Push, Pop);

  try {
    const { done } = generator.next();
    updateTree(ast.tree);

    if (done) {
      generator = null;
      setDisabled(true);
    }
  } catch (e) {
    generator = null;
    setDisabled(true);
    alert(e.message);
  }
}

export function skip(
) {
  do {
    // step();
  }
  while (true)
}

export function play(
) {
  if (timer) {
    return;
  }
  timer = setInterval(() => {
    // step();
    if (true) {
      clearInterval(timer as NodeJS.Timeout);
    }
  }, 100);
}

export function pause() {
  if (timer) {
    clearInterval(timer);
  }
  timer = null;
}
