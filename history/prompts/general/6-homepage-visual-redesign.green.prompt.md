---
id: 6
title: Homepage Visual Redesign
stage: green
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: agent
command: homepage redesign instruction
labels: ["homepage", "landing-page", "ui", "tailwind", "next.js"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/page.tsx
tests:
  - none
---

## Prompt

You are working on a Next.js 16 + Tailwind CSS todo app called "DO IT" located at D:\hackathon-2-phase3\phase-3\frontend.

The homepage already exists at: D:\hackathon-2-phase3\phase-3\frontend\src\app\page.tsx

Read the current homepage file first, then read the design system context below, then improve and rewrite the homepage to make it visually impressive, modern, and complete.

**Design System (must follow exactly):**
- Primary blue: #2563EB
- Gradient: linear-gradient(135deg, #4F8CFF, #3A6EDC)
- Background: #F9FAFB
- Text primary: #111827
- Text secondary: #6B7280
- Borders: #E5E7EB
- Cards: bg-white, rounded-[20px], border border-[#E5E7EB], shadow-sm
- Buttons primary: h-[48px] px-8 bg-[#2563EB] text-white rounded-[14px]
- Inputs: h-[50px] rounded-[14px] border border-[#E5E7EB]
- Navbar height: h-[72px]

**App info:**
- App name: DO IT
- Description: Smart Todo App with AI Assistant
- Routes: /login, /register, /dashboard, /chat
- Logo: white checkmark ✓ in a blue gradient circle
- If authenticated → redirect to /dashboard (already implemented with useEffect)

**What the homepage should include:**
1. Sticky white navbar (h-[72px]) with logo "DO IT", and right-side buttons: "Sign In" (outlined) + "Get Started" (blue filled)
2. Hero section — large headline, subtext, two CTA buttons (Get Started Free + Sign In), and a visual/mockup area
3. Features section — 4 feature cards in a grid: Create Tasks, AI Assistant, Track Progress, Print & Export
4. How it works section — 3 steps numbered: 1. Create account, 2. Add tasks, 3. Let AI help
5. Footer — simple centered text

**Important:**
- Use only inline Tailwind classes (no custom CSS classes from globals.css)
- Use 'use client' directive at top
- Keep existing auth redirect logic (isAuthenticated check)
- All Links use Next.js Link component
- No emojis in text content except where already used (logo ✓, feature icons)
- Write the complete updated file to D:\hackathon-2-phase3\phase-3\frontend\src\app\page.tsx

## Response snapshot

Rewrote `frontend/src/app/page.tsx` with a complete, modern landing page including:
- Sticky navbar with "Sign In" (outlined) and "Get Started" (filled blue) buttons
- Hero with gradient headline, descriptive subtext, dual CTAs, and an inline app mockup showing task items and AI chat bubble
- Features section with 4 icon-driven cards (SVG icons, hover lift + icon scale effects)
- "How It Works" 3-step section with numbered circles and a desktop connector line
- Blue gradient CTA banner encouraging sign-up
- Footer with logo, tagline, and nav links
- All Tailwind inline, `'use client'` directive, auth redirect logic preserved

## Outcome

- Impact: Homepage is now a complete, visually impressive landing page aligned to the design system
- Tests: none (visual UI page, no logic tests applicable)
- Files: frontend/src/app/page.tsx
- Next prompts: visual QA review, mobile responsiveness check, optional animation pass
- Reflection: Replaced emoji icons with inline SVG for feature cards to keep a professional look. Added an app mockup widget as the hero visual to demonstrate the product without requiring screenshots.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): add scroll-based fade-in animations using Tailwind's animate utilities or Framer Motion
