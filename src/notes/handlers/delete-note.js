import { parseRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { deleteNote } from "../services/note-service";
import { http } from '../../common/middlewares/base.middleware';
import { authenticate } from '../../auth/middlewares/auth.middleware';

export const handler = http(async (event) => {
	const { params, userId } = parseRequest(event);
	const { id } = params;

	await deleteNote(userId, id);

	return respond(200, "Note removed successfully.");
}).use(authenticate())
