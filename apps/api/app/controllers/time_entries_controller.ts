import Project from '#models/project'
import TimeEntry from '#models/time_entry'
import ClientPolicy from '#policies/client_policy'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { storeTimeEntry } from '@maximecd/schemas'

export default class TimeEntriesController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const timeEntries = await db
      .from('time_entries')
      .join('projects', 'time_entries.project_id', 'projects.id')
      .join('clients', 'projects.client_id', 'clients.id')
      .select('time_entries.*')
      .select('projects.name as project_name')
      .select('projects.id as project_id')
      .where('clients.user_id', auth.user!.id)
      .orderBy('time_entries.created_at', 'desc')

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
  async show({}: HttpContext) {
    //TODO: Implement
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer }: HttpContext) {
    const { description, duration, projectId } = storeTimeEntry.parse(request.body())

    const timeEntry = await TimeEntry.findOrFail(params.id)

    const project = await Project.query()
      .preload('client')
      .where('id', timeEntry.projectId)
      .firstOrFail()

    await bouncer.with(ClientPolicy).authorize('owner', project.client)

    timeEntry
      .merge({
        description,
        duration,
        projectId,
      })
      .save()

    return timeEntry
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer, response }: HttpContext) {
    const timeEntry = await TimeEntry.findOrFail(params.id)
    const project = await Project.query()
      .preload('client')
      .where('id', timeEntry.projectId)
      .firstOrFail()

    await bouncer.with(ClientPolicy).authorize('owner', project.client)

    await timeEntry.delete()

    return response.ok({
      message: 'Time entry deleted successfully',
    })
  }
}
