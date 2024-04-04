import User from '#models/user'
import Client from '#models/client'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ClientPolicy extends BasePolicy {
  owner(user: User, client: Client): AuthorizerResponse {
    return user.id === client.userId
  }
}
