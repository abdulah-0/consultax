# Implementation Phases — CONSULTax Associates

This document defines the step-by-step roadmap for implementing the CONSULTax Associates corporate website, admin dashboard, and backend API.

---

## Phase 1: Project Setup & Monorepo Initialization
**Goal:** Establish the project workspace structure, shared Tailwind tokens, configure TypeScript, and verify basic builds and routing.

- [ ] Initialize git and repository configurations (`.gitignore`, `.editorconfig`).
- [ ] Configure `npm` workspaces for monorepo:
  - `/apps/web`: Public marketing website (Next.js 14+ App Router, TS, Tailwind CSS).
  - `/apps/admin`: Admin dashboard (Next.js 14+ App Router, TS, Tailwind CSS).
  - `/packages/db`: Shared database configuration (Prisma client & schemas).
  - `/packages/config`: Shared Tailwind & brand color tokens configuration.
- [ ] Configure Tailwind theme color variables and fonts in `/packages/config` and CSS styles in apps (navy, orange, charcoal, cloud, etc.).
- [ ] Setup simple landing check pages for `/apps/web` and `/apps/admin` to confirm routing.
- [ ] **Verification:** Verify both applications build and run locally.
- [ ] **Release:** Commit and push to `https://github.com/abdulah-0/consultax.git` (Phase 1).

---

## Phase 2: Database Schema & Core APIs (Backend)
**Goal:** Implement the PostgreSQL database schema using Prisma, setup seed data, build the lead-capture API endpoint, and build admin authentication APIs.

- [ ] Setup PostgreSQL connection environment variables.
- [ ] Implement Prisma schema in `/packages/db` containing models:
  - `Lead`
  - `LeadNote`
  - `User`
  - `ServiceCategory`
  - `SubService`
- [ ] Create DB migration and a seed script to populate:
  - Default `ServiceCategory` and `SubService` data (FBR Registration, NTN, Corporate Filings, etc.).
  - Default administrative users (`SUPER_ADMIN`, `CONSULTANT`).
- [ ] Develop public API endpoint `POST /api/leads` in the web application (with Server-side validation and IP-based rate limiting).
- [ ] Implement Admin Auth APIs (JWT-based token session issuance, HTTP-Only Cookie wrapper or Bearer headers, role validation middleware).
- [ ] **Verification:** Run unit tests for validation, rate limiting, and auth role checks.
- [ ] **Release:** Commit and push to `https://github.com/abdulah-0/consultax.git` (Phase 2).

---

## Phase 3: Public Marketing Pages
**Goal:** Build the frontend pages for the public website using verbatim copy and wire all CTAs to the lead capture system.

- [ ] Create shared layout with Header, Navigation, Footer (with dynamic current year), and Floating WhatsApp CTA.
- [ ] Build **Home Page (`/`)**: Hero section, Trust bar, Services grid, CTA band.
- [ ] Build **About Us (`/about`)**: Narrative, Why Choose Us list, empty-safe `<TeamMember />` rendering.
- [ ] Build **Services Page (`/services`)**: Anchored category cards (Income Tax, Sales Tax, SECP, etc.), fetching details dynamically from the API/DB.
- [ ] Build **Contact Us Page (`/contact`)**: Form with pre-fill options from URL query parameters (e.g., `?service=income-tax`), contact details showing fallback Gmail email, and social links (no address/hours/map).
- [ ] Implement on-page success states and confirmation panels after form submission.
- [ ] **Verification:** Test all lead capture flows end-to-end (submitting forms from home/contact/services persists them to PostgreSQL database and triggers emails).
- [ ] **Release:** Commit and push to `https://github.com/abdulah-0/consultax.git` (Phase 3).

---

## Phase 4: Tax Calculators
**Goal:** Implement accurate tax calculations logic with regression unit tests, and build the calculators user interface.

- [ ] Implement pure calculation logic functions with precise decimal arithmetic in `lib/calculators/*.ts`:
  - Salaried Individuals Calculator
  - Non-Salaried (Business) Individuals Calculator
  - Rental Tax for Individuals Calculator
  - Rental Tax for Companies Calculator
- [ ] Write comprehensive unit tests for calculations verifying slab boundaries against Excel regression fixtures:
  - e.g. Salary gross 150,000 -> Annual Tax 64,080 / Monthly Tax 5,340.
  - e.g. Business income 150,000 -> Annual Tax 230,000 / Monthly Tax 19,166.67.
- [ ] Build UI tab/card component on `/calculators` with live, debounced calculation updates, disclaimers, and conversion CTAs (`Get an Exact Calculation` links to `/contact` with URL query parameters).
- [ ] **Verification:** Run all test suites for calculators; verify responsiveness and tabular number formatting in UI.
- [ ] **Release:** Commit and push to `https://github.com/abdulah-0/consultax.git` (Phase 4).

---

## Phase 5: Admin Dashboard — Authentication & Core Views
**Goal:** Implement the admin application authentication, overview metrics dashboard, and lead management console.

- [ ] Build **Login Page (`/login`)** in `/apps/admin` using custom JWT auth.
- [ ] Build **Dashboard Overview (`/`)**:
  - KPI Cards: New Leads (today/week), Open Leads, Converted, Avg Response Time.
  - 30-day lead volume trend charts and leads-by-service breakdown.
- [ ] Build **Leads List (`/leads`)**: Filterable/sortable table showing leads, with visual overdue flags (>24h since `NEW`).
- [ ] Build **Lead Details (`/leads/[id]`)**: Detailed view with status transition dropdown, assignment dropdown, notes timeline, and quick-contact triggers (WhatsApp, phone, email).
- [ ] Implement in-app notifications (new lead alerts, count badges).
- [ ] **Verification:** Verify role-based routing checks prevent unauthenticated users or lower roles from accessing super-admin metrics.
- [ ] **Release:** Commit and push to `https://github.com/abdulah-0/consultax.git` (Phase 5).

---

## Phase 6: Admin Dashboard — Administration & Reports
**Goal:** Complete settings, user management, services list CRUD, and exportable reports.

- [ ] Build **Services CRUD Page (`/services`)**: Edit services/sub-services dynamically (updating the DB which in turn updates the public site).
- [ ] Build **Users/Staff Management (`/users`)** (Super Admin only): CRUD for inviting/editing/deactivating staff members.
- [ ] Build **Reports Page (`/reports`)**: Date and category filters, and CSV export of lead data.
- [ ] Build **Settings Page (`/settings`)**: Configurable values (e.g. contact email fallback, in-app notification toggles).
- [ ] **Verification:** Verify CSV export output correctness and service editing updates reflect immediately on the public website.
- [ ] **Release:** Commit and push to `https://github.com/abdulah-0/consultax.git` (Phase 6).

---

## Phase 7: Polish, SEO & Final Delivery
**Goal:** Finalize performance optimizations, SEO tags, accessibility audits, and prepare the production build.

- [ ] Conduct accessibility pass (verify keyboard navigability, color contrast ratios).
- [ ] Add SEO tags: semantic tags, per-page custom title/meta description, `LocalBusiness` JSON-LD schema (without office address).
- [ ] Create `sitemap.xml` and `robots.txt` configuration for both subdomains.
- [ ] Optimize load performance (target < 2.5s on mobile 4G, 85+ mobile Lighthouse score).
- [ ] **Verification:** Run final production builds for both apps.
- [ ] **Release:** Final push to `https://github.com/abdulah-0/consultax.git` (Phase 7).
