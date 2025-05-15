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
  IGNORE = "*",
}

export type DiffElement =
  | { type: "="; words: Word[] }
  | { type: "+"; actual: Word[] }
  | { type: "-"; expected: Word[] }
  | { type: "→"; expected: Word[]; actual: Word[] }
  | { type: "*"; expected: Word[] }

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
  if (element.type === "→") {
    if (wordsToString(element.expected) === wordsToString(element.actual))
      throw "expected and actual in a replace must not be the same"
  }
}

export function diffElementToString(element: DiffElement): string {
  switch (element.type) {
    case "=":
      return `=${wordsToString(element.words)}`
    case "+":
      return `+${wordsToString(element.actual)}`
    case "-":
      return `-${wordsToString(element.expected)}`
    case "→":
      return `→${wordsToString(element.expected)}→${wordsToString(element.actual)}`
    case "*":
      return `*${wordsToString(element.expected)}`
  }
}

export function stringToDiffElement(string: string): DiffElement {
  const regex = string.match(/^([=+-→*])\s*(.*)/)
  if (!regex) throw "invalid diff element string"
  const [, type, wordsString] = regex
  switch (type) {
    case "=":
      return { type: "=", words: stringToWords(wordsString) }
    case "+":
      return { type: "+", actual: stringToWords(wordsString) }
    case "-":
      return { type: "-", expected: stringToWords(wordsString) }
    case "→":
      const [expected, actual] = wordsString.split("→")
      return { type: "→", expected: stringToWords(expected), actual: stringToWords(actual) }
    case "*":
      return { type: "*", expected: stringToWords(wordsString) }
    default:
      throw `invalid diff element type: ${type}`
  }
}
