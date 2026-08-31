import { PostService } from "../services/postService.js";

export class PostController {
  /**
   * GET /api/posts
   */
  static async getPosts(req, res, next) {
    try {
      const { page, limit, category, tag } = req.query;
      const result = await PostService.getPosts({
        page,
        limit,
        category,
        tag,
        currentUserId: req.userId,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/posts
   */
  static async createPost(req, res, next) {
    try {
      const {
        content,
        category,
        tag,
        location,
        mediaUrl,
        isVideo,
        videoDuration,
      } = req.body;
      const result = await PostService.createPost({
        userId: req.userId,
        content,
        category,
        tag,
        location,
        mediaUrl,
        isVideo,
        videoDuration,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/posts/:id/like
   */
  static async toggleLike(req, res, next) {
    try {
      const { id: postId } = req.params;
      const result = await PostService.toggleLike({
        postId,
        userId: req.userId,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}
