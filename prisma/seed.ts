// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);

  await prisma.usuario.upsert({
    where: { correo: 'admin@correo.com' },
    update: {},
    create: {
      nombre: 'Juan Admin',
      correo: 'admin@correo.com',
      contrasena: hashed,
      rol: 'ADMISIONISTA',
    },
  });

  console.log('✅ Usuario de prueba creado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
