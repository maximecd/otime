import Client from '#models/client'
import ClientPolicy from '#policies/client_policy'
import type { HttpContext } from '@adonisjs/core/http'
import { storeClient } from '@maximecd/schemas'

export default class ClientsController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const clients = await Client.query().where('userId', auth.user!.id)

    return clients
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const { name } = storeClient.parse(request.body())

    const client = await Client.create({
      name,
      userId: auth.user!.id,
    })

    return client
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await bouncer.with(ClientPolicy).authorize('owner', client)

    return client
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer }: HttpContext) {
    const { name } = storeClient.parse(request.body())

    const client = await Client.findOrFail(params.id)

    await bouncer.with(ClientPolicy).authorize('owner', client)

    client.name = name

    await client.save()

    return client
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await bouncer.with(ClientPolicy).authorize('owner', client)

    await client.delete()

    return {
      message: 'Record deleted',
    }
  }
}
