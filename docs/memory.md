# Development Memory Log — CONSULTax Associates

This document tracks the current state of the project, features implemented, decisions made, and upcoming tasks.

## Project Status Overview
- **Repository Remote:** `https://github.com/abdulah-0/consultax.git`
- **Current Phase:** Phase 5 (Admin Dashboard — Authentication & Core Views) — In Progress
- **Last Updated:** 20 July 2026

---

## Log of Completed Features & Actions

### 20 July 2026
- **Action:** Initialized Git repository in the project workspace.
- **Action:** Set git default branch name to `main`.
- **Action:** Configured Git remote origin pointing to `https://github.com/abdulah-0/consultax.git`.
- **Action:** Created `phases.md` mapping out the 7 development phases based on the requirements from `docs/PRD.md`.
- **Action:** Initialized NPM workspaces monorepo structure with `/apps/web`, `/apps/admin`, `/packages/config`, and `/packages/db`.
- **Action:** Created shared `@consultax/config` containing Tailwind v4 design tokens and theme settings.
- **Action:** Created shared `@consultax/db` containing the Prisma schema definitions.
- **Action:** Scaffolded Next.js projects for public marketing (`/apps/web`) and admin dashboard (`/apps/admin`).
- **Action:** Verified local development workspaces configuration and successfully built both applications.
- **Action:** Created `.env.example` configuration template file.
- **Action:** Installed `bcryptjs` and `jose` authentication dependencies.
- **Action:** Developed seed script `packages/db/prisma/seed.js` pre-populating FBR service categories, subservices, and admin roles.
- **Action:** Implemented public `POST /api/leads` route with input verification (PK phones, emails) and in-memory rate limiting.
- **Action:** Created admin auth endpoints: `/api/auth/login` (issues JWT in HTTP-Only cookie), `/api/auth/logout` (expires session), and `/api/auth/me` (reads profile).
- **Action:** Completed TypeScript checks and verified full workspace builds.
- **Action:** Copied logo asset to public folders of both applications.
- **Action:** Created responsive `Navbar` and dynamic `Footer` with dynamic copyright calculations.
- **Action:** Implemented floating `WhatsAppButton` CTA linking to the firm's direct number.
- **Action:** Configured Google Fonts (Poppins & Inter) in Next.js App layout.
- **Action:** Developed all core website pages: Home (`/`), About (`/about`), Services (`/services`), and Contact Us (`/contact`).
- **Action:** Wired service card CTA actions to pre-fill the contact form dropdown via URL query parameters.
- **Action:** Developed a success checkmark and WhatsApp redirect confirmation panel after submitting a lead.
- **Action:** Wrapped parameter readers in a Suspense boundary to ensure successful static page generation.
- **Action:** Defined modular FBR slab rate models and generic tax math engines in `apps/web/lib/calculators/rates.ts`.
- **Action:** Developed formulas for 4 calculators: Salary, Business, Rental (Individual), and Rental (Company).
- **Action:** Implemented a currency formatting utility `formatPKR` support for comma separation and custom decimal points.
- **Action:** Created a custom boundary test runner `run-tests.ts` and executed it successfully.
- **Action:** Developed the tabbed interactive Tax Calculators Page (`/calculators`).
- **Action:** Linked the calculator CTAs to pass calculated monthly estimates to the contact page form.
