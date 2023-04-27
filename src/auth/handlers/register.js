import { handleApiRequest } from "../../common/middlewares/base.middleware";
import { handleError } from "../../common/utils/handle-error";
import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { registerSchema } from "../request-schemas/auth.schema";
import { createAccount } from "../services/auth.service";

export const handler = handleApiRequest(async (event) => {
  const { body } = parseRequest(event);

  const validation = await validateRequest(registerSchema, body);

  if (validation.error) {
    return respond(400, validation.error);
  }

  try {
    const response = await createAccount(validation.validated);

    if (response.error) {
      return respond(400, "Unable to create account.", response.error);
    }

    return respond(
      201,
      "Account created successfully, please verify your email.",
      response.data.user
    );
  } catch (error) {
    return handleError(error);
  }
});
