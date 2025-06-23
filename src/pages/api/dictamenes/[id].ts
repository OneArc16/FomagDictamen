// pages/api/dictamenes/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No autorizado' })

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    if (decoded.rol !== 'MEDICO') {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    const id = req.query.id as string

    const dictamen = await prisma.dictamen.findUnique({
      where: { id },
      include: {
        profesor: {
          select: {
            nombre: true,
            apellido: true,
            cedula: true,
            correo: true,
            telefono: true,
            fechaNacimiento: true,
            cargo: true,
            institucion: true,
            municipio: true,
            departamento: true,
          },
        },
      },
    })

    if (!dictamen) {
      return res.status(404).json({ message: 'Dictamen no encontrado' })
    }

    if (dictamen.estado !== 'PENDIENTE') {
      return res.status(400).json({ message: 'Este dictamen ya fue llenado' })
    }

    return res.status(200).json(dictamen)
  } catch (err) {
    console.error('Error al obtener dictamen:', err)
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
