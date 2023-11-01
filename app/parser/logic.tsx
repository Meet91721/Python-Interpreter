import { LEX } from "@/components/outputs/lex";
import { AST } from "@/components/outputs/parser";

import {
  init,
} from "./parser";

let timer: NodeJS.Timeout | null = null;
let generator: Generator | null = null;

export function reset(
  parser: AST,
  updateTree: Function = () => { },
  setDisabled: Function = () => { }
) {
  parser.iter = 0;
  parser.stack = [];
  parser.tree = null;

  updateTree(null);
  setDisabled(false);

  pause();
}

export function step(
  parser: AST,
  lex: LEX,
  Push: Function,
  Pop: Function,
  updateTree: Function,
  setDisabled: Function,
) {
  if (
    parser.stack.length === 0 &&
    lex.tokens[parser.iter].type === 'EOF'
  ) {
    setDisabled(true);
    return;
  }

  if (generator === null)
    generator = init(parser, lex, Push, Pop);

  try {
    const { done } = generator.next();
    updateTree(parser.tree);

    if (done) {
      generator = null;
      setDisabled(true);
    }
  } catch (e) {
    generator = null;
    setDisabled(true);
    pause();

    alert((e as { message: string }).message);
  }
}

export function skip(
  parser: AST,
  lex: LEX,
  Push: Function,
  Pop: Function,
  updateTree: Function,
  setDisabled: Function,
) {
  do {
    step(parser, lex, Push, Pop, updateTree, setDisabled);
  }
  while (
    parser.stack[parser.stack.length - 1] !== 'START' &&
    parser.stack[parser.stack.length - 1] !== 'START?' &&
    parser.stack[parser.stack.length - 1] !== 'BLOCK' &&
    parser.stack[parser.stack.length - 1] !== 'BLOCK?' &&
    lex.tokens[parser.iter].type !== 'EOF'
  )
}

export function play(
  parser: AST,
  lex: LEX,
  Push: Function,
  Pop: Function,
  updateTree: Function,
  setDisabled: Function,
) {
  if (timer) {
    return;
  }
  timer = setInterval(() => {
    step(parser, lex, Push, Pop, updateTree, setDisabled);
    if (
      parser.stack.length === 0 &&
      lex.tokens[parser.iter].type === 'EOF'
    ) {
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
