import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as SearchIcon, Play, Trophy, AlertCircle, Loader2, Tv, Radio, Monitor } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import IPTVPlayer from '@/components/iptv-player'

interface Channel {
  id: string
  name: string
  category: string
  logo?: string
  streams: string[]
  streamUrl?: string
}

interface Category {
  name: string
  icon: React.ReactNode
  color: string
}

export default function IPTV() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { toast } = useToast()

  const categories: Category[] = [
    { name: 'all', icon: <Tv className="h-4 w-4" />, color: 'bg-blue-500' },
    { name: 'Spor', icon: <Trophy className="h-4 w-4" />, color: 'bg-red-500' },
    { name: 'Ulusal', icon: <Monitor className="h-4 w-4" />, color: 'bg-green-500' },
    { name: 'Haber', icon: <Radio className="h-4 w-4" />, color: 'bg-purple-500' }
  ]

  const loadChannels = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://78.185.19.222:5000/api/iptv/channels')
      if (!response.ok) {
        throw new Error('Kanal listesi alınamadı')
      }
      const data = await response.json()
      setChannels(data)
      toast({
        title: "Başarılı",
        description: `${data.length} kanal yüklendi.`,
      })
    } catch (_error) {
      setError(_error instanceof Error ? _error.message : 'Kanal listesi alınamadı')
      toast({
        title: "Hata",
        description: _error instanceof Error ? _error.message : 'Kanal listesi alınamadı',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadChannels()
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 500);
    }
  }, [loadChannels])

  const handleChannelSelect = async (channel: Channel) => {
    try {
      setLoading(true)

      // Doğrudan stream URL'ini kullan
      if (channel.streams && channel.streams.length > 0) {
        const streamUrl = channel.streams[0];

        // Kanalı stream URL'i ile güncelle
        const channelWithStream = {
          ...channel,
          streamUrl: streamUrl
        }

        setSelectedChannel(channelWithStream)

        // Mobilde en üste kaydır
        if (window.innerWidth < 1024) { // lg breakpoint
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 100); // Kısa bir gecikme ile daha smooth
        }

        toast({
          title: "Kanal Açılıyor",
          description: `${channel.name} yayını başlatılıyor...`,
        })
      } else {
        throw new Error('Stream URL bulunamadı')
      }
    } catch (_error) {
      toast({
        title: "Hata",
        description: "Kanal açılırken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredChannels = selectedCategory === 'all'
    ? channels
    : channels.filter(channel => channel.category === selectedCategory)

  const refreshChannels = () => {
    loadChannels()
  }

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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>IPTV Kanalları</h1>
          <p className='text-muted-foreground mt-2'>
            Türkiye'nin en popüler TV kanalları
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
          {/* Mobilde: Video üstte, kanal listesi altta */}
          {/* Desktop: Sol tarafta kanal listesi, sağda video */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  TV Kanalları
                  <Badge variant="outline" className="text-xs">
                    {filteredChannels.length} Kanal
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Kategorilere göre kanallar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Kategori Filtreleri */}
                <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className="flex items-center gap-1 text-xs md:text-sm"
                    >
                      {category.icon}
                      <span className="hidden sm:inline">
                        {category.name === 'all' ? 'Tümü' : category.name}
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  ) : filteredChannels.length > 0 ? (
                    filteredChannels.map((channel) => (
                      <Card
                        key={channel.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedChannel?.id === channel.id ? 'ring-2 ring-primary' : ''
                          }`}
                        onClick={() => handleChannelSelect(channel)}
                      >
                        <CardContent className="p-2 md:p-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            {/* Kanal Logo */}
                            {channel.logo ? (
                              <img
                                src={channel.logo}
                                alt={channel.name}
                                className="w-6 h-6 md:w-8 md:h-8 rounded object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-muted flex items-center justify-center">
                                <Tv className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              </div>
                            )}

                            {/* Kanal Bilgileri */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs md:text-sm truncate">{channel.name}</div>
                              <div className="text-xs text-muted-foreground hidden sm:block">{channel.category}</div>
                            </div>

                            {/* Play Butonu */}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 md:h-8 md:w-8 p-0"
                            >
                              <Play className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Tv className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Bu kategoride kanal bulunamadı</p>
                    </div>
                  )}

                  {/* Yenile Butonu */}
                  <Button
                    onClick={refreshChannels}
                    variant="outline"
                    className="w-full mt-4"
                    disabled={loading}
                  >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {loading ? 'Yenileniyor...' : 'Yenile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobilde: Video üstte, kanal listesi altta */}
          {/* Desktop: Sol tarafta kanal listesi, sağda video */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            {selectedChannel ? (
              <div className="space-y-6">
                {/* Video Player */}
                <IPTVPlayer
                  streamUrl={selectedChannel.streamUrl || ''}
                  channelName={selectedChannel.name}
                  onError={(error) => {
                    toast({
                      title: "Yayın Hatası",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />

                {/* Kanal Bilgileri */}
                <Card>
                  <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm md:text-lg">
                      <Tv className="h-3 w-3 md:h-5 md:w-5" />
                      <span className="truncate">{selectedChannel.name}</span>
                      <Badge variant="outline" className="text-xs hidden sm:inline">{selectedChannel.category}</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm hidden sm:block">
                      Canlı yayın bilgileri
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Mobilde: Kompakt bilgi */}
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-medium">Canlı</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">HD</Badge>
                          <Badge variant="outline" className="text-xs">{selectedChannel.category}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Detaylı bilgi */}
                    <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-1">Kanal Adı</div>
                        <div className="text-sm text-muted-foreground">{selectedChannel.name}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-1">Kategori</div>
                        <div className="text-sm text-muted-foreground">{selectedChannel.category}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-1">Yayın Kalitesi</div>
                        <div className="text-sm text-muted-foreground">HD • Ücretsiz</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-1">Format</div>
                        <div className="text-sm text-muted-foreground">M3U8 Stream</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Kanal Seçin</CardTitle>
                  <CardDescription>
                    Sol taraftan bir kanal seçerek yayını izleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Tv className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Kanal Seçilmedi</p>
                    <p className="text-sm">Sol taraftan bir kanal seçerek canlı yayını başlatın</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: "IPTV Kanalları",
    href: "/iptv-kanallar",
    isActive: true,
  }
] 