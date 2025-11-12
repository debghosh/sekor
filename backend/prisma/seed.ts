import { PrismaClient, ContentType, Role, ContentStatus } from '.prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.contentEngagement.deleteMany();
  await prisma.savedContent.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.contentTag.deleteMany();
  await prisma.content.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userFollow.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // =========================================================================
  // USERS (matching prototype personas)
  // =========================================================================
  console.log('Creating users...');

  const passwordHash = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'priya@kcc.in',
        name: 'Priya Chatterjee',
        passwordHash,
        role: Role.AUTHOR,
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        bio: 'Covering Kolkata\'s heritage & urban development',
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'arnab@kcc.in',
        name: 'Arnab Sen',
        passwordHash,
        role: Role.AUTHOR,
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        bio: 'Political correspondent & investigative journalist',
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'moumita@kcc.in',
        name: 'Moumita Roy',
        passwordHash,
        role: Role.EDITOR,
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        bio: 'Managing Editor focusing on arts & culture',
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'arijit@kcc.in',
        name: 'Arijit Mukherjee',
        passwordHash,
        role: Role.AUTHOR,
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        bio: 'Food critic & cultural commentator',
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'shreya@kcc.in',
        name: 'Shreya Das',
        passwordHash,
        role: Role.AUTHOR,
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        bio: 'Metro correspondent covering local governance',
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'rahul@kcc.in',
        name: 'Rahul Bose',
        passwordHash,
        role: Role.AUTHOR,
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        bio: 'Culinary economist analyzing food culture & business',
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@kcc.in',
        name: 'Admin User',
        passwordHash,
        role: Role.ADMIN,
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        bio: 'Administrator',
        emailVerified: true,
      },
    }),
    // Test reader account
    prisma.user.create({
      data: {
        email: 'reader@test.com',
        name: 'Test Reader',
        passwordHash,
        role: Role.READER,
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        bio: 'Test reader account',
        emailVerified: true,
      },
    }),
  ]);

  console.log(`✓ Created ${users.length} users`);

  // =========================================================================
  // CATEGORIES (matching prototype)
  // =========================================================================
  console.log('Creating categories...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Heritage',
        nameBengali: 'ঐতিহ্য',
        slug: 'heritage',
        description: 'Stories about Kolkata\'s rich cultural and architectural heritage',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'আড্ডা (Adda)',
        nameBengali: 'আড্ডা',
        slug: 'adda',
        description: 'Conversations, culture, and community discussions',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'সংস্কৃতি (Culture)',
        nameBengali: 'সংস্কৃতি',
        slug: 'culture',
        description: 'Arts, music, literature, and cultural events',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'মাছ-ভাত (Food)',
        nameBengali: 'মাছ-ভাত',
        slug: 'food',
        description: 'Bengali cuisine, restaurants, and food culture',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Metro',
        nameBengali: 'মেট্রো',
        slug: 'metro',
        description: 'Local news, governance, and urban development',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Audio',
        nameBengali: 'অডিও',
        slug: 'audio',
        description: 'Podcasts and audio stories',
        order: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Video',
        nameBengali: 'ভিডিও',
        slug: 'video',
        description: 'Video content and vlogs',
        order: 7,
      },
    }),
  ]);

  console.log(`✓ Created ${categories.length} categories`);

  // =========================================================================
  // TAGS
  // =========================================================================
  console.log('Creating tags...');

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Durga Puja', slug: 'durga-puja' } }),
    prisma.tag.create({ data: { name: 'Architecture', slug: 'architecture' } }),
    prisma.tag.create({ data: { name: 'Street Food', slug: 'street-food' } }),
    prisma.tag.create({ data: { name: 'Bengali Cuisine', slug: 'bengali-cuisine' } }),
    prisma.tag.create({ data: { name: 'Politics', slug: 'politics' } }),
    prisma.tag.create({ data: { name: 'Education', slug: 'education' } }),
    prisma.tag.create({ data: { name: 'Music', slug: 'music' } }),
    prisma.tag.create({ data: { name: 'Literature', slug: 'literature' } }),
  ]);

  console.log(`✓ Created ${tags.length} tags`);

  // =========================================================================
  // CONTENT - ARTICLES (matching prototype)
  // =========================================================================
  console.log('Creating articles...');

  const articles = await Promise.all([
    prisma.content.create({
      data: {
        type: ContentType.ARTICLE,
        title: 'The Resurrection of Park Street\'s Colonial Architecture',
        slug: 'resurrection-park-street-colonial-architecture',
        summary: 'How conservation efforts are bringing new life to Kolkata\'s iconic colonial buildings while preserving their historical essence.',
        categoryId: categories[0].id, // Heritage
        authorId: users[0].id, // Priya
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-16'),
        views: 1243,
        typeData: {
          content: `<h2>A Renaissance of Heritage</h2>
          <p>Park Street stands as a testament to Kolkata's colonial past, with its grand Victorian and Georgian architecture telling stories of a bygone era. Recent conservation efforts have breathed new life into these historic structures.</p>
          
          <h3>The Challenge of Preservation</h3>
          <p>Preserving colonial-era buildings presents unique challenges. The structures require specialized restoration techniques that respect their historical integrity while ensuring they meet modern safety standards.</p>
          
          <p>Local architects and heritage conservationists have been working tirelessly to restore buildings like the iconic Flury's tearoom and the majestic St. Xavier's College. These efforts involve meticulous research, sourcing period-appropriate materials, and employing traditional construction techniques.</p>
          
          <h3>Community Engagement</h3>
          <p>The success of these conservation projects depends heavily on community involvement. Local residents, business owners, and heritage enthusiasts have formed committees to oversee restoration work and advocate for protected status for significant buildings.</p>
          
          <p>Walking tours organized by heritage groups have become increasingly popular, educating both locals and tourists about the architectural significance of Park Street and fostering a sense of pride in Kolkata's built heritage.</p>`,
          readingTime: 6,
          coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
          excerpt: 'How conservation efforts are bringing new life to Kolkata\'s iconic colonial buildings while preserving their historical essence.',
          wordCount: 850,
        },
        seoTitle: 'Park Street Colonial Architecture Restoration | Kolkata Heritage',
        seoDescription: 'Discover how conservation efforts are preserving Park Street\'s colonial heritage',
        seoKeywords: ['Park Street', 'Colonial Architecture', 'Heritage Conservation', 'Kolkata'],
      },
    }),
    prisma.content.create({
      data: {
        type: ContentType.ARTICLE,
        title: 'Inside the Kumartuli Potter\'s Colony: Where Gods Are Born',
        slug: 'inside-kumartuli-potters-colony-where-gods-are-born',
        summary: 'An intimate look at the artisan community that has been crafting Durga idols for generations.',
        categoryId: categories[2].id, // Culture
        authorId: users[1].id, // Arnab
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-15'),
        views: 2156,
        typeData: {
          content: `<h2>The Sacred Art of Idol Making</h2>
          <p>In the narrow lanes of Kumartuli, generations of artisan families continue the sacred tradition of crafting clay idols of goddess Durga. This centuries-old craft is more than just art—it's a living heritage that defines Bengali culture.</p>
          
          <h3>The Process</h3>
          <p>Creating a Durga idol is a months-long process that begins with gathering clay from the Hooghly River. Master sculptors sketch the initial design, while teams of artisans work on different aspects—from molding the basic structure to painting intricate details.</p>
          
          <p>The process involves multiple stages: creating the bamboo frame, applying layers of clay and straw, sculpting features, painting, and finally decorating with traditional ornaments and clothing.</p>`,
          readingTime: 8,
          coverImage: 'https://images.unsplash.com/photo-1609168371002-471f0019f635?w=800',
          excerpt: 'An intimate look at the artisan community that has been crafting Durga idols for generations.',
          wordCount: 1200,
        },
        seoTitle: 'Kumartuli Potter Colony: Durga Idol Making Tradition',
        seoDescription: 'Explore the art of Durga idol making in Kolkata\'s historic Kumartuli',
        seoKeywords: ['Kumartuli', 'Durga Idol', 'Bengali Artisans', 'Cultural Heritage'],
      },
    }),
    prisma.content.create({
      data: {
        type: ContentType.ARTICLE,
        title: 'The Rise of Bengali Fusion Cuisine',
        slug: 'rise-of-bengali-fusion-cuisine',
        summary: 'Young chefs are reinventing traditional Bengali dishes with modern techniques and global influences.',
        categoryId: categories[3].id, // Food
        authorId: users[3].id, // Arijit
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-14'),
        views: 3421,
        typeData: {
          content: `<h2>Tradition Meets Innovation</h2>
          <p>Bengali cuisine, known for its subtle flavors and emphasis on fish and rice, is experiencing a renaissance. Young chefs are experimenting with molecular gastronomy, international ingredients, and modern presentation while staying true to traditional flavors.</p>
          
          <h3>Notable Innovations</h3>
          <p>From deconstructed Shorshe Ilish to Mishti Doi panna cotta, these innovative dishes respect tradition while pushing culinary boundaries. Restaurants like 6 Ballygunge Place and Oh! Calcutta have been pioneers in this movement.</p>`,
          readingTime: 5,
          coverImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
          excerpt: 'Young chefs are reinventing traditional Bengali dishes with modern techniques and global influences.',
          wordCount: 950,
        },
        seoTitle: 'Bengali Fusion Cuisine: Modern Takes on Traditional Food',
        seoDescription: 'Discover how young chefs are revolutionizing Bengali cuisine',
        seoKeywords: ['Bengali Cuisine', 'Fusion Food', 'Kolkata Restaurants', 'Food Culture'],
      },
    }),
    prisma.content.create({
      data: {
        type: ContentType.ARTICLE,
        title: 'মাছ-ভাত: The Soul Food Renaissance',
        slug: 'maach-bhaat-soul-food-renaissance',
        summary: 'How young chefs are reinventing traditional Bengali fish and rice dishes for a new generation.',
        categoryId: categories[3].id, // Food
        authorId: users[5].id, // Rahul
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-12'),
        views: 876,
        typeData: {
          content: `<h2>More Than Just Fish and Rice</h2>
          <p>Maach-bhaat (fish and rice) is the quintessential Bengali meal, representing comfort, home, and tradition. But a new generation of chefs is elevating this humble combination into haute cuisine.</p>
          
          <h3>The Economics of Tradition</h3>
          <p>As a culinary economist, I've observed how traditional dishes like maach-bhaat are being repositioned in the market. Fine dining establishments are charging premium prices for dishes that were once everyday meals.</p>`,
          readingTime: 7,
          coverImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',
          excerpt: 'How young chefs are reinventing traditional Bengali fish and rice dishes for a new generation.',
          wordCount: 1100,
        },
        seoTitle: 'Maach Bhaat: Bengali Soul Food Reinvented',
        seoDescription: 'The evolution of traditional Bengali fish and rice dishes',
        seoKeywords: ['Maach Bhaat', 'Bengali Food', 'Fish Curry', 'Traditional Cuisine'],
      },
    }),
  ]);

  console.log(`✓ Created ${articles.length} articles`);

  // =========================================================================
  // CONTENT - PODCASTS
  // =========================================================================
  console.log('Creating podcasts...');

  const podcasts = await Promise.all([
    prisma.content.create({
      data: {
        type: ContentType.PODCAST,
        title: 'আড্ডা Sessions: Conversations with Kolkata\'s Artists',
        slug: 'adda-sessions-conversations-kolkata-artists',
        summary: 'Weekly conversations with local artists, musicians, and cultural icons about their craft and the city that inspires them.',
        categoryId: categories[5].id, // Audio
        authorId: users[2].id, // Moumita
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-13'),
        views: 542,
        typeData: {
          audioUrl: 'https://example.com/podcasts/adda-sessions-ep01.mp3',
          duration: 2340, // 39 minutes
          transcript: 'Full transcript available...',
          episodeNumber: 1,
          seasonNumber: 1,
          guests: [
            {
              name: 'Anjan Dutt',
              bio: 'Legendary Bengali singer-songwriter and filmmaker',
              avatar: 'https://i.pravatar.cc/150?img=20',
            },
          ],
          chapters: [
            { timestamp: 0, title: 'Introduction' },
            { timestamp: 300, title: 'Early Days in Kolkata' },
            { timestamp: 900, title: 'The Bengali Music Scene' },
            { timestamp: 1800, title: 'Future of Regional Music' },
          ],
          coverArt: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
        },
        seoTitle: 'Adda Sessions Podcast: Kolkata Artists Conversations',
        seoDescription: 'Listen to intimate conversations with Kolkata\'s finest artists',
        seoKeywords: ['Podcast', 'Bengali Artists', 'Kolkata Music', 'Adda'],
      },
    }),
    prisma.content.create({
      data: {
        type: ContentType.PODCAST,
        title: 'ঐতিহ্য Tales: Stories of Bengali Heritage',
        slug: 'heritage-tales-stories-bengali-heritage',
        summary: 'Exploring the rich history and cultural heritage of Bengal through storytelling and expert interviews.',
        categoryId: categories[5].id, // Audio
        authorId: users[0].id, // Priya
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-10'),
        views: 687,
        typeData: {
          audioUrl: 'https://example.com/podcasts/heritage-tales-ep03.mp3',
          duration: 1920, // 32 minutes
          transcript: 'Episode 3: The Legacy of Rabindranath Tagore...',
          episodeNumber: 3,
          seasonNumber: 1,
          guests: [
            {
              name: 'Dr. Supriya Chowdhury',
              bio: 'Professor of Bengali Literature, Jadavpur University',
              avatar: 'https://i.pravatar.cc/150?img=21',
            },
          ],
          chapters: [
            { timestamp: 0, title: 'Introduction to Tagore\'s Impact' },
            { timestamp: 420, title: 'Shantiniketan and Educational Philosophy' },
            { timestamp: 1200, title: 'Global Influence' },
          ],
          coverArt: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
        },
        seoTitle: 'Heritage Tales Podcast: Bengali Culture and History',
        seoDescription: 'Deep dives into Bengali heritage and cultural stories',
        seoKeywords: ['Heritage', 'Bengali History', 'Culture Podcast', 'Tagore'],
      },
    }),
  ]);

  console.log(`✓ Created ${podcasts.length} podcasts`);

  // =========================================================================
  // CONTENT - VLOGS
  // =========================================================================
  console.log('Creating vlogs...');

  const vlogs = await Promise.all([
    prisma.content.create({
      data: {
        type: ContentType.VLOG,
        title: 'Street Food Hunt: Best Kathi Rolls in Kolkata',
        slug: 'street-food-hunt-best-kathi-rolls-kolkata',
        summary: 'Join us as we explore the best kathi roll joints across Kolkata, from iconic Park Street to hidden gems in North Kolkata.',
        categoryId: categories[6].id, // Video
        authorId: users[3].id, // Arijit
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-11'),
        views: 1532,
        typeData: {
          videoUrl: 'https://example.com/videos/kathi-roll-hunt.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800',
          duration: 720, // 12 minutes
          resolution: '1080p',
          transcript: 'Video transcript with timestamps...',
          captions: [
            { language: 'en', url: 'https://example.com/captions/kathi-roll-en.vtt' },
            { language: 'bn', url: 'https://example.com/captions/kathi-roll-bn.vtt' },
          ],
          chapters: [
            { timestamp: 0, title: 'Introduction' },
            { timestamp: 60, title: 'Nizam\'s - The Original' },
            { timestamp: 240, title: 'Kusum\'s - Hidden Gem' },
            { timestamp: 480, title: 'Taste Test Comparison' },
          ],
        },
        seoTitle: 'Best Kathi Rolls in Kolkata: Street Food Video Guide',
        seoDescription: 'Watch our video guide to finding the best kathi rolls in Kolkata',
        seoKeywords: ['Kathi Roll', 'Kolkata Street Food', 'Food Vlog', 'Bengali Cuisine'],
      },
    }),
    prisma.content.create({
      data: {
        type: ContentType.VLOG,
        title: 'A Day in the Life: Kumartuli Idol Maker',
        slug: 'day-in-life-kumartuli-idol-maker',
        summary: 'Follow master artisan Gopal Pal through a typical day as he crafts Durga idols in the heart of Kumartuli.',
        categoryId: categories[6].id, // Video
        authorId: users[1].id, // Arnab
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-09'),
        views: 2341,
        typeData: {
          videoUrl: 'https://example.com/videos/kumartuli-artisan.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1609168371002-471f0019f635?w=800',
          duration: 1080, // 18 minutes
          resolution: '4K',
          transcript: 'Documentary-style video following Gopal Pal...',
          captions: [
            { language: 'en', url: 'https://example.com/captions/kumartuli-en.vtt' },
            { language: 'bn', url: 'https://example.com/captions/kumartuli-bn.vtt' },
          ],
          chapters: [
            { timestamp: 0, title: 'Morning Rituals' },
            { timestamp: 180, title: 'Clay Preparation' },
            { timestamp: 480, title: 'Sculpting the Face' },
            { timestamp: 840, title: 'Family Tradition' },
          ],
        },
        seoTitle: 'Kumartuli Idol Maker Documentary: Traditional Craftsmanship',
        seoDescription: 'Experience a day in the life of a traditional Durga idol maker',
        seoKeywords: ['Kumartuli', 'Idol Making', 'Documentary', 'Bengali Artisan'],
      },
    }),
  ]);

  console.log(`✓ Created ${vlogs.length} vlogs`);

  // =========================================================================
  // CONTENT - PHOTO ESSAYS
  // =========================================================================
  console.log('Creating photo essays...');

  const photoEssays = await Promise.all([
    prisma.content.create({
      data: {
        type: ContentType.PHOTO_ESSAY,
        title: 'Durga Puja 2024: The Art of Pandal Hopping',
        slug: 'durga-puja-2024-art-of-pandal-hopping',
        summary: 'A visual journey through the most spectacular Durga Puja pandals of 2024, showcasing the creativity and devotion that defines Kolkata\'s biggest festival.',
        categoryId: categories[2].id, // Culture
        authorId: users[0].id, // Priya
        status: ContentStatus.PUBLISHED,
        publishDate: new Date('2024-10-08'),
        views: 4521,
        typeData: {
          images: [
            {
              url: 'https://images.unsplash.com/photo-1609619385002-f40f6d7e3efa?w=1200',
              caption: 'Bagbazar Sarbojanin: A stunning recreation of ancient Bengali architecture',
              photographer: 'Priya Chatterjee',
              location: { lat: 22.5958, lon: 88.3697 },
              camera: 'Sony A7IV',
              settings: { iso: 400, aperture: 'f/2.8', shutter: '1/200' },
            },
            {
              url: 'https://images.unsplash.com/photo-1610193135128-ad522501e040?w=1200',
              caption: 'Kumartuli Park: Traditional clay idol with intricate detailing',
              photographer: 'Priya Chatterjee',
              location: { lat: 22.6033, lon: 88.3676 },
              camera: 'Sony A7IV',
              settings: { iso: 800, aperture: 'f/1.8', shutter: '1/160' },
            },
            {
              url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200',
              caption: 'College Square: Massive pandal with over 100 artisans working for 6 months',
              photographer: 'Priya Chatterjee',
              location: { lat: 22.5744, lon: 88.3629 },
              camera: 'Sony A7IV',
              settings: { iso: 1600, aperture: 'f/2.0', shutter: '1/125' },
            },
          ],
          narrative: `Durga Puja is more than just a festival in Kolkata—it's a five-day celebration that transforms the entire city into an open-air art gallery. Each neighborhood competes to create the most innovative and beautiful pandal, often with themes that range from social commentary to historical recreations.

This year, we witnessed some of the most spectacular displays in recent memory. From eco-friendly pandals made entirely from recycled materials to high-tech installations featuring projection mapping, the creativity was boundless.

The tradition of pandal-hopping—visiting multiple pandals throughout the night—is a quintessential Kolkata experience. Families, friends, and tourists walk for hours, admiring the artistry and devotion that goes into each creation.`,
          totalImages: 15,
        },
        seoTitle: 'Durga Puja 2024: Photo Essay of Kolkata Pandals',
        seoDescription: 'Visual journey through the best Durga Puja pandals in Kolkata',
        seoKeywords: ['Durga Puja', 'Kolkata Festival', 'Photo Essay', 'Bengali Culture'],
      },
    }),
  ]);

  console.log(`✓ Created ${photoEssays.length} photo essays`);

  // =========================================================================
  // CONTENT TAGS
  // =========================================================================
  console.log('Adding tags to content...');

  await prisma.contentTag.createMany({
    data: [
      { contentId: articles[0].id, tagId: tags[1].id }, // Architecture
      { contentId: articles[1].id, tagId: tags[0].id }, // Durga Puja
      { contentId: articles[2].id, tagId: tags[3].id }, // Bengali Cuisine
      { contentId: articles[3].id, tagId: tags[2].id }, // Street Food
      { contentId: podcasts[0].id, tagId: tags[6].id }, // Music
      { contentId: vlogs[0].id, tagId: tags[2].id }, // Street Food
      { contentId: photoEssays[0].id, tagId: tags[0].id }, // Durga Puja
    ],
  });

  // =========================================================================
  // USER FOLLOWS
  // =========================================================================
  console.log('Creating user follows...');

  await prisma.userFollow.createMany({
    data: [
      { followerId: users[7].id, followingId: users[0].id }, // Reader follows Priya
      { followerId: users[7].id, followingId: users[3].id }, // Reader follows Arijit
      { followerId: users[7].id, followingId: users[1].id }, // Reader follows Arnab
    ],
  });

  // =========================================================================
  // SUBSCRIPTIONS
  // =========================================================================
  console.log('Creating subscriptions...');

  await prisma.subscription.create({
    data: {
      userId: users[7].id,
      plan: 'PREMIUM',
      frequency: 'DAILY',
      interests: ['heritage', 'food', 'culture'],
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  // =========================================================================
  // ENGAGEMENT
  // =========================================================================
  console.log('Creating engagement data...');

  const allContent = [...articles, ...podcasts, ...vlogs, ...photoEssays];

  // Create views for all content
  for (const content of allContent) {
    for (let i = 0; i < content.views; i++) {
      await prisma.contentEngagement.create({
        data: {
          contentId: content.id,
          userId: i % 2 === 0 ? users[7].id : null, // Some anonymous views
          engagementType: 'VIEW',
          metadata: { timestamp: new Date() },
        },
      });
    }
  }

  // =========================================================================
  // SAVED CONTENT
  // =========================================================================
  console.log('Creating saved content...');

  await prisma.savedContent.createMany({
    data: [
      {
        userId: users[7].id,
        contentId: articles[0].id,
        tags: ['to-read-later', 'architecture'],
        notes: 'Want to visit Park Street this weekend',
      },
      {
        userId: users[7].id,
        contentId: podcasts[0].id,
        tags: ['podcasts', 'bengali-music'],
      },
    ],
  });

  // =========================================================================
  // COMMENTS
  // =========================================================================
  console.log('Creating comments...');

  await prisma.comment.createMany({
    data: [
      {
        contentId: articles[0].id,
        userId: users[7].id,
        text: 'Excellent article! I learned so much about Park Street\'s history.',
      },
      {
        contentId: vlogs[0].id,
        userId: users[7].id,
        text: 'The kathi roll at Nizam\'s is unbeatable! Great video.',
      },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`
  📊 Summary:
  - Users: ${users.length}
  - Categories: ${categories.length}
  - Tags: ${tags.length}
  - Articles: ${articles.length}
  - Podcasts: ${podcasts.length}
  - Vlogs: ${vlogs.length}
  - Photo Essays: ${photoEssays.length}
  - Total Content: ${allContent.length}
  
  🔐 Test Credentials:
  - Admin: admin@kcc.in / password123
  - Author: priya@kcc.in / password123
  - Reader: reader@test.com / password123
  `);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
