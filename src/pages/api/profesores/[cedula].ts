// pages/api/profesores/[cedula].ts (mismo archivo, se maneja dentro del switch de métodos)
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cedula } = req.query
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'No autorizado, token faltante' })

  try {
    verify(token, process.env.JWT_SECRET!) // validamos token

    if (req.method === 'PUT') {
      const {
        nombre,
        apellido,
        correo,
        telefono,
        fechaNacimiento,
        cargo,
        institucion,
        municipio,
        departamento,
        genero,
      } = req.body

      const profesorActualizado = await prisma.profesor.update({
        where: { cedula: String(cedula) },
        data: {
          nombre,
          apellido,
          correo,
          telefono,
          fechaNacimiento: new Date(fechaNacimiento),
          cargo,
          institucion,
          municipio,
          departamento,
          genero,
        },
      })

      return res.status(200).json(profesorActualizado)
    }

    if (req.method === 'GET') {
      const profesor = await prisma.profesor.findUnique({
        where: { cedula: String(cedula) },
      })
      if (!profesor) return res.status(404).json({ message: 'Profesor no encontrado' })
      return res.status(200).json(profesor)
    }

    return res.status(405).json({ message: 'Método no permitido' })
  } catch (error) {
    console.error('Error al actualizar profesor:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
