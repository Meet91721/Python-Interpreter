"use client";
import { createContext } from "react";

export type PATTERN = {
  type: string;
  re: RegExp;
}

export type TOKEN = {
  type: string;
  re: RegExp;
  lexeme: string;

  line: number;
  column: number;

  entry?: number;
};

export type LEX = {
  iter: number;
  line: number;
  column: number;

  tokens: TOKEN[];
  table: TOKEN[];
};

const context: LEX = {
  iter: 0,
  line: 1,
  column: 1,

  tokens: [],
  table: [],
};

export const lexOutput = createContext(context);
