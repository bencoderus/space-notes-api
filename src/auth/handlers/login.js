import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { loginSchema } from "../request-schemas/auth.schema";
import { createAccount, login } from "../services/auth.service";

export const handler = async (event) => {
  const { body } = parseRequest(event);

  const validation = await validateRequest(loginSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }

  const response = await login(validation.validated);

  if (response.error) {
    return respond(400, response.error.message);
  }

  return respond(200, "Login completed.", response.data.session);
};
