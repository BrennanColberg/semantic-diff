import diffWordsDeterministically from "./algorithm/diffWords"
import diffWordsViaLLM from "./prompt/diffWords"
import { validateDiff } from "./types/diff"
import type { Diff } from "./types/diff"
import { stringToWords, Word } from "./types/Word"

export type DiffMode = "deterministic" | "llm"

export function diffStrings(
  expected: string,
  actual: string,
  mode: DiffMode = "deterministic"
): Diff {
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
  const diffExpectedWords = result.flatMap((element) =>
    "expected" in element ? element.expected : "words" in element ? element.words : []
  )
  if (diffExpectedWords.map((w) => w.text).join(" ") !== expectedWords.map((w) => w.text).join(" "))
    throw `expected words in diff must be same as inputted [${diffExpectedWords
      .map((w) => w.text)
      .join(" ")} !== ${expectedWords.map((w) => w.text).join(" ")}]`
  const diffActualWords = result.flatMap((element) =>
    "actual" in element ? element.actual : "words" in element ? element.words : []
  )
  if (diffActualWords.map((w) => w.text).join(" ") !== actualWords.map((w) => w.text).join(" "))
    throw `actual words in diff must be same as inputted [${diffActualWords
      .map((w) => w.text)
      .join(" ")} !== ${actualWords.map((w) => w.text).join(" ")}]`

  return result
}
