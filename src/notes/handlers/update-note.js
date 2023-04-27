import {parseRequest, validateRequest} from "../../common/utils/request";
import {respond} from "../../common/utils/response";
import {updateNoteSchema} from "../request-schemas/note.schema";
import {updateNote} from "../services/note-service";
import {handleApiRequest} from '../../common/middlewares/base.middleware';
import {authenticate} from '../../auth/middlewares/auth.middleware';

export const handler = handleApiRequest(async (event) => {
	const {params, userId, body} = parseRequest(event);
	const {id} = params;

	const validation = await validateRequest(updateNoteSchema, body);

	if (validation.error) {
		return respond(400, validation.error);
	}

	const note = await updateNote(userId, id, body);

	return respond(200, "Note updated successfully.", note);
}).use(authenticate())