import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const total = await prisma.dictamen.count({
      where: { firmado: false },
    });

    return res.status(200).json({ total });
  } catch (error) {
    console.error('Error al contar dictámenes pendientes:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
}
