"use client";

import { useState, useContext } from "react";

import Header from "@/components/header/header";
import { srcOutput } from "@/components/outputs/src";
import { lexOutput } from "@/components/outputs/lex";

import { patterns } from "./patterns";
import { reset, step, skip, play, pause } from "./logic";
import styles from "./page.module.css";

const reversePattern = patterns.reduce((acc, pattern, i) => {
  const { name } = pattern;
  acc[name] = i;
  return acc;
}, {} as { [key: string]: number });
reversePattern["UNKNOWN"] = -1;
const factor = 360 / patterns.length;

function colorize(i: number) {
  const hue = (5 * factor * (i + 1)) % 360;
  return `hsl(${hue}, 60%, 60%)`;
}

export default function Page() {
  const { code } = useContext(srcOutput);
  const lex = useContext(lexOutput);

  const [Disabled, setDisabled] = useState(lex.iter >= code.length);
  const [Matched, setMatched] = useState<boolean[]>(Array.from([]));

  const resetHandle = () => reset(lex, setDisabled);
  const stepHandle = () => step(lex, code, patterns, setMatched, setDisabled);
  const skipHandle = () => skip(lex, code, patterns, setMatched, setDisabled);
  const playHandle = () => play(lex, code, patterns, setMatched, setDisabled);
  const pauseHandle = () => pause();

  return (
    <>
      <Header disabled={Disabled}
        reset={resetHandle}
        step={stepHandle}
        skip={skipHandle}
        play={playHandle}
        pause={pauseHandle}
      />
      <main className={styles.main}>
        {/* Patterns */}
        <div className={styles.patterns}>
          <h3>Patterns</h3>
          <ul className={styles.list}>
            {patterns.map((pattern, i) => {
              const { name } = pattern;
              return (
                <li key={i} style={{ backgroundColor: colorize(i) }}>
                  <span className={styles.matched}>
                    {Matched[i] ? "✓" : "✗"}
                  </span>
                  {name}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tokens */}
        <p className={styles.code}>
          {lex.tokens.map((token, i) => {
            const { name, lexeme } = token;
            const color = colorize(reversePattern[name]);
            return (
              <span style={{ backgroundColor: color }} key={i} className={styles.token}>
                {lexeme}
              </span>
            )
          })}
          {code.slice(lex.iter)}
        </p>

        {/* Symbol Table */}
        <table className={styles.table} border={0} cellSpacing={10}>
          <caption>Symbol Table</caption>
          <thead>
            <tr>
              <th>ID</th>
              <th>Token</th>
              <th>Lexical value</th>
            </tr>
          </thead>
          <tbody>
            {lex.table.map((row, i) => {
              const { name: token, lexeme } = row;
              return (
                <tr key={i}>
                  <td>ID{i + 1}</td>
                  <td>{token}</td>
                  <td>{lexeme}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main >
    </>
  )
}
