export const successResponse = (res, data, statusCode = 200) => {
	res.status(statusCode).json({
		success: true,
		message: "Request was successful",
		data
	});
}


export const errorResponse = (res, error, statusCode = 500) => {
	console.log("Error:", error.message);
	res.status(statusCode).json({
		success: false,
		message: "Request was not successful",
		error: error.message
	});
}
