import Project from '#models/project'
import TimeEntry from '#models/time_entry'
import ClientPolicy from '#policies/client_policy'
import type { HttpContext } from '@adonisjs/core/http'
import { storeTimeEntry } from '../../../../packages/schemas/src/index.js'

export default class TimeEntriesController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const timeEntries = await TimeEntry.query()
      .preload('project', (projectsQuery) => {
        projectsQuery.preload('client')
      })
      .join('projects', 'time_entries.project_id', 'projects.id')
      .join('clients', 'projects.client_id', 'clients.id')
      .where('clients.user_id', auth.user!.id)

    return timeEntries
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, bouncer }: HttpContext) {
    const { description, duration, projectId } = storeTimeEntry.parse(request.body())

    const project = await Project.query().preload('client').where('id', projectId).firstOrFail()

    await bouncer.with(ClientPolicy).authorize('owner', project.client)

    const timeEntry = await project.related('time_entries').create({
      description,
      duration,
    })

    return timeEntry
  }

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}
