import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/diff"
import { diffStrings } from "../harness"

describe("simple insert", () => {
  test("one word in middle", () => {
    expect(diffStrings("one three", "one two three")).toEqual(stringToDiff("= one\n+ two\n= three"))
  })
  test("two words together in middle", () => {
    expect(diffStrings("one four", "one two three four")).toEqual(stringToDiff("= one\n+ two three\n= four"))
  })
  test("two words separately in middle", () => {
    expect(diffStrings("one three five", "one two three four five")).toEqual(
      stringToDiff("= one\n+ two\n= three\n+ four\n= five")
    )
  })
})
