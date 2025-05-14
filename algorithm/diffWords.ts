import type { Diff } from "../types/Diff"
import { DiffElementType } from "../types/DiffElement"
import { stringToWords, Word } from "../types/Word"
import { diffWords } from "diff"

export default function (expectedWords: Word[], actualWords: Word[]): Diff {
  // start with a basic diff from the established library for this
  const result: Diff = []
  const simpleDiff = diffWords(expectedWords.map((w) => w.text).join(" "), actualWords.map((w) => w.text).join(" "))
  simpleDiff.forEach((d) => {
    // not added, not removed -> equal
    if (!d.added && !d.removed) return result.push({ type: DiffElementType.EQUAL, words: stringToWords(d.value) })
    // removed -> omit
    if (d.removed) return result.push({ type: DiffElementType.OMIT, expected: stringToWords(d.value) })
    // added -> insert
    if (d.added) return result.push({ type: DiffElementType.INSERT, actual: stringToWords(d.value) })
    // (no replace case; this is a simple diff)
    // (no ignore case; this is a simple diff)
    throw `unhandled simple diff case: added & removed: ${d.added} & ${d.removed}`
  })

  // if there are any adjacent adds+omits, combine them

  return result
}
