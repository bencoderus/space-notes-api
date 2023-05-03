import { parseRequest, validateRequest } from "../../common/utils/request"
import { respond } from "../../common/utils/response"
import { updateNoteSchema } from "../request-schemas/note.schema"
import { updateNote } from "../services/note-service"
import { http } from "../../common/middlewares/base.middleware"
import { authenticate } from "../../auth/middlewares/auth.middleware"
import { validateSchema } from "../../common/middlewares/validator.middleware"

export const handler = http(async (event) => {
  const { params, userId, body } = parseRequest(event)
  const { id } = params

  const note = await updateNote(userId, id, event.validated)

  return respond(200, "Note updated successfully.", note)
})
  .use(authenticate())
  .use(validateSchema(updateNoteSchema))
