import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as X } from "lucide-react"
import { useEffect, useState } from 'react'

export default function KimlikArsivi() {
  const [images, setImages] = useState<string[]>([])
  const [selectedImg, setSelectedImg] = useState<string|null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    // Tüm 1-358 arası dosya adlarını otomatik ekle
    setImages(Array.from({length: 358}, (_, i) => `wexcanim${i + 1}.jpeg`))
  },[])

  // Modal kapatma fonksiyonu
  const closeModal = () => {
    setSelectedImg(null)
    setZoom(1)
  }

  // Modal dışına tıklayınca kapansın
  useEffect(() => {
    if (!selectedImg) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selectedImg])

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <div className="flex items-center gap-3">
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Kimlik Arşivi</h1>
          </div>
          <p className='text-muted-foreground mt-2'>
            Kimlik arşivimizi inceleyin.
          </p>
        </div>

        {/* Galeri Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img} className="flex flex-col items-center bg-white dark:bg-muted rounded-lg shadow p-2 border border-muted-foreground/10 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedImg(img)}
            >
              <img
                src={`/images/wexkimlik/${img}`}
                alt="Kimlik görseli"
                className="object-cover rounded-md w-full aspect-[3/4] max-h-64 border border-muted-foreground/10"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Modal (Lightbox) */}
        {selectedImg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Sağ üstte kapat ve zoom butonları */}
              <div className="absolute top-2 right-2 flex gap-2 items-center z-10">
                <button
                  className="bg-gray-200 dark:bg-gray-700 text-lg font-bold rounded px-3 py-1 disabled:opacity-50"
                  onClick={() => setZoom(z => Math.max(1, z - 0.2))}
                  disabled={zoom <= 1}
                  aria-label="Küçült"
                >-
                </button>
                <span className="text-white text-sm select-none">{(zoom * 100).toFixed(0)}%</span>
                <button
                  className="bg-gray-200 dark:bg-gray-700 text-lg font-bold rounded px-3 py-1 disabled:opacity-50"
                  onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                  disabled={zoom >= 3}
                  aria-label="Büyüt"
                >+
                </button>
                <button
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 ml-2"
                  onClick={closeModal}
                  aria-label="Kapat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <img
                src={`/images/wexkimlik/${selectedImg}`}
                alt="Büyük kimlik görseli"
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
                className="rounded-lg shadow-lg max-h-[80vh] max-w-[90vw] bg-white"
                draggable={false}
              />
            </div>
          </div>
        )}

      </Main>
    </>
  )
}

const topNav = [
  {
    title: "Kimlik Arşivi",
    href: "/kimlik-arsivi",
    isActive: true,
  }
]