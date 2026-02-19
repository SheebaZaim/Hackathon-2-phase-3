---
id: 3
title: Master Design Frontend Update All Pages
stage: general
date: 2026-02-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 001-constitution-alignment
user: user
command: /nextjs-skills
labels: ["frontend","design-system","ui","tailwind","nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/globals.css
  - frontend/src/app/page.tsx
  - frontend/src/app/dashboard/page.tsx
  - frontend/src/app/chat/page.tsx
  - frontend/src/components/chat/MessageInput.tsx
tests:
  - manual visual inspection of all pages
---

## Prompt

update frontend according to this prompt or call frontend agent MASTER DESIGN PROMPT (Homepage + All Inner Pages)

🌟 Global Design System (Apply to ALL pages)
Design a modern AI-powered Todo SaaS app with a clean, soft, rounded UI.

🎨 Theme
Primary gradient: linear-gradient(135deg, #4F8CFF, #3A6EDC)
Accent: #2563EB
Background light: #F9FAFB
Card background: #FFFFFF
Border color: #E5E7EB
Text primary: #111827
Text secondary: #6B7280

🧱 Spacing System: 8px scale, Container max-width: 1200px

🔘 Buttons: Height 48px, Border radius 14px, Font size 14px, Font weight 600

🧾 Inputs: Height 50px, Border radius 14px, Border 1px solid #E5E7EB

🏠 HOMEPAGE: Navbar with Print List + AI Assistant + Get Started. Hero 48px heading, 600px max-width subtext. Feature cards.

📊 DASHBOARD: Top navbar 72px + Sidebar 280px + Main content. Sidebar with rounded active items 44px. Add Task card 600px centered, 24px radius, 40px padding.

🤖 AI ASSISTANT PAGE: Left sidebar conversations + Right chat panel max-width 800px. Message bubbles blue/grey 18px radius. Input bar 56px height, send icon 20px.

## Response snapshot

Updated 5 files with the design system:
1. globals.css — Fixed body background from blue gradient to #F9FAFB, added fade-in animation
2. page.tsx (homepage) — New navbar with Print List + AI Assistant + Get Started buttons, 48px hero heading, 600px subtext max-width, fade-in animation
3. dashboard/page.tsx — Added 280px sidebar with Tasks/AI Assistant/Print List nav items (44px height, SVG icons), Add Task card (600px, 24px radius, p-10 = 40px), 72px header
4. chat/page.tsx — Sidebar always visible (removed toggle), max-w-800px chat panel centered
5. MessageInput.tsx — Send button replaced with SVG send icon (20px)

## Outcome

- ✅ Impact: All pages now follow unified design system with #F9FAFB background, proper sidebar layouts, and consistent button/input styling
- 🧪 Tests: Manual visual testing required
- 📁 Files: 5 files updated
- 🔁 Next prompts: Commit all changes, push to remote
- 🧠 Reflection: Login/Register pages were already well-styled and required no changes. TaskFormComponent already had correct input specs (h-50px, rounded-14px). TaskListComponent table layout kept as-is (functional and correct).

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment: Add responsive mobile sidebar toggle for dashboard
