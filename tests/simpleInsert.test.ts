import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/Diff"
import { semanticDiff } from ".."

describe("simple insert", () => {
  test("one word in middle", () => {
    expect(semanticDiff("one three", "one two three")).toEqual(
      stringToDiff("= one\n+ two\n= three"),
    )
  })
  test("two words together in middle", () => {
    expect(semanticDiff("one four", "one two three four")).toEqual(
      stringToDiff("= one\n+ two three\n= four"),
    )
  })
  test("two words separately in middle", () => {
    expect(semanticDiff("one three five", "one two three four five")).toEqual(
      stringToDiff("= one\n+ two\n= three\n+ four\n= five"),
    )
  })
})
