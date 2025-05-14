import { test, expect, describe } from "bun:test"
import { stringToDiff } from "../types/diff"
import { diffStrings } from "../harness"

describe("ignore", () => {
  test("at start", () => {
    expect(diffStrings("one two three", "two three")).toEqual(stringToDiff("? one\n= two three"))
  })
  test("at end", () => {
    expect(diffStrings("one two three", "one two")).toEqual(stringToDiff("= one two\n? three"))
  })
})
