import Client from '#models/client'
import Project from '#models/project'
import ClientPolicy from '#policies/client_policy'
import type { HttpContext } from '@adonisjs/core/http'
import { storeProject } from '@maximecd/schemas'

export default class ProjectsController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const projects = await Project.query()
      .preload('client')
      .join('clients', 'projects.client_id', 'clients.id')
      .where('clients.user_id', auth.user!.id)

    return projects
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, bouncer }: HttpContext) {
    const { name, clientId } = storeProject.parse(request.body())

    const client = await Client.findOrFail(clientId)

    await bouncer.with(ClientPolicy).authorize('owner', client)

    const project = await client.related('projects').create({
      name,
    })

    return project
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer }: HttpContext) {
    const project = await Project.query()
      .preload('client')
      .preload('time_entries')
      .where('id', params.id)
      .firstOrFail()

    await bouncer.with(ClientPolicy).authorize('owner', project.client)

    return project
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer }: HttpContext) {
    const { name } = storeProject.parse(request.body())

    const project = await Project.findOrFail(params.id)

    await bouncer.with(ClientPolicy).authorize('owner', project.client)

    project.name = name

    await project.save()

    return project
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer }: HttpContext) {
    const project = await Project.query().preload('client').where('id', params.id).firstOrFail()

    await bouncer.with(ClientPolicy).authorize('owner', project.client)

    await project.delete()

    return {
      message: 'Record deleted',
    }
  }
}
