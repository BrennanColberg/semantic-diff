import { test, expect, describe } from "bun:test"
import { stringToSemanticDiff } from "../types/SemanticDiff"
import { semanticDiff } from ".."

describe("simple replace", () => {
  test("one word in middle", () => {
    expect(semanticDiff("one two three", "one wrong three")).toEqual(
      stringToSemanticDiff("= one\n→ two → wrong\n= three"),
    )
  })
  test("two words together in middle", () => {
    expect(semanticDiff("one two three four", "one wrong wrong four")).toEqual(
      stringToSemanticDiff("= one\n→ two three → wrong wrong\n= four"),
    )
  })
  test("one into two words", () => {
    expect(semanticDiff("one two three", "one wrong wrong three")).toEqual(
      stringToSemanticDiff("= one\n→ two → wrong wrong\n= three"),
    )
  })
  test("two into one word", () => {
    expect(semanticDiff("one two three four", "one wrong four")).toEqual(
      stringToSemanticDiff("= one\n→ two three → wrong\n= four"),
    )
  })
})
