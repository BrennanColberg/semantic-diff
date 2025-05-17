import diffWordsDeterministically from "./algorithm/deterministic"
import { validateDiff } from "./types/Diff"
import type { Diff } from "./types/Diff"
import { stringToWords, Word, areWordsEqual, wordsToString } from "./types/Word"
import type { DiffElement, DiffElementType } from "./types/DiffElement"

// Re-export utils and types with more externally-descriptive names
export {
  diffToString as semanticDiffToString,
  stringToDiff as stringToSemanticDiff,
} from "./types/Diff"
export { wordsToString, stringToWords, areWordsEqual } from "./types/Word"
export type SemanticDiff = Diff
export type SemanticDiffElement = DiffElement
export type SemanticDiffElementType = DiffElementType
export type SemanticDiffWord = Word

// re-export renderer
export {
  renderDiff as renderSemanticDiff,
  type DiffRenderer as SemanticDiffRenderer,
} from "./renderer/renderer"

export function semanticDiff(
  expected: string | Word[],
  actual: string | Word[],
  // TODO mode to switch between deterministic and LLM
): Diff {
  const expectedWords = typeof expected === "string" ? stringToWords(expected) : expected
  const actualWords = typeof actual === "string" ? stringToWords(actual) : actual

  // TODO optionally switch to LLM mode here (-> also make async)
  const result = diffWordsDeterministically(expectedWords, actualWords)

  // validate: diff must be in a proper format, not just typed correctly
  validateDiff(result)
  // validate: expected+actual words in diff must be same as inputted
  const diffEW = result.flatMap((e) => ("expected" in e ? e.expected : "words" in e ? e.words : []))
  if (!areWordsEqual(diffEW, expectedWords))
    throw `expected words in diff must be same as inputted [${wordsToString(diffEW)} ≠ ${wordsToString(expectedWords)}]`
  const diffAW = result.flatMap((e) => ("actual" in e ? e.actual : "words" in e ? e.words : []))
  if (!areWordsEqual(diffAW, actualWords))
    throw `actual words in diff must be same as inputted [${wordsToString(diffAW)} ≠ ${wordsToString(actualWords)}]`

  return result
}
