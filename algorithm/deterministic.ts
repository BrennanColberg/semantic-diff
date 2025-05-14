import type { SemanticDiff } from "../types/SemanticDiff"
import { SemanticDiffElement, SemanticDiffElementType } from "../types/SemanticDiffElement"
import { stringToWords, Word } from "../types/Word"
import { diffWords } from "diff"

export default function (expectedWords: Word[], actualWords: Word[]): SemanticDiff {
  // start with a basic diff from the established library for this
  const result: SemanticDiff = []
  const simpleDiff = diffWords(
    expectedWords.map((w) => w.text).join(" "),
    actualWords.map((w) => w.text).join(" "),
  )
  simpleDiff.forEach((d) => {
    // not added, not removed -> equal
    if (!d.added && !d.removed)
      return result.push({ type: SemanticDiffElementType.EQUAL, words: stringToWords(d.value) })
    // removed -> omit
    if (d.removed)
      return result.push({ type: SemanticDiffElementType.OMIT, expected: stringToWords(d.value) })
    // added -> insert
    if (d.added)
      return result.push({ type: SemanticDiffElementType.INSERT, actual: stringToWords(d.value) })
    // (no replace case; this is a simple diff)
    // (no ignore case; this is a simple diff)
    throw `unhandled simple diff case: added & removed: ${d.added} & ${d.removed}`
  })

  // if there are any adjacent adds+omits, take them out in favor of a replace
  for (let i = 0; i < result.length - 1; i++) {
    const thisElement = result[i]
    const nextElement = result[i + 1]
    // note: coming from the simple diff, omits will always precede inserts
    if (
      thisElement.type === SemanticDiffElementType.OMIT &&
      nextElement.type === SemanticDiffElementType.INSERT
    ) {
      result.splice(i, 2, {
        type: SemanticDiffElementType.REPLACE,
        expected: thisElement.expected,
        actual: nextElement.actual,
      })
      i--
    }
  }

  // any leading or trailing omits should be ignores instead
  if (result[0]?.type === SemanticDiffElementType.OMIT)
    (result[0] as SemanticDiffElement).type = SemanticDiffElementType.IGNORE
  if (result[result.length - 1]?.type === SemanticDiffElementType.OMIT)
    (result[result.length - 1] as SemanticDiffElement).type = SemanticDiffElementType.IGNORE

  return result
}
