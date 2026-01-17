## FixIt – Automotive Service Management

Role-based workshop management platform built with Next.js 16, Prisma, and NextAuth. It covers the full service lifecycle: intake, tasking, parts, invoicing, payments, and customer communication across multiple branches.

---

### 1.2. Summary of Diploma

**Streszczenie**

Celem pracy było utworzenie i opisanie internetowej aplikacji wspomagającej zarządzanie warsztatem samochodowym oraz przedstawienie problematyki związanej z tworzeniem nowoczesnych aplikacji webowych z wykorzystaniem frameworka Next.js.

W części teoretycznej zostały poruszone tematy dotyczące użytych technologii i narzędzi. Opisano w niej zarys frameworka React oraz Next.js z wyszczególnieniem App Router i Server Components. Dalej zostały przedstawione sposoby przetwarzania, zarządzania i przechowywania danych za pomocą ORM Prisma oraz bazy danych PostgreSQL. Przedstawiono też zalety korzystania z mechanizmu NextAuth do uwierzytelniania i autoryzacji użytkowników. W pracy dużą uwagę zwrócono na problematykę związaną z bezpieczeństwem aplikacji webowych. Zostały w niej przedstawione zagrożenia, nad którymi należy się skupić projektując takie aplikacje w celu zabezpieczenia się przed nimi. Omówiono również integrację z systemem płatności Stripe oraz zarządzanie rolami użytkowników w aplikacji.

W części praktycznej pracy zaprojektowano i wykonano internetową aplikację wspomagającą zarządzanie warsztatem samochodowym, której zadaniem jest obsługa pełnego cyklu serwisowego: przyjmowanie zleceń, zarządzanie zadaniami, kontrola magazynu części, fakturowanie, realizacja płatności oraz komunikacja z klientami w wielu oddziałach. Aplikacja została wykonana przy użyciu technologii Next.js 16, TypeScript, Prisma ORM oraz bazy danych PostgreSQL. System umożliwia zarządzanie różnymi rolami użytkowników (administrator, mechanik, magazynier, recepcjonista, klient), śledzenie statusu napraw, zarządzanie zapasami części oraz generowanie faktur i przyjmowanie płatności online.

**Słowa kluczowe:** aplikacje webowe, Next.js, zarządzanie warsztatem samochodowym, autoryzacja oparta na rolach, system zarządzania serwisem

### Summary

The main goal was establishment and description of a web application supporting automotive workshop management as well as exposition of issues related to creating modern web applications using the Next.js framework.

The theoretical part of thesis raises matters concerning technologies and methods used to achieve the major aim. In this part outline of the React framework and Next.js has been depicted detailing App Router and Server Components. Later, there have been characterized ways of processing, managing and storing data by means of Prisma ORM and PostgreSQL database. Moreover, this part contains the advantages of using the NextAuth mechanism for user authentication and authorization. However, in thesis much interest has been also given to problems connected with the security of web applications. There were presented threats which should be taken into consideration when designing such applications as well as methods protecting from them. The integration with Stripe payment system and role-based user management were also discussed.

In the practical part, a web application supporting automotive workshop management has been designed and implemented. Its purpose is to handle the complete service lifecycle: order intake, task management, parts inventory control, invoicing, payment processing, and customer communication across multiple branches. The application was built using Next.js 16, TypeScript, Prisma ORM, and PostgreSQL database. The system enables management of different user roles (admin, mechanic, warehouse worker, receptionist, client), tracking repair status, managing parts inventory, and generating invoices with online payment processing.

**Keywords:** web applications, Next.js, automotive workshop management, role-based authorization, service management system

---

### Demo

Each thumbnail opens the role demo on YouTube.

- Warehouse
  [![Warehouse demo](https://img.youtube.com/vi/BeaRlvya7OA/0.jpg)](https://youtu.be/BeaRlvya7OA)

- Mechanic
  [![Mechanic demo](https://img.youtube.com/vi/xkfuUDAbLDA/0.jpg)](https://youtu.be/xkfuUDAbLDA)

- Client
  [![Client demo](https://img.youtube.com/vi/Brmvh5GDzDM/0.jpg)](https://youtu.be/Brmvh5GDzDM)

- Admin
  [![Admin demo](https://img.youtube.com/vi/7qiWTHk5Ht4/0.jpg)](https://youtu.be/7qiWTHk5Ht4)

### Highlights

- Role-aware dashboards and routing (ADMIN, MECHANIC, WAREHOUSE, RECEPTIONIST, CLIENT)
- Branch management with employees, vehicles, and customers tied to locations
- Service orders with tasks, comments, attachments, progress tracking, and status history
- Inventory and parts usage with warehouse deduction flags and minimum stock thresholds
- Invoicing and Stripe-backed payments, including status tracking and receipts
- Notifications, activity logs, and review capture for closed work

### Tech Stack

- Next.js App Router (TypeScript)
- Prisma ORM with PostgreSQL
- NextAuth for authentication/authorization
- Stripe for payments
- Radix UI, Tailwind CSS, and custom component library

### Project Layout

- app/(first_page) and app/(unpublic)/[role] – public entry, auth flows, and role-scoped dashboards
- app/api – REST-style API routes for auth, branches, cars, customers, dashboard data, mechanics, orders, settings, users, warehouse, and Stripe payment intents
- prisma/schema.prisma – relational model for users, branches, vehicles, service orders, tasks, parts, invoices, payments, and notifications
- src/lib – auth/session helpers, Prisma client, utilities, and route access checks
- src/components – layouts, UI primitives, tables, forms, and feature views
- public/uploads – user-generated assets (e.g., task comment attachments)

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Stripe account and API keys

### Environment

Create a `.env` file with at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Scripts

- `npm run dev` – start Next.js in development
- `npm run build` – production build
- `npm run start` – run the built app
- `npm run lint` – ESLint (Next.js rules)

### Deployment Notes

- Ensure `DATABASE_URL`, `NEXTAUTH_SECRET`, and Stripe secrets are set in the hosting environment.
- Run `prisma migrate deploy` on deploy to sync the database schema.

### Conventions

- Use role-based routes under `app/(unpublic)/[role]` to keep access isolated.
- Keep uploads within `public/uploads` and store metadata through the `document` model.
