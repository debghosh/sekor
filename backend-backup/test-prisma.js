import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing Prisma connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Test if Article model exists
    console.log('Testing Article model...');
    const articles = await prisma.article.findMany();
    console.log(`✅ Found ${articles.length} articles`);
    
    await prisma.$disconnect();
    console.log('✅ Test complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

test();
