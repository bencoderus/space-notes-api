import jwt from 'jsonwebtoken'
import { ulid } from 'ulid';

const generateAuthResponse = (principalId, effect, methodArn) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument,
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
}

const verifyToken = (token) => {
  const secret = process.env.SUPABASE_JWT_SECRET || "";

  return jwt.verify(token, secret);
}

export const handler = async (event, context, callback) => {
  const authorizationToken = (event.headers.Authorization || "").replace("Bearer ", "");

  const methodArn = event.routeArn;

  if (!authorizationToken || !methodArn) return callback(null, "Unauthorized");

  try {
    const response = await verifyToken(authorizationToken);

    return callback(null, generateAuthResponse(response.sub, "Allow", methodArn));
  }catch(error){
    return callback(null, generateAuthResponse(ulid(), "Deny", methodArn));
  }
};
