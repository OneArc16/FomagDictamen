import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import RegresarBtn from '../../../../components/RegresarBtn'
import Link from 'next/link'

export default function DictamenesPendientes() {
  const [dictamenes, setDictamenes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtrados, setFiltrados] = useState([])
  const router = useRouter()

  useEffect(() => {
    const cargar = async () => {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/login')

      try {
        const { data } = await axios.get('/api/dictamenes/pendientes', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDictamenes(data)
        setFiltrados(data)
      } catch (error) {
        toast.error('❌ Error al obtener dictámenes')
        console.error(error)
      }
    }

    cargar()
  }, [])

  const handleBuscar = () => {
    const valor = busqueda.toLowerCase().trim()
    const resultado = dictamenes.filter((d: any) =>
      d.profesor.nombre.toLowerCase().includes(valor) ||
      d.profesor.apellido.toLowerCase().includes(valor) ||
      d.profesor.cedula.includes(valor)
    )
    setFiltrados(resultado)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBuscar()
    }
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50">
      <div className="max-w-5xl p-6 mx-auto bg-white shadow-md rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Dictámenes Pendientes</h2>
          <RegresarBtn />
        </div>

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o cédula"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleBuscar}
            className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

        {filtrados.length === 0 ? (
          <p className="text-gray-600">No se encontraron dictámenes pendientes.</p>
        ) : (
          <div className="grid gap-4">
            {filtrados.map((dictamen: any) => (
              <div key={dictamen.id} className="p-4 border shadow-sm rounded-xl bg-gray-50">
                <p className="mb-1">
                  <span className="font-semibold">Nombre:</span>{' '}
                  {dictamen.profesor.nombre} {dictamen.profesor.apellido}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Cédula:</span>{' '}
                  {dictamen.profesor.cedula}
                </p>
                <Link
                  href={`/medico/dictamenes/${dictamen.id}`}
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Seleccionar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
