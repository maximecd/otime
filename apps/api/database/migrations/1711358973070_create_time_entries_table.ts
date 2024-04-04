import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.integer('project_id').unsigned().references('projects.id').onDelete('CASCADE')
      table.string('description').nullable()
      table.integer('duration')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
