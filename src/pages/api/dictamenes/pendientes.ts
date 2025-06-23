import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    // Permitimos tanto MÉDICO como ADMISIONISTA
    if (decoded.rol !== 'ADMISIONISTA' && decoded.rol !== 'MEDICO') {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    const dictamenes = await prisma.dictamen.findMany({
      where: { estado: 'PENDIENTE' },
      include: {
        profesor: {
          select: {
            nombre: true,
            apellido: true,
            cedula: true,
          },
        },
      },
      orderBy: {
        creadoEn: 'desc',
      },
    })

    res.status(200).json(dictamenes)
  } catch (error) {
    console.error('Error al obtener dictámenes:', error)
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
