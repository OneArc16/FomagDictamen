import { useEffect, useState } from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { toast } from 'react-hot-toast'

type Dictamen = {
  id: string
  creadoEn: string
  profesor: {
    nombre: string
    apellido: string
    cedula: string
  }
}

export default function DictamenesPendientes() {
  const [dictamenes, setDictamenes] = useState<Dictamen[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [rol, setRol] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    try {
      const decoded: any = jwtDecode(token)
      setRol(decoded.rol)

      axios
        .get('/api/dictamenes/pendientes', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDictamenes(res.data))
        .catch(() => toast.error('❌ Error al cargar dictámenes'))
    } catch (error) {
      toast.error('Token inválido')
      router.push('/login')
    }
  }, [])

  const dictamenesFiltrados = dictamenes.filter((d) => {
    const fullName = `${d.profesor.nombre} ${d.profesor.apellido}`.toLowerCase()
    return (
      fullName.includes(busqueda.toLowerCase()) ||
      d.profesor.cedula.includes(busqueda)
    )
  })

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl p-6 mx-auto bg-white shadow rounded-xl">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Dictámenes Pendientes</h2>

        <Input
          placeholder="Buscar por nombre o cédula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="mb-6"
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-2">Nombre</th>
                <th className="p-2">Cédula</th>
                <th className="p-2">Fecha</th>
                {rol === 'MEDICO' && <th className="p-2">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {dictamenesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No hay dictámenes pendientes
                  </td>
                </tr>
              ) : (
                dictamenesFiltrados.map((dictamen) => (
                  <tr key={dictamen.id} className="hover:bg-gray-100">
                    <td className="p-2">
                      {dictamen.profesor.nombre} {dictamen.profesor.apellido}
                    </td>
                    <td className="p-2">{dictamen.profesor.cedula}</td>
                    <td className="p-2">
                      {new Date(dictamen.creadoEn).toLocaleDateString()}
                    </td>
                    {rol === 'MEDICO' && (
                      <td className="p-2">
                        <Link href={`/medico/dictamenes/llenar/${dictamen.id}`}>
                          <Button variant="default">Seleccionar</Button>
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
