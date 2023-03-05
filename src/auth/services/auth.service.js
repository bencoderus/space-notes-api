import { HttpError } from "../../common/errors/http.error";

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

const supabase = () => createClient(SUPABASE_URL, SUPABASE_KEY);

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

export const login = async ({ email, password }) => {
  return supabase().auth.signInWithPassword({
    email,
    password,
  });
};

export const verifyToken = async (accessToken) => {
  const response = await supabase().auth.getUser(accessToken);

  return {
    error: response.error,
    user: response?.data?.user,
    userId: response?.data?.user?.id,
  };
};

export const authorizeUsingEvent = async (event) => {
  const accessToken = (
    event.headers.Authorization ||
    event.headers.authorization ||
    ""
  ).replace("Bearer ", "");

  const response = await supabase().auth.getUser(accessToken);

  if (response.error) {
    throw new HttpError(response.error.message, 401, response.error);
  }

  return {
    user: response?.data?.user,
    userId: response?.data?.user?.id,
  };
};

export const getUser = async (accessToken) => {
  return supabase().auth.getUser(accessToken);
};
