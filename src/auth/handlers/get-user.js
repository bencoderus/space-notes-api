import { handleApiRequest } from "../../common/middlewares/base.middleware";
import { respond } from "../../common/utils/response";
import { getToken, getUser, } from "../services/auth.service";

export const handler = handleApiRequest(async (event) => {
    const accessToken = getToken(event);

    if (!accessToken) {
      return respond(400, "Authorization token is required.");
    }
    const { data, error } = await getUser(accessToken);

    if (error) {
      return respond(400, "Token is invalid.");
    }

    return respond(200, "User retrieved successfully.", data);
});
