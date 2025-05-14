import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/diff"
import { diffStrings } from "../harness"

describe("simple replace", () => {
  test("one word in middle", () => {
    expect(diffStrings("one two three", "one wrong three")).toEqual(stringToDiff("= one\n→ two → wrong\n= three"))
  })
  test("two words together in middle", () => {
    expect(diffStrings("one two three four", "one wrong wrong four")).toEqual(
      stringToDiff("= one\n→ two three → wrong wrong\n= four")
    )
  })
  test("one into two words", () => {
    expect(diffStrings("one two three", "one wrong wrong three")).toEqual(
      stringToDiff("= one\n→ two → wrong wrong\n= three")
    )
  })
  test("two into one word", () => {
    expect(diffStrings("one two three four", "one wrong four")).toEqual(
      stringToDiff("= one\n→ two three → wrong\n= four")
    )
  })
})
