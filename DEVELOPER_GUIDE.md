# Geliştirici Rehberi

## Proje Mimarisi
- **React + Vite** ile modern, hızlı ve modüler frontend.
- **@tanstack/react-router** ile dosya tabanlı route sistemi.
- **@tanstack/react-query** ile veri yönetimi ve cache.
- **TailwindCSS** ile utility-first stil yönetimi.
- **Express + MySQL** ile backend API.

## Klasörler ve Rolleri
- `src/routes/` : Route ve sayfa yönlendirmeleri.
- `src/modules/` : Her ana özellik için ayrı klasör (feature-based architecture).
- `src/components/` : UI ve layout bileşenleri.
- `src/lib/` : Yardımcı fonksiyonlar ve statik veriler.

## Modül/Sayfa Ekleme
1. `src/modules/` altında yeni bir klasör oluşturun.
2. İçine bir `index.tsx` dosyası ekleyin ve ana bileşeni yazın.
3. `src/routes/_authenticated/` altında aynı isimde bir klasör açıp, `index.tsx` ile modülü route'a bağlayın.
4. Gerekirse sidebar ve menüye ekleyin.

## Veri Akışı ve API
- Tüm veri işlemleri (sorgu, ekleme, silme) backend API ile yapılır.
- API çağrıları fetch veya react-query ile yapılır.
- Hatalar toast ile kullanıcıya bildirilir.

## Toast ve Bildirimler
- Tüm önemli işlemler ve hatalar için toast bildirimleri kullanılır.
- `useToast` hook'u ile kolayca toast gösterilebilir.
- Toast stilleri ve animasyonları TailwindCSS ile özelleştirilmiştir.

## Stil Yönetimi
- Tüm bileşenler TailwindCSS ile stillendirilmiştir.
- Tema ve font yönetimi context ile sağlanır.
- Responsive ve modern bir arayüz için utility-first yaklaşım benimsenmiştir.

## API Entegrasyonu
- Backend Express sunucusu ile REST API üzerinden haberleşme.
- MySQL veritabanı ile çeşitli sorgulamalar ve işlemler.
- API endpointleri için `server/` klasörüne bakınız.

## Katkı Sağlama ve Kod Standartları
- Kodunuzu göndermeden önce lint ve format komutlarını çalıştırın.
- Açık ve anlaşılır commit mesajları kullanın.
- Her modül ve önemli fonksiyon için kısa açıklama ekleyin.
- Geliştirici dokümantasyonunu güncel tutun.

## Sıkça Sorulanlar
- **Yeni bir sayfa nasıl eklenir?**
  - `src/modules/` altında klasör aç, bileşenini yaz, route'a bağla.
- **API'ye nasıl istek atılır?**
  - fetch veya react-query ile, endpointleri backend'den öğren.
- **Toast nasıl gösterilir?**
  - `useToast` hook'u ile kolayca toast göster.
- **Stil nasıl eklenir?**
  - TailwindCSS className'leri ile.

## Modül Listesi ve Kısa Açıklamaları
- Her modülün işlevi için README.md'ye bakınız.

---
Daha fazla bilgi için kodu ve örnek modülleri inceleyin. Herhangi bir sorunda proje yöneticisine veya ana geliştiriciye ulaşabilirsiniz. 