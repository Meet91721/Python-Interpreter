"use client";
import { createContext } from "react";

export type PRODUCTION_RULE = string[];
export type PRODUCTION_RULES = PRODUCTION_RULE[];
export type GRAMMAR = Record<string, PRODUCTION_RULES>;

export type NODE = {
  name: string;
  attributes: Record<string, string | number | true>;
  children: NODE[];
}

export type AST = {
  iter: number;
  stack: string[];
  tree: NODE | null;
}

const context: AST = {
  iter: 0,
  stack: [],
  tree: null,
};

export const parserOutput = createContext(context);
