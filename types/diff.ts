import {
  DiffElement,
  diffElementToString,
  DiffElementType,
  stringToDiffElement,
  validateDiffElement,
} from "./DiffElement"

export type Diff = DiffElement[]

/** checks non-typed invariants of a diff */
export function validateDiff(diff: Diff): void | never {
  // all elements must be valid
  diff.forEach(validateDiffElement)

  // no two neighboring elements can have the same type
  // TODO eventually two replaces need to be able to be adjacent
  diff.forEach((element, index) => {
    if (index === 0) return
    if (element.type === diff[index - 1].type) throw "adjacent elements have the same type"
  })

  // no insert should never be next to an omit; instead, put a replace
  // TODO eventually this might be appropriate in niche semantic cases
  diff.forEach((element, index) => {
    if (element.type === DiffElementType.INSERT && diff[index + 1]?.type === DiffElementType.OMIT)
      throw `insert and omit are adjacent:\n${diffToString(diff)}`
    if (element.type === DiffElementType.OMIT && diff[index + 1]?.type === DiffElementType.INSERT)
      throw `omit and insert are adjacent:\n${diffToString(diff)}`
  })
}

export function diffToString(diff: Diff): string {
  return diff.map(diffElementToString).join("\n")
}

export function stringToDiff(string: string): Diff {
  return string.split("\n").map(stringToDiffElement)
}
