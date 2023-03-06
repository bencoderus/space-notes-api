import jwt from "jsonwebtoken";

/**
 * Verify JWT token.
 *
 * @param {string} token
 * @returns {any}
 */
const verifyToken = (token) => {
  const secret = process.env.SUPABASE_JWT_SECRET || "";

  if (!token) {
    return {
      valid: false,
      decoded: false,
    };
  }

  let valid = false;
  let decoded = null;

  jwt.verify(token, secret, (error, value) => {
    valid = error ? false : true;
    decoded = value;
  });

  return {
    valid: valid,
    decoded: decoded,
  };
};

/**
 * Retrieve token from event header.
 * 
 * @param {any} event 
 * @returns {string}
 */
const getToken = (event) => {
  const bearerToken =
    event.headers.authorization || event.headers.Authorization || "";

  return bearerToken.replace("Bearer ", "");
};

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
