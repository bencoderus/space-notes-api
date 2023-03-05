/**
 * Parse requests to get headers, body, queryString and path parameter.
 *
 * @param {*} event
 *
 * @returns {Record<string, any>}
 */
export const parseRequest = (event) => {
  const authToken = (event.headers.authorization || "").replace("Bearer ", "")
  const jwt =  event?.requestContext?.authorizer?.lambda;

  return {
    body: event.body ? JSON.parse(event.body) : {},
    params: event.pathParameters || {},
    query: event.queryStringParameters || {},
    headers: event.headers || {},
    user: jwt,
    userId: jwt?.sub,
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
