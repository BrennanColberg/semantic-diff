import { Diff } from "../types/Diff"
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

export function renderDiff<T>(diff: Diff, renderer: DiffRenderer<T>): T {
  return diff.reduce((acc, element) => {
    switch (element.type) {
      case "=":
        return renderer.join(acc, renderer.renderEqual(wordsToString(element.words)))
      case "+":
        return renderer.join(acc, renderer.renderInsert(wordsToString(element.actual)))
      case "-":
        return renderer.join(acc, renderer.renderOmit(wordsToString(element.expected)))
      case "→":
        return renderer.join(
          acc,
          renderer.renderReplace(wordsToString(element.expected), wordsToString(element.actual)),
        )
      case "*":
        return renderer.join(acc, renderer.renderIgnore(wordsToString(element.expected)))
    }
  }, renderer.seed)
}
