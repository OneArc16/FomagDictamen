import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  nombreUsuario: string
  onLogout: () => void
}

export default function Header({ nombreUsuario, onLogout }: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 text-white bg-blue-600 shadow">
      <h1 className="text-xl font-bold">Panel del Usuario</h1>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="px-4 py-2 font-medium bg-blue-800 rounded-lg"
        >
          {nombreUsuario}
        </button>
        {menuAbierto && (
          <div className="absolute right-0 z-10 w-40 mt-2 bg-white rounded-lg shadow-md">
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-sm text-left text-gray-800 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
