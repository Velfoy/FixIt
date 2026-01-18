## FixIt – Automotive Service Management

Role-based workshop management platform built with Next.js 16, Prisma, and NextAuth. It covers the full service lifecycle: intake, tasking, parts, invoicing, payments, and customer communication across multiple branches.

**📖 For AI Assistant**: See [CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md) for project context when continuing work in a new chat.

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

#### Warehouse

[![Warehouse demo](https://img.youtube.com/vi/BeaRlvya7OA/0.jpg)](https://youtu.be/BeaRlvya7OA)

#### Mechanic

[![Mechanic demo](https://img.youtube.com/vi/xkfuUDAbLDA/0.jpg)](https://youtu.be/xkfuUDAbLDA)

#### Client

[![Client demo](https://img.youtube.com/vi/Brmvh5GDzDM/0.jpg)](https://youtu.be/Brmvh5GDzDM)

#### Admin

[![Admin demo](https://img.youtube.com/vi/wlpSTByOFcY/0.jpg)](https://youtu.be/wlpSTByOFcY)

### Highlights

- Role-aware dashboards and routing (ADMIN, MECHANIC, WAREHOUSE, RECEPTIONIST, CLIENT)
- Branch management with employees, vehicles, and customers tied to locations
- Service orders with tasks, comments, attachments, progress tracking, and status history
- Inventory and parts usage with warehouse deduction flags and minimum stock thresholds
- Invoicing and Stripe-backed payments, including status tracking and receipts
- Notifications, activity logs, and review capture for closed work

### Tech Stack

- **Frontend**: Next.js 16 App Router (TypeScript), React 19
- **Backend**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Payments**: Stripe
- **UI Components**: Radix UI, Tailwind CSS v4, Lucide React icons
- **Styling**: CSS Modules + Tailwind CSS
- **Password Hashing**: bcryptjs
- **Development Tools**: ESLint v9, TypeScript v5.9

### Detailed Technology Stack

#### **Frontend & UI**

| Technology               | Version | Purpose                                                                                  |
| ------------------------ | ------- | ---------------------------------------------------------------------------------------- |
| Next.js                  | 16.0.1  | Full-stack React framework with App Router, Server Components, and built-in optimization |
| React                    | 19.2.0  | UI component library with hooks and Suspense support                                     |
| TypeScript               | 5.9.3   | Type safety for JavaScript - catches errors at compile time                              |
| Tailwind CSS             | 4.1.17  | Utility-first CSS framework for rapid UI development                                     |
| Radix UI                 | Latest  | Unstyled, accessible component primitives (Dialog, Slot, etc.)                           |
| Lucide React             | 0.553.0 | Beautiful, consistent icon library (1000+ icons)                                         |
| Class Variance Authority | 0.7.1   | Type-safe component variant management                                                   |
| clsx                     | 2.1.1   | Conditional className management utility                                                 |
| Tailwind Merge           | 3.4.0   | Intelligent Tailwind class merging to prevent conflicts                                  |

#### **Backend & API**

| Technology         | Version | Purpose                                                         |
| ------------------ | ------- | --------------------------------------------------------------- |
| Next.js API Routes | 16.0.1  | Built-in REST API endpoints in `/app/api`                       |
| Node.js            | 20+     | JavaScript runtime for backend execution                        |
| Prisma ORM         | 6.19.0  | Type-safe database ORM with migrations and schema management    |
| PostgreSQL         | Latest  | Relational database with strong consistency and ACID compliance |
| NextAuth.js        | 4.24.13 | Authentication library with role-based access control (RBAC)    |
| bcryptjs           | 3.0.2   | Password hashing for secure credential storage                  |

#### **Integrations**

| Technology              | Version | Purpose                                              |
| ----------------------- | ------- | ---------------------------------------------------- |
| Stripe                  | 20.0.0  | Payment processing (invoices, payments, receipts)    |
| @stripe/react-stripe-js | 5.4.1   | React components for Stripe integration              |
| @stripe/stripe-js       | 8.5.3   | Stripe JavaScript library for client-side operations |

#### **Development & Build Tools**

| Technology         | Version  | Purpose                                         |
| ------------------ | -------- | ----------------------------------------------- |
| ESLint             | 9        | Code quality and style enforcement              |
| ESLint Config Next | 16.0.1   | Next.js-specific ESLint rules                   |
| Autoprefixer       | 10.4.21  | Auto-prefixes CSS for browser compatibility     |
| PostCSS            | 8.5.6    | CSS transformation pipeline (used by Tailwind)  |
| Turbopack          | Built-in | Fast bundler and compiler (faster than Webpack) |

#### **Type Definitions**

| Package            | Version  | Purpose                         |
| ------------------ | -------- | ------------------------------- |
| @types/node        | 20.19.24 | Node.js type definitions        |
| @types/react       | 19.2.2   | React type definitions          |
| @types/react-dom   | 19.2.2   | React DOM type definitions      |
| @types/bcryptjs    | 3.0.0    | bcryptjs type definitions       |
| @types/estree      | 1.0.8    | ECMAScript AST type definitions |
| @types/json-schema | 7.0.15   | JSON Schema type definitions    |

### Technology Choices & Rationale

**Why Next.js?**

- Server Components reduce JavaScript sent to client
- Built-in API routes eliminate need for separate backend
- Automatic code splitting and optimization
- Fast refresh for development experience
- Turbopack for blazing-fast builds

**Why PostgreSQL + Prisma?**

- PostgreSQL: ACID compliance, complex queries, strong consistency for financial data
- Prisma: Type-safe migrations, auto-generated client, easy schema management

**Why Stripe?**

- Industry-standard payment processor
- Comprehensive API for invoices, payments, subscriptions
- Built-in PCI compliance and security
- Excellent webhook support for real-time updates

**Why NextAuth.js?**

- Secure session management
- Built-in providers (credentials, OAuth)
- Role-based access control (RBAC) support
- No database required (can use any provider)

### Development Tools

| Tool                              | Purpose                            | Version |
| --------------------------------- | ---------------------------------- | ------- |
| **Visual Studio Code**            | Code editor                        | latest  |
| **Prisma Studio**                 | Database GUI (`npx prisma studio`) | v6.19.0 |
| **pgAdmin** or **DBeaver**        | PostgreSQL client (optional)       | latest  |
| **Postman** or **Thunder Client** | API testing (VS Code extension)    | latest  |
| **Stripe CLI**                    | Local webhook testing (optional)   | latest  |

**VS Code Recommended Extensions:**

- Prisma (prisma.prisma)
- Thunder Client (rangav.vscode-thunder-client)
- ESLint (dbaeumer.vscode-eslint)
- TypeScript Vue Plugin (Vue.volar)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

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

### Installation on New Computer

#### 1. Install Required Software

**Node.js (v20 or higher)**

- Download from [nodejs.org](https://nodejs.org/)
- Verify: `node -v` and `npm -v`

**PostgreSQL Database**

- **Windows**: Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql@16` or download from postgresql.org
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`
- Start PostgreSQL service
- Create database: `createdb fixit` or use pgAdmin/psql

**Git** (optional, for cloning)

- Download from [git-scm.com](https://git-scm.com/)

#### 2. Clone/Copy Project

```bash
# Option 1: Clone from repository
git clone <repository-url>
cd fixit

# Option 2: Copy project folder to new computer
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Configure Environment Variables

Create `.env.local` file in project root:

```env
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fixit?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Stripe Payment (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # For production webhooks
```

**Replace:**

- `USER` - your PostgreSQL username (default: `postgres`)
- `PASSWORD` - your PostgreSQL password
- `fixit` - your database name
- Generate `NEXTAUTH_SECRET`: run `openssl rand -base64 32` in terminal
- Get Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com/apikeys)

#### 5. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# (Optional) Seed initial data
npx prisma db seed
```

#### 6. Create Upload Directories

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path public\uploads\task-comments

# macOS/Linux
mkdir -p public/uploads/task-comments
```

#### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### 8. Create First Admin User (Manual)

Since you need an admin account to access the system:

**Option 1: Use script (if exists)**

```bash
node src/scripts/user_add.js
```

**Option 2: Direct database insert**

```sql
-- Connect to PostgreSQL
psql -U postgres -d fixit

-- Create admin user
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@fixit.com',
  '$2a$10$...',  -- bcrypt hash of password (use bcryptjs to generate)
  'Admin',
  'User',
  'ADMIN'
);
```

**Option 3: Use Prisma Studio**

```bash
npx prisma studio
# Opens GUI at http://localhost:5555
# Create user manually with role='ADMIN'
```

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
- `npm start` – run production server
- `npx prisma studio` – open database GUI
- `npx prisma migrate dev` – create/apply migrations
- `npx prisma generate` – regenerate Prisma Client

### Common Issues & Solutions

**Port already in use**

```bash
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Database connection failed**

- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `.env.local`
- Ensure database exists: `psql -l`

**Prisma Client errors**

```bash
npx prisma generate
npx prisma migrate reset  # WARNING: deletes all data
```

**Missing dependencies**

```bash
npm install
npm audit fix
```

### Production Deployment

1. Build application: `npm run build`
2. Set production environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

For Vercel/Railway/other platforms, see their specific PostgreSQL setup guides.

- `npm run start` – run the built app
- `npm run lint` – ESLint (Next.js rules)

### Deployment Notes

- Ensure `DATABASE_URL`, `NEXTAUTH_SECRET`, and Stripe secrets are set in the hosting environment.
- Run `prisma migrate deploy` on deploy to sync the database schema.

### Conventions

- Use role-based routes under `app/(unpublic)/[role]` to keep access isolated.
- Keep uploads within `public/uploads` and store metadata through the `document` model.
