import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/diff"
import { diffStrings } from "../harness"

describe("allEqual", () => {
  test("one word", () => {
    expect(diffStrings("hello", "hello")).toEqual(stringToDiff("= hello"))
  })
  test("multiple words", () => {
    expect(diffStrings("hello world", "hello world")).toEqual(stringToDiff("= hello world"))
  })
  test("different capitalization", () => {
    expect(diffStrings("Hello World", "hello world")).toEqual(stringToDiff("= hello world"))
  })
  test("different punctuation", () => {
    expect(diffStrings("Hello, world!", "hello world")).toEqual(stringToDiff("= hello world"))
  })
})
