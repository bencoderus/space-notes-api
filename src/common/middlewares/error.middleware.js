import { handleError } from "../utils/handle-error"

export const handleRequestError = () => {
  return {
    onError: ({ error }) => {
      return handleError(error)
    }
  }
}
