# BakuGo — PWA GitHub Pages Quraşdırması

Bu qovluqda BakuGo tətbiqini **quraşdırıla bilən PWA** kimi GitHub-a yükləyib pulsuz
GitHub Pages ilə canlıya çıxarmaq üçün lazım olan bütün fayllar var:

```
bakugo/
├── index.html          ← əsas tətbiq
├── manifest.json        ← PWA manifesti (ad, ikonlar, rənglər)
├── sw.js                 ← Service Worker (offline keş)
└── icons/
    ├── icon-192.png
    ├── icon-384.png
    ├── icon-512.png
    ├── icon-512-maskable.png
    └── icon-1024.png
```

## 1. GitHub-da repo yarat

1. https://github.com → **New repository**
2. Ad ver, məsələn `bakugo` (public seç, README əlavə etməyə ehtiyac yoxdur)
3. **Create repository** düyməsinə bas

## 2. Faylları yüklə

**Ən asan yol — brauzerdən:**
- Repo səhifəsində **Add file → Upload files**
- Bu qovluqdakı bütün faylları (və `icons/` qovluğunu) sürüklə-burax
- **Commit changes**

**Və ya terminaldan (git quraşdırılıbsa):**
```bash
cd bakugo
git init
git add .
git commit -m "BakuGo PWA ilk versiya"
git branch -M main
git remote add origin https://github.com/İSTİFADƏÇİ_ADIN/bakugo.git
git push -u origin main
```

## 3. GitHub Pages-i aktivləşdir

1. Repo → **Settings → Pages**
2. **Source** bölməsində: `Deploy from a branch`
3. **Branch**: `main`, qovluq: `/ (root)` → **Save**
4. Bir neçə dəqiqədən sonra sayt bu ünvanda olacaq:
   `https://İSTİFADƏÇİ_ADIN.github.io/bakugo/`

> ⚠️ **Vacib:** GitHub Pages avtomatik **HTTPS** verir — Service Worker və PWA
> quraşdırılması yalnız HTTPS (və ya `localhost`) üzərində işləyir, ona görə
> əlavə heç nə etməyə ehtiyac yoxdur.

## 4. Yoxla

1. Yayımlanan linki telefonda (Android/Chrome) aç
2. Bir neçə saniyə sonra brauzer aşağıda **"Ana ekrana əlavə et" / "Install app"**
   bildirişi göstərəcək (və ya menyudan əl ilə seçilə bilər)
3. Chrome DevTools → **Application** tabında `Manifest` və `Service Workers`
   bölmələrindən qeydiyyatın uğurlu olduğunu yoxlaya bilərsən

## 5. Android APK istəyirsənsə (PWABuilder)

1. https://www.pwabuilder.com → linkini yapışdır (`https://.../bakugo/`)
2. "Start" → Android paketini generasiya et və endir
3. Bu, `manifest.json`-dakı ikon və adları avtomatik oxuyacaq

## Qeydlər

- `manifest.json` içindəki `theme_color`/`background_color` tətbiqin öz
  dizaynındakı `--bg: #020712` rənginə uyğunlaşdırılıb.
- `sw.js` yalnız statik faylları (HTML qabığı, ikonlar) keşləyir — Firebase/
  Firestore sorğularına (canlı qiymət, sifariş statusu) toxunmur, ona görə
  tətbiq həmişə təzə data göstərəcək.
- Hər dəfə `index.html`, `manifest.json` və ya ikonları yenilədikdən sonra
  `sw.js` içindəki `CACHE_NAME` dəyərini artır (məs. `v1` → `v2`), əks halda
  istifadəçilər köhnə keşlənmiş versiyanı görə bilər.
- Firebase `apiKey` kodda görünür — bu normaldır, Firebase client key-ləri
  ictimai olmaq üçün nəzərdə tutulub (təhlükəsizlik Firestore Security
  Rules ilə həll olunur, açar gizli saxlanmır).
