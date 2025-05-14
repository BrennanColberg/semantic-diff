export type SemanticDiff = SemanticDiffElement[]

export enum SemanticDiffElementType {
  /** Text that matches in the expected and actual. */
  EQUAL = "=",
  /** Text in the expected that was not in the actual. */
  ADD = "+",
  /** Text in the actual that was not in the expected. */
  REMOVE = "-",
  /** Text in the expected that was different in the actual. */
  REPLACE = "→",
  /** Text in the expected that was not attempted, or was skipped. */
  IGNORE = "?",
}

export type Word = {
  text: string // lowercased, alphanumeric
  // TODO add these later, to preserve formatting & render
  // // leadingWhitespace?: string
  // // trailingWhitespace?: string
}

export type SemanticDiffElement =
  | { type: SemanticDiffElementType.ADD; actual: Word[] }
  | { type: SemanticDiffElementType.REMOVE; expected: Word[] }
  | { type: SemanticDiffElementType.REPLACE; expected: Word[]; actual: Word[] }
  | { type: SemanticDiffElementType.IGNORE; expected: Word[] }
