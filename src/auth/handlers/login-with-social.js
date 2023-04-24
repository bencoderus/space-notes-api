import { handleError } from "../../common/utils/handle-error";
import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { loginWithSocialSchema } from "../request-schemas/auth.schema";
import { login, signInWithSocial } from "../services/auth.service";

export const handler = async (event) => {
  const { body } = parseRequest(event);

  const validation = await validateRequest(loginWithSocialSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }
  try {
    const response = await signInWithSocial(validation.validated);

    if (response.error) {
      return respond(400, response.error.message);
    }

    return respond(200, "Social login initiated successfully.", response.data);
  } catch (error) {
    return handleError(error);
  }
};
