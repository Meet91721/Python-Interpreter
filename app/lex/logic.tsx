import { TOKEN, LEX } from "@/components/outputs/lex";
import { patterns } from "./patterns";

let timer: NodeJS.Timeout | null = null;

export function reset(
  lex: LEX,
  setMatched: Function = () => { },
  setDisabled: Function = () => { }
) {
  lex.iter = 0;
  lex.line = 1;
  lex.column = 1;

  lex.tokens = [];
  lex.table = [];

  setMatched(patterns.map(() => false));
  setDisabled(false);

  pause();
}

export function step(
  lex: LEX,
  code: string,
  setMatched: Function,
  setDisabled: Function
) {
  if (lex.iter >= code.length) {
    setDisabled(true);

    if (lex.tokens[lex.tokens.length - 1].type !== "EOF")
      lex.tokens.push({
        type: "EOF", re: /./,
        lexeme: "$",
        line: lex.line, column: lex.column,
      });

    return;
  }

  const matched: boolean[] = [];
  let candidate_type = '';
  let matched_re = /./;
  let longest_match = '';

  // Check for matches
  const slice = code.slice(lex.iter);
  patterns.forEach(({ type, re }) => {
    const match = re.exec(slice);
    if (match) {
      const lexeme = match[0];
      if (lexeme.length > longest_match.length) {
        candidate_type = type;
        matched_re = re;
        longest_match = lexeme;
      }
      matched.push(true);
    } else {
      matched.push(false);
    }
  });

  // Create token
  if (longest_match) {
    const token: TOKEN = {
      type: candidate_type, re: matched_re,
      lexeme: longest_match,
      line: lex.line, column: lex.column,
    };

    if (
      candidate_type === "BOOLEAN" ||
      candidate_type === "INT" ||
      candidate_type === "FLOAT" ||
      candidate_type === "STRING" ||
      candidate_type === "IDENTIFIER"
    ) {
      token.entry = lex.table.length;
      lex.table.push(token);
    }

    lex.tokens.push(token);

    // Update line and column
    const lines = token.lexeme.split("\n");
    lex.iter += token.lexeme.length;
    lex.line += lines.length - 1;
    if (lines.length > 1) {
      lex.column = lines[lines.length - 1].length + 1;
    } else {
      lex.column += token.lexeme.length;
    }
  } else {
    lex.tokens.push({
      type: "UNKNOWN", re: /./,
      lexeme: code[lex.iter],
      line: lex.line, column: lex.column,
    });

    lex.iter += 1;
    lex.column += 1;
  }

  setMatched(matched);

  if (lex.iter >= code.length) {
    setDisabled(true);
    if (lex.tokens[lex.tokens.length - 1].type !== "EOF")
      lex.tokens.push({
        type: "EOF", re: /./,
        lexeme: "$",
        line: lex.line, column: lex.column,
      });
  }
}

export function skip(
  lex: LEX,
  code: string,
  setMatched: Function,
  setDisabled: Function
) {
  do {
    step(lex, code, setMatched, setDisabled);
  }
  while (
    lex.iter < code.length &&
    code[lex.iter] !== "\n"
  )
}

export function play(
  lex: LEX,
  code: string,
  setMatched: Function,
  setDisabled: Function
) {
  if (timer) {
    return;
  }
  timer = setInterval(() => {
    step(lex, code, setMatched, setDisabled);
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
