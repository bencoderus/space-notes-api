const { respond } = require("./utils/response.util")

module.exports.index = (event) => {
   return respond(200, "Notes API version 2.")
}