import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/Diff"
import { semanticDiff } from ".."

describe("allEqual", () => {
  test("one word", () => {
    expect(semanticDiff("hello", "hello")).toEqual(stringToDiff("= hello"))
  })
  test("multiple words", () => {
    expect(semanticDiff("hello world", "hello world")).toEqual(stringToDiff("= hello world"))
  })
  test("different capitalization", () => {
    expect(semanticDiff("Hello World", "hello world")).toEqual(stringToDiff("= hello world"))
  })
  test("different punctuation", () => {
    expect(semanticDiff("Hello, world!", "hello world")).toEqual(stringToDiff("= hello world"))
  })
})
