import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  /**
   * This migration is adding user ownership to clients data
   */
  protected tableName = 'clients'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
    })
  }
}
