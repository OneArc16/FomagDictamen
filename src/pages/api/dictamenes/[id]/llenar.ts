// pages/api/dictamenes/[id]/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dictamenId = req.query.id as string

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    jwt.verify(token, process.env.JWT_SECRET!)

    const dictamen = await prisma.dictamen.findUnique({
      where: { id: dictamenId },
      include: {
        profesor: true,
      },
    })

    if (!dictamen) {
      return res.status(404).json({ message: 'Dictamen no encontrado' })
    }

    res.status(200).json(dictamen)
  } catch (error) {
    console.error('Error al obtener dictamen:', error)
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
