import middy from "@middy/core";
import { handleRequestError } from "./error.middleware";

export const handleApiRequest = (handler) => middy(handler).use(handleRequestError)
