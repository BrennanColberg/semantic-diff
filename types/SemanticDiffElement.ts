import { stringToWords, validateWord, Word, wordsToString } from "./Word"

export enum SemanticDiffElementType {
  /** Text that matches in the expected and actual. */
  EQUAL = "=",
  /** Text in the expected that was not in the actual. */
  INSERT = "+",
  /** Text in the actual that was not in the expected. */
  OMIT = "-",
  /** Text in the expected that was different in the actual. */
  REPLACE = "→",
  /** Text in the expected that was not attempted, or was skipped. */
  IGNORE = "?",
}

export type SemanticDiffElement =
  | { type: SemanticDiffElementType.EQUAL; words: Word[] }
  | { type: SemanticDiffElementType.INSERT; actual: Word[] }
  | { type: SemanticDiffElementType.OMIT; expected: Word[] }
  | { type: SemanticDiffElementType.REPLACE; expected: Word[]; actual: Word[] }
  | { type: SemanticDiffElementType.IGNORE; expected: Word[] }

export function validateSemanticDiffElement(element: SemanticDiffElement): void | never {
  // every word must be valid
  if ("actual" in element) element.actual.forEach(validateWord)
  if ("expected" in element) element.expected.forEach(validateWord)
  if ("words" in element) element.words.forEach(validateWord)
  // every word array must have at least one word
  if ("actual" in element && element.actual.length === 0) throw "actual has no words"
  if ("expected" in element && element.expected.length === 0) throw "expected has no words"
  if ("words" in element && element.words.length === 0) throw "words has no words"
  // expected/actual in a replace must not be the same
  if (element.type === SemanticDiffElementType.REPLACE) {
    if (wordsToString(element.expected) === wordsToString(element.actual))
      throw "expected and actual in a replace must not be the same"
  }
}

export function semanticDiffElementToString(element: SemanticDiffElement): string {
  switch (element.type) {
    case SemanticDiffElementType.EQUAL:
      return `=${wordsToString(element.words)}`
    case SemanticDiffElementType.INSERT:
      return `+${wordsToString(element.actual)}`
    case SemanticDiffElementType.OMIT:
      return `-${wordsToString(element.expected)}`
    case SemanticDiffElementType.REPLACE:
      return `→${wordsToString(element.expected)}→${wordsToString(element.actual)}`
    case SemanticDiffElementType.IGNORE:
      return `?${wordsToString(element.expected)}`
  }
}

export function stringToSemanticDiffElement(string: string): SemanticDiffElement {
  const regex = string.match(/^([=+-→?])\s*(.*)/)
  if (!regex) throw "invalid diff element string"
  const [, type, wordsString] = regex
  switch (type) {
    case SemanticDiffElementType.EQUAL:
      return { type: SemanticDiffElementType.EQUAL, words: stringToWords(wordsString) }
    case SemanticDiffElementType.INSERT:
      return { type: SemanticDiffElementType.INSERT, actual: stringToWords(wordsString) }
    case SemanticDiffElementType.OMIT:
      return { type: SemanticDiffElementType.OMIT, expected: stringToWords(wordsString) }
    case SemanticDiffElementType.REPLACE:
      const [expected, actual] = wordsString.split("→")
      return {
        type: SemanticDiffElementType.REPLACE,
        expected: stringToWords(expected),
        actual: stringToWords(actual),
      }
    case SemanticDiffElementType.IGNORE:
      return { type: SemanticDiffElementType.IGNORE, expected: stringToWords(wordsString) }
    default:
      throw `invalid diff element type: ${type}`
  }
}
