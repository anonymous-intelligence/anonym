import React, { useState, useRef, useEffect } from "react";
import { Header } from '@/components/layout/header';
import { TopNav } from "@/components/layout/top-nav";
import { Search as SearchInput } from '@/components/search';
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Paperclip, Search, Lightbulb, ChevronDown, Send } from 'lucide-react';

const callAIService = async (message: string, history: { role: string, content: string }[]): Promise<{ sohbet: string, kisiSonuclari: Record<string, unknown>[], gsmSonucu?: { GSM: string } }> => {
  const response = await fetch('http://localhost:5000/api/ai/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: message, history }),
  });
  const data = await response.json();
  return { sohbet: data.sohbet, kisiSonuclari: data.kisiSonuclari || [], gsmSonucu: data.gsmSonucu || undefined };
};

export default function WexAIPage() {
  const [messages, setMessages] = useState<{
    sender: "user" | "ai";
    text: string;
    gsmSonucu?: { GSM: string };
    loading?: boolean; // loading mesajı için
  }[]>([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  // loadingDots ve setLoadingDots ile ilgili tüm kodlar kaldırıldı
  const scrollRef = useRef<HTMLDivElement>(null);
  // Model seçimi için state
  const [selectedModel, setSelectedModel] = useState('LLMA3-70b-8192');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const modelList = [
    'LLMA3-70b-8192',
    'GPT-4 (Yakında)',
  ];
  // Loading animasyonu için state
  const [showWaitMsg, setShowWaitMsg] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Eğer loading mesajı varsa animasyonu başlat
    if (messages.some(m => m.loading)) {
      interval = setInterval(() => {
        // setLoadingDots((dots) => (dots + 1) % 4); // Bu satır kaldırıldı
      }, 500);
    } else {
      // setLoadingDots(0); // Bu satır kaldırıldı
    }
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    // Loading mesajı varsa 5 saniye sonra bekleme mesajını göster
    let timer: NodeJS.Timeout | undefined;
    if (messages.some(m => m.loading)) {
      setShowWaitMsg(false);
      timer = setTimeout(() => setShowWaitMsg(true), 5000);
    } else {
      setShowWaitMsg(false);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setMessages((msgs) => [...msgs, { sender: "ai" as const, text: "", loading: true }]);
    const newHistory = [...chatHistory, { role: 'user' as const, content: input }];
    const { sohbet, kisiSonuclari, gsmSonucu } = await callAIService(input, newHistory);
    let aiText = sohbet;
    // Telefon sorgusunda chat balonuna telefon numarası ekleme
    // if (gsmSonucu && gsmSonucu.GSM) {
    //   aiText += `\n\nTelefon Numarası:\n${gsmSonucu.GSM}`;
    // }
    if (kisiSonuclari.length > 0) {
      aiText += "\n\nBulunan kişiler:\n" + kisiSonuclari.map(k => `${k.ADI} ${k.SOYADI} (${k.TC})|${k.DOGUMTARIHI || ''}|${k.NUFUSIL || ''}`).join('\n');
    }
    setMessages((msgs) => [
      ...msgs.slice(0, -1),
      { sender: "ai" as const, text: aiText, gsmSonucu }, // gsmSonucu'nu mesaj objesine ekle
    ]);
    setChatHistory([...newHistory, { role: 'assistant' as const, content: sohbet }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const topNav = [
    { title: 'Anasayfa', href: '/', isActive: true },
    { title: 'wexAI', href: '/wexai', isActive: false },
  ];

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s;
        }
      `}</style>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <SearchInput />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className="h-screen overflow-hidden flex flex-col w-full px-3 sm:px-4">
        {messages.length === 0 && (
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Hey WexAI!</h1>
            <p className="text-base sm:text-lg">Hoşgeldin, bugün kimi bulmak istiyorsun?</p>
          </div>
        )}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto w-full max-w-2xl flex flex-col gap-2 px-0 sm:px-2 pb-[120px] sm:pb-5 mx-auto"
          style={{ scrollBehavior: 'smooth', paddingBottom: 120 }}
        >
          {messages.map((msg, idx) => {
            // Loading mesajı için özel render
            if (msg.loading) {
              return (
                <div key={idx} className="my-2 text-left animate-fade-in">
                  <div className="flex items-center gap-2 min-h-[32px]">
                    <span className="text-gray-300 text-sm font-bold select-none">Düşünüyor</span>
                    <span className="inline-block align-middle">
                      {/* Modern, etkileyici spinner - tema uyumlu */}
                      <svg className="animate-spin" style={{width:'1em',height:'1em'}} viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="31.4 94.2" strokeLinecap="round" className="text-black dark:text-white"/>
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 120" strokeLinecap="round" opacity="0.5" className="text-black dark:text-white"/>
                      </svg>
                    </span>
                  </div>
                  {showWaitMsg && (
                    <div className="text-xs text-gray-400 mt-1 ml-2 transition-opacity duration-700 opacity-100 animate-fade-in">
                      Bu biraz zaman alabilir...
                    </div>
                  )}
                </div>
              );
            }
            // AI mesajı ve kişi listesi ayrımı
            if (msg.sender === "ai" && msg.text.includes("Bulunan kişiler:")) {
              const [sohbet, ...kisiSatirlari] = msg.text.split("\n\nBulunan kişiler:\n");
              const kisiListesi = kisiSatirlari[0]
                ? kisiSatirlari[0].split("\n").map(satir => {
                  const match = satir.match(/^(.*?) (.*?) \((\d{11})\)\|(.*?)\|(.*)$/);
                  if (!match) return null;
                  const [, adi, soyadi, tc, dogumTarihi, il] = match;
                  return { adi, soyadi, tc, dogumTarihi, il };
                }).filter(Boolean)
                : [];
              // gsm ve gsmTc'yi burada tanımla
              let gsm = '';
              let gsmTc = '';
              let sadeceTelefon = false;
              if (kisiListesi.length === 1 && msg.gsmSonucu && msg.gsmSonucu.GSM) {
                gsm = msg.gsmSonucu.GSM;
                gsmTc = kisiListesi[0] ? kisiListesi[0].tc : '';
                sadeceTelefon = true;
              }
              return (
                <div key={idx} className="my-2 text-left animate-fade-in">
                  <div className="inline-block px-4 py-2 rounded-xl rounded-bl-none bg-gray-800 text-white mb-2 shadow">
                    {sohbet}
                  </div>
                  {kisiListesi.length > 0 && (
                    <div className="overflow-x-auto mt-2">
                      <table className="min-w-full text-xs sm:text-sm border">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Adı</th>
                            <th className="border px-2 py-1">Soyadı</th>
                            {sadeceTelefon && <th className="border px-2 py-1">Telefon</th>}
                            {!sadeceTelefon && <><th className="border px-2 py-1">TC</th><th className="border px-2 py-1">Doğum Tarihi</th><th className="border px-2 py-1">İl</th><th className="border px-2 py-1">Telefon</th></>}
                          </tr>
                        </thead>
                        <tbody>
                          {kisiListesi.map((k, i) => k && (
                            <tr key={i}>
                              <td className="border px-2 py-1">{k.adi}</td>
                              <td className="border px-2 py-1">{k.soyadi}</td>
                              {sadeceTelefon && <td className="border px-2 py-1">{gsm}</td>}
                              {!sadeceTelefon && <><td className="border px-2 py-1">{k.tc}</td><td className="border px-2 py-1">{k.dogumTarihi}</td><td className="border px-2 py-1">{k.il}</td><td className="border px-2 py-1">{gsm && k.tc === gsmTc ? gsm : ''}</td></>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            }
            // Telefon Numarası mesajı
            if (msg.sender === "ai" && msg.text.includes("Telefon Numarası:")) {
              const [sohbet, ...rest] = msg.text.split("\n\nTelefon Numarası:\n");
              const [gsmLine, ...kisiSatirlari] = rest.length > 0 ? rest[0].split("\n\nBulunan kişiler:\n") : [null, null];
              const kisiListesi = kisiSatirlari[1]
                ? kisiSatirlari[1].split("\n").map(satir => {
                  const match = satir.match(/^(.*?) (.*?) \((\d{11})\)\|(.*?)\|(.*)$/);
                  if (!match) return null;
                  const [, adi, soyadi, tc, dogumTarihi, il] = match;
                  return { adi, soyadi, tc, dogumTarihi, il };
                }).filter(Boolean)
                : [];
              // gsm bilgisini kisiListesi ile eşleştir
              const gsm = gsmLine ? gsmLine.trim() : '';
              // Eğer sadece bir kişi varsa ve gsm varsa, o kişiye ata
              let gsmTc = '';
              if (gsm && kisiListesi.length === 1 && kisiListesi[0]) {
                gsmTc = kisiListesi[0].tc;
              }
              return (
                <div key={idx} className="my-2 text-left animate-fade-in">
                  <div className="inline-block px-4 py-2 rounded-xl rounded-bl-none bg-gray-800 text-white mb-2 shadow">
                    {sohbet}
                  </div>
                  {gsm && (
                    <div className="mt-2 mb-2 p-3 bg-black text-white rounded-lg shadow border border-gray-700 inline-block">
                      <span className="font-semibold">Telefon Numarası:</span> <span className="tracking-wider text-lg">{gsm}</span>
                    </div>
                  )}
                  {kisiListesi.length > 0 && (
                    <div className="overflow-x-auto mt-2">
                      <table className="min-w-full text-xs sm:text-sm border">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Adı</th>
                            <th className="border px-2 py-1">Soyadı</th>
                            <th className="border px-2 py-1">TC</th>
                            <th className="border px-2 py-1">Doğum Tarihi</th>
                            <th className="border px-2 py-1">İl</th>
                            <th className="border px-2 py-1">Telefon</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kisiListesi.map((k, i) => k && (
                            <tr key={i}>
                              <td className="border px-2 py-1">{k.adi}</td>
                              <td className="border px-2 py-1">{k.soyadi}</td>
                              <td className="border px-2 py-1">{k.tc}</td>
                              <td className="border px-2 py-1">{k.dogumTarihi}</td>
                              <td className="border px-2 py-1">{k.il}</td>
                              <td className="border px-2 py-1">{gsm && k.tc === gsmTc ? gsm : ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            }
            // Diğer mesajlar (kullanıcı veya AI)
            return (
              <div
                key={idx}
                className={`my-1 sm:my-2 flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    `max-w-[90%] sm:max-w-[70%] animate-fade-in px-3 sm:px-4 py-2 shadow ` +
                    (msg.sender === "user"
                      ? "bg-black text-white rounded-xl rounded-br-none"
                      : "bg-gray-800 text-white rounded-xl rounded-bl-none")
                  }
                  style={{ marginBottom: idx === messages.length - 1 ? 20 : 0 }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
        {/* Mesaj kutusu (form) sadece mobilde görünsün */}
        <form
          className="w-full max-w-2xl px-2 sm:px-4 py-2 sm:py-4 shadow-lg border-2 border-solid border-gray-300 dark:border-gray-700 flex flex-col gap-2 sm:gap-3 bg-white dark:bg-[#01050e] mt-3 sm:mt-4 md:mb-8 fixed bottom-0 sm:bottom-5 left-0 z-50 mx-auto sm:static rounded-t-2xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl"
          style={{ boxSizing: 'border-box' }}
          onSubmit={handleSend}
        >
          {/* Mobilde input üstte, ataç ve gönder altta aynı satırda */}
          <div className="sm:hidden flex flex-col gap-4 w-full">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ne bilmek istiyorsun?"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 h-10 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#01050e] focus:ring-2 focus:ring-primary focus:border-primary transition"
              style={{ minWidth: '60px' }}
            />
            <div className="flex flex-row items-center gap-1 w-full">
              <button type="button" className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#01050e] hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary dark:hover:border-primary shadow-sm transition-colors duration-200">
                <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="flex-1" />
              <button
                type="submit"
                className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 active:scale-95 transition-all duration-150 dark:bg-white dark:text-primary dark:hover:bg-gray-200"
              >
                <Send className="w-6 h-6 text-white dark:text-black" />
              </button>
            </div>
          </div>
          {/* Masaüstü için: input üstte, butonlar altta yatay hizalı */}
          <div className="hidden sm:flex flex-col gap-4 w-full">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ne bilmek istiyorsun?"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 h-12 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#01050e] focus:ring-2 focus:ring-primary focus:border-primary transition"
              style={{ minWidth: '120px' }}
            />
            <div className="flex flex-row gap-2 items-center w-full justify-between">
              <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#01050e] hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary dark:hover:border-primary shadow-sm transition-colors duration-200">
                <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button type="button" className="flex items-center gap-1 px-3 h-10 rounded-lg bg-gray-100 dark:bg-[#01050e] border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary dark:hover:border-primary shadow-sm transition-colors duration-200 cursor-not-allowed">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Yakında
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400" />
              </button>
              <button type="button" className="flex items-center gap-1 px-3 h-10 rounded-lg bg-gray-100 dark:bg-[#01050e] border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary dark:hover:border-primary shadow-sm transition-colors duration-200 cursor-not-allowed">
                <Lightbulb className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Yakında
              </button>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 h-10 rounded-lg bg-transparent text-sm text-primary font-medium border border-gray-200 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary dark:hover:border-primary shadow-sm transition-colors duration-200"
                  onClick={() => setModelDropdownOpen((v) => !v)}
                >
                  Model: {selectedModel}
                  <ChevronDown className="w-4 h-4 text-primary" />
                </button>
                {modelDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#01050e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    {modelList.map((model) => (
                      <button
                        key={model}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-150 ${selectedModel === model ? 'font-bold text-primary' : ''} ${model.includes('Yakında') ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (model.includes('Yakında')) return;
                          setSelectedModel(model);
                          setModelDropdownOpen(false);
                        }}
                        disabled={model.includes('Yakında')}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 active:scale-95 transition-all duration-150 dark:bg-white dark:text-primary dark:hover:bg-gray-200"
              >
                <Send className="w-6 h-6 text-white dark:text-black" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
} 