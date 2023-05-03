import { http } from "../../common/middlewares/base.middleware"
import { validateSchema } from '../../common/middlewares/validator.middleware'
import { respond } from "../../common/utils/response"
import { resetPasswordSchema } from "../request-schemas/auth.schema"
import { getToken, resetPassword } from "../services/auth.service"

export const handler = http(async (event) => {
  const accessToken = getToken(event)

  await resetPassword(event.validated, accessToken)

  return respond(200, "Password reset successfully.")
}).use(validateSchema(resetPasswordSchema))