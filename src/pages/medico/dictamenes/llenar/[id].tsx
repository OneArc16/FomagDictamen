// pages/medico/dictamenes/llenar/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import RegresarBtn from '../../../../../components/RegresarBtn'

export default function LlenarDictamen() {
  const router = useRouter()
  const { id } = router.query
  const [dictamen, setDictamen] = useState<any>(null)
  const [form, setForm] = useState({
    resumen: '',
    recomendaciones: '',
    diagnostico: '',
  })

  useEffect(() => {
    const fetchDictamen = async () => {
      const token = localStorage.getItem('token')
      try {
        const { data } = await axios.get(`/api/dictamenes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDictamen(data)
      } catch (err) {
        toast.error('❌ Error al cargar dictamen')
        router.push('/medico/dictamenes/pendientes')
      }
    }

    if (id) fetchDictamen()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')

    const updateRequest = axios.put(`/api/dictamenes/${id}/llenar`, form, {
      headers: { Authorization: `Bearer ${token}` },
    })

    toast.promise(updateRequest, {
      loading: 'Guardando dictamen...',
      success: '✅ Dictamen completado',
      error: '❌ No se pudo guardar',
    })

    try {
      await updateRequest
      setTimeout(() => router.push('/medico'), 1500)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow rounded-xl">
        <RegresarBtn />
        <h2 className="mb-4 text-2xl font-bold">Llenar Dictamen</h2>

        {dictamen && (
          <div className="mb-6 space-y-2 text-gray-700">
            <p><strong>Profesor:</strong> {dictamen.profesor.nombre} {dictamen.profesor.apellido}</p>
            <p><strong>Cédula:</strong> {dictamen.profesor.cedula}</p>
            <p><strong>Institución:</strong> {dictamen.profesor.institucion}</p>
          </div>
        )}

        <textarea
          name="resumen"
          value={form.resumen}
          onChange={handleChange}
          className="w-full mb-4 textarea"
          rows={4}
          placeholder="Resumen del caso"
        />
        <textarea
          name="diagnostico"
          value={form.diagnostico}
          onChange={handleChange}
          className="w-full mb-4 textarea"
          rows={3}
          placeholder="Diagnóstico"
        />
        <textarea
          name="recomendaciones"
          value={form.recomendaciones}
          onChange={handleChange}
          className="w-full mb-6 textarea"
          rows={3}
          placeholder="Recomendaciones"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
        >
          Guardar dictamen
        </button>
      </div>
    </div>
  )
}
