import { query } from '../config/db.js';
import { NotFoundError } from '../middleware/errorHandler.js';

/**
 * Service handling post comments retrieval and creation.
 */
export class CommentService {
  /**
   * Fetch all comments for a specific post ordered chronologically.
   * @param {string} postId
   */
  static async getCommentsByPostId(postId) {
    // Check if post exists
    const postRes = await query(`SELECT id FROM posts WHERE id = $1;`, [postId]);
    if (postRes.rowCount === 0) {
      throw new NotFoundError(`Post with id ${postId} not found`);
    }

    const sql = `
      SELECT
        c.id,
        c.text,
        c.created_at as "createdAt",
        u.handle as "authorHandle",
        u.name as "authorName",
        u.avatar_url as "authorAvatarUrl"
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC;
    `;

    const { rows } = await query(sql, [postId]);
    return {
      postId,
      comments: rows,
    };
  }

  /**
   * Add a new comment to a post.
   * @param {Object} params
   * @param {string} params.postId
   * @param {string} params.userId
   * @param {string} params.text
   */
  static async addComment({ postId, userId, text }) {
    // Check if post exists
    const postRes = await query(`SELECT id FROM posts WHERE id = $1;`, [postId]);
    if (postRes.rowCount === 0) {
      throw new NotFoundError(`Post with id ${postId} not found`);
    }

    const insertSql = `
      INSERT INTO comments (post_id, user_id, text)
      VALUES ($1, $2, $3)
      RETURNING id, text, created_at as "createdAt";
    `;

    const { rows } = await query(insertSql, [postId, userId, text]);
    const comment = rows[0];

    const userRes = await query(`SELECT name as "authorName", handle as "authorHandle", avatar_url as "authorAvatarUrl" FROM users WHERE id = $1;`, [userId]);
    const user = userRes.rows[0] || {};

    return {
      id: comment.id,
      postId,
      text: comment.text,
      createdAt: comment.createdAt,
      authorHandle: user.authorHandle || 'user',
      authorName: user.authorName || 'User',
      authorAvatarUrl: user.authorAvatarUrl || '',
    };
  }
}
