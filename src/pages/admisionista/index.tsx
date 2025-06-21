import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import Link from 'next/link';

export default function AdmisionistaDashboard() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const TIEMPO_INACTIVIDAD = 900000;
  let timeoutId: NodeJS.Timeout;

  const resetInactividad = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      localStorage.removeItem('token');
      router.push('/login');
    }, TIEMPO_INACTIVIDAD);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwt_decode(token);
      setUsuario({ nombre: decoded.nombre });
    } catch (error) {
      console.error('Token inválido', error);
      router.push('/login');
    }

    const eventos = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    eventos.forEach(e => window.addEventListener(e, resetInactividad));
    resetInactividad();

    return () => {
      clearTimeout(timeoutId);
      eventos.forEach(e => window.removeEventListener(e, resetInactividad));
    };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="text-xl font-bold text-blue-700">Panel Admisionista</div>

        <nav className="hidden space-x-4 md:block">
          <Link href="/admisionista/certificado" className="text-gray-700 hover:text-blue-600">
            Imprimir Certificado
          </Link>
          <Link href="/admisionista/dictamenes" className="text-gray-700 hover:text-blue-600">
            Ver Dictámenes
          </Link>
          <Link href="/admisionista/crear-profesor" className="text-gray-700 hover:text-blue-600">
            Crear Profesor
          </Link>
          <Link href="/admisionista/actualizar" className="text-gray-700 hover:text-blue-600">
            Actualizar Datos
          </Link>
        </nav>

        <div className="relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="font-semibold text-gray-700 hover:text-blue-700"
          >
            {usuario?.nombre || 'Usuario'} ▾
          </button>
          {menuAbierto && (
            <div className="absolute right-0 z-10 mt-2 overflow-hidden bg-white rounded-md shadow-md">
              <button
                onClick={cerrarSesion}
                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6 text-gray-600">
        <h1 className="mb-4 text-2xl font-semibold">Bienvenido, {usuario?.nombre}</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </main>
    </div>
  );
}
