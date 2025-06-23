import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import RegresarBtn from '../../../components/RegresarBtn'

export default function ActualizarProfesor() {
  const [cedulaBuscar, setCedulaBuscar] = useState('')
  const [profesor, setProfesor] = useState<any>(null)

  const handleBuscar = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get(`/api/profesores/${cedulaBuscar}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfesor(data)
    } catch (error) {
      toast.error('❌ Profesor no encontrado')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfesor({ ...profesor, [name]: value })
  }

  const handleActualizar = async () => {
    const token = localStorage.getItem('token')
    const updateRequest = axios.put(`/api/profesores/${cedulaBuscar}`, profesor, {
      headers: { Authorization: `Bearer ${token}` },
    })

    toast.promise(updateRequest, {
      loading: 'Actualizando...',
      success: '✅ Datos actualizados con éxito',
      error: '❌ Error al actualizar',
    })

    try {
      await updateRequest
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
        {/* Botón regresar */}
        <div className="mb-4">
          <RegresarBtn destino="/admisionista" />
        </div>

        <h2 className="mb-6 text-2xl font-bold text-gray-800">Actualizar Datos del Profesor</h2>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Cédula"
            value={cedulaBuscar}
            onChange={(e) => setCedulaBuscar(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleBuscar()
            }}
            className="flex-1 input"
          />
          <button onClick={handleBuscar} className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700">
            Buscar
          </button>
        </div>

        {profesor && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <input name="nombre" value={profesor.nombre} onChange={handleChange} className="input" />
            <input name="apellido" value={profesor.apellido} onChange={handleChange} className="input" />
            <input name="correo" value={profesor.correo} onChange={handleChange} className="input" />
            <input name="telefono" value={profesor.telefono} onChange={handleChange} className="input" />
            <input name="cargo" value={profesor.cargo} onChange={handleChange} className="input" />
            <input name="institucion" value={profesor.institucion} onChange={handleChange} className="input" />
            <input name="municipio" value={profesor.municipio} onChange={handleChange} className="input" />
            <input name="departamento" value={profesor.departamento} onChange={handleChange} className="input" />
            <select name="genero" value={profesor.genero} onChange={handleChange} className="input">
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="OTRO">Otro</option>
            </select>
            <input
              name="fechaNacimiento"
              type="date"
              value={profesor.fechaNacimiento?.split('T')[0] || ''}
              onChange={handleChange}
              className="input"
            />
            <div className="sm:col-span-2">
              <button
                onClick={handleActualizar}
                className="w-full py-3 font-semibold text-white transition bg-green-600 rounded-xl hover:bg-green-700"
              >
                Actualizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
