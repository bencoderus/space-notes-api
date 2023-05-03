import { parseRequest } from "../../common/utils/request"
import { respond } from "../../common/utils/response"
import { changeStatusSchema } from "../request-schemas/note.schema"
import { changeStatus } from "../services/note-service"
import { http } from "../../common/middlewares/base.middleware"
import { authenticate } from "../../auth/middlewares/auth.middleware"
import { validateSchema } from "../../common/middlewares/validator.middleware"

export const handler = http(async (event) => {
  const { params, userId, body } = parseRequest(event)
  const { id } = params

  const note = await changeStatus(userId, id, body.status)

  return respond(200, "Note status updated successfully.", note)
})
  .use(authenticate())
  .use(validateSchema(changeStatusSchema))
