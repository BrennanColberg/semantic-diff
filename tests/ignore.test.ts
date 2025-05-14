import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/Diff"
import { semanticDiff } from ".."

describe("ignore", () => {
  test("at start", () => {
    expect(semanticDiff("one two three", "two three")).toEqual(stringToDiff("? one\n= two three"))
  })
  test("at end", () => {
    expect(semanticDiff("one two three", "one two")).toEqual(stringToDiff("= one two\n? three"))
  })
})
