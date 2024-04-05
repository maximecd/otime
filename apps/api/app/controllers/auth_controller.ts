// import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { loginSchema, registerSchema } from '../../../../packages/schemas/src/index.js'

export default class AuthController {
  async login({ request, auth, response }: HttpContext) {
    const { email, password } = loginSchema.parse(request.body())

    const caseInsensitiveEmail = email.toLowerCase()

    const user = await User.verifyCredentials(caseInsensitiveEmail, password)

    await auth.use('web').login(user)

    return response.ok({
      message: 'Logged in',
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  async register({ request, auth, response }: HttpContext) {
    const { fullName, email, password } = registerSchema.parse(request.body())

    const caseInsensitiveEmail = email.toLowerCase()

    const user = await User.create({
      fullName,
      email: caseInsensitiveEmail,
      password,
    })

    await auth.use('web').login(user)

    return response.created({
      message: 'Registered',
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  async me({ auth, response }: HttpContext) {
    return response.ok({
      user: {
        fullName: auth.user!.fullName,
        email: auth.user!.email,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.ok({
      message: 'Logged out',
    })
  }
}
