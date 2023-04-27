/**
 * Parse requests to get headers, body, queryString and path parameter.
 *
 * @param {*} event
 *
 * @returns {Record<string, any>}
 */
export const parseRequest = (event) => {
  const authToken = (event.headers.authorization || "").replace("Bearer ", "")
  const jwt = getJwtContext(event);
  const user = event?.requestContext?.user;

  return {
    body: event.body ? JSON.parse(event.body) : {},
    params: event.pathParameters || {},
    query: event.queryStringParameters || {},
    headers: event.headers || {},
    user: jwt || user,
    userId: jwt?.sub || user?.sub,
    authorizationToken: authToken
  };
};

const getJwtContext = (event) => {
 return event?.requestContext?.authorizer?.lambda ||event?.requestContext?.authorizer;
}

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
