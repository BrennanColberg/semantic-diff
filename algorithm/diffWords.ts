import type { Diff } from "../types/Diff"
import { DiffElementType } from "../types/DiffElement"
import { Word } from "../types/Word"

export default function (expectedWords: Word[], actualWords: Word[]): Diff {
  // TODO implement :)
  return [{ type: DiffElementType.EQUAL, words: expectedWords }]
}
