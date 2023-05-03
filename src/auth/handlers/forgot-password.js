import { http } from "../../common/middlewares/base.middleware"
import { validateSchema } from "../../common/middlewares/validator.middleware"
import { respond } from "../../common/utils/response"
import { forgotPasswordSchema } from "../request-schemas/auth.schema"
import { forgotPassword } from "../services/auth.service"

export const handler = http(async (event) => {
  const response = await forgotPassword(event.validated)

  if (response.error) {
    return respond(400, response.error.message, response.error)
  }

  return respond(200, "A password reset link has been sent to your email.")
}).use(validateSchema(forgotPasswordSchema))
