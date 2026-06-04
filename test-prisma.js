const { PrismaClient } = require('./src/generated/prisma/client.js');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Cliente Prisma:', Object.keys(prisma).slice(0, 10));
    console.log('¿Tiene faq?', 'faq' in prisma);
    console.log('¿Tiene FAQ?', 'FAQ' in prisma);

    if (prisma.faq) {
      const faqs = await prisma.faq.findMany();
      console.log('FAQs encontradas:', faqs.length);
    } else {
      console.log('ERROR: prisma.faq no existe');
      console.log('Propiedades disponibles:', Object.keys(prisma).filter(k => !k.startsWith('_')));
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
