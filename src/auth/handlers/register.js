import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { registerSchema } from "../request-schemas/auth.schema";
import { createAccount } from "../services/auth.service";

export const handler = async (event) => {
    const { body } = parseRequest(event);
  
    const validation = await validateRequest(registerSchema, body);

    if (validation.error) {
      return respond(400, "Validation error", validation.error);
    }

    const response = await createAccount(validation.validated);

    if(response.error){
       return respond(400, 'Unable to create account', response.error)
    }

   return respond(200, 'Account created successfully.', response.data.user)
  };
  