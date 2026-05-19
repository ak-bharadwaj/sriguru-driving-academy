# Sri Guru Driving Academy — Architecture Bible

## Read this at the start of EVERY Claude Code session.

---

## Design Language (Non-Negotiable)

### Color Tokens (use only these)
```css
--color-void: #07090F;        /* Page background */
--color-surface: #0D1117;     /* Card/panel background */
--color-border: rgba(255,255,255,0.07); /* All borders */
--color-primary: #2563EB;     /* Electric blue - actions */
--color-accent: #F59E0B;      /* Amber - XP, rewards, highlights */
--color-success: #10B981;     /* Green - completed, attendance */
--color-danger: #EF4444;      /* Red - warnings, errors */
--color-text-1: #F1F5F9;      /* Primary text */
--color-text-2: #94A3B8;      /* Secondary text */
--color-text-3: #475569;      /* Muted text */
```

### Typography
- Headings: `Outfit` (weight 600–800)
- Body: `DM Sans` (weight 400–500)
- Mono/data: `JetBrains Mono`
- Load via next/font, not CDN

### Spacing Scale (named, not arbitrary)
```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 32px
--space-xl: 64px
--space-section: 120px
```

### Animation Curves (CSS custom properties)
```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-snap: cubic-bezier(0.87, 0, 0.13, 1);
```

---

## Anti-Pattern Rules (NEVER violate)

### Layout
- NO sidebar navigation on student portal. Use top orbital nav.
- NO generic card grid (3-col equal cards). Use asymmetric layouts.
- NO full-width hero with centered text + button. That's a template.
- NO ShadCN default components without heavy customization.

### Visual
- NO box-shadow on cards. Use border: 1px solid var(--color-border) instead.
- NO purple/violet gradients. Use primary + accent only.
- NO glassmorphism unless with backdrop-filter AND a real blurred background behind it.
- NO emoji as icons. Use Lucide React icons OR custom SVGs from /lib/icons/.

### Performance
- Every list over 20 items MUST use @tanstack/virtual.
- All animations MUST use transform and opacity ONLY (no layout-triggering properties).
- Framer Motion: use layoutId for shared transitions, viewport prop for scroll reveals.
- Images: always use next/image with proper sizes prop.

### Road Signs & Symbols
- Road signs live in /lib/icons/road-signs.tsx as named SVG components.
- NEVER use emoji or text characters for road signs.
- NEVER use an icon library that doesn't have actual road sign shapes.

---

## File Structure
```
/app
  /(public)       → Landing page, booking
  /(student)      → Student portal (RBAC protected)
  /(instructor)   → Instructor portal (RBAC protected)
  /(admin)        → Admin portal (RBAC protected)
  /api            → Next.js API routes
/components
  /ui             → Base design system components
  /student        → Student-specific components
  /instructor     → Instructor-specific components
  /admin          → Admin-specific components
  /shared         → Cross-portal components
/lib
  /icons          → road-signs.tsx, custom SVGs
  /stores         → Zustand stores
  /db             → Prisma client
  /auth           → NextAuth config
  /utils          --> Helpers
/prisma
  schema.prisma
```

---

## Zustand Stores (one per domain)
- `useXPStore` → currentXP, level, streakDays, badges[], pendingToasts[]
- `useSessionStore` → upcoming sessions, active session state
- `useRTOStore` → quiz state, weak topics, progress
- `useStudentStore` → profile, roadmap progress, attendance

---

## Database Rules
- Always use Prisma with connection pooling (pgbouncer=true in Neon URL)
- Never fetch more than 50 rows without pagination
- Use select: {} to only fetch needed fields (never findMany without select)
- Index: userId on every student-related table

---

## Portal Feel Matrix
| Portal     | Feel                        | Primary Motion    | Layout Pattern        |
|------------|-----------------------------|-------------------|-----------------------|
| Student    | Gamified learning universe  | Spring animations | Asymmetric, orbital   |
| Instructor | Professional coaching tool  | Smooth, precise   | Split-panel workspace |
| Admin      | Command center              | Snap, data-driven | Dense grid, stats-led |
| Public     | Premium brand experience    | Cinematic scroll  | Full-bleed, editorial |
