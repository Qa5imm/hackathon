import { z } from "zod"
import { errorResponse } from "../utils/response.js";



const postSchema = z.object({
	user_id: z.number({ message: "user id must be a number" }).positive({ message: "user id must be a positive number" }),
	title: z.string().min(3, { message: "title must be at least 3 characters long" }).max(255, { message: "Title must be at most 255 characters long" }),
	content: z.string().min(3, { message: "content must be at least 3 characters long" })
})


const validatePost = async (req, res, next) => {
	try {
		const post = postSchema.parse(req.body);
		req.body = post;
		next();
	} catch (error) {
		errorResponse(res, error.errors[0], 400);
	}
}

export default validatePost;
