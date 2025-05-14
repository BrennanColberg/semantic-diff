import { SemanticDiffElementType, type SemanticDiff } from "./SemanticDiff"
import { validateWord } from "./word"

/** checks non-typed invariants of a diff */
export function validateDiff(diff: SemanticDiff): void | never {
  // every word must be valid
  diff.forEach((element) => {
    if ("expected" in element) element.expected.forEach(validateWord)
    if ("actual" in element) element.actual.forEach(validateWord)
  })
  // every element array must have at least one word
  diff.forEach((element) => {
    if ("expected" in element && element.expected.length === 0) throw "expected has no words"
    if ("actual" in element && element.actual.length === 0) throw "actual has no words"
  })
  // no two neighboring elements can have the same type
  // TODO eventually two replaces need to be able to be adjacent
  diff.forEach((element, index) => {
    if (index === 0) return
    if (element.type === diff[index - 1].type) throw "adjacent elements have the same type"
  })
  // the expected/actual in a replace must not be the same
  diff.forEach((element) => {
    if (element.type === SemanticDiffElementType.REPLACE) {
      if (element.expected.join(" ") === element.actual.join(" "))
        throw "expected and actual in a replace must not be the same"
    }
  })
}

export function toString(diff: SemanticDiff): string {
  return diff
    .map((element) => {
      switch (element.type) {
        case SemanticDiffElementType.ADD:
          return `+ ${element.actual.map((word) => word.text).join(" ")}`
        case SemanticDiffElementType.REMOVE:
          return `- ${element.expected.map((word) => word.text).join(" ")}`
        case SemanticDiffElementType.IGNORE:
          return `? ${element.expected.map((word) => word.text).join(" ")}`
        case SemanticDiffElementType.REPLACE: {
          const expectedWords = element.expected.map((word) => word.text).join(" ")
          const actualWords = element.actual.map((word) => word.text).join(" ")
          return `→ ${expectedWords} → ${actualWords}`
        }
      }
    })
    .join("\n")
}
