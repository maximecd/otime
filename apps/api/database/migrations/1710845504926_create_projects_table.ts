import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('clients.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.string('name')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
