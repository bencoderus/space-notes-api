import { HttpError } from "../errors/http.error"
import { respond } from "./response"

export const handleError = (error) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500
  const message =
    error instanceof HttpError ? error.message : "Unable to complete request"
  const reason = error.stack

  if (!(error instanceof HttpError)) {
    console.error(error)
  }

  return respond(statusCode, message, reason)
}
