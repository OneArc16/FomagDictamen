import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const {
    nombre,
    cedula,
    fechaNacimiento, // 👈 desde el frontend (en string)
    telefono,
    cargo,
    institucion,
    municipio,
    departamento
  } = req.body;

  const usuario = (req as any).usuario; // viene desde el middleware de auth

  if (!usuario?.id) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const nuevo = await prisma.profesor.create({
      data: {
        nombre,
        cedula,
        fechaNacimiento: new Date(fechaNacimiento), // 👈 conversión aquí
        telefono,
        cargo,
        institucion,
        municipio,
        departamento,
        creadoPor: {
          connect: { id: usuario.id },
        },
      },
    });

    return res.status(201).json(nuevo);
  } catch (error: any) {
    console.error('Error al crear profesor:', error);
    return res.status(500).json({ message: 'Error interno al crear profesor' });
  }
};

export default withAuth(handler); // 👈 protegido con middleware
