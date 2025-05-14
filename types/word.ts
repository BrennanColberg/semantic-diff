import type { Word } from "./SemanticDiff"

export function validateWord(word: Word): void | never {
  if (!word.text) throw "word has no text"
  if (word.text.match(/^[a-z0-9]+$/) === null) throw "word is not alphanumeric"
}

export function textToWords(text: string): Word[] {
  return (
    text
      .split(/[^a-z0-9']+/i)
      // strip down to lowercase alphanumeric
      .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
      // get rid of empty words
      .filter(Boolean)
      // put in proper format
      .map((word) => ({ text: word }))
  )
}
