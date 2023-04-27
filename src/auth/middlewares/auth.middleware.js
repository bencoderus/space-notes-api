import { respond } from "../../common/utils/response";
import { getToken, verifyToken } from "../services/auth.service";

export const authenticate = () => {
  return {
    before: ({ event }) => {
      const authorizationToken = getToken(event);

      if (!authorizationToken) {
        return respond(401, "Authorization token is not provided.");
      }

      const response = verifyToken(authorizationToken);

      if (!response.valid) {
        return respond(401, "Authorization token is not valid.");
      }

      event.requestContext.user = response.decoded;
    },
  };
};
