import { test, expect } from "bun:test"
import { textToWords, validateWord } from "./word"

test("validateWord", () => {
  expect(() => validateWord({ text: "hello" })).not.toThrow()
  expect(() => validateWord({ text: "hello, world!" })).toThrow()
  expect(() => validateWord({ text: "123" })).not.toThrow()
  expect(() => validateWord({ text: "123!" })).toThrow()
  expect(() => validateWord({ text: "Hello" })).toThrow()
})

test("textToWords", () => {
  expect(textToWords("Hello, world!")).toEqual([{ text: "hello" }, { text: "world" }])
})
