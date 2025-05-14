import {
  SemanticDiffElement,
  semanticDiffElementToString,
  SemanticDiffElementType,
  stringToSemanticDiffElement,
  validateSemanticDiffElement,
} from "./SemanticDiffElement"

export type SemanticDiff = SemanticDiffElement[]

/** checks non-typed invariants of a diff */
export function validateSemanticDiff(diff: SemanticDiff): void | never {
  // all elements must be valid
  diff.forEach(validateSemanticDiffElement)

  // no two neighboring elements can have the same type
  // TODO eventually two replaces need to be able to be adjacent
  diff.forEach((element, index) => {
    if (index === 0) return
    if (element.type === diff[index - 1].type) throw "adjacent elements have the same type"
  })

  // no insert should never be next to an omit; instead, put a replace
  // TODO eventually this might be appropriate in niche semantic cases
  diff.forEach((element, index) => {
    if (
      element.type === SemanticDiffElementType.INSERT &&
      diff[index + 1]?.type === SemanticDiffElementType.OMIT
    )
      throw `insert and omit are adjacent:\n${semanticDiffToString(diff)}`
    if (
      element.type === SemanticDiffElementType.OMIT &&
      diff[index + 1]?.type === SemanticDiffElementType.INSERT
    )
      throw `omit and insert are adjacent:\n${semanticDiffToString(diff)}`
  })
}

export function semanticDiffToString(diff: SemanticDiff): string {
  return diff.map(semanticDiffElementToString).join("\n")
}

export function stringToSemanticDiff(string: string): SemanticDiff {
  return string.split("\n").map(stringToSemanticDiffElement)
}
