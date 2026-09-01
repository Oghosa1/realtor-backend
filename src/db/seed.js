import { pool } from '../config/db.js';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&fit=crop',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&fit=crop',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&fit=crop',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&fit=crop',
];

const LOCATIONS = [
  'Lekki Phase 1, Lagos',
  'Banana Island, Ikoyi',
  'Victoria Island, Lagos',
  'Old Ikoyi, Lagos',
  'Ikeja GRA, Lagos',
  'Maitama, Abuja',
  'Asokoro, Abuja',
  'Chevron Drive, Lekki',
  'Eko Atlantic City, Lagos',
  'Guzape, Abuja',
  'Magodo Phase 2, Lagos',
  'Osapa London, Lekki',
  'Ikate Elegushi, Lekki',
];

const PROPERTY_DESCRIPTIONS = [
  'Newly built 4-bedroom semi-detached duplex with private swimming pool, fitted kitchen, and BQ.',
  'Luxury 3-bedroom waterfront apartment with panoramic ocean views, gym, and 24/7 power supply.',
  'Contemporary 5-bedroom fully detached villa with rooftop terrace, cinema room, and smart automation.',
  'Serviced 2-bedroom executive apartment in a gated estate. Move-in ready with high-end furnishings.',
  'Prime commercial office space spanning 450 sqm, ideal for tech hubs or corporate headquarters.',
  'Brand new 4-bedroom terrace duplex in a secure gated community with 24/7 security and treated water.',
  'Exquisite penthouse apartment featuring an infinity terrace, private elevator, and smart lighting.',
  'Solid dry land measuring 1,200 sqm with Governor’s Consent in a serene residential neighborhood.',
  'Spacious 3-bedroom flat with fitted wardrobes, modern sanitary fittings, and ample parking space.',
  'Stunning 5-bedroom architectural masterpiece on 2 floors with imported marble and green garden.',
];

const REQUEST_DESCRIPTIONS = [
  'Looking for a 2-bedroom serviced apartment. Must have 24/7 power, reliable water, and 1-car parking.',
  'Urgent request: Client seeking 4-bedroom detached house with large compound. Budget open for quality.',
  'Looking to lease 500 sqm commercial open floor space with elevator and ample parking.',
  'Seeking a modern 1-bedroom studio apartment for a young executive. Move-in date end of this month.',
  'Looking for 2 plots of dry land with C of O for immediate residential development.',
  'Urgent: Need a 3-bedroom terrace duplex with swimming pool and gym access in a serene gated estate.',
  'Client looking for short-let managed luxury apartments for expatriate staff housing.',
];

const GENERAL_DESCRIPTIONS = [
  'What are your thoughts on the new infrastructure developments in Epe? Is now the best time to invest?',
  'Tips for first-time home buyers in Lagos: Always verify the title documents at the land registry before commitment.',
  'How is everyone handling service charge renewals this quarter with inflation trends?',
  'Notice: Road maintenance work ongoing along Admiralty Way this weekend. Plan your route accordingly 🙏',
  'Great real estate networking mixer happening this Saturday! Let me know if you’d like an invite.',
];

async function seedDatabase() {
  console.log('Seeding PostgreSQL database with 100+ rich real estate posts...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Clean existing records in reverse dependency order
    await client.query('DELETE FROM likes');
    await client.query('DELETE FROM comments');
    await client.query('DELETE FROM posts');
    await client.query('DELETE FROM stories');
    await client.query('DELETE FROM users');

    // 2. Insert Users
    const usersSql = `
      INSERT INTO users (id, name, handle, role, avatar_url, is_online)
      VALUES
        ('11111111-1111-1111-1111-111111111111', 'Your Story', 'current_user', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop', true),
        ('22222222-2222-2222-2222-222222222222', 'Felix Okon', 'felix_okon', 'Broker', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop', true),
        ('33333333-3333-3333-3333-333333333333', 'Maurice U', 'maurice_u', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop', false),
        ('44444444-4444-4444-4444-444444444444', 'Boyd From', 'boyd_from', 'Developer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop', true),
        ('55555555-5555-5555-5555-555555555555', 'miracle.h', 'miracle.h', NULL, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop', false),
        ('66666666-6666-6666-6666-666666666666', 'Tunde Bakare', 'tunde_b', NULL, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop', false),
        ('77777777-7777-7777-7777-777777777777', 'RamosRealty', 'ramos_realty', 'Agency', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&fit=crop', true),
        ('88888888-8888-8888-8888-888888888888', 'Jordan', 'jordan_realty', 'Agent', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&fit=crop', true),
        ('99999999-9999-9999-9999-999999999999', 'Taylor', 'taylor_homes', 'Realtor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop', false)
      RETURNING id;
    `;
    const userRes = await client.query(usersSql);
    const userIds = userRes.rows.map((r) => r.id);

    // 3. Insert Stories
    await client.query(`
      INSERT INTO stories (user_id, media_url)
      VALUES
        ('11111111-1111-1111-1111-111111111111', NULL),
        ('77777777-7777-7777-7777-777777777777', '${PROPERTY_IMAGES[0]}'),
        ('88888888-8888-8888-8888-888888888888', '${PROPERTY_IMAGES[1]}'),
        ('99999999-9999-9999-9999-999999999999', '${PROPERTY_IMAGES[2]}'),
        ('22222222-2222-2222-2222-222222222222', '${PROPERTY_IMAGES[3]}'),
        ('33333333-3333-3333-3333-333333333333', '${PROPERTY_IMAGES[4]}'),
        ('44444444-4444-4444-4444-444444444444', '${PROPERTY_IMAGES[5]}'),
        ('55555555-5555-5555-5555-555555555555', '${PROPERTY_IMAGES[6]}'),
        ('66666666-6666-6666-6666-666666666666', '${PROPERTY_IMAGES[7]}');
    `);

    // 4. Generate 105 Diverse Posts
    const postValues = [];
    const commentInserts = [];
    const likeInserts = [];

    // Core Figma mockup posts
    postValues.push({
      id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      userId: '22222222-2222-2222-2222-222222222222',
      category: 'request',
      tag: 'Looking to Buy',
      content: 'Looking for a 2-bedroom apartment in Yaba or Akoka. Must have constant water and parking for one car. Moving in by end of next month.',
      location: 'Lekki Phase 1, Lagos',
      mediaUrl: null,
      isVideo: false,
      videoDuration: null,
      viewsCount: 120,
      minsAgo: 5,
    });

    postValues.push({
      id: 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      userId: '33333333-3333-3333-3333-333333333333',
      category: 'general',
      tag: null,
      content: 'How is everyone holding up with the flooding in Lekki this week? Stay safe out there — and let me know if anyone needs a temporary place to crash 🙏',
      location: 'Lekki Phase 1, Lagos',
      mediaUrl: null,
      isVideo: false,
      videoDuration: null,
      viewsCount: 700,
      minsAgo: 20,
    });

    postValues.push({
      id: 'c3333333-cccc-cccc-cccc-cccccccccccc',
      userId: '44444444-4444-4444-4444-444444444444',
      category: 'property',
      tag: 'For Rent',
      content: 'Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
      location: 'Lekki Phase 1, Lagos',
      mediaUrl: PROPERTY_IMAGES[0],
      isVideo: false,
      videoDuration: null,
      viewsCount: 1000,
      minsAgo: 120,
    });

    postValues.push({
      id: 'd4444444-dddd-dddd-dddd-dddddddddddd',
      userId: '22222222-2222-2222-2222-222222222222',
      category: 'property',
      tag: 'For Sale',
      content: 'New 2-bedroom apartment in Yaba or Akoka. Must have constant water and parking for one car. Moving in by end of next month.',
      location: 'Lekki Phase 1, Lagos',
      mediaUrl: PROPERTY_IMAGES[1],
      isVideo: true,
      videoDuration: '0:20',
      viewsCount: 700,
      minsAgo: 180,
    });

    postValues.push({
      id: 'e5555555-eeee-eeee-eeee-eeeeeeeeeeee',
      userId: '22222222-2222-2222-2222-222222222222',
      category: 'request',
      tag: 'Looking to Rent',
      content: 'Looking for a 2-bedroom apartment in Yaba or Akoka. Must have constant water and parking for one car. Moving in by end of next month.',
      location: 'Lekki Phase 1, Lagos',
      mediaUrl: null,
      isVideo: false,
      videoDuration: null,
      viewsCount: 350,
      minsAgo: 240,
    });

    // 100 additional procedural posts
    for (let i = 1; i <= 100; i++) {
      const typeIndex = i % 3; // 0 = property, 1 = request, 2 = general
      const randomUser = userIds[i % userIds.length];
      const randomLoc = LOCATIONS[i % LOCATIONS.length];
      const minsAgo = 300 + i * 45;

      let category = 'property';
      let tag = i % 2 === 0 ? 'For Sale' : 'For Rent';
      let content = PROPERTY_DESCRIPTIONS[i % PROPERTY_DESCRIPTIONS.length];
      let mediaUrl = PROPERTY_IMAGES[i % PROPERTY_IMAGES.length];
      let isVideo = i % 6 === 0;
      let videoDuration = isVideo ? '0:35' : null;

      if (typeIndex === 1) {
        category = 'request';
        tag = i % 2 === 0 ? 'Looking to Buy' : 'Looking to Rent';
        content = REQUEST_DESCRIPTIONS[i % REQUEST_DESCRIPTIONS.length];
        mediaUrl = null;
        isVideo = false;
        videoDuration = null;
      } else if (typeIndex === 2) {
        category = 'general';
        tag = null;
        content = GENERAL_DESCRIPTIONS[i % GENERAL_DESCRIPTIONS.length];
        mediaUrl = i % 4 === 0 ? PROPERTY_IMAGES[(i + 3) % PROPERTY_IMAGES.length] : null;
        isVideo = false;
        videoDuration = null;
      }

      postValues.push({
        id: null, // will be generated by pgcrypto gen_random_uuid()
        userId: randomUser,
        category,
        tag,
        content,
        location: randomLoc,
        mediaUrl,
        isVideo,
        videoDuration,
        viewsCount: 100 + ((i * 73) % 2900),
        minsAgo,
      });
    }

    // Insert all posts in batches
    for (const p of postValues) {
      const idClause = p.id ? `'${p.id}',` : 'gen_random_uuid(),';
      const insertPostSql = `
        INSERT INTO posts (id, user_id, category, tag, content, location, media_url, is_video, video_duration, views_count, created_at)
        VALUES (${idClause} $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() - ($10 || ' minutes')::interval)
        RETURNING id;
      `;
      const res = await client.query(insertPostSql, [
        p.userId,
        p.category,
        p.tag,
        p.content,
        p.location,
        p.mediaUrl,
        p.isVideo,
        p.videoDuration,
        p.viewsCount,
        p.minsAgo.toString(),
      ]);
      const createdId = res.rows[0].id;

      // Seed likes for each post
      const likesCount = (p.viewsCount % 4) + 1;
      for (let j = 0; j < likesCount; j++) {
        const liker = userIds[(j + p.minsAgo) % userIds.length];
        likeInserts.push(`('${createdId}', '${liker}')`);
      }

      // Seed comment for some posts
      if (p.viewsCount % 3 === 0) {
        commentInserts.push(`('${createdId}', '${userIds[5]}', 'Great update on this location! Is inspection still open?', NOW() - INTERVAL '15 minutes')`);
      }
    }

    // Insert Likes
    if (likeInserts.length > 0) {
      await client.query(`
        INSERT INTO likes (post_id, user_id)
        VALUES ${likeInserts.join(', ')}
        ON CONFLICT DO NOTHING;
      `);
    }

    // Insert Comments
    if (commentInserts.length > 0) {
      await client.query(`
        INSERT INTO comments (post_id, user_id, text, created_at)
        VALUES ${commentInserts.join(', ')};
      `);
    }

    await client.query('COMMIT');
    console.log(`Database seeded successfully with ${postValues.length} posts and rich media!`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
