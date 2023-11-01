"use client";

import React, { useState, useContext } from "react";

import Header from "@/components/header/header";
import ReactD3Tree from "@/components/tree/tree";
import { lexOutput } from "@/components/outputs/lex";
import { parserOutput, NODE } from "@/components/outputs/parser";

import { colorizeToken } from "../lex/patterns";

import { reset, step, skip, play, pause } from "./logic";
import styles from "./parser.module.css";

export default function Page() {
  const lex = useContext(lexOutput);
  const parser = useContext(parserOutput);

  const [Stack, setStack] = useState(parser.stack);
  function Push(item: string) {
    parser.stack.push(item);
    setStack(parser.stack);
  }
  function Pop() {
    const item = parser.stack.pop();
    setStack(parser.stack);
    return item;
  }

  const [Tree, setTree] = useState(parser.tree);
  function updateTree(tree: NODE) {
    parser.tree = { ...tree };
    setTree(parser.tree);
  }

  const [Disabled, setDisabled] = useState(parser.iter >= lex.tokens.length);
  const resetHandle = () => reset(parser, updateTree, setDisabled);
  const stepHandle = () => step(parser, lex, Push, Pop, updateTree, setDisabled);
  const skipHandle = () => skip(parser, lex, Push, Pop, updateTree, setDisabled);
  const playHandle = () => play(parser, lex, Push, Pop, updateTree, setDisabled);
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
        {/* Stack */}
        <div className={styles.stack}>
          {Stack.map((symbol, i) => {

            const span = <span key={i} ref={(el) => {
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            >
              {symbol}
            </span>;
            return span;
            // )
          })
          }
          {
            Stack.length === 0 &&
            <span>--==EMPTY STACK==--</span>
          }
        </div>

        {/* Token stream */}
        <div className={styles.code}>
          {lex.tokens.slice(parser.iter).map((token, i) => {
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
        </div>

        {/* Tree */}
        <div className={styles.tree}>
          {Tree && <ReactD3Tree tree={Tree} />}
        </div>
      </main>
    </>
  )
}
