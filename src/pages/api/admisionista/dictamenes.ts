import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const payload: any = verify(token, process.env.JWT_SECRET!);

    // Traer dictámenes sin estado de "visto" (esto depende de tu lógica)
    const dictamenes = await prisma.dictamen.findMany({
      where: {},
      include: {
        profesor: {
          select: {
            nombre: true,
            cedula: true
          }
        }
      },
      orderBy: { creadoEn: 'desc' }
    });

    res.status(200).json(dictamenes);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'No autorizado' });
  }
}
