import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import RegresarBtn from '../../../components/RegresarBtn'
import Link from 'next/link'

export default function DictamenesPendientes() {
  const [dictamenes, setDictamenes] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  const cargarDictamenes = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('/api/dictamenes/pendientes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDictamenes(data)
    } catch (error) {
      toast.error('❌ Error al cargar los dictámenes')
    }
  }

  const dictamenesFiltrados = dictamenes.filter((d) =>
    d.profesor.cedula.includes(busqueda)
  )

  useEffect(() => {
    cargarDictamenes()
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dictámenes Pendientes</h2>
          <RegresarBtn />
        </div>

        <input
          type="text"
          placeholder="Buscar por cédula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />

        <table className="w-full text-left border table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Cédula</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {dictamenesFiltrados.length > 0 ? (
              dictamenesFiltrados.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-2">{d.profesor.nombre} {d.profesor.apellido}</td>
                  <td className="px-4 py-2">{d.profesor.cedula}</td>
                  <td className="px-4 py-2">{new Date(d.creadoEn).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{d.estado}</td>
                  <td className="px-4 py-2">
                    <Link href={`/admisionista/dictamenes/${d.id}`}>
                      <button className="px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Ver
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No hay dictámenes pendientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
