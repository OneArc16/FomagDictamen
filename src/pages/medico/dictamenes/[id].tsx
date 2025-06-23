import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import RegresarBtn from '../../../../components/RegresarBtn'

export default function LlenarDictamen() {
  const router = useRouter()
  const { id } = router.query
  const [contenido, setContenido] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const verificarYObtener = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      if (!id) return // evita ejecutar con id vacío

      try {
        const { data } = await axios.get(`/api/dictamenes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setContenido(data.contenido || '')
      } catch (err) {
        toast.error('❌ No se pudo cargar el dictamen')
        router.push('/medico/dictamenes/pendientes')
      } finally {
        setCargando(false)
      }
    }

    verificarYObtener()
  }, [id, router])

  const handleGuardar = async () => {
    const token = localStorage.getItem('token')
    if (!token) return toast.error('Token no disponible')

    const guardar = axios.put(`/api/dictamenes/${id}`, {
      contenido,
      estado: 'COMPLETADO',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })

    toast.promise(guardar, {
      loading: 'Guardando dictamen...',
      success: '✅ Dictamen completado con éxito',
      error: '❌ Error al guardar el dictamen',
    })

    try {
      await guardar
      setTimeout(() => {
        router.push('/medico/dictamenes/pendientes')
      }, 1500)
    } catch (err) {
      console.error(err)
    }
  }

  if (cargando) return <p className="p-6">Cargando dictamen...</p>

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50">
      <div className="max-w-3xl p-6 mx-auto bg-white shadow rounded-xl">
        <RegresarBtn />
        <h2 className="mb-4 text-xl font-bold text-gray-700">Llenar Dictamen</h2>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={12}
          className="w-full p-4 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Escribe aquí el contenido del dictamen..."
        />
        <button
          onClick={handleGuardar}
          className="w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
        >
          Guardar y completar
        </button>
      </div>
    </div>
  )
}
