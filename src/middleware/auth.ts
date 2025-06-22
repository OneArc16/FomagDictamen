// middleware/auth.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

      // 🔑 Aquí se adjunta el usuario a la request
      (req as any).usuario = { id: decoded.id }

      return handler(req, res)
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' })
    }
  }
}
