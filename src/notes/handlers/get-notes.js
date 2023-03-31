import { handleError } from "../../common/utils/handle-error";
import { parseRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { NOTE_LIMIT, NOTE_STATUSES } from "../database/repository/note.repository";
import { getNotes } from "../services/note-service";

export const handler = async (event, context) => {
  const { query, userId } = parseRequest(event);

  const status = query.status || NOTE_STATUSES.ACTIVE;
  const lastKey = query.lastKey || '';
  const limit = query.limit || NOTE_LIMIT;

  try {
    const notes = await getNotes(userId, status, lastKey, limit);

    return respond(200, "Notes retrieved successfully.", notes);
  } catch (error) {
    return handleError(error);
  }
};
