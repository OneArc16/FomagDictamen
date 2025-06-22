import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token no presente' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { sub: string }

    const {
      nombre,
      apellido,
      cedula,
      correo,
      telefono,
      fechaNacimiento,
      cargo,
      institucion,
      municipio,
      departamento,
      genero,
    } = req.body

    const nuevoProfesor = await prisma.profesor.create({
      data: {
        nombre,
        apellido,
        cedula,
        correo,
        telefono,
        fechaNacimiento: new Date(fechaNacimiento),
        cargo,
        institucion,
        municipio,
        departamento,
        genero,
        creadoPor: {
          connect: { id: decoded.sub },
        },
      },
    })

    return res.status(201).json(nuevoProfesor)
  } catch (error) {
    console.error('Error al crear profesor:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
