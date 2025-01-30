import pool from "../config/db.config.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getCurrentUser = async (req, res) => {
	try {
		const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.user.id]);
		successResponse(res, user[0], 200);
	} catch (error) {
		errorResponse(res, error, 500);
	}
}
export const getUserById = async (req, res) => {
	try {
		const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
		successResponse(res, user[0], 200);
	} catch (error) {
		errorResponse(res, error, 500);
	}
}

export const getAllUsers = async (_, res) => {
	try {
		const [users] = await pool.execute("SELECT * FROM users");
		successResponse(res, users);
	} catch (error) {
		errorResponse(res, error, 500);
	}
}


export const getUserPosts = async (req, res) => {
	try {
		const { id } = req.params;
		const [posts] = await pool.execute("SELECT * FROM posts WHERE user_id = ?", [id]);

		if (!posts.length) {
			errorResponse(res, { message: "no posts found" }, 404)
		}
		successResponse(res, posts)

	} catch (error) {
		errorResponse(res, error)
	}
};
