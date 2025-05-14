import { stringToWords, validateWord, Word, wordsToString } from "./Word"

export enum DiffElementType {
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

export type DiffElement =
  | { type: DiffElementType.EQUAL; words: Word[] }
  | { type: DiffElementType.INSERT; actual: Word[] }
  | { type: DiffElementType.OMIT; expected: Word[] }
  | { type: DiffElementType.REPLACE; expected: Word[]; actual: Word[] }
  | { type: DiffElementType.IGNORE; expected: Word[] }

export function validateDiffElement(element: DiffElement): void | never {
  // every word must be valid
  if ("actual" in element) element.actual.forEach(validateWord)
  if ("expected" in element) element.expected.forEach(validateWord)
  if ("words" in element) element.words.forEach(validateWord)
  // every word array must have at least one word
  if ("actual" in element && element.actual.length === 0) throw "actual has no words"
  if ("expected" in element && element.expected.length === 0) throw "expected has no words"
  if ("words" in element && element.words.length === 0) throw "words has no words"
  // expected/actual in a replace must not be the same
  if (element.type === DiffElementType.REPLACE) {
    if (wordsToString(element.expected) === wordsToString(element.actual))
      throw "expected and actual in a replace must not be the same"
  }
}

export function diffElementToString(element: DiffElement): string {
  switch (element.type) {
    case DiffElementType.EQUAL:
      return `=${wordsToString(element.words)}`
    case DiffElementType.INSERT:
      return `+${wordsToString(element.actual)}`
    case DiffElementType.OMIT:
      return `-${wordsToString(element.expected)}`
    case DiffElementType.REPLACE:
      return `→${wordsToString(element.expected)}→${wordsToString(element.actual)}`
    case DiffElementType.IGNORE:
      return `?${wordsToString(element.expected)}`
  }
}

export function stringToDiffElement(string: string): DiffElement {
  const regex = string.match(/^([=+-→?])\s*(.*)/)
  if (!regex) throw "invalid diff element string"
  const [, type, wordsString] = regex
  switch (type) {
    case DiffElementType.EQUAL:
      return { type: DiffElementType.EQUAL, words: stringToWords(wordsString) }
    case DiffElementType.INSERT:
      return { type: DiffElementType.INSERT, actual: stringToWords(wordsString) }
    case DiffElementType.OMIT:
      return { type: DiffElementType.OMIT, expected: stringToWords(wordsString) }
    case DiffElementType.REPLACE:
      const [expected, actual] = wordsString.split("→")
      return {
        type: DiffElementType.REPLACE,
        expected: stringToWords(expected),
        actual: stringToWords(actual),
      }
    case DiffElementType.IGNORE:
      return { type: DiffElementType.IGNORE, expected: stringToWords(wordsString) }
    default:
      throw `invalid diff element type: ${type}`
  }
}
