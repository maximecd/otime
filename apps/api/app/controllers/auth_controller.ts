// import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { loginSchema, registerSchema, changePasswordSchema } from '@maximecd/schemas'

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

  async deleteAccount({ auth, response }: HttpContext) {
    await auth.user!.delete()

    response.ok({
      message: 'Account deleted',
    })
  }

  async changePassword({ request, auth, response }: HttpContext) {
    const { currentPassword, newPassword } = changePasswordSchema.parse(request.body())

    const user = await User.verifyCredentials(auth.user!.email, currentPassword)

    user.password = newPassword

    await user.save()

    return response.ok({
      message: 'Password changed',
    })
  }
}
