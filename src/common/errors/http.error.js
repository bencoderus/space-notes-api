export class HttpError extends Error {
    /**
     * Create a new error instance.
     * 
     * @param {string} message 
     * @param {number} statusCode
     * @param {*} stack 
     */
    constructor(message, statusCode = 500, stack = null){
       const messageBody = JSON.stringify({message});

        super(message)
        this.body = messageBody
        this.statusCode = statusCode;
        this.stack = stack
    }
}