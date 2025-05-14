import { test, expect, describe } from "bun:test"
import { stringToSemanticDiff } from "../types/SemanticDiff"
import { semanticDiff } from ".."

describe("simple omit", () => {
  test("one word in middle", () => {
    expect(semanticDiff("one two three", "one three")).toEqual(
      stringToSemanticDiff("= one\n- two\n= three"),
    )
  })
  test("two words together in middle", () => {
    expect(semanticDiff("one two three four", "one four")).toEqual(
      stringToSemanticDiff("= one\n- two three\n= four"),
    )
  })
  test("two words separately in middle", () => {
    expect(semanticDiff("one two three four five", "one three five")).toEqual(
      stringToSemanticDiff("= one\n- two\n= three\n- four\n= five"),
    )
  })
})
