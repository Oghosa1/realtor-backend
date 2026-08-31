import { Router } from "express";
import { CommentController } from "../controllers/commentController.js";
import { PostController } from "../controllers/postController.js";
import { validate } from "../middleware/validate.js";
import { createCommentSchema } from "../validators/commentSchemas.js";
import {
  createPostSchema,
  getPostsQuerySchema,
  postIdParamSchema,
} from "../validators/postSchemas.js";

export const postRouter = Router();

// Feed posts routes
postRouter
  .route("/")
  .get(validate(getPostsQuerySchema, "query"), PostController.getPosts)
  .post(validate(createPostSchema, "body"), PostController.createPost);

postRouter
  .route("/:id/like")
  .post(validate(postIdParamSchema, "params"), PostController.toggleLike);

// Nested post comments routes
postRouter
  .route("/:id/comments")
  .get(validate(postIdParamSchema, "params"), CommentController.getComments)
  .post(
    validate(postIdParamSchema, "params"),
    validate(createCommentSchema, "body"),
    CommentController.addComment,
  );
