import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import Client from '#models/client'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TimeEntry from '#models/time_entry'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare name: string

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @column()
  declare clientId: number

  @hasMany(() => TimeEntry)
  declare time_entries: HasMany<typeof TimeEntry>
}
