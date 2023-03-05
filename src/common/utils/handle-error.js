import { HttpError } from "../errors/http.error";
import { respond } from "./response";

export const handleError = (error) => {
    const statusCode = error.statusCode || 500;
    const message = (error instanceof HttpError) ? error.message : 'Unable to complete request';
    const reason = error.stack;

    console.error(error)

    return respond(statusCode, message, reason)
}