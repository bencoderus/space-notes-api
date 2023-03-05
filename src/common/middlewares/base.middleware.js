import { respond } from "../utils/response";

export const handleRequest = async (handler) => {
  const fx = await handleErrors(handler);

  console.log('Received Handler', handler)
  console.log('Generated Handler', fx)

  return fx;
};

const handleErrors = async (handler) => {
  const callback = async () => {
    try {
      return handler();
    } catch (error) {
      return respond(500, "Unable to process request.", error);
    }
  };

  return callback;
};
