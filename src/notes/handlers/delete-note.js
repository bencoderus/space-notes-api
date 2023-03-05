import { parseRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { deleteNote, getNote } from "../services/note-service";

export const handler = async (event) => {
  const { params, userId } = parseRequest(event);
  const { id } = params;

  await deleteNote(userId, id);

  return respond(200, "Note removed successfully.");
};
