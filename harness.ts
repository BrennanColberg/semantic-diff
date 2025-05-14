import diffWordsDeterministically from "./algorithm/diffWords"
import diffWordsViaLLM from "./prompt/diffWords"
import { validateDiff } from "./types/diff"
import type { Diff } from "./types/diff"
import { stringToWords, Word } from "./types/Word"

export type DiffMode = "deterministic" | "llm"

export function diffStrings(expected: string, actual: string, mode: DiffMode): Diff {
  const expectedWords = stringToWords(expected)
  const actualWords = stringToWords(actual)
  return diffWords(expectedWords, actualWords, mode)
}

function diffWords(expectedWords: Word[], actualWords: Word[], mode: DiffMode): Diff {
  let result: Diff = {
    deterministic: diffWordsDeterministically,
    llm: diffWordsViaLLM,
  }[mode](expectedWords, actualWords)

  // validate: diff must be in a proper format, not just typed correctly
  validateDiff(result)
  // validate: expected+actual words in diff must be same as inputted
  const diffExpectedWords = result.flatMap((e) => ("expected" in e ? e.expected : []))
  if (diffExpectedWords.map((w) => w.text).join(" ") !== expectedWords.map((w) => w.text).join(" "))
    throw "expected words in diff must be same as inputted"
  const diffActualWords = result.flatMap((e) => ("actual" in e ? e.actual : []))
  if (diffActualWords.map((w) => w.text).join(" ") !== actualWords.map((w) => w.text).join(" "))
    throw "actual words in diff must be same as inputted"

  return result
}
