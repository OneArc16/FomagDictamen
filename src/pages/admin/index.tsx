import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [mostrarMenu, setMostrarMenu] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    try {
      const decoded: any = jwtDecode(token)
      setNombreUsuario(decoded.nombre || 'Administrador')
    } catch (err) {
      console.error('Token inválido:', err)
      router.push('/login')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 text-white bg-gray-800 shadow">
        <h1 className="text-xl font-bold">Panel del Administrador</h1>

        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            {nombreUsuario}
          </button>

          {mostrarMenu && (
            <div className="absolute right-0 z-10 w-48 mt-2 text-gray-800 bg-white border rounded-md shadow-xl">
              <Link href="/admin/crear-usuario" className="block px-4 py-2 hover:bg-gray-100">
                Crear usuario
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl p-6 mx-auto mt-10 bg-white shadow-md rounded-xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Bienvenido a Aurora, {nombreUsuario}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/medico/dictamenes/pendientes">
            <div className="p-6 bg-blue-100 border border-blue-400 cursor-pointer rounded-xl hover:shadow">
              <h3 className="text-lg font-bold text-blue-800">Dictámenes pendientes</h3>
              <p className="text-sm text-blue-700">Visualizar todos los dictámenes no completados.</p>
            </div>
          </Link>

          <Link href="/medico/historial">
            <div className="p-6 bg-green-100 border border-green-400 cursor-pointer rounded-xl hover:shadow">
              <h3 className="text-lg font-bold text-green-800">Historial</h3>
              <p className="text-sm text-green-700">Consultar dictámenes completados.</p>
            </div>
          </Link>

          <Link href="/admisionista/crear-profesor">
            <div className="p-6 bg-yellow-100 border border-yellow-400 cursor-pointer rounded-xl hover:shadow">
              <h3 className="text-lg font-bold text-yellow-800">Crear Profesor</h3>
              <p className="text-sm text-yellow-700">Registrar un nuevo docente en el sistema.</p>
            </div>
          </Link>

          <Link href="/admisionista/actualizar">
            <div className="p-6 bg-purple-100 border border-purple-400 cursor-pointer rounded-xl hover:shadow">
              <h3 className="text-lg font-bold text-purple-800">Actualizar Datos</h3>
              <p className="text-sm text-purple-700">Buscar y actualizar información de un profesor.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
