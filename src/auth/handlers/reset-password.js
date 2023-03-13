import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { resetPasswordSchema } from "../request-schemas/auth.schema";
import { getToken, resetPassword } from "../services/auth.service";

export const handler = async (event) => {
  const { body } = parseRequest(event);

  const validation = await validateRequest(resetPasswordSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }

  const accessToken = getToken(event);
  await resetPassword(validation.validated, accessToken);

  return respond(200, "Password reset successfully.");
};
