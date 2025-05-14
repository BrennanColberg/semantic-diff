import {
  DiffElement,
  diffElementToString,
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
}

export function diffToString(diff: Diff): string {
  return diff.map(diffElementToString).join("\n")
}

export function stringToDiff(string: string): Diff {
  return string.split("\n").map(stringToDiffElement)
}
