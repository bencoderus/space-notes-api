import { getToken, verifyToken } from "../services/auth.service";

/**
 * Handle JWT authorization
 * 
 * @param {any} event 
 * @param {any} context 
 * @param {any} callback 
 * @returns {Promise<{isAuthorized: boolean, context: any}>}
 */
export const handler = async (event, context, callback) => {
  const authorizationToken = getToken(event);

  const response = verifyToken(authorizationToken);

  return {
    isAuthorized: response.valid,
    context: response.decoded,
  };
};
