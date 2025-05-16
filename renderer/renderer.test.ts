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

describe("equal whitespace greediness (> all but ignore)", () => {
  test("insert (after equal)", () => {
    const diff = stringToDiff("=one two\n+three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[=one two ][+three]")
  })
  test("insert (before equal)", () => {
    const diff = stringToDiff("+one two\n=three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[+one two][= three]")
  })
  test("omit (after equal)", () => {
    const diff = stringToDiff("=one two\n-three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[=one two ][-three]")
  })
  test("omit (before equal)", () => {
    const diff = stringToDiff("-one two\n=three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[-one two][= three]")
  })
  test("replace (after equal)", () => {
    const diff = stringToDiff("=one two\n→three→four")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[=one two ][three→four]")
  })
  test("replace (before equal)", () => {
    const diff = stringToDiff("→one→two\n=three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[one→two][= three]")
  })
})

describe("ignore whitespace greediness (> all)", () => {
  test("equal (after ignore)", () => {
    const diff = stringToDiff("*one two\n=three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[*one two ][=three]")
  })
  test("equal (before ignore)", () => {
    const diff = stringToDiff("=one two\n*three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[=one two][* three]")
  })
  test("insert (after ignore)", () => {
    const diff = stringToDiff("*one two\n+three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[*one two ][+three]")
  })
  test("insert (before ignore)", () => {
    const diff = stringToDiff("+one two\n*three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[+one two][* three]")
  })
  test("omit (after ignore)", () => {
    const diff = stringToDiff("*one two\n-three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[*one two ][-three]")
  })
  test("omit (before ignore)", () => {
    const diff = stringToDiff("-one two\n*three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[-one two][* three]")
  })
  test("replace (after ignore)", () => {
    const diff = stringToDiff("*one two\n→three→four")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[*one two ][three→four]")
  })
  test("replace (before ignore)", () => {
    const diff = stringToDiff("→one→two\n*three")
    const result = renderDiff(diff, TEST_RENDERER)
    expect(result).toEqual("[one→two][* three]")
  })
})
