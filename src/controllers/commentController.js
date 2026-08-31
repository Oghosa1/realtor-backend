import { CommentService } from '../services/commentService.js';

export class CommentController {
  /**
   * GET /api/posts/:id/comments
   */
  static async getComments(req, res, next) {
    try {
      const { id: postId } = req.params;
      const result = await CommentService.getCommentsByPostId(postId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/posts/:id/comments
   */
  static async addComment(req, res, next) {
    try {
      const { id: postId } = req.params;
      const { text } = req.body;

      const result = await CommentService.addComment({
        postId,
        userId: req.userId,
        text,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}
