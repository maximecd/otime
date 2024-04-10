/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const TimeEntriesController = () => import('#controllers/time_entries_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/healthcheck', () => {
  return { status: 'ok' }
})

router
  .group(() => {
    router.get('me', [AuthController, 'me']).use(middleware.auth())
    router.post('login', [AuthController, 'login'])
    router.post('register', [AuthController, 'register'])
    router.post('change-password', [AuthController, 'changePassword']).use(middleware.auth())
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.delete('delete-account', [AuthController, 'deleteAccount']).use(middleware.auth())
  })
  .prefix('auth')

router
  .group(() => {
    router.resource('clients', ClientsController).apiOnly()
    router.resource('projects', ProjectsController).apiOnly()
    router.resource('time-entries', TimeEntriesController).apiOnly()
  })
  .use(middleware.auth())
