import { handleError } from "../../common/utils/handle-error";
import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { createNoteSchema } from "../request-schemas/note.schema";
import { createNote } from "../services/note-service";

export const handler = async (event) => {
  const { body, userId } = parseRequest(event);
  const validation = await validateRequest(createNoteSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }

  try {
    const note = await createNote(userId, validation.validated);

    return respond(200, "Notes created successfully.", note);
  } catch (error) {
    return handleError(error);
  }
};
