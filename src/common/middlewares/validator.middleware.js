import { validateRequest } from "../utils/request"
import { respond } from "../utils/response"

export const validateSchema = (schema) => {
  return {
    before: async ({ event }) => {
      const body = event.body ? JSON.parse(event.body) : {}

      const validation = await validateRequest(schema, body)

      if (validation.error) {
        return respond(400, validation.error)
      }

      event.validated = validation.validated
    }
  }
}
