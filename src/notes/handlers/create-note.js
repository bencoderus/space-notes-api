import { parseRequest, validateRequest } from "../../common/utils/request"
import { respond } from "../../common/utils/response"
import { createNoteSchema } from "../request-schemas/note.schema"
import { createNote } from "../services/note-service"
import { authenticate } from "../../auth/middlewares/auth.middleware"
import { http } from "../../common/middlewares/base.middleware"
import { validateSchema } from "../../common/middlewares/validator.middleware"

export const handler = http(async (event) => {
  const { userId } = parseRequest(event)

  const note = await createNote(userId, event.validated)

  return respond(200, "Notes created successfully.", note)
})
  .use(authenticate())
  .use(validateSchema(createNoteSchema))
