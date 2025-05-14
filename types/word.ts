export type Word = {
  text: string // lowercased, alphanumeric
  // TODO add these later, to preserve formatting & render
  // // leadingWhitespace?: string
  // // trailingWhitespace?: string
}

export function validateWord(word: Word): void | never {
  if (!word.text) throw "word has no text"
  if (word.text.match(/^[a-z0-9]+$/) === null) throw "word is not alphanumeric"
}

export function stringToWord(string: string): Word {
  return { text: string.toLowerCase().replace(/[^a-z0-9]/g, "") }
}

export function stringToWords(string: string): Word[] {
  return string
    .split(/[^a-z0-9']+/i)
    .filter(Boolean)
    .map(stringToWord)
}

export function wordToString(word: Word): string {
  return word.text
}

export function wordsToString(words: Word[]): string {
  return words.map(wordToString).join(" ")
}

export function areWordsEqual(a: Word[], b: Word[]): boolean {
  if (a.length !== b.length) return false
  return a.every((word, index) => word.text === b[index].text)
}
