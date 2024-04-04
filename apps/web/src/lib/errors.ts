import { setError, type SuperValidated } from 'sveltekit-superforms'

export class ApiFormError<T extends Record<string, unknown>> extends Error {
  form: SuperValidated<T>
  fieldErrors: { field: string; message: string }[]
  globalError: string

  constructor(
    form: SuperValidated<T>,
    fieldErrors: { field: string; message: string }[],
    globalError: string = ''
  ) {
    super()
    this.form = form
    this.fieldErrors = fieldErrors
    this.globalError = globalError

    if (globalError) {
      setError(form, globalError)
    }

    if (fieldErrors) {
      fieldErrors.forEach((fieldError) => {
        // @ts-expect-error - I don't know why this is throwing an error
        setError(form, fieldError.field, fieldError.message)
      })
    }
  }
}
