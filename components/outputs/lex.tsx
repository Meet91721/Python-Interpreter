"use client";

import { createContext } from "react";
import { lex } from "@/app/lex/types";

const context: lex = {
  iter: 0,
  tokens: [],
  table: [],
};

export const lexOutput = createContext(context);
