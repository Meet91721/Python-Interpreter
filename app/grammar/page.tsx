"use client";

import React from 'react';
import Header from "@/components/header/header";
import { grammer } from '@/app/parser/grammar';
import { useContext } from "react";
import { srcOutput } from "@/components/outputs/src";
import { lexOutput } from "@/components/outputs/lex";
import { parserOutput } from "@/components/outputs/parser";
export default function Page() {
    const { code } = useContext(srcOutput);
    const lex = useContext(lexOutput);
    const parser = useContext(parserOutput);
    return (
        <>
            <Header />
            <div>
                <h2>Grammar: </h2>
                <ul>
                    {Object.entries(grammer).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key} -&gt; </strong>

                            {value.map((list, ind) => (
                                <span>
                                    {ind < value.length - 1 ? (<span>{list.join(' ')} | </span>) : (<span>{list.join(' ')} </span>)}
                                </span>

                            ))}

                        </li>
                    ))}
                </ul>
            </div>
        </>
    );

}
