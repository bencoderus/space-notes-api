import { http } from "../../common/middlewares/base.middleware"
import { validateSchema } from "../../common/middlewares/validator.middleware"
import { respond } from "../../common/utils/response"
import { loginSchema } from "../request-schemas/auth.schema"
import { login } from "../services/auth.service"

export const handler = http(async (event) => {
  const response = await login(event.validated)

  if (response.error) {
    return respond(400, response.error.message)
  }

  return respond(200, "Login completed.", response.data.session)
}).use(validateSchema(loginSchema))
