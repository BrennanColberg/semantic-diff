import type { Diff } from "../types/Diff"
import { DiffElement } from "../types/DiffElement"
import { stringToWords, Word } from "../types/Word"
import { diffWords } from "diff"

export default function (expectedWords: Word[], actualWords: Word[]): Diff {
  // start with a basic diff from the established library for this
  const result: Diff = []
  const simpleDiff = diffWords(
    expectedWords.map((w) => w.text).join(" "),
    actualWords.map((w) => w.text).join(" "),
  )
  simpleDiff.forEach((d) => {
    // not added, not removed -> equal
    if (!d.added && !d.removed) return result.push({ type: "=", words: stringToWords(d.value) })
    // removed -> omit
    if (d.removed) return result.push({ type: "-", expected: stringToWords(d.value) })
    // added -> insert
    if (d.added) return result.push({ type: "+", actual: stringToWords(d.value) })
    // (no replace case; this is a simple diff)
    // (no ignore case; this is a simple diff)
    throw `unhandled simple diff case: added & removed: ${d.added} & ${d.removed}`
  })

  // if there are any adjacent adds+omits, take them out in favor of a replace
  for (let i = 0; i < result.length - 1; i++) {
    const a = result[i]
    const b = result[i + 1]
    // note: coming from the simple diff, omits will always precede inserts
    if (a.type === "-" && b.type === "+") {
      result.splice(i, 2, { type: "→", expected: a.expected, actual: b.actual })
      i -= 1
    }
  }

  // any leading or trailing omits should be ignores instead
  if (result[0]?.type === "-") (result[0] as DiffElement).type = "?"
  if (result[result.length - 1]?.type === "-") (result[result.length - 1] as DiffElement).type = "?"

  return result
}
