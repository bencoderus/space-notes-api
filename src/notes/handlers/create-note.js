import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { createNoteSchema } from "../request-schemas/note.schema";
import { createNote } from "../services/note-service";
import { authenticate } from "../../auth/middlewares/auth.middleware";
import { handleApiRequest } from "../../common/middlewares/base.middleware";

export const handler = handleApiRequest(async (event) => {
  const { body, userId } = parseRequest(event);
  const validation = await validateRequest(createNoteSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }

  const note = await createNote(userId, validation.validated);

  return respond(200, "Notes created successfully.", note);
}).use(authenticate());
