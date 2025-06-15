import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function LoginPage() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/auth/login', {
        correo,
        contrasena,
      })

      const { token } = response.data
      localStorage.setItem('token', token)

      // Decodificar el token para obtener el rol
      const payload = JSON.parse(atob(token.split('.')[1]))
      const rol = payload.rol

      if (rol === 'ADMISIONISTA') {
        router.push('/admision')
      } else if (rol === 'MEDICO') {
        router.push('/medico')
      } else {
        setError('Rol no reconocido')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-xl"
      >
        <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
