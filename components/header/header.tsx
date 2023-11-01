"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"

import { useEffect, useState } from "react";

import {
  MdReplay,
  MdRedo,
  MdPlayArrow,
  MdFastForward,
  MdPause,
} from "react-icons/md";

import Image from "next/image"
import logo from "./logo.svg"
import styles from "./header.module.css"

const stages = [
  { path: '/src', name: "SRC" },
  { path: "/lex", name: "LEX" },
  { path: "/parser", name: "PARSER" },
  { path: "/grammar", name: "GRAMMAR" },
]

export default function Header({
  reset = () => { },
  step = () => { },
  skip = () => { },
  play = () => { },
  pause = () => { },
  disabled = true,
}) {
  const pathname = usePathname();

  const [ResetDisabled, setResetDisabled] = useState(false);
  const [StepDisabled, setStepDisabled] = useState(true);
  const [SkipDisabled, setSkipDisabled] = useState(true);
  const [PlayDisabled, setPlayDisabled] = useState(true);
  const [PlayHidden, setPlayHidden] = useState(false);

  useEffect(() => {
    if (disabled) {
      setResetDisabled(false);
      setStepDisabled(true);
      setSkipDisabled(true);
      setPlayDisabled(true);
      setPlayHidden(false);
    } else {
      setResetDisabled(false);
      setStepDisabled(false);
      setSkipDisabled(false);
      setPlayDisabled(false);
      setPlayHidden(false);
    }
  }, [disabled])

  function handleReset() {
    if (ResetDisabled) return;
    reset();
  }

  function handleStep() {
    if (StepDisabled) return;
    step();
  }

  function handleSkip() {
    if (SkipDisabled) return;
    skip();
  }

  function handlePlay() {
    if (PlayDisabled) return;
    if (PlayHidden) {
      setResetDisabled(false);
      setStepDisabled(false);
      setSkipDisabled(false);
      setPlayHidden(false);
      pause();
    } else {
      setResetDisabled(true);
      setStepDisabled(true);
      setSkipDisabled(true);
      setPlayHidden(true);
      play();
    }
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.title}>
        <Image src={logo} alt="logo" width={50} height={50} />
        Python Interpreter
      </Link>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          {
            stages.map(({ path, name }) => {
              const isActive = pathname === path;
              return <li key={path} className={styles.li}>
                <Link href={path} className={isActive ? styles.active : styles.link}>
                  {name}
                </Link>
              </li>
            })
          }
        </ul>
      </nav>

      <ul className={styles.ul}>
        <li className={styles.li}>
          <button
            title="Reset"
            className={styles.button}
            disabled={ResetDisabled}
            onClick={handleReset}
          >
            <MdReplay />
          </button>
        </li>
        <li className={styles.li}>
          <button
            title="Step"
            className={styles.button}
            disabled={StepDisabled}
            onClick={handleStep}
          >
            <MdPlayArrow />
          </button>
        </li>
        <li className={styles.li}>
          <button
            title="Skip"
            className={styles.button}
            disabled={SkipDisabled}
            onClick={handleSkip}
          >
            <MdRedo />
          </button>
        </li>
        <li className={styles.li}>
          <button
            title={PlayHidden ? "Pause" : "Play"}
            className={styles.button}
            disabled={PlayDisabled}
            onClick={handlePlay}
          >
            {PlayHidden ? <MdPause /> : <MdFastForward />}
          </button>
        </li>
      </ul>
    </header>
  )
}
