import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { changeStatusSchema } from "../request-schemas/note.schema";
import { changeStatus } from "../services/note-service";
import { handleApiRequest } from "../../common/middlewares/base.middleware";
import { authenticate } from "../../auth/middlewares/auth.middleware";

export const handler = handleApiRequest(async (event) => {
  const { params, userId, body } = parseRequest(event);
  const { id } = params;

  const validation = await validateRequest(changeStatusSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }

  const note = await changeStatus(userId, id, body.status);

  return respond(200, "Note status updated successfully.", note);
}).use(authenticate());
