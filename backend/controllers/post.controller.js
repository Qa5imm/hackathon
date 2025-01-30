import pool from "../config/db.config.js";
import { errorResponse, successResponse } from "../utils/response.js";



export const createPost = async (req, res) => {
	try {
		const { user_id, title, content } = req.body
		const [result] = await pool.execute("INSERT INTO posts (user_id, title, content) VALUES (?,?,?)", [user_id, title, content])
		const [createdPost] = await pool.execute(
			"SELECT * FROM posts WHERE id=?",
			[result.insertId]
		);
		successResponse(res, createdPost[0], 201)
	} catch (error) {
		errorResponse(res, error)
	}
}

export const getAllPosts = async (_, res) => {
	try {
		const [posts] = await pool.execute("SELECT * from posts")
		successResponse(res, posts, 200)
	} catch (error) {
		errorResponse(res, error)
	}

}

export const getPostById = async (req, res) => {
	try {
		const { id } = req.params
		const [posts] = await pool.execute("SELECT * FROM posts WHERE id=?", [id])
		successResponse(res, posts[0], 200)
	} catch (error) {
		errorResponse(res, error)
	}
}

export const updatePost = async (req, res) => {
	try {
		const { id } = req.params
		const { title, content } = req.body
		const [result] = await pool.execute("UPDATE posts SET title= ?, content=? WHERE id=?", [title, content, id])
		if (result.affectedRows === 0) {
			errorResponse(res, { message: "post not found" }, 404)
		}
		const [updatedPost] = await pool.execute(
			"SELECT * FROM posts WHERE id=?",
			[id]
		);
		successResponse(res, updatedPost[0])
	}
	catch (error) {
		errorResponse(res, error)
	}
}
export const deletePost = async (req, res) => {
	try {
		const { id } = req.params
		const [result] = await pool.execute("DELETE FROM posts WHERE id=?", [id])
		if (result.affectedRows === 0) {
			errorResponse(res, { message: "post not found" }, 404)
		}
		successResponse(res, { id })
	}
	catch (error) {
		errorResponse(res, error)
	}

}





