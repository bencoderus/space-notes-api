/**
 * Parse requests to get headers, body, queryString and path parameter.
 *
 * @param {*} event
 *
 * @returns {Record<string, any>}
 */
export const parseRequest = (event) => {
  const authToken = (event.headers.authorization || "").replace("Bearer ", "")

  return {
    body: event.body ? JSON.parse(event.body) : {},
    params: event.pathParameters || {},
    query: event.queryStringParameters || {},
    headers: event.headers || {},
    user: event?.requestContext?.authorizer?.jwt?.claims,
    userId: event?.requestContext?.authorizer?.jwt?.claims?.sub,
    authorizationToken: authToken
  };
};

export const validateRequest = async (schema, input = {}) => {
  try {
    const validated = await schema.validate(input);

    return {
      validated,
      input,
      error: null,
    };
  } catch (error) {
    return {
      validated: null,
      input,
      error: error.message,
    };
  }
};
