//a custom error handler function(API) to capture my error messages

class customErrorAPI extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomError = (message, statusCode) => {
    return new customErrorAPI(message, statusCode)
}

module.exports = {
    customErrorAPI,
    createCustomError
}