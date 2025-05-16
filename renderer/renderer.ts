import { Diff } from "../types/Diff"
import { DiffElementType } from "../types/DiffElement"
import { wordsToString } from "../types/Word"

export type DiffRenderer<T> = {
  seed: T
  join(a: T, b: T): T
  renderEqual(text: string): T
  renderInsert(actual: string): T
  renderOmit(expected: string): T
  renderReplace(expected: string, actual: string): T
  renderIgnore(expected: string): T
}

const WHITESPACE = " "
export function renderDiff<T>(diff: Diff, renderer: DiffRenderer<T>): T {
  let nextLeadingWhitespace = ""
  return diff.reduce((acc, element, index, array) => {
    // grab leading whitespace that the last element left us
    const leadingWhitespace = nextLeadingWhitespace
    nextLeadingWhitespace = ""
    let laggingWhitespace = ""
    // compare this element to the next one. if it's greedier take whitespace as lagging,
    // if it's lazier give the whitespace to the leading of the next element
    const WHITESPACE_BETWEEN_ELEMENTS = " " // TODO change according to word
    if (index < array.length - 1) {
      const nextElement = array[index + 1]
      // @ts-ignore because wrong
      const stickingTo = whitespaceSticksTo(element.type, nextElement.type)
      if (stickingTo === "a") laggingWhitespace = WHITESPACE_BETWEEN_ELEMENTS
      else nextLeadingWhitespace = WHITESPACE_BETWEEN_ELEMENTS
    }

    switch (element.type) {
      case "=":
        return renderer.join(
          acc,
          renderer.renderEqual(
            leadingWhitespace + wordsToString(element.words) + laggingWhitespace,
          ),
        )
      case "+":
        return renderer.join(
          acc,
          renderer.renderInsert(
            leadingWhitespace + wordsToString(element.actual) + laggingWhitespace,
          ),
        )
      case "-":
        return renderer.join(
          acc,
          renderer.renderOmit(
            leadingWhitespace + wordsToString(element.expected) + laggingWhitespace,
          ),
        )
      case "→":
        return renderer.join(
          acc,
          renderer.renderReplace(
            leadingWhitespace + wordsToString(element.expected),
            wordsToString(element.actual) + laggingWhitespace,
          ),
        )
      case "*":
        return renderer.join(
          acc,
          renderer.renderIgnore(
            leadingWhitespace + wordsToString(element.expected) + laggingWhitespace,
          ),
        )
    }
  }, renderer.seed)
}

function whitespaceSticksTo(a: DiffElementType, b: DiffElementType): "a" | "b" {
  if (a === b) throw "two of the same type adjacent; merge"
  // ignore is the greediest
  if (a === "*") return "a"
  if (b === "*") return "b"
  // then equal
  if (a === "=") return "a"
  if (b === "=") return "b"
  // then it doesn't matter, stick with first
  return "a"
}
