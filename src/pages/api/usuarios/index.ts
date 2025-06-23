import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No autorizado' })

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    if (decoded.rol !== 'ADMINISTRADOR') {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    const { nombre, correo, contrasena, rol } = req.body

    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    const hashed = await bcrypt.hash(contrasena, 10)

    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: hashed,
        rol,
      },
    })

    res.status(201).json({ message: 'Usuario creado', usuario: nuevo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
