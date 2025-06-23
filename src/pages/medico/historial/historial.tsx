import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import RegresarBtn from '../../../../components/RegresarBtn'

type Dictamen = {
  id: string
  contenido: string
  creadoEn: string
  profesor: {
    nombre: string
    apellido: string
    cedula: string
  }
}

export default function HistorialDictamenes() {
  const router = useRouter()
  const [dictamenes, setDictamenes] = useState<Dictamen[]>([])
  const [entrada, setEntrada] = useState('')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/dictamenes/historial', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDictamenes(data)
      } catch (err) {
        toast.error('❌ Error al cargar historial')
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setBusqueda(entrada)
    }
  }

  const dictamenesFiltrados = dictamenes.filter((d) => {
    const term = busqueda.toLowerCase()
    return (
      d.profesor.nombre.toLowerCase().includes(term) ||
      d.profesor.apellido.toLowerCase().includes(term) ||
      d.profesor.cedula.includes(term)
    )
  })

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100">
      <div className="max-w-5xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Historial de Dictámenes</h2>
          <RegresarBtn />
        </div>

        <div className="mb-4">
          <Input
            placeholder="Buscar por nombre, apellido o cédula"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {dictamenesFiltrados.length === 0 ? (
          <p className="text-gray-600">No se encontraron dictámenes.</p>
        ) : (
          <div className="space-y-4">
            {dictamenesFiltrados.map((d) => (
              <div
                key={d.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100"
              >
                <p className="font-semibold text-gray-700">
                  {d.profesor.nombre} {d.profesor.apellido} – {d.profesor.cedula}
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(d.creadoEn).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-800">{d.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
