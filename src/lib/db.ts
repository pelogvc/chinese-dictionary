import { PowerSyncDatabase } from '@powersync/web'
import { wrapPowerSyncWithDrizzle, DrizzleAppSchema } from '@powersync/drizzle-driver'
import { eq, gt, and, desc } from 'drizzle-orm'
import { word, wordMean, wordExample, wordbook, wordRelations, wordMeanRelations, wordExampleRelations, wordbookRelations } from './schema'

function generateId(): string {
  return crypto.randomUUID()
}

const drizzleSchema = {
  word,
  wordMean,
  wordExample,
  wordbook,
  wordRelations,
  wordMeanRelations,
  wordExampleRelations,
  wordbookRelations,
}

const AppSchema = new DrizzleAppSchema(drizzleSchema)

const powerSyncDb = new PowerSyncDatabase({
  database: { dbFilename: 'chinese-dictionary.sqlite' },
  schema: AppSchema,
})

const db = wrapPowerSyncWithDrizzle(powerSyncDb, { schema: drizzleSchema })

let initialized = false
async function ensureInit() {
  if (!initialized) {
    await powerSyncDb.init()
    initialized = true
  }
}

export interface WordbookEntryWithDetails {
  id: string
  query: string
  createdAt: Date
  word: {
    id: string
    entry: string
    pinyin: string | null
    link: string | null
  }
  means: Array<{
    id: string
    partOfSpeech: string | null
    value: string
  }>
  examples: Array<{
    id: string
    exampleZh: string
    examplePinyin: string | null
    exampleKo: string | null
  }>
}

export async function getWordbook(): Promise<WordbookEntryWithDetails[]> {
  await ensureInit()

  const entries = await db.select().from(wordbook).orderBy(desc(wordbook.createdAt))

  const results: WordbookEntryWithDetails[] = []

  for (const entry of entries) {
    const wordData = await db.select().from(word).where(eq(word.id, entry.wordId)).limit(1)
    if (wordData.length === 0) continue

    const means = await db.select().from(wordMean).where(eq(wordMean.wordId, entry.wordId))
    const examples = await db.select().from(wordExample).where(eq(wordExample.wordId, entry.wordId))

    results.push({
      id: entry.id,
      query: entry.query,
      createdAt: new Date(entry.createdAt),
      word: wordData[0]!,
      means,
      examples,
    })
  }

  return results
}

export interface AddWordInput {
  query: string
  entry: string
  pinyin: string | null
  link: string | null
  means: Array<{
    partOfSpeech: string | null
    value: string
  }>
  examples: Array<{
    exampleZh: string
    examplePinyin: string | null
    exampleKo: string | null
  }>
}

export async function addToWordbook(input: AddWordInput): Promise<void> {
  await ensureInit()

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const existing = await db
    .select()
    .from(wordbook)
    .where(and(eq(wordbook.query, input.query), gt(wordbook.createdAt, fiveMinutesAgo)))
    .limit(1)

  if (existing.length > 0) return

  const existingWord = await db.select().from(word).where(eq(word.entry, input.entry)).limit(1)

  let wordId: string

  if (existingWord.length > 0) {
    wordId = existingWord[0]!.id
  } else {
    wordId = generateId()

    await db.insert(word).values({
      id: wordId,
      entry: input.entry,
      pinyin: input.pinyin,
      link: input.link,
    })

    if (input.means.length > 0) {
      await db.insert(wordMean).values(
        input.means.map((m) => ({
          id: generateId(),
          wordId,
          partOfSpeech: m.partOfSpeech,
          value: m.value,
        }))
      )
    }

    if (input.examples.length > 0) {
      await db.insert(wordExample).values(
        input.examples.map((e) => ({
          id: generateId(),
          wordId,
          exampleZh: e.exampleZh,
          examplePinyin: e.examplePinyin,
          exampleKo: e.exampleKo,
        }))
      )
    }
  }

  await db.insert(wordbook).values({
    id: generateId(),
    query: input.query,
    wordId,
    createdAt: new Date().toISOString(),
  })
}

export async function deleteFromWordbook(id: string): Promise<void> {
  await ensureInit()
  await db.delete(wordbook).where(eq(wordbook.id, id))
}

export async function clearWordbook(): Promise<void> {
  await ensureInit()
  await db.delete(wordbook)
  await db.delete(wordExample)
  await db.delete(wordMean)
  await db.delete(word)
}
