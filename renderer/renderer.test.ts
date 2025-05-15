import { describe, expect, test } from "bun:test"
import { DiffRenderer, renderDiff } from "./renderer"
import { stringToDiff } from "../types/Diff"

export const TEST_RENDERER: DiffRenderer<string> = {
  seed: "",
  join: (a, b) => a + b,
  renderEqual: (text) => `[=${text}]`,
  renderInsert: (text) => `[+${text}]`,
  renderOmit: (text) => `[-${text}]`,
  renderReplace: (expected, actual) => `[${expected}→${actual}]`,
  renderIgnore: (text) => `[*${text}]`,
}

describe("full sole elements", () => {
  test("equal", () => {
    const diff = stringToDiff("=one two three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[=one two three]")
  })
  test("insert", () => {
    const diff = stringToDiff("+one two three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[+one two three]")
  })
  test("omit", () => {
    const diff = stringToDiff("-one two three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[-one two three]")
  })
  test("ignore", () => {
    const diff = stringToDiff("*one two three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[*one two three]")
  })
})

describe("equal is more greedy with whitespace than insert/omit", () => {})
