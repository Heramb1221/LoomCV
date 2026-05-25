# LoomCV

> AI-powered resume builder SaaS with Google Gemini AI, real-time live preview, Stripe subscriptions, and production-inspired full-stack architecture.


![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=for-the-badge&logo=stripe)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-orange?style=for-the-badge&logo=google)
![Status](https://img.shields.io/badge/Status-Production--Architecture%20Prototype-purple?style=for-the-badge)

---

# Live Demo

| Resource | Link |
|---|---|
| Frontend (Live App) | [Live Demo](https://loom-cv.vercel.app/) |

---

# About The Project

LoomCV is a full-stack SaaS application that allows users to build and download professional resumes through a guided multi-step editor with a real-time A4 preview.

The editor updates instantly as users type, rendering a live scaled preview beside the form without requiring page reloads.

The AI integration powered by Google Gemini Flash enables users to:

- Generate professional resume summaries
- Convert plain-English job descriptions into ATS-optimized bullet points
- Enhance resume quality using AI-assisted workflows

The platform implements a complete freemium subscription architecture using Stripe:

- Free users: 1 resume
- Pro users: 3 resumes + AI tools
- Pro Plus users: unlimited resumes + customization features

The project explores production-inspired SaaS patterns including:

- Real authentication
- Real billing
- Real database persistence
- Real AI integration
- File uploads
- Subscription state management
- Server Actions architecture

This is not a CRUD tutorial project — it was built to explore full-stack production architecture concepts in practice.

---

# Project Type

| Attribute | Value |
|---|---|
| Category | AI-Powered SaaS Web Application |
| Architecture | Full-Stack Monorepo (Next.js App Router) |
| Rendering Model | React Server Components + Client Components |
| API Pattern | Next.js Server Actions |
| Auth Model | JWT-based authentication via Clerk |
| Billing Model | Stripe subscriptions |
| Deployment Target | Vercel |

---

# Project Status

**Production-Architecture Learning Prototype**

The core feature set is complete and functional. The project was built primarily to explore real-world SaaS engineering patterns including:

- Authentication architecture
- Subscription billing flows
- AI integration
- Server Actions
- File storage
- Database modeling
- Permission systems

Several architectural improvements and scalability concerns are intentionally documented throughout the repository for engineering transparency and learning purposes.

---

# Why I Built This

Most portfolio projects stop at CRUD operations with mock authentication and hardcoded data.

I built LoomCV to explore what a real SaaS architecture looks like end-to-end, including:

- Server Actions as an API layer
- Stripe subscription lifecycle management
- AI integration in a product context
- Serverless database patterns
- Real-time UX without WebSockets

The project helped me understand how production systems handle:

- Authentication
- Billing
- Permissions
- Database persistence
- Auto-save workflows
- AI-assisted user experiences

---

# Features

## Core Features

- Multi-step resume editor
- Real-time A4 preview
- AI-generated summaries
- AI-generated work experience entries
- Drag-and-drop section reordering
- Fuzzy skill autocomplete
- Profile photo upload
- Browser-native print-to-PDF

---

## Engineering Features

- Debounced auto-save
- URL-driven editor state
- React Server Components data fetching
- Subscription-gated permissions
- React.cache deduplication
- Retry-based persistence flow

---

## Security Features

- Clerk Edge middleware
- IDOR protection
- Stripe webhook verification
- Zod validation
- Server-side AI calls

---

## Developer Experience Features

- End-to-end type safety
- Environment variable validation
- Dark/light mode
- shadcn/ui integration

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js 15 | Framework, App Router, Server Actions |
| React 19 RC | UI rendering |
| TypeScript | Static typing |
| Tailwind CSS | Styling |
| shadcn/ui | Accessible UI primitives |
| react-hook-form | Form handling |
| @dnd-kit | Drag-and-drop |
| Fuse.js | Fuzzy search |
| Zustand | Lightweight global state |
| Framer Motion | UI transitions |

---

## Backend

| Technology | Purpose |
|---|---|
| Next.js Server Actions | Mutation layer |
| Clerk | Authentication |
| Google Gemini Flash | AI generation |
| Stripe | Subscription billing |

---

## Database & Storage

| Technology | Purpose |
|---|---|
| PostgreSQL | Primary database |
| Prisma ORM | Database access |
| Vercel Blob | File storage |

---

# Architecture

LoomCV uses Next.js App Router as the full application layer without a separate backend service.

```text
Browser (Client Components)
        │
        ▼
Next.js App Router
        │
        ├── Server Actions
        ├── React Server Components
        └── API Routes
                │
                ▼
 ┌──────────────┬──────────────┬──────────────┐
 │              │              │
 ▼              ▼              ▼
Clerk        PostgreSQL      External APIs
Auth         Prisma ORM      Gemini / Stripe / Blob
```

---

## Resume Auto-Save Lifecycle

```text
User types in form
      │
      ▼
react-hook-form state update
      │
      ▼
Debounce timer (1500ms)
      │
      ▼
saveResume() Server Action
      │
      ├── Validate JWT
      ├── Permission checks
      ├── Blob upload (optional)
      └── Prisma update
      │
      ▼
Resume persisted
```

---

## Subscription Permission Model

```text
free
 └── 1 resume

pro
 ├── 3 resumes
 └── AI tools enabled

pro_plus
 ├── unlimited resumes
 ├── AI tools
 └── customizations
```

---

# Folder Structure

```text
loomcv/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (main)/
│   │   │   ├── billing/
│   │   │   ├── editor/
│   │   │   ├── resumes/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── stripe-webhook/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── env.ts
│   └── middleware.ts
│
├── components.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# Installation

## Prerequisites

- Node.js >= 18.17.0
- PostgreSQL database
- Clerk account
- Stripe account
- Google AI Studio account
- Vercel account

---

## Setup

```bash
# Clone repository
git clone https://github.com/yourusername/loomcv.git
cd loomcv

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Push schema
npx prisma db push

# Start development server
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Environment Variables

Create a `.env.local` file:

```env
# Database
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Clerk
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Gemini AI
GEMINI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Blob Storage
BLOB_READ_WRITE_TOKEN=

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Stripe Webhook Setup

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Required events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

# Usage

## Creating a Resume

1. Sign in with Clerk
2. Create a new resume
3. Complete editor steps
4. Resume auto-saves automatically
5. Print or download PDF

---

## AI Features

### AI Summary Generation

Gemini analyzes entered resume data and generates a professional summary.

### AI Work Experience

Describe a role in plain English and Gemini returns ATS-optimized bullet points.

---

## Subscription Management

Users can:

- Upgrade plans
- Manage billing
- Cancel subscriptions

through Stripe Customer Portal integration.

---

# API Documentation

LoomCV uses Server Actions instead of a traditional REST API.

---

## Stripe Webhook

### `POST /api/stripe-webhook`

Processes Stripe subscription events.

| Event | Purpose |
|---|---|
| checkout.session.completed | Store customer metadata |
| customer.subscription.created | Create subscription |
| customer.subscription.updated | Update plan |
| customer.subscription.deleted | Revert to free tier |

---

## Server Actions

| Action | Description |
|---|---|
| `saveResume()` | Create/update resume |
| `deleteResume()` | Delete resume |
| `generateSummary()` | AI summary generation |
| `generateWorkExperience()` | AI work experience generation |
| `createCheckoutSession()` | Start Stripe checkout |
| `createCustomerPortalSession()` | Open billing portal |

---

# Screenshots

| Screen | Description |
|---|---|
| <img width="1893" height="866" alt="image" src="https://github.com/user-attachments/assets/00147449-90d7-44e1-b9c6-7a787d662611" /> | Landing page |
| <img width="1895" height="867" alt="image" src="https://github.com/user-attachments/assets/2e0d33bc-446c-4ad5-bc82-df1e40fbf830" /> | Resume dashboard |
| <img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/3cd81292-9e60-4328-8d78-de3a9182555e" /> | Split-pane editor |
| <img width="961" height="410" alt="image" src="https://github.com/user-attachments/assets/fd270c4d-3bcd-4426-8f79-94531cf2d150" /> | AI generation workflow |
| <img width="838" height="365" alt="image" src="https://github.com/user-attachments/assets/e38f7b24-a05b-45c2-a24d-53bd55843a9d" /> | Upgrade modal |
| <img width="1901" height="867" alt="image" src="https://github.com/user-attachments/assets/55c2d16f-aed0-445f-b5c6-2d6686e862b3" /> | Billing dashboard |
| <img width="1895" height="860" alt="image" src="https://github.com/user-attachments/assets/c5e64d33-ba45-452d-9d1f-4a33fad588a1" /> | Dark theme |

---

# Performance Considerations

## Optimizations Implemented

- Debounced auto-save
- React.cache deduplication
- Parallel data fetching
- React Server Components
- Fuse.js client-side search
- CDN-backed profile photos

---

## Known Bottlenecks

| Issue | Impact |
|---|---|
| deleteMany + create nested writes | Excessive DB operations |
| Missing ResumePreview memoization | Frequent re-renders |
| Missing database indexes | Slower queries |

---

# Security Considerations

## Implemented

| Concern | Implementation |
|---|---|
| Authentication | Clerk Edge middleware |
| Authorization | Scoped DB queries |
| CSRF | Next.js protections |
| Input validation | Zod schemas |
| Webhook verification | Stripe HMAC validation |
| API key protection | Server-side Gemini calls |

---

## Known Limitations

- No rate limiting on AI endpoints
- No CSP headers
- Blob URLs are publicly accessible
- `priceId` accepted from client without allowlist validation

---

# Tradeoffs & Limitations

| Decision | Tradeoff |
|---|---|
| Server Actions over REST | Simpler architecture but harder isolated testing |
| Clerk authentication | Faster setup but vendor lock-in |
| Prisma ORM | Better DX but larger serverless bundle |
| deleteMany + create writes | Simpler logic but inefficient persistence |
| Client-side preview rendering | Faster UX but more re-renders |

---

# Known Issues

| Issue | Severity |
|---|---|
| Blob upload path collision | Medium |
| `structuredClone` File issue | High |
| Unvalidated `priceId` | High |
| PII logged in console | Medium |
| Missing AI endpoint rate limiting | High |

---

# Technical Debt

- No automated test coverage
- No service layer abstraction


---

# Challenges Faced

- Auto-save diffing with File objects
- Prisma connection management in development
- Vercel Postgres pooling architecture
- Understanding Server Actions lifecycle
- Stripe webhook ordering consistency

---

# What I Learned

- App Router architecture
- Server Actions as an API model
- Stripe subscription systems
- React.cache optimization
- Zod schema contracts
- Practical freemium architecture

---

# Future Scope

## Engineering Improvements

- Upsert-based nested writes
- Redis rate limiting
- CSP headers
- Better AI structured output
- Test coverage

---

## Product Expansion

- Resume templates
- ATS analyzer
- Cover letter generator
- Resume version history
- Collaborative sharing

---

# Repository Philosophy

LoomCV was built as a production-architecture learning project.

The focus was not simply feature completion, but understanding:

- authentication systems
- billing flows
- AI integration
- database architecture
- permissions
- serverless deployment patterns

The repository intentionally documents:

- technical debt
- tradeoffs
- architectural limitations

to demonstrate engineering reasoning and growth.

---

# License

Distributed under the MIT License.

See `LICENSE` for details.

---

# Contact

**Heramb Chaudhari**

[![GitHub](https://img.shields.io/badge/GitHub-Heramb1221-black?style=for-the-badge&logo=github)](https://github.com/Heramb1221)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Heramb%20Chaudhari-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/heramb-chaudhari)

[![Email](https://img.shields.io/badge/Email-hchaudhari1221%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:hchaudhari1221@gmail.com)

---

Built to explore production-grade SaaS architecture with Next.js, Prisma, Clerk, Stripe, PostgreSQL, and Google Gemini AI.
