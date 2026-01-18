# FixIt - Kontekst dla AI Asystenta

## 📋 Projekt Dyplomowy

**Nazwa**: FixIt - Automotive Service Management System  
**Język**: Polsko-angielski (dokumentacja i UI)  
**Status**: Aktywny (w rozwoju)

---

## 🎯 Cel Projektu

Stworzenie webowej aplikacji do zarządzania warsztatem samochodowym z pełnym cyklem serwisowym:

- Przyjmowanie zleceń serwisowych
- Zarządzanie zadaniami napraw
- Kontrola magazynu części zamiennych
- Fakturowanie i płatności online (Stripe)
- Komunikacja z klientami
- Powiadomienia w czasie rzeczywistym
- Role-based access control (5 ról)

---

## 🛠️ Tech Stack (AKTUALNY)

### Frontend

- **Next.js 16** (App Router, Server Components, TypeScript)
- **React 19** (hooks, Suspense)
- **TypeScript 5.9**
- **Custom CSS** (brak Tailwind - głównie Flexbox, Grid)
- **Radix UI** (komponenty)
- **Lucide React** (ikony)

### Backend

- **Next.js API Routes** (Node.js)
- **Prisma 6.19.0** (ORM + migracje)
- **PostgreSQL** (baza danych)

### Autentykacja & Autoryzacja

- **NextAuth.js 4.24** (sesje, role-based access)
- **bcryptjs** (hashowanie haseł)

### Integracje

- **Stripe 20.0.0** (płatności, faktury)
- **@stripe/react-stripe-js**

### Narzędzia Dev

- **ESLint 9** (code quality)
- **Turbopack** (bundler)

---

## 📁 Struktura Projektu

```
fixit/
├── src/
│   ├── app/
│   │   ├── (first_page)/           # Publiczne strony + auth
│   │   │   ├── (auth)/login, signout
│   │   │   └── (public)/page.tsx
│   │   ├── (unpublic)/             # Role-based routes
│   │   │   ├── [role]/             # Admin, Mechanic, Warehouse, etc.
│   │   │   │   ├── dashboard/
│   │   │   │   ├── orders/
│   │   │   │   ├── customers/
│   │   │   │   ├── profile/        # Profil + notyfikacje
│   │   │   │   └── [inne strony]/
│   │   │   └── layout.tsx          # Navbar + notyfikacje badge
│   │   ├── api/                    # REST API routes
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── orders/             # CRUD orders
│   │   │   ├── notifications/      # Notyfikacje user'a
│   │   │   ├── warehouse/          # Zarządzanie częściami
│   │   │   ├── customers/
│   │   │   ├── mechanics/
│   │   │   └── [inne API]/
│   │   └── globals.css
│   ├── components/
│   │   ├── pages/                  # View components (Orders, Cars, etc.)
│   │   ├── layouts/                # Navbar, Sidebar, etc.
│   │   ├── tables/                 # UI tables
│   │   └── ui/                     # Radix UI components
│   ├── lib/
│   │   ├── auth.ts                 # NextAuth config
│   │   ├── prisma.ts               # Prisma client
│   │   ├── notifications.ts        # Notyfikacje helper
│   │   ├── session.ts
│   │   └── [utilities]/
│   ├── hooks/
│   │   ├── useTaskComments.ts      # Komentarze do zadań
│   │   ├── useTaskManagement.ts
│   │   └── [inne hooks]/
│   ├── types/                      # TypeScript interfaces
│   └── styles/                     # CSS files (custom CSS, nie Tailwind)
├── prisma/
│   └── schema.prisma               # Database schema + enums
├── public/
│   └── uploads/task-comments/      # User-generated files
├── package.json
├── tsconfig.json
├── README.md
└── .env.local (not in repo)
```

---

## 🔐 Role & Uprawnienia

1. **ADMIN** - pełna kontrola, zarządzanie użytkownikami, raportowanie
2. **MECHANIC** - tworzenie/aktualizacja zleceń, dodawanie komentarzy
3. **WAREHOUSE** - zarządzanie magazynem, dedukcja części
4. **RECEPTIONIST** - przyjmowanie zleceń, komunikacja z klientami
5. **CLIENT** - przeglądanie swoich zleceń, płacenie faktur

---

## ✨ Implementowane Funkcjonalności

### ✅ Już Zrobione

- [ ] Autentykacja (NextAuth + role-based)
- [ ] Zarządzanie zleceniami (CRUD + status history)
- [ ] Zarządzanie zadaniami w zleceniach
- [ ] Komentarze do zadań z załącznikami (zdjęcia, wideo, dokumenty)
- [ ] **Inline video player** w komentarzach (nowe!)
- [ ] Zarządzanie częściami (warehouse)
- [ ] Dedukcja części z magazynu
- [ ] Fakturowanie + płatności Stripe
- [ ] Powiadomienia (system notyfikacji, badge na avatarze)
- [ ] Dashboard dla każdej roli
- [ ] Activity logs
- [ ] Przeszukiwanie i filtry

### 🔄 Role-Based Features

| Feature             | Admin | Mechanic | Warehouse | Receptionist | Client |
| ------------------- | ----- | -------- | --------- | ------------ | ------ |
| Przeglądaj zlecenia | ✅    | ✅       | ✅        | ✅           | Swoje  |
| Twórz zlecenia      | ✅    | ✅       | ❌        | ✅           | ❌     |
| Dodaj komentarze    | ✅    | ✅       | ❌        | ❌           | ❌     |
| Zarządzaj magazynem | ❌    | ❌       | ✅        | ❌           | ❌     |
| Administracja       | ✅    | ❌       | ❌        | ❌           | ❌     |
| Płatności           | ✅    | ❌       | ❌        | ❌           | ✅     |

---

## 🚀 Jak Zacząć

```bash
# 1. Zainstaluj zależności
npm install

# 2. Skonfiguruj .env.local (patrz README.md)
# DATABASE_URL, NEXTAUTH_SECRET, STRIPE_KEY

# 3. Uruchom migracje
npx prisma generate
npx prisma migrate dev

# 4. Pokaż Prisma Studio (opcjonalnie)
npx prisma studio

# 5. Uruchom serwer dev
npm run dev

# 6. Otwórz http://localhost:3000
```

---

## 📂 Ważne Pliki do Edytowania

### Backend (API)

- `src/app/api/orders/route.ts` - tworzenie/pobieranie zleceń
- `src/app/api/orders/[id]/route.ts` - edycja zlecenia + notyfikacje
- `src/app/api/notifications/route.ts` - endpoint notyfikacji
- `prisma/schema.prisma` - baza danych

### Frontend (UI)

- `src/app/(unpublic)/layout.tsx` - navbar + badge notyfikacji
- `src/app/(unpublic)/[role]/profile/page.tsx` - profil + lista notyfikacji
- `src/components/pages/OrderDetailView.tsx` - widok zlecenia (video player!)
- `src/styles/` - wszystkie pliki CSS

### Konfiguracja

- `src/lib/auth.ts` - NextAuth config
- `src/lib/notifications.ts` - helper do powiadomień
- `.env.local` - zmienne środowiska (DATABASE_URL, STRIPE_KEY, etc.)

---

## 📊 Baza Danych (Prisma)

### Główne tabele

- `users` - konta + role
- `service_order` - zlecenia napraw
- `service_task` - zadania w zleceniu
- `service_task_comment` - komentarze + załączniki
- `document` - zdjęcia/wideo/PDFy
- `part` - części zamienne
- `service_order_part` - części używane w zleceniu
- `invoice` - faktury
- `payment` - płatności (Stripe)
- `notification` - powiadomienia
- `logs` - activity log

**Migracja**: `npx prisma migrate dev --name <opis>`

---

## 🔧 Polecenia NPM

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Run production
npm run lint             # Check code quality
npx prisma studio       # Open DB GUI
npx prisma migrate dev  # Create/apply migrations
npx prisma generate     # Regenerate Prisma Client
```

---

## 🐛 Debugging & Troubleshooting

**Port zajęty**: `taskkill /PID <PID> /F` (Windows) lub `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

**Błędy Prisma**:

```bash
npx prisma generate
npx prisma migrate reset  # ⚠️ WARNING: usuwa wszystkie dane!
```

**Problemy z bazą**: Upewnij się, że PostgreSQL działa i DATABASE_URL jest poprawny

---

## 📝 Notatki do Dyplomu

- Projekt używa **custom CSS**, nie Tailwind
- Video player w komentarzach - implementacja z `<video>` tag'iem
- Notyfikacje - system real-time badges + lista w profilu
- Role-based routing w Next.js - middleware + layout structure
- Prisma migrations - versionowanie bazy

---

## 🎓 Do Omówienia w Dyplomie

1. Architektura Next.js App Router
2. Server Components vs Client Components
3. Prisma ORM + migracje
4. NextAuth.js + role-based access
5. Stripe integration (payments, webhooks)
6. Real-time features (notyfikacje)
7. File upload + storage (video, images)
8. TypeScript benefits w large projects
9. Turbopack performance
10. Security best practices (bcryptjs, HTTPS, CSP)

---

## 👨‍💻 AI Assistant Prompt

_Kopiuj to do nowego chatu:_

> "Pomagasz mi pisać diplom. Projekt: **FixIt** - system zarządzania warsztatem samochodowym w Next.js 16.
>
> Tech: Next.js (API Routes), React 19, TypeScript, Prisma + PostgreSQL, NextAuth.js, Stripe, custom CSS.
>
> Główne funkcje: zlecenia serwisowe, zarządzanie zadaniami, komentarze z video player'em, powiadomienia, role-based access (5 ról).
>
> Mogę Ci pytać o:
>
> - Implementację nowych funkcji
> - Poprawki bugów
> - Optymalizacje kodu
> - Architekturę systemu
> - Teorię do dyplomu (bezpieczeństwo webapps, best practices, itd.)
>
> Plik struktury: CONTEXT_FOR_AI.md"

---

**Ostatnia aktualizacja**: 18 Styczeń 2026  
**Status**: Gotowy do kontynuacji
