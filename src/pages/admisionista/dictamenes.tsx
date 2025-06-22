import { useEffect, useState } from 'react';
import axios from 'axios';

type Dictamen = {
  id: string;
  contenido: string;
  creadoEn: string;
  profesor: {
    nombre: string;
    cedula: string;
  };
};

export default function DictamenesPage() {
  const [dictamenes, setDictamenes] = useState<Dictamen[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admisionista/dictamenes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDictamenes(response.data);
      } catch (error) {
        console.error('Error al obtener dictámenes', error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-4 text-2xl font-bold text-blue-700">📄 Dictámenes Pendientes</h1>

      {cargando ? (
        <p className="text-gray-600">Cargando dictámenes...</p>
      ) : dictamenes.length === 0 ? (
        <p className="text-gray-500">No hay dictámenes pendientes.</p>
      ) : (
        <div className="grid gap-4">
          {dictamenes.map((dictamen) => (
            <div
              key={dictamen.id}
              className="flex items-center justify-between p-4 bg-white shadow-md rounded-xl"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Profesor: {dictamen.profesor.nombre} ({dictamen.profesor.cedula})
                </p>
                <p className="text-sm text-gray-500">
                  Fecha: {new Date(dictamen.creadoEn).toLocaleDateString()}
                </p>
              </div>
              <button
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => window.print()} // ← puedes reemplazar con lógica real
              >
                Imprimir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
