"use client";

import { useState, useContext } from "react";

import Header from "@/components/header/header";
import { srcOutput } from "@/components/outputs/src";
import { lexOutput } from "@/components/outputs/lex";
import { parserOutput } from "@/components/outputs/parser";
import { reset as parserResetHandle } from "../parser/logic";

import { patterns, colorizeToken } from "./patterns";
import { reset, step, skip, play, pause } from "./logic";
import styles from "./lex.module.css";

export default function Page() {
  const { code } = useContext(srcOutput);
  const lex = useContext(lexOutput);
  const parser = useContext(parserOutput);

  const [Matched, setMatched] = useState<boolean[]>(patterns.map(() => false));

  const [Disabled, setDisabled] = useState(lex.iter >= code.length);
  const resetHandle = () => {
    reset(lex, setMatched, setDisabled);
    parserResetHandle(parser);
  }
  const stepHandle = () => step(lex, code, setMatched, setDisabled);
  const skipHandle = () => skip(lex, code, setMatched, setDisabled);
  const playHandle = () => play(lex, code, setMatched, setDisabled);
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
          <span className={styles.h3}>Pattern Matching</span>
          <ul className={styles.list}>
            {patterns.map(({ type }, i) => {
              return (
                <li key={i} style={{ backgroundColor: colorizeToken(type) }}>
                  <span className={styles.matched}>
                    {Matched[i] ? "✓" : "✗"}
                  </span>
                  {type}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tokens */}
        <p className={styles.code}>
          {lex.tokens.map((token, i) => {
            const {
              type, lexeme,
              line, column,
            } = token;
            return (
              <span
                key={i}
                style={{ backgroundColor: colorizeToken(type) }}
                className={styles.token}
                data-label={`${type}@(${line}, ${column})`}
              >
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
              <th>Token Type</th>
              <th>Lexical Value</th>
            </tr>
          </thead>
          <tbody>
            {lex.table.map((row, i) => {
              const { type, lexeme } = row;
              return (
                <tr key={i}>
                  <td>ID{i + 1}</td>
                  <td>{type}</td>
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
