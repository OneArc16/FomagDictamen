// components/RegresarBtn.tsx
import { useRouter } from 'next/router'
import { ArrowLeft } from 'lucide-react'

export default function RegresarBtn({ destino }: { destino?: string }) {
  const router = useRouter()

  const handleClick = () => {
    if (destino) {
      router.push(destino)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
    >
      <ArrowLeft size={18} />
      Regresar
    </button>
  )
}
