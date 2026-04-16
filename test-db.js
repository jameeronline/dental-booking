const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function testConnection() {
  console.log('Testing connection to:', process.env.DIRECT_URL?.split('@')[1]?.split(':')[0] || 'unknown');
  console.log('Database URL set:', !!process.env.DATABASE_URL);
  console.log('Direct URL set:', !!process.env.DIRECT_URL);

  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connection successful!', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('  Code:', error.code);
    console.error('  Message:', error.message);
    console.error('  Meta:', error.meta);

    if (error.code === '28P01') {
      console.error('\n→ Fix: Check your password in .env.local');
    } else if (error.code === '3D000') {
      console.error('\n→ Database exists but schema not found - run: npx prisma db push');
    } else if (error.message.includes('timeout')) {
      console.error('\n→ Fix: Check IP whitelist in Supabase Dashboard');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();