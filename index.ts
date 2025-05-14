import diffWordsDeterministically from "./algorithm/deterministic"
import { validateSemanticDiff } from "./types/SemanticDiff"
import type { SemanticDiff } from "./types/SemanticDiff"
import { stringToWords, Word } from "./types/Word"

export type DiffMode = "deterministic" | "llm"

export function semanticDiff(
  expected: string | Word[],
  actual: string | Word[],
  mode: DiffMode = "deterministic",
): SemanticDiff {
  const expectedWords = typeof expected === "string" ? stringToWords(expected) : expected
  const actualWords = typeof actual === "string" ? stringToWords(actual) : actual

  if (mode === "llm") throw "llm mode not implemented"
  const result = diffWordsDeterministically(expectedWords, actualWords)

  // validate: diff must be in a proper format, not just typed correctly
  validateSemanticDiff(result)
  // validate: expected+actual words in diff must be same as inputted
  const diffExpectedWords = result.flatMap((element) =>
    "expected" in element ? element.expected : "words" in element ? element.words : [],
  )
  if (diffExpectedWords.map((w) => w.text).join(" ") !== expectedWords.map((w) => w.text).join(" "))
    throw `expected words in diff must be same as inputted [${diffExpectedWords
      .map((w) => w.text)
      .join(" ")} !== ${expectedWords.map((w) => w.text).join(" ")}]`
  const diffActualWords = result.flatMap((element) =>
    "actual" in element ? element.actual : "words" in element ? element.words : [],
  )
  if (diffActualWords.map((w) => w.text).join(" ") !== actualWords.map((w) => w.text).join(" "))
    throw `actual words in diff must be same as inputted [${diffActualWords
      .map((w) => w.text)
      .join(" ")} !== ${actualWords.map((w) => w.text).join(" ")}]`

  return result
}
