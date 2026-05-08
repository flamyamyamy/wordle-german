export type CEFRLevel =
  | 'A1'
  | 'A2'
  | 'B1'
  | 'B2'
  | 'C1'

export interface WordEntry {
  word: string
  level: CEFRLevel
}