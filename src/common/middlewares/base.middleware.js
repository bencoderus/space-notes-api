import middy from "@middy/core"
import { handleRequestError } from "./error.middleware"

/**
 * Handle API requests.
 *
 * @param {any} handler
 * @returns {any}
 */
export const http = (handler) => middy(handler).use(handleRequestError())
