/**
 * Send Lambda REST API response.
 *
 * @param {number} statusCode
 * @param {string} message
 * @param {unknown} data
 * @returns {Record<string, any>}
 */
export function respond(statusCode, message, data = null) {
  const status = statusCode >= 200 && statusCode <= 210
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }

  const responseData = {
    statusCode,
    message
  }

  if (data) {
    const additional = status ? "data" : "error"
    responseData[additional] = data
  }

  return {
    statusCode,
    headers,
    body: JSON.stringify(responseData, null, 2)
  }
}
