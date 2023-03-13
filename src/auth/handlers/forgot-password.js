import { parseRequest, validateRequest } from "../../common/utils/request";
import { respond } from "../../common/utils/response";
import { forgotPasswordSchema } from "../request-schemas/auth.schema";
import { forgotPassword } from "../services/auth.service";

export const handler = async (event) => {
    const { body } = parseRequest(event);
  
    const validation = await validateRequest(forgotPasswordSchema, body);

    if (validation.error) {
      return respond(400, validation.error);
    }

    const response = await forgotPassword(validation.validated);

    if(response.error){
       return respond(400, response.error.message, response.error)
    }

   return respond(200, 'A password reset link has been sent to your email.')
  };
  