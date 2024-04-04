import { z } from 'zod'

export const errorMap: z.ZodErrorMap = (error, ctx) => {
  switch (
    error.code
    // TODO LATER GLOBAL ERRORS
  ) {
  }

  return {
    message: ctx.defaultError,
  }
}
