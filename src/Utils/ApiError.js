class ApiError {
    constructor(
        success = false, data= null, statusCode = 400 ,message="Error Occurs!!"){
            this.success = success,
            this.data = data,
            this.statusCode = statusCode,
            this.message = message
        }
}

module.exports = {ApiError}