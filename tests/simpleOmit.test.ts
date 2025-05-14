import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/diff"
import { diffStrings } from "../harness"

describe("simple omit", () => {
  test("one word in middle", () => {
    expect(diffStrings("one two three", "one three")).toEqual(stringToDiff("= one\n- two\n= three"))
  })
  test("two words together in middle", () => {
    expect(diffStrings("one two three four", "one four")).toEqual(stringToDiff("= one\n- two three\n= four"))
  })
  test("two words separately in middle", () => {
    expect(diffStrings("one two three four five", "one three five")).toEqual(
      stringToDiff("= one\n- two\n= three\n- four\n= five")
    )
  })
})
