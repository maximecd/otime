import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  async up() {
    // if any of the existing rows have a null value, this will fail
    // replace null values with empty string before running this migration
    this.defer(async (db) => {
      await db.from(this.tableName).whereNull('description').update('description', '')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.string('description').notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('description').nullable().alter()
    })
  }
}
