# Taskilled Frontend v2 - Project Architecture & Tech Stack

Bu sənəd layihənin istifadə etdiyi texnologiya stekini (Tech Stack) və qovluq arxitekturasını (Folder Architecture) ətraflı şəkildə izah edir. Layihə modulyar və miqyaslana bilən (scalable) bir struktura əsaslanır və Feature-Sliced Design (FSD) yanaşmasına bənzər prinsiplərdən istifadə edir.

## 🛠 Texnologiya Steki (Tech Stack)

Layihə ən müasir frontend texnologiyaları əsasında qurulub:

### ⚡ Core & Framework
- **React (v19)** - Əsas UI kitabxanası
- **Vite (v8)** - Sürətli build aləti və inkişaf serveri
- **TypeScript** - Statik tipləmə üçün
- **React Router DOM (v7)** - Səhifələrarası naviqasiya (Routing)

### 🎨 Styling & UI
- **Tailwind CSS (v4)** - Utility-first CSS framework
- **Shadcn UI & Radix UI** - Əlçatan (accessible) və fərdiləşdirilə bilən UI komponentləri üçün
- **Framer Motion** - Mürəkkəb animasiyalar üçün
- **Lucide React** - İkonlar
- **Sonner** - Bildirişlər (Toasts) üçün
- **Matter.js** - 2D fizika mühərriki (Xüsusi interaktiv UI elementləri üçün)

### 🗄 State Management & Data Fetching
- **Zustand (v5)** - Qlobal state idarəetməsi (Client State)
- **TanStack React Query (v5)** - API müraciətləri və server state idarəetməsi
- **Axios** - HTTP sorğuları (Requests) üçün

### 📝 Form Handling & Validation
- **React Hook Form** - Performanslı forma idarəetməsi
- **Zod** - Form datalarının yoxlanılması (Schema Validation)

### 🌍 Internationalization (i18n)
- **i18next & react-i18next** - Çoxdillilik dəstəyi

### 🧪 Testing & Linting
- **Vitest** - Sürətli test mühərriki (Unit testing)
- **React Testing Library** - UI testləri üçün
- **ESLint** - Kod standartlarının qorunması

---

## 📂 Qovluq Arxitekturası (Folder Architecture)

Layihə strukturu funksional və domen əsaslı modullara bölünüb. Bu yanaşma böyük layihələrdə kodun daha asan idarə olunmasını və təkrar istifadəsini təmin edir.

```text
src/
├── app/                  # Tətbiqin əsas quruluşu və qlobal tənzimləmələri
│   ├── layouts/          # Qlobal səhifə şablonları (məsələn: MainLayout, AuthLayout)
│   ├── providers/        # Context Provider-lər (Theme, QueryClient, i18n və s.)
│   └── router/           # React Router tənzimləmələri və Guard-lar (Protected Routes)
│
├── modules/              # Domenə spesifik böyük biznes modulları (məs: auth, profile)
│   └── auth/
│       ├── api/          # Modula aid API sorğuları
│       ├── components/   # Modula xüsusi UI komponentləri
│       ├── constants/    # Sabit dəyərlər (Constants)
│       ├── hooks/        # Modul üçün Custom hook-lar
│       ├── pages/        # Modula aid alt-səhifələr
│       ├── store/        # Zustand store (qlobal state)
│       ├── types/        # TypeScript interfeysləri
│       └── utils/        # Yardımcı funksiyalar
│
├── features/             # Təkrar istifadə edilə bilən konkret funksionallıqlar (məs: onboarding)
│   └── onboarding/
│       ├── api/          
│       ├── components/   
│       ├── schemas/      # Zod validasiya sxemləri
│       ├── store/        
│       ├── types/        
│       └── utils/        
│
├── pages/                # Tətbiqin əsas səhifələri (Modules və Features-ləri birləşdirir)
│   ├── home/
│   └── landing/
│
├── shared/               # Bütün layihə boyu istifadə olunan ortaq (shared) fayllar
│   ├── api/              # Axios instansiyaları və base API məntiqi
│   ├── constants/        # Qlobal sabit dəyərlər
│   ├── hooks/            # Qlobal Custom Hook-lar (məs: useWindowSize)
│   ├── i18n/             # Çoxdillilik konfiqurasiyası
│   ├── lib/              # Xarici kitabxanaların tənzimləmələri
│   ├── store/            # Qlobal State-lər (App səviyyəsində)
│   ├── styles/           # Qlobal CSS (index.css) və Tailwind konfiqurasiyaları
│   ├── types/            # Qlobal TypeScript tipləri
│   ├── ui/               # Təkrar istifadə edilə bilən ortaq UI komponentləri
│   │   ├── custom/       # Layihəyə özəl yazılmış ortaq komponentlər
│   │   └── shadcn/       # Shadcn UI kitabxanasından gələn komponentlər
│   └── utils/            # Qlobal yardımcı funksiyalar (Helpers)
│
├── assets/               # Statik fayllar (Şəkillər, Fontlar, İkonlar)
└── test/                 # Test konfiqurasiyaları və ortaq test utility-ləri
```

### 🏗 Arxitektura Qaydaları (Architectural Rules)

1. **İzolyasiya (Isolation)**: `modules` və `features` daxilindəki qovluqlar bir-birindən asılı olmamalıdır. Bir feature digərinin daxili koduna birbaşa müraciət etməməlidir.
2. **Aşağıdan Yuxarıya Asılılıq (Dependency Rule)**: Asılılıqlar yuxarıdan aşağıya deyil, aşağıdan yuxarıya doğru olmalıdır: `app` -> `pages` -> `modules/features` -> `shared`. Yəni, `shared` qovluğu `modules` və ya `features` haqqında heç nə bilməməlidir.
3. **Mərkəzləşdirilmiş API İdarəetməsi**: Bütün API sorğuları müvafiq modulun və ya feature-ın `api/` qovluğunda toplanır və `React Query` (Custom Hook-lar) vasitəsilə komponentlərə təqdim edilir.
4. **Validasiya Mərkəzi**: Bütün form məlumatları və API cavabları `Zod` sxemləri (`schemas/`) ilə yoxlanılır.
