"use client";

import { useState, useContext } from "react";

import Header from "@/components/header/header";
import ReactD3Tree from "@/components/tree/tree";
import { lexOutput } from "@/components/outputs/lex";
import { astOutput, NODE } from "@/components/outputs/ast";

import { colorizeToken } from "../lex/patterns";

import { reset, step, skip, play, pause } from "./logic";
import styles from "./ast.module.css";

export default function Page() {
  const lex = useContext(lexOutput);
  const ast = useContext(astOutput);

  const [Stack, setStack] = useState(ast.stack);
  function Push(item: string) {
    ast.stack.push(item);
  }
  function Pop() {
    return ast.stack.pop();
  }

  const [Tree, setTree] = useState(ast.tree);
  function updateTree(tree: NODE) {
    ast.tree = { ...tree };
    setTree(tree);
  }

  const [Disabled, setDisabled] = useState(ast.iter >= lex.tokens.length);
  const resetHandle = () => reset(ast, updateTree, setDisabled);
  const stepHandle = () => step(ast, lex, Push, Pop, updateTree, setDisabled);
  const skipHandle = () => skip();
  const playHandle = () => play();
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
        {/* Token stream */}
        <div className={styles.code}>
          {lex.tokens.slice(ast.iter).map((token, i) => {
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
          <span
            style={{ backgroundColor: colorizeToken("UNKNOWN") }}
            className={styles.token}
            data-label={`EOF@(${lex.line}, ${lex.column})`}
          >$</span>
        </div>

        {/* Stack */}
        <div className={styles.stack}>
          {Stack.map((symbol, i) => {
            return (
              <span key={i}>{symbol}</span>
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
