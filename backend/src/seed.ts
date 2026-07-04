import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@emmi.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@emmi.com', password: adminPassword, role: 'ADMIN' },
  });

  console.log('Seed completed: admin user created');
  console.log('Login: admin@emmi.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
