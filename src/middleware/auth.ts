import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      ;(req as any).usuario = decoded
      return handler(req, res)
    } catch {
      return res.status(401).json({ mensaje: 'Token inválido' })
    }
  }
}
