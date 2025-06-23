import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import jwtDecode from 'jwt-decode'
import Link from 'next/link'

export default function MedicoDashboard() {
  const router = useRouter()
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded: any = jwtDecode(token)
      setNombreUsuario(decoded.nombre || 'Médico')
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 text-white bg-blue-600 shadow">
        <h1 className="text-xl font-bold">Panel del Médico</h1>
        <div className="relative" ref={menuRef}>
          <button
            className="px-4 py-2 font-medium bg-blue-800 rounded-lg"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {nombreUsuario}
          </button>
          {menuAbierto && (
            <div className="absolute right-0 z-10 w-40 mt-2 text-black bg-white rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl p-6 mx-auto mt-10 bg-white shadow-md rounded-xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Bienvenido a Aurora, Dr(a). {nombreUsuario}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/medico/dictamenes/pendientes">
            <div className="p-6 bg-blue-100 border border-blue-400 cursor-pointer rounded-xl hover:shadow">
              <h3 className="text-lg font-bold text-blue-800">Dictámenes pendientes</h3>
              <p className="text-sm text-blue-700">Ver y llenar los dictámenes asignados.</p>
            </div>
          </Link>
          <Link href="/medico/historial">
            <div className="p-6 bg-green-100 border border-green-400 cursor-pointer rounded-xl hover:shadow">
              <h3 className="text-lg font-bold text-green-800">Historial</h3>
              <p className="text-sm text-green-700">Consultar dictámenes realizados previamente.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
