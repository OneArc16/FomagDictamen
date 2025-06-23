import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import RegresarBtn from '../../../components/RegresarBtn'

export default function CrearProfesor() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    cargo: '',
    institucion: '',
    municipio: '',
    departamento: '',
    genero: 'MASCULINO',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const crearProfesor = axios.post('/api/profesores', form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.promise(
      crearProfesor,
      {
        loading: 'Creando profesor...',
        success: '✅ ¡Profesor creado con éxito!',
        error: '❌ Hubo un error al crear el profesor',
      },
      {
        position: 'top-right',
      }
    )

    try {
      await crearProfesor
      setTimeout(() => {
        router.push('/admisionista')
      }, 1500)
    } catch (err) {
      console.error('Error en la creación del profesor:', err)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
        <RegresarBtn />
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Registro De Docente</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
          <input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required className="input" />
          <input type="text" name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required className="input" />
          <input type="email" name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required className="input" />
          <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="input" />
          <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required className="input" />
          <input type="text" name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} required className="input" />
          <input type="text" name="institucion" placeholder="Institución" value={form.institucion} onChange={handleChange} required className="input" />
          <input type="text" name="municipio" placeholder="Municipio" value={form.municipio} onChange={handleChange} required className="input" />
          <input type="text" name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} required className="input" />
          <select name="genero" value={form.genero} onChange={handleChange} className="input">
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>
          </select>
          <div className="sm:col-span-2">
            <button type="submit" className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
