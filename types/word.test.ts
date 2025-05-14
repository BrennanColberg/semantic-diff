import { test, expect } from "bun:test"
import { stringToWords, validateWord } from "./Word"

test("validateWord", () => {
  expect(() => validateWord({ text: "hello" })).not.toThrow()
  expect(() => validateWord({ text: "hello, world!" })).toThrow()
  expect(() => validateWord({ text: "123" })).not.toThrow()
  expect(() => validateWord({ text: "123!" })).toThrow()
  expect(() => validateWord({ text: "Hello" })).toThrow()
})

test("stringToWords", () => {
  expect(stringToWords("Hello, world!")).toEqual([{ text: "hello" }, { text: "world" }])
})
