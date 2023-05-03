import { http } from "../../common/middlewares/base.middleware"
import { validateSchema } from "../../common/middlewares/validator.middleware"
import { respond } from "../../common/utils/response"
import { loginWithSocialSchema } from "../request-schemas/auth.schema"
import { signInWithSocial } from "../services/auth.service"

export const handler = http(async (event) => {
  const response = await signInWithSocial(event.validated)

  if (response.error) {
    return respond(400, response.error.message)
  }

  return respond(200, "Social login initiated successfully.", response.data)
}).use(validateSchema(loginWithSocialSchema))
