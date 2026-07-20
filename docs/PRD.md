# CONSULTax Associates — Product Requirements Document
**Corporate Website + Admin Lead-Management Dashboard**

- **Version:** 2.0 (incorporates client redlines + finalized tax calculator formulas)
- **Client:** CONSULTax Associates
- **Document Owner:** Abdullah Khalid
- **Date:** 20 July 2026
- **Status:** Approved for development

> This document is written to be handed directly to an AI coding assistant (Claude Code, Cursor, Windsurf, etc.) as the build spec. It contains exact data models, formulas, routes, and copy — implement it literally; do not invent additional business logic not specified here.

---

## 0. What Changed Since v1.0 (Client Redlines)

| # | Change | Impact |
|---|---|---|
| 1 | **No physical office.** CONSULTax operates online-only. | Remove map/office-address block and "Office Hours" from Contact page entirely. No location schema. |
| 2 | **Sales Tax Calculator is removed.** It was never part of the client's actual toolset. | Tax Calculators page ships with **4 calculators**, not 2: Salary Tax, Non-Salary (Business) Tax, Rental Tax (Individuals), Rental Tax (Companies). |
| 3 | **Real calculator formulas supplied** (`Tax_Calculators.xlsx`). | Replace the "configurable estimate" placeholder logic in v1.0 with the exact FBR slab formulas below (Section 5). |
| 4 | **Email fallback.** `info@consultax.com` may not be provisioned yet. | Contact page and footer must display `consultaxassociates@gmail.com` as the email of record unless/until the client confirms `info@consultax.com` is live. Keep this as a single config value, not hardcoded in multiple places. |
| 5 | **Document owner is a named individual** (Abdullah Khalid), not a generic "Product/Design Team." | Cosmetic — no functional impact. |
| 6 | **Notification wording tightened**: dashboard notifications are in-app only for v1 (email notification on new lead is not a committed v1 feature, revisit later). | Build in-app notifications only; leave an extension point for email/WhatsApp push later. |

Everything else from the original PRD (sitemap, lead-capture model, admin dashboard structure, brand palette, non-functional requirements) still applies and is restated below in full so this file is self-contained.

---

## 1. Product Summary

CONSULTax Associates is an online-only professional tax consultancy and management accounting firm (25+ years combined experience). We are building:

1. **Public marketing website** — 5 pages, mobile-first, lead-generation focused.
2. **Admin Dashboard** — separate authenticated web app where staff manage incoming leads.
3. A shared **API-first backend** so a future mobile app can consume the same data without a rewrite.

**Core loop:** Visitor reads about services → submits a form (general inquiry or "Request This Service") or uses a tax calculator → submission is stored as a `Lead` → Lead appears instantly in the Admin Dashboard → staff triages, contacts the client via WhatsApp/email/phone, and updates status through to conversion.

---

## 2. Tech Stack (build with this unless a hard blocker is found)

| Layer | Choice |
|---|---|
| Frontend (public site) | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS |
| Frontend (admin dashboard) | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS — separate app, shared UI package if using a monorepo |
| Backend / API | Node.js — Next.js API routes or a standalone Express/Fastify service, REST, API-first (no logic embedded only in UI) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth (dashboard) | JWT-based session (e.g., NextAuth with Credentials provider, or custom JWT) — must be token-based so a future mobile app can reuse it, not cookie-only server sessions |
| Hosting | Public site: Vercel-class host. Dashboard + API + DB: managed cloud (Railway/Render/AWS/DigitalOcean) |
| Email | Transactional provider (Resend/SendGrid) for lead confirmation emails |
| Deployment domains | `consultax.com` (public site), `admin.consultax.com` (dashboard) — separate subdomains, dashboard never indexed (`robots.txt: Disallow: /` + `noindex` meta) |

Monorepo structure suggestion:
```
/apps
  /web        -> public marketing site
  /admin      -> admin dashboard
  /api        -> shared backend (or API routes live inside /web if simpler for v1)
/packages
  /ui         -> shared design-system components (buttons, cards, badges)
  /config     -> shared Tailwind config, brand tokens
  /db         -> Prisma schema + client, shared by /api and /admin
```
If a simpler single-repo setup is preferred for v1, it's acceptable to run the public site and the API from one Next.js app and the admin dashboard as a second Next.js app in the same repo, both pointing at the same Prisma/Postgres database. The non-negotiable constraint is: **the public site never talks directly to the database — it always goes through the API layer**, so that layer can later serve a mobile app too.

---

## 3. Design System

### 3.1 Brand Color Tokens
Derived from the CONSULTax logo (navy chevron, orange ribbon, charcoal wordmark). Define these as CSS variables / Tailwind theme tokens — do not hardcode hex values in components.

```css
:root {
  --color-navy: #1F2B7A;        /* primary brand — header, nav, primary buttons, links */
  --color-navy-dark: #141C52;   /* footer bg, dark sections, hero overlays */
  --color-orange: #E8622C;      /* accent CTA only — "Request a Consultation", hover states */
  --color-charcoal: #414042;    /* body copy, form labels */
  --color-cloud: #F4F5FA;       /* section backgrounds, card fills */
  --color-white: #FFFFFF;
  --color-success: #2E7D32;     /* form success state */
  --color-error: #C0392B;       /* form validation errors */
  --color-rule: #D9DBE9;        /* borders/dividers */
}
```

Tailwind config equivalent:
```js
theme: {
  extend: {
    colors: {
      navy: { DEFAULT: '#1F2B7A', dark: '#141C52' },
      orange: '#E8622C',
      charcoal: '#414042',
      cloud: '#F4F5FA',
      success: '#2E7D32',
      error: '#C0392B',
    }
  }
}
```

**Usage rule:** Orange is reserved exclusively for primary calls-to-action and key highlights (badges, active nav underline). Never use orange for large background fills or body text — it must stay rare enough to keep its urgency.

### 3.2 Typography
- Headings: Poppins or Montserrat (600/700 weight).
- Body: Inter or Source Sans Pro (400/500 weight).
- Calculator numeral output: tabular-nums, monospace-aligned figures.

### 3.3 UI Principles
- Navy = structure (header, footer, nav, links).
- Orange = action only.
- Card-based layout, generous whitespace, rounded-lg (8–12px) corners on cards/buttons.
- Admin dashboard: mostly Cloud/White surfaces; Navy/Orange reserved for status badges, chart accents, and primary buttons — keep the data-dense UI calm.

---

## 4. Public Website — Pages & Components

### 4.1 Sitemap (5 pages)

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, trust bar, services grid, CTA band, footer |
| `/about` | About Us | Firm narrative, Why Choose Us, team placeholder |
| `/services` | Services | 6 categories + sub-services, "Request This Service" CTA per category |
| `/calculators` | Tax Calculators | 4 calculators (Section 5) |
| `/contact` | Contact Us | General inquiry form, contact details, social links — **no map, no office hours** |

### 4.2 Home (`/`)
- **Hero:** Firm name + tagline "Professional Tax Consultancy, Management Accounting & Corporate Compliance." Two CTAs: `Request a Consultation` (primary, orange, → `/contact`) and `Explore Services` (secondary, navy outline, → `/services`).
- **Trust bar:** 25+ Years of Experience · Experienced Tax Consultants · Complete Confidentiality · Affordable Consultancy.
- **Services grid:** 6 clickable cards → Income Tax, Sales Tax, Tax Planning, SECP Compliance, Management Accounting, Internal Audit — each links to `/services#<anchor>`.
- **Sticky WhatsApp button:** floating action button, bottom-right, all pages, `https://wa.me/923345371105`.
- **Footer** (all pages): firm name, tagline, social links, `© {currentYear} CONSULTax Associates. All Rights Reserved.` — year must be computed at render time, not hardcoded.

### 4.3 About Us (`/about`)
- Firm description (verbatim, Section 8 has exact copy).
- "Why Choose Us" — 6-item checklist, orange check icon.
- Team/credentials section: build as a reusable `<TeamMember />` component list, ship empty/placeholder-safe (i.e., section renders cleanly with zero members, so it can be populated later without a redeploy blocker — pull from CMS/DB, not hardcoded JSX).

### 4.4 Services (`/services`)
Six category sections, each an anchor target (`#income-tax`, `#sales-tax`, `#tax-planning`, `#secp-compliance`, `#management-accounting`, `#internal-audit`), plus a 7th non-anchored "Other Services" block. Full content in Section 8.2.

Each category card/section has a **"Request This Service"** button that opens the lead form (modal or `/contact?service=<slug>`) with the `service` field pre-filled and locked/pre-selected in the dropdown.

### 4.5 Tax Calculators (`/calculators`)
Four independent calculator widgets on one page (tabs or stacked cards — tabs recommended for mobile). Full formulas in Section 5.

Each calculator:
- Live-updates result as the user types (no submit button required, but debounce input).
- Shows a persistent disclaimer: *"This is an estimate for informational purposes only and does not constitute tax advice. Actual liability may vary. Consult our team for an exact calculation."*
- Ends with CTA: `Get an Exact Calculation from Our Consultants` → `/contact?source=calculator&calculator=<name>`.

### 4.6 Contact Us (`/contact`)
- **Form fields:** Full Name*, Phone*, Email*, Service of Interest (dropdown, optional pre-fill from query param), Message* (required here; optional on service-request variant).
- **Contact details:** WhatsApp `0334-5371105`, Email — see Section 0 item 4 (config-driven, gmail fallback).
- **Social links** (new tab): Facebook `consultax.pak`, Instagram `consultax.pk`, Threads `consultax.pk`, X `consul_tax`.
- **No map. No office hours. No address field.** (Explicitly removed per client — online-only firm.)

---

## 5. Tax Calculators — Exact Formulas

Source: client-supplied `Tax_Calculators.xlsx`. Implement these as pure functions (e.g., `lib/calculators/*.ts`) with unit tests covering each slab boundary. **Do not round intermediate values**; round only the final displayed rupee amount.

All four calculators take **monthly** input from the user and compute **annual income = monthly × 12** first, then apply the annual slab table, then divide by 12 for the displayed monthly tax.

### 5.1 Salary Tax Calculator (salaried individuals)

**Inputs:**
- `monthlyBasicPay` (number, required)
- `monthlyMedicalAllowance` (number, required)
- `monthlyGrossPay` (number, required)

**Calculation:**
```
annualBasicPay        = monthlyBasicPay * 12
annualMedicalAllowance = monthlyMedicalAllowance * 12
tenPctOfBasic          = annualBasicPay * 0.10
exemptMedicalAllowance = MIN(tenPctOfBasic, annualMedicalAllowance)
annualGrossPay          = monthlyGrossPay * 12
taxableIncome           = annualGrossPay - exemptMedicalAllowance
annualTax               = salarySlabTax(taxableIncome)     // see slab table below
monthlyTax              = annualTax / 12
```

**Slab table `salarySlabTax(X)`** (X = taxable income after medical exemption):
| Taxable Income (annual, PKR) | Tax |
|---|---|
| ≤ 600,000 | 0 |
| 600,001 – 1,200,000 | (X − 600,000) × 1% |
| 1,200,001 – 2,200,000 | 6,000 + (X − 1,200,000) × 11% |
| 2,200,001 – 3,200,000 | 116,000 + (X − 2,200,000) × 20% |
| 3,200,001 – 4,100,000 | 316,000 + (X − 3,200,000) × 25% |
| 4,100,001 – 5,600,000 | 541,000 + (X − 4,100,000) × 29% |
| 5,600,001 – 7,000,000 | 976,000 + (X − 5,600,000) × 32% |
| > 7,000,000 | 1,424,000 + (X − 7,000,000) × 35% |

Reference values to validate implementation against (from the source workbook, do not ship these as test-only — use as regression test fixtures):
- Monthly Basic Pay 65,000 / Medical Allowance 6,000 / Gross Pay 150,000 → Taxable Income 1,728,000 → **Annual Tax 64,080** → **Monthly Tax 5,340**.

### 5.2 Tax Calculator — Non-Salary (business / non-salaried individuals)

**Input:** `monthlyIncome` (number, required)

**Calculation:**
```
annualIncome = monthlyIncome * 12
annualTax    = nonSalarySlabTax(annualIncome)
monthlyTax   = annualTax / 12
```

**Slab table `nonSalarySlabTax(X)`:**
| Annual Income (PKR) | Tax |
|---|---|
| ≤ 600,000 | 0 |
| 600,001 – 1,200,000 | (X − 600,000) × 15% |
| 1,200,001 – 1,600,000 | 90,000 + (X − 1,200,000) × 20% |
| 1,600,001 – 3,200,000 | 170,000 + (X − 1,600,000) × 30% |
| 3,200,001 – 5,600,000 | 650,000 + (X − 3,200,000) × 40% |
| > 5,600,000 | 1,610,000 + (X − 5,600,000) × 45% |

Regression fixture: Monthly Income 150,000 → Annual Income 1,800,000 → **Annual Tax 230,000** → **Monthly Tax 19,166.67**.

### 5.3 Rental Tax for Individuals

**Input:** `monthlyRentalIncome` (number, required)

**Calculation:**
```
annualRentalIncome = monthlyRentalIncome * 12
annualTax          = rentalIndividualSlabTax(annualRentalIncome)
monthlyTax          = annualTax / 12
```

**Slab table `rentalIndividualSlabTax(X)`:**
| Annual Rental Income (PKR) | Tax |
|---|---|
| ≤ 300,000 | 0 |
| 300,001 – 600,000 | (X − 300,000) × 5% |
| 600,001 – 2,000,000 | 15,000 + (X − 600,000) × 10% |
| > 2,000,000 | 155,000 + (X − 2,000,000) × 25% |

Regression fixture: Monthly Rental Income 150,000 → Annual 1,800,000 → **Annual Tax 135,000** → **Monthly Tax 11,250**.

### 5.4 Rental Tax for Companies

**Input:** `monthlyRentalIncome` (number, required)

**Calculation:** flat rate, no slabs.
```
annualRentalIncome = monthlyRentalIncome * 12
annualTax           = annualRentalIncome * 0.15
monthlyTax           = annualTax / 12
```

Regression fixture: Monthly Rental Income 150,000 → Annual 1,800,000 → **Annual Tax 270,000** → **Monthly Tax 22,500**.

### 5.5 Implementation notes
- Build each slab function with a simple ordered `if/else if` chain matching the boundaries above exactly (they are inclusive on the upper bound as written, e.g. "≤ 600,000").
- Store slab tables as data structures (array of `{ upTo, base, rate, prevThreshold }`), not inline magic numbers repeated across the codebase, so a future admin-editable rates feature (Section 7.4) can read/write the same structure.
- All four calculators must never produce a negative tax or a negative taxable income (clamp at 0).
- Currency formatting: PKR, thousands separator, no decimal places for annual figures, 2 decimal places only where the monthly division produces a fraction (e.g., 19,166.67).

---

## 6. Lead Capture — Data Model & Flow

### 6.1 `Lead` schema (Prisma)

```prisma
model Lead {
  id            String      @id @default(cuid())
  fullName      String
  phone         String
  email         String
  serviceInterest String?   // one of the ServiceCategory slugs, or "General Inquiry"
  message       String?
  sourcePage    String      // e.g. "Home", "Services — Income Tax", "Contact", "Calculator — Salary Tax"
  status        LeadStatus  @default(NEW)
  assignedToId  String?
  assignedTo    User?       @relation(fields: [assignedToId], references: [id])
  notes         LeadNote[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum LeadStatus {
  NEW
  CONTACTED
  IN_PROGRESS
  CONVERTED
  CLOSED
  NOT_INTERESTED
}

model LeadNote {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  body      String
  createdAt DateTime @default(now())
}

model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  password  String     // hashed
  role      UserRole   @default(CONSULTANT)
  leads     Lead[]
  notes     LeadNote[]
  createdAt DateTime   @default(now())
}

enum UserRole {
  SUPER_ADMIN
  CONSULTANT
  FRONT_DESK
}

model ServiceCategory {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?
  order       Int      @default(0)
  subServices SubService[]
  active      Boolean  @default(true)
}

model SubService {
  id                String          @id @default(cuid())
  categoryId        String
  category          ServiceCategory @relation(fields: [categoryId], references: [id])
  name              String
  order             Int             @default(0)
}
```

### 6.2 Required validation (all forms)
- `fullName`: required, min 2 chars.
- `phone`: required, basic PK phone format tolerance (accept `03XX-XXXXXXX` or `+92...`).
- `email`: required, valid email format.
- `message`: required on the Contact page general form; optional on per-service "Request This Service" form.
- Server-side validation + sanitization on every field (do not trust client-side only).
- Rate-limit the public lead-submission endpoint (e.g., max 5 submissions per IP per 10 minutes) to deter spam/bot abuse.

### 6.3 API endpoint (public → backend)

```
POST /api/leads
Body: {
  fullName: string,
  phone: string,
  email: string,
  serviceInterest?: string,
  message?: string,
  sourcePage: string
}
Response 201: { id, status: "NEW" }
```

On success:
1. Persist `Lead` with `status = NEW`.
2. Send confirmation email to the submitter (transactional template — see Section 6.4).
3. Lead becomes immediately visible in the Admin Dashboard "New" queue (poll or websocket — polling every 30–60s is acceptable for v1; websockets/SSE is a nice-to-have, not required).

### 6.4 Confirmation email (submitter-facing)
Subject: `We've received your request — CONSULTax Associates`
Body: Thank the user by name, restate the service they inquired about, note a team member will respond within 24 hours, include WhatsApp number as a fast-track option.

### 6.5 On-page success state
Replace the form with a confirmation panel: checkmark icon, "Thank you — we've received your request," WhatsApp quick-contact button as an alternative.

---

## 7. Admin Dashboard

Separate app at `admin.consultax.com`. Must be `noindex`, not linked from the public site's navigation, and behind authentication for every route except `/login`.

### 7.1 Authentication
- Email + password login, JWT-based session (stored httpOnly cookie for web; the same token issuance endpoint should work for a future mobile client too — do not tie auth exclusively to browser cookies at the API layer, issue a real JWT that a mobile app could also store).
- Password reset via email.
- Roles: `SUPER_ADMIN`, `CONSULTANT`, `FRONT_DESK` — enforce role checks on every API route, not just hidden UI.

| Role | Can do |
|---|---|
| `FRONT_DESK` | View/triage all leads, assign, add notes, change status |
| `CONSULTANT` | View/manage leads assigned to them (and optionally all, if the firm wants shared visibility — default to "all" for v1 given small team size), add notes, change status |
| `SUPER_ADMIN` | Everything above + manage users, manage service categories, view reports, view dashboard-wide analytics |

### 7.2 Pages

| Route | Purpose |
|---|---|
| `/login` | Auth |
| `/` (Dashboard Overview) | KPI cards: New Leads Today/This Week, Open Leads, Converted Leads, Avg Response Time. 30-day lead volume trend chart. Leads-by-service breakdown chart. |
| `/leads` | Filterable/sortable table: status, service, date range, assigned staff. Columns: Name, Service, Status badge, Source, Submitted date, Assigned to. |
| `/leads/[id]` | Full detail: submitted fields, status dropdown, assignment dropdown, notes/timeline (chronological), quick-contact buttons (`tel:`, `https://wa.me/92...`, `mailto:`). |
| `/services` | CRUD for `ServiceCategory` / `SubService` — feeds both the public Services page and the lead form's dropdown, so they never fall out of sync. |
| `/users` | `SUPER_ADMIN` only — invite/edit/deactivate staff, assign roles. |
| `/reports` | Date-range + service + status filters, CSV export. |
| `/settings` | Notification preferences (in-app for v1), branding placeholders. |

### 7.3 Lead status flow
`NEW → CONTACTED → IN_PROGRESS → CONVERTED | CLOSED | NOT_INTERESTED` — enforce as a fixed enum (Section 6.1), render as color-coded badges (e.g., New = orange, In Progress = navy, Converted = success green, Closed/Not Interested = grey).

### 7.4 Notifications (v1 scope)
- **In-app only**: a badge/counter and toast when a new lead arrives while a staff member is logged in; an "overdue" visual flag on any `NEW` lead older than 24 hours in the `/leads` table.
- Email/WhatsApp push notification to staff on new-lead arrival is **not required for v1** — build the notification service as its own module so it can add an email channel later without touching lead-creation logic.

### 7.5 Services & calculator-rate management (forward-looking, build the data model now even if the admin UI ships minimal in v1)
- `ServiceCategory`/`SubService` tables (Section 6.1) must back both the public Services page and the Contact/Request form dropdown from the same source — no duplicated hardcoded lists between the site and the dashboard.
- Tax slab tables (Section 5) should live in a config table (e.g., `CalculatorSlab`) rather than hardcoded in the frontend, so a `SUPER_ADMIN` can eventually update rates when FBR changes them annually, without a code deploy. For v1 it is acceptable to seed this table from the constants in Section 5 and expose a read-only admin view; a full editing UI can be Phase 1.1 if time-boxed.

---

## 8. Content — Verbatim Copy Blocks

Use these exactly; do not paraphrase.

### 8.1 About Us
> CONSULTax Associates is a professional tax consultancy and management accounting firm committed to providing reliable, practical, and result-oriented financial solutions.
>
> With over 25 years of combined professional experience, our team of qualified tax consultants and accounting professionals assists individuals, businesses, companies, and organizations in meeting their taxation and regulatory compliance requirements.
>
> We believe in professionalism, integrity, confidentiality, and timely service delivery. Our objective is to help clients remain fully compliant with applicable tax laws while minimizing tax risks through proper planning and expert guidance.

**Why Choose Us** (checklist):
- 25+ Years Professional Experience
- Experienced Tax Consultants
- Reliable & Timely Services
- Affordable Consultancy
- Complete Confidentiality
- Personalized Client Support

### 8.2 Services (6 categories + 1 additional block)

**1. Income Tax Services**
- FBR Registration (NTN)
- Income Tax Return Filing
- Revision of Income Tax Returns
- Reply to Tax Notices
- Tax Refund Processing

**2. Sales Tax Services**
- Sales Tax Registration
- Monthly Sales Tax Returns
- Sales Tax Compliance
- Reply to Sales Tax Notices

**3. Tax Planning**
> Our experts provide tax planning solutions to help individuals and businesses legally optimize their tax liabilities while ensuring full compliance with tax regulations.

**4. SECP Compliance**
- Company Incorporation
- Submission of Annual Returns
- Corporate Compliance
- Statutory Filings

**5. Management Accounting Services**
- Accounts Management
- Computerized Accounting
- Bookkeeping
- Preparation of Financial Statements
- Financial Reporting
- Business Performance Analysis

**6. Internal Audit**
> We conduct comprehensive internal audits to strengthen internal controls, improve operational efficiency, identify financial risks, and ensure regulatory compliance.

**Other Services**
- PSEB Registration
- Website Development / Android Apps Development

### 8.3 Contact Details
- WhatsApp: `0334-5371105` (link as `https://wa.me/923345371105`)
- Email: `consultaxassociates@gmail.com` (fallback — swap to `info@consultax.com` once the client confirms it's live; keep this value in a single config/env constant, e.g. `NEXT_PUBLIC_CONTACT_EMAIL`)
- **No physical address. No map. No office hours.**

### 8.4 Social Channels (open in new tab, `rel="noopener noreferrer"`)
- Facebook: `consultax.pak`
- Instagram: `consultax.pk`
- Threads: `consultax.pk`
- X: `consul_tax`

### 8.5 Footer
> CONSULTax Associates
> Professional Tax Consultancy • Management Accounting • Corporate Compliance
> © {currentYear} CONSULTax Associates. All Rights Reserved.

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Public pages load < 2.5s on 4G; Lighthouse mobile performance score 85+ |
| Responsiveness | Mobile-first; majority of traffic expected via WhatsApp/social referral on mobile |
| SEO | Semantic HTML, per-page meta title/description, `LocalBusiness`/`ProfessionalService` JSON-LD (omit `address` field entirely — no physical location), `sitemap.xml`, `robots.txt` |
| Security | HTTPS everywhere; server-side input validation/sanitization; rate limiting on `/api/leads`; admin dashboard behind auth + `noindex` |
| Accessibility | WCAG 2.1 AA color contrast; full keyboard navigation, especially forms and calculators |
| Data Privacy | Lead PII access restricted by role; passwords hashed (bcrypt/argon2); no PII in logs |
| Scalability | API layer must support additional consumers (future mobile app) without redesign |
| Availability | 99.5%+ uptime target, both apps |
| Browser Support | Latest 2 versions Chrome/Safari/Edge/Firefox; iOS Safari + Android Chrome |

---

## 10. Assumptions & Open Items

- `info@consultax.com` may not be provisioned yet — ship with the Gmail fallback (Section 8.3) behind a single config value.
- No office address will ever be collected for this build — do not leave a dormant "address" field in the schema or UI.
- Team member bios/photos for About Us are not yet supplied — component must render cleanly with zero entries.
- FBR tax slabs (Section 5) are current as of the client's supplied workbook; the client is responsible for notifying the team of annual rate changes; the data structure in Section 7.5 should make updating these low-effort.
- Email/WhatsApp push notifications for staff on new-lead arrival are deferred past v1 — architecture should not block adding them later.

---

## 11. Build Order (suggested milestones for the AI coding agent)

1. **Scaffold** monorepo/two-app structure, Tailwind theme with brand tokens (Section 3).
2. **Database & API**: Prisma schema (Section 6.1, 7.5), `/api/leads` POST endpoint with validation + rate limiting, auth endpoints for the dashboard.
3. **Public site — static pages**: Home, About, Services, Contact (forms wired to `/api/leads`), using verbatim copy (Section 8).
4. **Tax Calculators page**: implement the 4 pure calculation functions (Section 5) with unit tests against the regression fixtures, then wire to UI.
5. **Admin Dashboard**: login, Dashboard Overview, Leads table + detail view, status/assignment workflow.
6. **Admin — Services & Users management** pages.
7. **Polish**: responsive QA, accessibility pass, SEO metadata, `sitemap.xml`/`robots.txt`, deploy.
