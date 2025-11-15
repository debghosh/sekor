import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCreatorPortal() {
  console.log('🌱 Seeding creator portal data...');

  // 2. Create sample story (if you have a creator user)
  const creator = await prisma.user.findFirst({
    where: { role: 'AUTHOR' },
  });

  if (creator) {
    const category = await prisma.category.findFirst();
    
    if (category) {
      const story = await prisma.story.create({
        data: {
          title: 'The Last Tram of Kolkata',
          titleBn: 'কলকাতার শেষ ট্রাম',
          abstract: 'A nostalgic journey through the history of Kolkata\'s iconic trams',
          abstractBn: 'কলকাতার প্রতিষ্ঠানিক ট্রামের ইতিহাসের মধ্য দিয়ে একটি নস্টালজিক যাত্রা',
          body: {
            ops: [
              { insert: 'The trams of Kolkata are more than just a mode of transport...\n' }
            ]
          },
          slug: 'last-tram-of-kolkata',
          status: 'PUBLISHED',
          contentType: 'ARTICLE',
          language: 'BILINGUAL',
          authorId: creator.id,
          categoryId: category.id,
          readingTime: 5,
          wordCount: 1200,
          publishedAt: new Date(),
        },
      });

      console.log(`✅ Created sample story: ${story.title}`);

      // 3. Create sample analytics for the story
      await prisma.storyAnalytics.create({
        data: {
          storyId: story.id,
          date: new Date(),
          views: 1234,
          uniqueVisitors: 856,
          avgTimeOnPage: 245,
          completionRate: 78.5,
          reactions: { love: 45, insightful: 23, nostalgic: 67, inspiring: 12 },
          comments: 15,
          shares: { facebook: 23, twitter: 12, whatsapp: 45, email: 8 },
          bookmarks: 34,
        },
      });

      console.log('✅ Created sample analytics');
    }
  }

  console.log('🎉 Creator portal seeding complete!');
}

seedCreatorPortal()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });