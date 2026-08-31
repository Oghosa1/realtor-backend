import { query } from '../config/db.js';

/**
 * Service handling story carousel data.
 */
export class StoryService {
  /**
   * Fetch all active stories with user information.
   * @param {string} currentUserId
   */
  static async getStories(currentUserId) {
    const sql = `
      SELECT
        s.id,
        s.media_url as "mediaUrl",
        s.created_at as "createdAt",
        (s.user_id = $1) as "isMyStory",
        true as "hasUnseenStory",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'handle', u.handle,
          'avatarUrl', u.avatar_url,
          'isOnline', u.is_online
        ) as user
      FROM stories s
      JOIN users u ON u.id = s.user_id
      ORDER BY (s.user_id = $1) DESC, s.created_at DESC;
    `;

    const { rows } = await query(sql, [currentUserId]);
    return rows;
  }
}
