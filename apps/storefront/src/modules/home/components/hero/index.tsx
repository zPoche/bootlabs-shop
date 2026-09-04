"use client"

import { useEffect, useMemo, useState } from "react"

import { shopContent } from "@lib/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MATRIX_GLYPHS = "/:#[]{}?~$@%*+ABCDEF0123456789"

function buildColumns(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const length = 18 + ((index * 5) % 10)
    const glyphs = Array.from(
      { length },
      (_, glyphIndex) =>
        MATRIX_GLYPHS[(index * 7 + glyphIndex * 3) % MATRIX_GLYPHS.length]
    )
    return {
      left: `${(index * 97) % 100}%`,
      duration: `${12 + (index % 8)}s`,
      delay: `${-((index * 1.7) % 18)}s`,
      glyphs,
    }
  })
}

const Hero = () => {
  const { hero, ticker } = shopContent
  const [word, setWord] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const columns = useMemo(() => buildColumns(14), [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => {
      setWord((current) => (current + 1) % hero.rotating.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [hero.rotating.length, reduceMotion])

  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-heading">
        {!reduceMotion ? (
          <div className="hero-matrix" aria-hidden="true">
            {columns.map((column, index) => (
              <div
                key={index}
                className="hero-matrix-col"
                style={{
                  left: column.left,
                  animationDuration: column.duration,
                  animationDelay: column.delay,
                }}
              >
                {column.glyphs.map((glyph, glyphIndex) => (
                  <span key={glyphIndex}>{glyph}</span>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        <div className="hero-inner content-container">
          <div className="hero-copy">
            <p className="kicker">{hero.kicker}</p>
            <h1 id="hero-heading">
              <span>
                {hero.line1Prefix} {hero.rotating[word]}
              </span>
              <span>{hero.line2}</span>
            </h1>
            <p>{hero.support}</p>
            <div className="cta-row">
              <LocalizedClientLink
                className="button button-primary"
                href={hero.primaryCta.href}
              >
                {hero.primaryCta.label}
              </LocalizedClientLink>
              <LocalizedClientLink
                className="button button-ghost"
                href={hero.secondaryCta.href}
              >
                {hero.secondaryCta.label}
              </LocalizedClientLink>
            </div>
            <ul className="hero-facts">
              {hero.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className="terminal" aria-hidden="true">
            <div className="terminal-bar">
              <span />
              <span />
              <span />
              <em>{hero.terminal.title}</em>
            </div>
            <div className="terminal-body">
              <p className="terminal-cmd">
                <span>&gt;</span> {hero.terminal.command}
                <i />
              </p>
              {hero.terminal.rows.map((row) => (
                <p key={row.label}>
                  <span className="terminal-dot">●</span>
                  <span className="terminal-label">{row.label}</span>
                  <span className="terminal-ok">{row.value}</span>
                </p>
              ))}
              <div className="terminal-load">
                <div>
                  <span>{hero.terminal.loadLabel}</span>
                  <span>{hero.terminal.loadHint}</span>
                </div>
                <div className="terminal-bar-track">
                  <div className="terminal-bar-fill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i>/</i>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export default Hero
