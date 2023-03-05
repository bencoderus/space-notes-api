import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { changeStatusSchema } from "../request-schemas/note.schema";
import { changeStatus } from "../services/note-service";

export const handler = async (event) => {  
    const { params, userId, body } = parseRequest(event);
    const { id } = params;
  
    const validation = await validateRequest(changeStatusSchema, body);

    if (validation.error) {
      return respond(400, "Validation error", validation.error);
    }

    await changeStatus(userId, id, body.status);
  
    return respond(200, "Note status updated successfully.",);
  };
  