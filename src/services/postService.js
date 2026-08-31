import { query } from '../config/db.js';
import { NotFoundError } from '../middleware/errorHandler.js';

/**
 * Service handling feed posts retrieval, pagination, creation, and like toggling.
 */
export class PostService {
  /**
   * Fetch paginated list of feed posts with author details, counts, and like state.
   */
  static async getPosts({ page = 1, limit = 10, category, tag, currentUserId }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`p.category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (tag) {
      conditions.push(`LOWER(p.tag) = LOWER($${paramIndex})`);
      params.push(tag);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count query
    const countSql = `SELECT COUNT(*)::int as total FROM posts p ${whereClause};`;
    const countResult = await query(countSql, params);
    const totalItems = countResult.rows[0]?.total || 0;

    // Posts query with user-specific like state, aggregate like count, comments count, and liked-by avatars
    const postsSql = `
      SELECT
        p.id,
        p.category,
        p.tag,
        p.content,
        p.location,
        p.media_url as "mediaUrl",
        p.is_video as "isVideo",
        p.video_duration as "videoDuration",
        p.views_count as "viewsCount",
        p.created_at as "createdAt",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'handle', u.handle,
          'role', u.role,
          'avatarUrl', u.avatar_url,
          'isOnline', u.is_online
        ) as author,
        (SELECT COUNT(*)::int FROM likes l WHERE l.post_id = p.id) as "likesCount",
        (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = p.id) as "commentsCount",
        EXISTS (
          SELECT 1 FROM likes l
          WHERE l.post_id = p.id AND l.user_id = $${paramIndex}
        ) as "isLiked",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', lu.id,
                'name', lu.name,
                'avatarUrl', lu.avatar_url
              )
            )
            FROM (
              SELECT u2.id, u2.name, u2.avatar_url
              FROM likes l2
              JOIN users u2 ON u2.id = l2.user_id
              WHERE l2.post_id = p.id
              ORDER BY l2.created_at DESC
              LIMIT 3
            ) lu
          ),
          '[]'::json
        ) as "likedBy",
        (
          SELECT json_build_object(
            'id', c.id,
            'authorHandle', cu.handle,
            'text', c.text,
            'createdAt', c.created_at
          )
          FROM comments c
          JOIN users cu ON cu.id = c.user_id
          WHERE c.post_id = p.id
          ORDER BY c.created_at ASC
          LIMIT 1
        ) as "topComment"
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2};
    `;

    const finalParams = [...params, currentUserId, limit, offset];
    const { rows } = await query(postsSql, finalParams);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      posts: rows.map((row) => ({
        ...row,
        timeAgo: formatTimeAgo(row.createdAt),
      })),
      pagination: {
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems,
        hasNextPage: page < totalPages,
      },
    };
  }

  /**
   * Create a new feed post.
   */
  static async createPost({ userId, content, category = 'request', tag = null, location = 'Lekki Phase 1, Lagos', mediaUrl = null, isVideo = false, videoDuration = null }) {
    const insertSql = `
      INSERT INTO posts (user_id, category, tag, content, location, media_url, is_video, video_duration)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const { rows } = await query(insertSql, [
      userId,
      category,
      tag,
      content,
      location,
      mediaUrl,
      isVideo,
      videoDuration,
    ]);

    const post = rows[0];

    // Fetch created post with author details
    const userRes = await query(`SELECT id, name, handle, role, avatar_url as "avatarUrl", is_online as "isOnline" FROM users WHERE id = $1;`, [userId]);
    const author = userRes.rows[0] || { id: userId, name: 'User', avatarUrl: '' };

    return {
      id: post.id,
      category: post.category,
      tag: post.tag,
      content: post.content,
      location: post.location,
      mediaUrl: post.media_url,
      isVideo: post.is_video,
      videoDuration: post.video_duration,
      viewsCount: post.views_count,
      createdAt: post.created_at,
      timeAgo: 'Just Now',
      author,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isBookmarked: false,
      likedBy: [],
      topComment: null,
    };
  }

  /**
   * Toggle like state for a post.
   */
  static async toggleLike({ postId, userId }) {
    // Check if post exists
    const postRes = await query(`SELECT id FROM posts WHERE id = $1;`, [postId]);
    if (postRes.rowCount === 0) {
      throw new NotFoundError(`Post with id ${postId} not found`);
    }

    // Check if already liked
    const likeRes = await query(`SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2;`, [postId, userId]);
    let isLiked = false;

    if (likeRes.rowCount > 0) {
      await query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2;`, [postId, userId]);
      isLiked = false;
    } else {
      await query(`INSERT INTO likes (post_id, user_id) VALUES ($1, $2);`, [postId, userId]);
      isLiked = true;
    }

    const countRes = await query(`SELECT COUNT(*)::int as count FROM likes WHERE post_id = $1;`, [postId]);
    const likesCount = countRes.rows[0]?.count || 0;

    return {
      postId,
      isLiked,
      likesCount,
    };
  }
}

/**
 * Format timestamp to friendly time ago string.
 * @param {Date|string} date
 * @returns {string}
 */
function formatTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just Now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return past.toLocaleDateString();
}
