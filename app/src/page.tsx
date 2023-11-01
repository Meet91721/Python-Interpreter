"use client";

import { useState, useContext } from "react";

import Header from "@/components/header/header";

import { srcOutput } from "@/components/outputs/src";
import { lexOutput } from "@/components/outputs/lex";
import { parserOutput } from "@/components/outputs/parser";
import { reset as lexResetHandle } from "../lex/logic";
import { reset as parserResetHandle } from "../parser/logic";

import styles from "./src.module.css";

export default function Page() {
  const src = useContext(srcOutput);
  const lex = useContext(lexOutput);
  const parser = useContext(parserOutput);
  const [Code, setCode] = useState(src.code);

  function handleChange(code: string) {
    src.code = code.replace(/\t/g, "    ");
    setCode(src.code);

    lexResetHandle(lex);
    parserResetHandle(parser);
  }

  function resetHandle() {
    handleChange(`# Sample Python code
def factorial(n):
    eq = n == 0
    lt = n < 0
    if eq == True or lt == True:
        return 1
    else:
        return n * factorial(n-1)

x = input("Enter a number: ")
print("factorial(" + x + ") = " + factorial(int(x)))

print("Printing the first 10 factorials ...")
for k in range(1000e-2):
    print(factorial(k))

input('Press Enter to continue ...')
`);
  }

  return (
    <>
      <Header reset={resetHandle} />
      <main className={styles.main}>
        <textarea
          className={styles.textarea}
          rows={18}
          cols={80}
          placeholder="# Enter Python code here ..."
          value={Code}
          onChange={(e) => handleChange(e.target.value)}
        >
        </textarea>
      </main>
    </>
  )
}
