import { StoryService } from '../services/storyService.js';

export class StoryController {
  /**
   * GET /api/stories
   */
  static async getStories(req, res, next) {
    try {
      const result = await StoryService.getStories(req.userId);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}
