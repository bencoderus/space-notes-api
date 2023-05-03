import { authenticate } from "../../auth/middlewares/auth.middleware";
import { http } from "../../common/middlewares/base.middleware";
import { parseRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { NOTE_LIMIT } from "../database/repository/note.repository";
import { getNotes } from "../services/note-service";

export const handler = http(async (event, context) => {
	const { query, userId } = parseRequest(event);

	const status = query.status || "";
	const lastKey = query.lastKey || "";
	const limit = query.limit || NOTE_LIMIT;

	const notes = await getNotes(userId, status, lastKey, limit);

	return respond(200, "Notes retrieved successfully.", notes);
}).use(authenticate());