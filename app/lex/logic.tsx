import { token, pattern, lex } from "./types";

let timer: NodeJS.Timeout | null = null;

export function reset(lex: lex, setDisabled: Function) {
  lex.iter = 0;
  lex.tokens = [];
  lex.table = [];
  setDisabled(false);

  pause();
}

export function step(
  lex: lex,
  code: string,
  patterns: pattern[],
  setMatched: Function,
  setDisabled: Function
) {
  if (lex.iter >= code.length) {
    setDisabled(true);
  }

  const matched: boolean[] = [];
  let best = '';
  let type = '';

  const slice = code.slice(lex.iter);
  patterns.forEach((pattern, i) => {
    const { name, pattern: regex } = pattern;
    const match = regex.exec(slice);
    if (match) {
      const lexeme = match[0];
      if (lexeme.length > best.length) {
        best = lexeme;
        type = name;
      }
      matched.push(true);
    } else {
      matched.push(false);
    }
  });

  if (best) {
    const token: token = { name: type, lexeme: best };

    if (type === "IDENTIFIER" || type === "NUMBER" || type === "STRING" || type === "BOOLEAN") {
      const index = lex.table.findIndex((t) => t.lexeme === best);
      if (index === -1) {
        token["symbol"] = lex.table.length;
        lex.table.push(token);
      } else {
        token["symbol"] = index;
      }
    }

    lex.tokens.push(token);
    lex.iter += token.lexeme.length;
  } else {
    lex.tokens.push({ name: "UNKNOWN", lexeme: code[lex.iter] });
    lex.iter += 1;
  }

  setMatched(matched);

  if (lex.iter >= code.length) {
    setDisabled(true);
  }
}

export function skip(
  lex: lex,
  code: string,
  patterns: pattern[],
  setMatched: Function,
  setDisabled: Function
) {
  do {
    step(lex, code, patterns, setMatched, setDisabled);
  }
  while (
    lex.iter < code.length &&
    code[lex.iter] !== "\n"
  )
}

export function play(
  lex: lex,
  code: string,
  patterns: pattern[],
  setMatched: Function,
  setDisabled: Function
) {
  if (timer) {
    return;
  }
  timer = setInterval(() => {
    step(lex, code, patterns, setMatched, setDisabled);
    if (lex.iter >= code.length) {
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
