import { handleError } from "../utils/handle-error";

export const handleRequestError = {
  onError: ({ error }) => {
    return handleError(error);
  },
};
