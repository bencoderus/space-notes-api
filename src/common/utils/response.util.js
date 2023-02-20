/**
 * Send Lambda REST API response.
 *
 * @param {number} statusCode
 * @param {string} message
 * @param {unknown} data
 * @returns {Record<string, any>}
 */
module.exports.respond = (statusCode, message, data = null) => {
  const status = statusCode >= 200 && statusCode <= 210;
  const headers = { ContentType: "application/json" };

  const responseData = {
    status,
    message,
  };

  if (data) {
    const additional = status ? "data" : "error";
    responseData[additional] = data;
  }

  const responseBody = JSON.stringify(responseData);

  return {
    statusCode,
    headers,
    body: responseBody,
  };
};
