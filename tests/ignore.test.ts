import { test, expect, describe } from "bun:test"
import { stringToSemanticDiff } from "../types/SemanticDiff"
import { semanticDiff } from ".."

describe("ignore", () => {
  test("at start", () => {
    expect(semanticDiff("one two three", "two three")).toEqual(
      stringToSemanticDiff("? one\n= two three"),
    )
  })
  test("at end", () => {
    expect(semanticDiff("one two three", "one two")).toEqual(
      stringToSemanticDiff("= one two\n? three"),
    )
  })
})
