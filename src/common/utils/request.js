/**
 * Parse requests to get headers, body, queryString and path parameter.
 *
 * @param {*} event
 *
 * @returns {Record<string, any>}
 */
const parseRequest = (event) => {
	return {
		body: JSON.parse(event.body),
		params: event.pathParameters,
		query: event.queryStringParameters,
		headers: event.headers,
	};
}

export {
	parseRequest
}