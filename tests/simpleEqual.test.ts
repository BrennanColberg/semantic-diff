import { test, expect, describe } from "bun:test"
import { stringToSemanticDiff } from "../types/SemanticDiff"
import { semanticDiff } from ".."

describe("allEqual", () => {
  test("one word", () => {
    expect(semanticDiff("hello", "hello")).toEqual(stringToSemanticDiff("= hello"))
  })
  test("multiple words", () => {
    expect(semanticDiff("hello world", "hello world")).toEqual(
      stringToSemanticDiff("= hello world"),
    )
  })
  test("different capitalization", () => {
    expect(semanticDiff("Hello World", "hello world")).toEqual(
      stringToSemanticDiff("= hello world"),
    )
  })
  test("different punctuation", () => {
    expect(semanticDiff("Hello, world!", "hello world")).toEqual(
      stringToSemanticDiff("= hello world"),
    )
  })
})
