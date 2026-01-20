import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const word = sqliteTable('word', {
  id: text('id').primaryKey().notNull(),
  entry: text('entry').notNull(),
  pinyin: text('pinyin'),
  link: text('link'),
}, (table) => [
  index('idx_word_entry').on(table.entry),
])

export const wordMean = sqliteTable('word_mean', {
  id: text('id').primaryKey().notNull(),
  wordId: text('word_id').notNull(),
  partOfSpeech: text('part_of_speech'),
  value: text('value').notNull(),
}, (table) => [
  index('idx_word_mean_word_id').on(table.wordId),
])

export const wordExample = sqliteTable('word_example', {
  id: text('id').primaryKey().notNull(),
  wordId: text('word_id').notNull(),
  exampleZh: text('example_zh').notNull(),
  examplePinyin: text('example_pinyin'),
  exampleKo: text('example_ko'),
}, (table) => [
  index('idx_word_example_word_id').on(table.wordId),
])

export const wordbook = sqliteTable('wordbook', {
  id: text('id').primaryKey().notNull(),
  query: text('query').notNull(),
  wordId: text('word_id').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_wordbook_query').on(table.query),
  index('idx_wordbook_created_at').on(table.createdAt),
])

export const wordRelations = relations(word, ({ many }) => ({
  means: many(wordMean),
  examples: many(wordExample),
  wordbookEntries: many(wordbook),
}))

export const wordMeanRelations = relations(wordMean, ({ one }) => ({
  word: one(word, {
    fields: [wordMean.wordId],
    references: [word.id],
  }),
}))

export const wordExampleRelations = relations(wordExample, ({ one }) => ({
  word: one(word, {
    fields: [wordExample.wordId],
    references: [word.id],
  }),
}))

export const wordbookRelations = relations(wordbook, ({ one }) => ({
  word: one(word, {
    fields: [wordbook.wordId],
    references: [word.id],
  }),
}))
