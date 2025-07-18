import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import Hls from 'hls.js';

interface IPTVPlayerProps {
  streamUrl: string;
  channelName: string;
  onError?: (error: string) => void;
}

export default function IPTVPlayer({ streamUrl, channelName, onError }: IPTVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');

  useEffect(() => {
    if (!streamUrl) {
      setError('Stream URL bulunamadı');
      return;
    }

    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    if (!video) return;

    // Önceki HLS instance'ını temizle
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Video event listeners
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsPlaying(true);
      video.play().catch(_err => {
        setError('Video oynatılamıyor');
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (_e: Event) => {
      setIsLoading(false);
      const errorMessage = 'Video yüklenirken hata oluştu';
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Yayın Hatası",
        description: errorMessage,
        variant: "destructive",
      });
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Otomatik yeniden başlat
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }, 1000);
    };

    // Event listeners ekle
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Stream URL'ini ayarla
    const finalUrl = streamUrl.startsWith('/api/stream-proxy/') 
      ? `http://localhost:5000${streamUrl}` 
      : streamUrl;

    // HLS.js ile stream'i yükle
    if (Hls.isSupported() && finalUrl.includes('.m3u8')) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.2,
        nudgeMaxRetry: 5,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10
      });
      
      hlsRef.current = hls;
      
      hls.loadSource(finalUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const levels = hls.levels;
        if (levels && levels[data.level]) {
          const level = levels[data.level];
          setCurrentQuality(`${level.height}p`);
        }
      });
      
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError('Stream yüklenirken hata oluştu');
          onError?.('Stream yüklenirken hata oluştu');
        }
      });
      
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari için native HLS desteği
      video.src = finalUrl;
      video.load();
    } else {
      // Fallback - normal video
      video.src = finalUrl;
      video.load();
    }

    // Cleanup
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl, onError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(_err => {
        setError('Video oynatılamıyor');
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(() => {});
    }
  };

  const handleVideoClick = () => {
    setShowControls(!showControls);
  };



  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {channelName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-center">
            <div className="space-y-4">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Yayın Hatası</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Yeniden Dene
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          {channelName}
          <Badge variant="destructive" className="text-xs">
            Canlı
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* Video Player */}
          <video
            ref={videoRef}
            className="w-full aspect-video max-h-[50vh] md:max-h-[60vh] lg:max-h-[80vh] object-contain cursor-pointer bg-black"
            onClick={handleVideoClick}
            playsInline
            autoPlay
            muted={isMuted}
          />



          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                <p className="text-white text-sm">Yayın yükleniyor...</p>
              </div>
            </div>
          )}

          {/* Video Controls */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stream Info */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{channelName}</p>
              <p className="text-muted-foreground">
                {currentQuality !== 'auto' ? `${currentQuality} • ` : ''}HD Kalite • Ücretsiz
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentQuality !== 'auto' ? currentQuality : 'Auto'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                M3U8
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 