// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'clave-super-secreta';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { correo, contrasena } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { correo } });

  if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

  const valido = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({ token, rol: usuario.rol });
}
