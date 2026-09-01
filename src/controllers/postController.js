import { PostService } from "../services/postService.js";
import { CloudinaryService } from "../services/cloudinaryService.js";

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
    let uploadedAsset = null;
    try {
      const {
        content,
        category,
        tag,
        transactionType,
        location,
        mediaUrl: reqMediaUrl,
        isVideo,
        videoDuration,
      } = req.body;

      let mediaUrl = reqMediaUrl;

      // Handle image upload if a file is attached
      if (req.file) {
        uploadedAsset = await CloudinaryService.uploadImage(req.file.buffer);
        mediaUrl = uploadedAsset.secure_url;
      }

      const finalTag = transactionType || tag;

      const result = await PostService.createPost({
        userId: req.userId,
        content,
        category,
        tag: finalTag,
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
      // Clean up orphaned Cloudinary asset if DB insert fails
      if (uploadedAsset && uploadedAsset.public_id) {
        await CloudinaryService.deleteImage(uploadedAsset.public_id);
      }
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
