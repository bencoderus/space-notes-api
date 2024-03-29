import jwt from "jsonwebtoken";
import { HttpError } from "../../common/errors/http.error";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const SUPABASE_JWT_KEY = process.env.SUPABASE_JWT_SECRET || "";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "";

const supabase = () => createClient(SUPABASE_URL, SUPABASE_KEY);
const supabaseAdmin = () => createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

/**
 * Retrieve token from event header.
 *
 * @param {any} event
 * @returns {string}
 */
export const getToken = (event) => {
  const bearerToken =
    event.headers.authorization || event.headers.Authorization || "";

  return bearerToken.replace("Bearer ", "");
};

/**
 * Create an account.
 *
 * @param {Record<string, any>} params
 * @returns {Promise<Record<string, any>>}
 */
export const createAccount = async ({ email, password, name }) => {
  return supabase().auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
};

/**
 * Validate user credentials and generate JWT token.
 *
 * @param {Record<string, any>} params
 * @returns {Promise<Record<string, any>>}
 */
export const login = async ({ email, password }) => {
  return supabase().auth.signInWithPassword({
    email,
    password,
  });
};

/**
 * Request password reset using the user's credentials.
 *
 * @param {{email: string, redirectTo: string}} param0
 * @returns {Promise<Record<string, any>>}
 */
export const forgotPassword = async ({ email, redirectTo }) => {
  validateRedirectUrl(redirectTo);

  return supabase().auth.resetPasswordForEmail(email, {
    redirectTo,
  });
};

const validateRedirectUrl = (redirectTo) => {
  const domain = process.env.APP_DOMAIN || "";

  if (!domain) {
    throw new HttpError("App domain is not set", 400);
  }

  const regex = new RegExp(`(http|https)\:\/\/${domain}\/(.*)`, "i");

  if (!redirectTo.includes("//localhost") && !regex.test(redirectTo)) {
    throw new HttpError("Redirect Url is not valid", 400);
  }

  return redirectTo;
};

/**
 * Login with google
 */
const signInWithGoogle = async (redirectTo) => {
  return supabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};

export const signInWithSocial = async ({ provider, redirectTo }) => {
  validateRedirectUrl(redirectTo);

  const providers = {
    google: signInWithGoogle,
  };

  const providerAction = providers[provider];

  if (!providerAction) {
    throw new HttpError("Provider is not supported.");
  }

  return providerAction(redirectTo);
};

/**
 * Reset password using the access token.
 *
 * @param {Record<string, any>} param0
 * @returns {Promise<Record<string, any>>}
 */
export const resetPassword = async ({ password }, accessToken) => {
  const token = verifyToken(accessToken);

  if (!token.valid) {
    throw new HttpError("Token has expired.", 401);
  }

  const userId = token.decoded?.sub;

  const updateResponse = await supabaseAdmin().auth.admin.updateUserById(
    userId,
    {
      password,
    }
  );

  if (updateResponse.error) {
    throw new HttpError(updateResponse.error.message, 400);
  }

  return updateResponse.data.user;
};

export const getUser = async (accessToken) => {
  return supabase().auth.getUser(accessToken);
};

/**
 *
 * @param {string} token
 * @returns {any}
 */
export const verifyToken = (token) => {
  if (!token) {
    return {
      valid: false,
      decoded: false,
    };
  }

  let valid = false;
  let decoded = null;

  jwt.verify(token, SUPABASE_JWT_KEY, (error, value) => {
    valid = error ? false : true;
    decoded = value;
  });

  return {
    valid: valid,
    decoded: decoded,
  };
};
