import jwt from "jsonwebtoken";

const generateAuthResponse = (principalId, effect, methodArn, context = {}) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument,
    context: context
  };
};

const generatePolicyDocument = (effect, methodArn) => {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };

  return policyDocument;
};

/**
 * Verify JWT token.
 *
 * @param {string} token
 * @returns {any}
 */
const verifyToken = (token) => {
  const secret = process.env.SUPABASE_JWT_SECRET || "";

  return jwt.verify(token, secret);
};

const getToken = (event) => {
  const bearerToken =
    event.headers.authorization || event.headers.Authorization || "";

  return bearerToken.replace("Bearer ", "");
};

export const handler = (event, context, callback) => {
  const authorizationToken = getToken(event);

  const methodArn = event.methodArn || event.routeArn;

  if (!authorizationToken || !methodArn) return callback(null, "Unauthorized");

  try {
    const response = verifyToken(authorizationToken);

    if (response && response.sub) {
      return callback(
        null,
        generateAuthResponse(response.sub, "Allow", methodArn, response)
      );
    }

    return callback(null, generateAuthResponse("guest", "Deny", methodArn));
  } catch (error) {
    console.error(error);
    return callback(null, generateAuthResponse("guest", "Deny", methodArn));
  }
};
