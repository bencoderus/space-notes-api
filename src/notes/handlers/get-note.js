import { handleError } from "../../common/utils/handle-error";
import { parseRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { getNote } from "../services/note-service";

export const handler = async (event) => {
  const { params, userId } = parseRequest(event);
  const { id } = params;

  try {
    const note = await getNote(userId, id);

    return respond(200, "Notes retrieved successfully.", note);
  } catch (error) {
    return handleError(error);
  }
};
