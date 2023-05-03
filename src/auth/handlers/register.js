import { http } from "../../common/middlewares/base.middleware"
import { validateSchema } from '../../common/middlewares/validator.middleware'
import { respond } from "../../common/utils/response"
import { registerSchema } from "../request-schemas/auth.schema"
import { createAccount } from "../services/auth.service"

export const handler = http(async (event) => {
  const response = await createAccount(event.validated)

  if (response.error) {
    return respond(400, "Unable to create account.", response.error)
  }

  return respond(
    201,
    "Account created successfully, please verify your email.",
    response.data.user
  )
}).use(validateSchema(registerSchema))
