class ApiResponse {
    constructor(sucess , data , statusCode , error , message){
        this.Sucess = sucess,
        this.data = data,
        this.statusCode = statusCode,
        this.error = error,
        this.message = message

    }
}

module.exports = {ApiResponse}