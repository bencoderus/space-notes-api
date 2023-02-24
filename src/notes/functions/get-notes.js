import { respond } from "../../common/utils/response";

export async function handler (event) {
  return respond(200, "Notes retrieved successfully.");
}
