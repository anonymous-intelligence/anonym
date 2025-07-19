# Anonymous Intelligence

## Kurulum
1. Bağımlılıkları yükleyin:
   ```sh
   pnpm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```sh
   pnpm run dev
   ```
3. (Opsiyonel) Backend API için:
   ```sh
   pnpm run server
   ```

## Kullanılan Teknolojiler
- React 19
- TypeScript
- Vite
- TailwindCSS
- @tanstack/react-router
- @tanstack/react-query
- Express (Backend)
- MySQL
- Modern UI/UX bileşenleri

## Klasör Yapısı
- `src/routes/` : Dosya tabanlı route sistemi, sayfa yönlendirmeleri
- `src/modules/` : Tüm ana özellikler (her biri ayrı klasör)
- `src/components/` : Tekrar kullanılabilir UI ve layout bileşenleri
- `src/lib/` : Yardımcı fonksiyonlar ve statik veri dosyaları

## Modüller ve Sayfalar
Her modülün amacı ve temel işlevi aşağıda özetlenmiştir:

- **adsoyad-sorgu**: Ad, soyad, doğum tarihi, il/ilçe, baba/anne adı gibi bilgilerle kişi sorgulama.
- **altyapi-sorgu**: Adres bilgileriyle altyapı (ör. internet, fiber) sorgulaması.
- **azerbeycan-kimlik**: Azerbaycan kimlik görselleri arşivi.
- **bin-sorgu**: Kart numarasının ilk 6 hanesiyle banka/kart tipi/ülke sorgulama.
- **dns-domain-sorgu**: Domain adı için DNS ve domain bilgisi sorgulama.
- **fiyat-listesi**: Hizmetlerin ve aboneliklerin fiyatlandırması.
- **gsm-sorgu**: GSM numarası ile TC ve kişi bilgisi sorgulama.
- **ip-sorgu**: IP adresiyle detaylı bilgi sorgulama.
- **iptv**: Canlı TV kanalları izleme.
- **kimlik-arsivi**: Kimlik görselleri arşivi.
- **kimlik-olusturucu**: Gerçekçi kimlik kartı mockup’ı oluşturma.
- **kisi-bul**: Adım adım detaylı kişi arama ve sorgulama.
- **kisi-sorgu**: TC ile kişi ve kardeş bilgisi sorgulama.
- **operator-sorgu**: Telefon numarasının operatörünü sorgulama.
- **panel**: Genel istatistikler, popüler sorgular ve aktiviteler.
- **sms-bomber**: Toplu SMS gönderimi (VIP özellikli).
- **sulale-sorgu**: Sülale (aile ağacı) sorgulama.
- **wexai**: Sohbet edebilen, kişi ve GSM sorgusu yapabilen yapay zeka asistanı.
- **yabanci-sorgu**: Yabancı uyruklu kişiler için sorgu (yakında).

## Geliştirici Notları
- Kodun tamamı modüler ve okunabilir şekilde yazılmıştır.
- Her modül kendi içinde izole ve bağımsız geliştirilebilir.
- Toast bildirimleri, hata yönetimi ve modern UI/UX standartları uygulanmıştır.
- Yeni bir modül eklemek için `src/modules/` altında klasör açıp, route ve bileşenleri eklemeniz yeterlidir.

## Katkı Sağlamak
- Lütfen kodunuzu göndermeden önce `pnpm run lint` ve `pnpm run format` komutlarını çalıştırın.
- Açık ve anlaşılır commit mesajları kullanın.
- Geliştirici rehberi için `DEVELOPER_GUIDE.md` dosyasına göz atın.
