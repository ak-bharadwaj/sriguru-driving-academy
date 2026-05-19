# Sri Guru Driving Academy — Complete Build Prompt System
### Every prompt, in order, ready to paste into Claude Code

---

## HOW TO USE THIS DOCUMENT

1. Start every Claude Code session by pasting the **Session Opener** first (see below)
2. Then paste the session prompt for that day
3. Never skip sessions — each one depends on the previous
4. After every session run the **Session Closer** (see below)

---

## MANDATORY SESSION OPENER
### Paste this at the start of EVERY Claude Code session

```
Read ARCHITECTURE.md in the repo root — this is your constraint bible.
Read prisma/schema.prisma to understand all data models.
Run: git log --oneline -10
Run: npx tsc --noEmit
Run: npx prisma validate

Report back what was last built and any errors found.
Only then proceed with today's task below.
```

---

## MANDATORY SESSION CLOSER
### Paste this at the end of EVERY Claude Code session

```
Before finishing:
1. Run npx tsc --noEmit — fix every TypeScript error
2. Run npx prisma validate — confirm schema is valid
3. Check every new component against ARCHITECTURE.md anti-pattern rules
4. List every file created or modified this session
5. Commit everything: git add -A && git commit -m "[Session X] description"
```

---

## PRE-BUILD STEP 1 — ARCHITECTURE.md
### Create this file in your repo root BEFORE any session

```markdown
# Sri Guru Driving Academy — Architecture Bible
## Read this at the start of EVERY Claude Code session.

---

## Design Tokens (use ONLY these — no arbitrary Tailwind values)

### Colors
```css
--color-void: #07090F;
--color-surface: #0D1117;
--color-surface-2: #131920;
--color-border: rgba(255,255,255,0.07);
--color-border-hover: rgba(255,255,255,0.14);
--color-primary: #2563EB;
--color-primary-hover: #1D4ED8;
--color-accent: #F59E0B;
--color-accent-hover: #D97706;
--color-success: #10B981;
--color-danger: #EF4444;
--color-warning: #F59E0B;
--color-text-1: #F1F5F9;
--color-text-2: #94A3B8;
--color-text-3: #475569;
```

### Typography
- Headings: `Outfit` weight 600–800
- Body: `DM Sans` weight 400–500
- Data/mono: `JetBrains Mono`
- Load via next/font ONLY — never CDN

### Named Spacing (use these names in code, never raw px)
```
space-xs: 4px    space-sm: 8px    space-md: 16px
space-lg: 32px   space-xl: 64px   space-section: 120px
space-card: 28px
```

### Animation Curves
```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-snap:   cubic-bezier(0.87, 0, 0.13, 1);
```

---

## Anti-Pattern Rules — NEVER violate

### Layout
- NO sidebar nav on student portal — use top orbital nav pill
- NO equal 3-column card grids — use asymmetric layouts
- NO centered hero text + button — that is a template
- NO ShadCN default components without heavy customization

### Visual
- NO box-shadow on cards — use `border: 1px solid var(--color-border)` ONLY
- NO purple/violet gradients — primary + accent only
- NO emoji as icons — use Lucide React or /lib/icons/ SVGs
- NO Inter, Roboto, Arial as primary font

### Performance
- Every list > 20 items MUST use @tanstack/virtual — no exceptions
- ALL animations MUST use transform and opacity ONLY
- Framer Motion: use layoutId + viewport prop — never scroll listeners
- All images: next/image with sizes prop always set

### Road Signs
- Road signs live ONLY in /lib/icons/road-signs.tsx as SVG components
- NEVER use emoji or styled divs for road signs
- NEVER use an icon library for road sign shapes

### Database
- EVERY Prisma findMany MUST have select:{} — never fetch all fields
- DATABASE_URL must have ?pgbouncer=true&connection_limit=1
- NEVER raw SQL — all queries via Prisma ORM
- NEVER fetch > 50 rows without pagination

---

## File Structure
```
/app
  /(public)          landing page, booking, contact
  /(auth)            login, forgot-password
  /(student)         student portal (RBAC protected)
  /(instructor)      instructor portal (RBAC protected)
  /(admin)           admin portal (RBAC protected)
  /api               Next.js API routes
/components
  /ui                base design system (buttons, badges, etc.)
  /student           student-specific components
  /instructor        instructor-specific components
  /admin             admin-specific components
  /shared            cross-portal (XPToast, NotificationBell, etc.)
/lib
  /icons             road-signs.tsx, custom SVGs
  /stores            Zustand stores
  /db                Prisma client singleton
  /auth              NextAuth config
  /utils             helpers, rate-limit, validators
  /hooks             custom React hooks
/prisma
  schema.prisma
  seed.ts
```

---

## Portal Feel Matrix
| Portal     | Feel                       | Motion           | Layout                  |
|------------|----------------------------|------------------|-------------------------|
| Student    | Gamified learning universe | Spring, bouncy   | Asymmetric, orbital nav |
| Instructor | Professional coaching tool | Smooth, precise  | Split-panel workspace   |
| Admin      | Command center             | Snap, data-dense | 3-col, stats-led        |
| Public     | Premium brand              | Cinematic scroll | Full-bleed, editorial   |

---

## Zustand Stores
- useXPStore      → xp, level, streakDays, badges[], pendingToasts[], pendingLevelUp
- useSessionStore → upcomingSessions, activeSession
- useRTOStore     → quizState, weakTopics, progress, currentCategory
- useStudentStore → profile, roadmapProgress, attendance
- useUIStore      → sidebarOpen, activeModal, notifications[]
```

---

## PRE-BUILD STEP 2 — PRISMA SCHEMA
### Save as prisma/schema.prisma — commit BEFORE Session 0

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Role { STUDENT INSTRUCTOR ADMIN }
enum BookingStatus { PENDING APPROVED REJECTED COMPLETED }
enum AttendanceStatus { PRESENT ABSENT LATE }
enum SessionStatus { SCHEDULED IN_PROGRESS COMPLETED CANCELLED }
enum SlotStatus { DRAFT ACTIVE FULL CLOSED }
enum TrainingType { BEGINNER ADVANCED RTO_FAST_TRACK }
enum BadgeType {
  PARKING_EXPERT SIGNAL_MASTER ELITE_DRIVER PERFECT_ATTENDANCE
  ROAD_PRO CONSISTENT_LEARNER SAFETY_CHAMPION QUIZ_MASTER
  FIRST_LESSON STREAK_7 STREAK_30 SPEED_LEARNER
}
enum NotificationType {
  SESSION_REMINDER BADGE_EARNED FEEDBACK_RECEIVED
  BOOKING_APPROVED BOOKING_REJECTED STREAK_AT_RISK
  LEVEL_UP QUIZ_PASSED
}
enum RoadmapPhase { BEGINNER INTERMEDIATE ADVANCED RTO MASTERY }
enum NodeStatus { LOCKED AVAILABLE IN_PROGRESS COMPLETED }
enum FeedbackTag { STRENGTH NEEDS_WORK CRITICAL }

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  phone        String?   @unique
  passwordHash String
  role         Role
  name         String
  avatarUrl    String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  lastActiveAt DateTime?
  isActive     Boolean   @default(true)

  student       Student?
  instructor    Instructor?
  admin         Admin?
  notifications Notification[]

  @@index([role])
  @@index([email])
}

model Student {
  id           String       @id @default(cuid())
  userId       String       @unique
  user         User         @relation(fields: [userId], references: [id])
  instructorId String?
  instructor   Instructor?  @relation(fields: [instructorId], references: [id])
  trainingType TrainingType @default(BEGINNER)
  enrolledAt   DateTime     @default(now())
  xp           Int          @default(0)
  level        Int          @default(1)
  streakDays   Int          @default(0)
  lastStreakAt DateTime?
  confidenceScore Int       @default(0)
  totalSessions   Int       @default(0)
  completedSessions Int     @default(0)
  quizzesTaken    Int       @default(0)
  quizzesPassedCount Int    @default(0)

  sessions      Session[]
  attendance    Attendance[]
  feedback      Feedback[]
  xpEvents      XPEvent[]
  badges        StudentBadge[]
  bookings      Booking[]
  progress      LearningProgress[]
  roadmapNodes  StudentRoadmapNode[]
  quizAttempts  QuizAttempt[]
  notifications Notification[]
  skillScores   StudentSkillScore[]

  @@index([userId])
  @@index([instructorId])
}

model Instructor {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  bio            String?
  specialization String?
  yearsExp       Int      @default(0)
  studentCount   Int      @default(0)
  rating         Float    @default(0)

  students   Student[]
  sessions   Session[]
  slots      Slot[]
  dailyLogs  InstructorLog[]

  @@index([userId])
}

model Admin {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}

model StudentSkillScore {
  id        String  @id @default(cuid())
  studentId String
  student   Student @relation(fields: [studentId], references: [id])
  skill     String
  score     Int     @default(0)
  maxScore  Int     @default(10)
  updatedAt DateTime @updatedAt

  @@unique([studentId, skill])
  @@index([studentId])
}

model Session {
  id           String        @id @default(cuid())
  studentId    String
  student      Student       @relation(fields: [studentId], references: [id])
  instructorId String
  instructor   Instructor    @relation(fields: [instructorId], references: [id])
  slotId       String?
  slot         Slot?         @relation(fields: [slotId], references: [id])
  scheduledAt  DateTime
  duration     Int           @default(60)
  status       SessionStatus @default(SCHEDULED)
  lessonType   String
  notes        String?
  completedAt  DateTime?
  createdAt    DateTime      @default(now())
  attendance   Attendance?

  @@index([studentId])
  @@index([instructorId])
  @@index([scheduledAt])
  @@index([status])
}

model Attendance {
  id        String           @id @default(cuid())
  sessionId String           @unique
  session   Session          @relation(fields: [sessionId], references: [id])
  studentId String
  student   Student          @relation(fields: [studentId], references: [id])
  status    AttendanceStatus
  markedAt  DateTime         @default(now())
  markedBy  String

  @@index([studentId])
  @@index([markedAt])
}

model Feedback {
  id           String      @id @default(cuid())
  studentId    String
  student      Student     @relation(fields: [studentId], references: [id])
  instructorId String
  tag          FeedbackTag
  content      String
  skillScores  Json?
  sessionId    String?
  createdAt    DateTime    @default(now())

  @@index([studentId])
  @@index([createdAt])
}

model InstructorLog {
  id           String     @id @default(cuid())
  instructorId String
  instructor   Instructor @relation(fields: [instructorId], references: [id])
  date         DateTime   @default(now())
  content      String

  @@index([instructorId])
  @@unique([instructorId, date])
}

model LearningCard {
  id             String       @id @default(cuid())
  slug           String       @unique
  title          String
  category       String
  phase          RoadmapPhase
  xpReward       Int          @default(10)
  steps          Json
  commonMistakes Json
  instructorTips Json
  safetyWarnings Json
  quizQuestion   String
  quizOptions    Json
  quizAnswer     String
  orderIndex     Int
  estimatedMins  Int          @default(10)
  difficulty     String       @default("beginner")

  progress LearningProgress[]

  @@index([phase])
  @@index([category])
}

model LearningProgress {
  id          String    @id @default(cuid())
  studentId   String
  student     Student   @relation(fields: [studentId], references: [id])
  cardId      String
  card        LearningCard @relation(fields: [cardId], references: [id])
  completed   Boolean   @default(false)
  quizPassed  Boolean   @default(false)
  attempts    Int       @default(0)
  completedAt DateTime?

  @@unique([studentId, cardId])
  @@index([studentId])
}

model RoadmapNode {
  id                String       @id @default(cuid())
  title             String
  description       String
  phase             RoadmapPhase
  orderIndex        Int
  icon              String
  requiredCardSlugs Json
  unlockThreshold   Float        @default(0.8)
  xPosition         Float        @default(0)
  yPosition         Float        @default(0)

  studentNodes StudentRoadmapNode[]

  @@index([phase])
}

model StudentRoadmapNode {
  id          String      @id @default(cuid())
  studentId   String
  student     Student     @relation(fields: [studentId], references: [id])
  nodeId      String
  node        RoadmapNode @relation(fields: [nodeId], references: [id])
  status      NodeStatus  @default(LOCKED)
  unlockedAt  DateTime?
  completedAt DateTime?

  @@unique([studentId, nodeId])
  @@index([studentId])
}

model RTOQuestion {
  id          String   @id @default(cuid())
  question    String
  options     Json
  answer      String
  category    String
  difficulty  String   @default("medium")
  signSlug    String?
  explanation String?
  imageHint   String?

  attempts QuizAttempt[]

  @@index([category])
  @@index([difficulty])
}

model QuizAttempt {
  id         String      @id @default(cuid())
  studentId  String
  student    Student     @relation(fields: [studentId], references: [id])
  questionId String
  question   RTOQuestion @relation(fields: [questionId], references: [id])
  answer     String
  correct    Boolean
  timeSpent  Int         @default(0)
  createdAt  DateTime    @default(now())

  @@index([studentId])
  @@index([questionId])
  @@index([createdAt])
}

model XPEvent {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id])
  amount    Int
  reason    String
  source    String
  createdAt DateTime @default(now())

  @@index([studentId])
  @@index([createdAt])
}

model Badge {
  id          String    @id @default(cuid())
  type        BadgeType @unique
  name        String
  description String
  icon        String
  xpRequired  Int       @default(0)
  condition   Json
  rarity      String    @default("common")

  students StudentBadge[]
}

model StudentBadge {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id])
  badgeId   String
  badge     Badge    @relation(fields: [badgeId], references: [id])
  earnedAt  DateTime @default(now())
  seen      Boolean  @default(false)

  @@unique([studentId, badgeId])
  @@index([studentId])
}

model Slot {
  id           String       @id @default(cuid())
  instructorId String
  instructor   Instructor   @relation(fields: [instructorId], references: [id])
  trainingType TrainingType
  date         DateTime
  startTime    String
  endTime      String
  maxCapacity  Int          @default(1)
  currentCount Int          @default(0)
  status       SlotStatus   @default(DRAFT)
  notes        String?

  sessions Session[]
  bookings Booking[]

  @@index([date])
  @@index([status])
  @@index([trainingType])
}

model Booking {
  id           String        @id @default(cuid())
  studentId    String?
  student      Student?      @relation(fields: [studentId], references: [id])
  slotId       String?
  slot         Slot?         @relation(fields: [slotId], references: [id])
  name         String
  phone        String
  email        String
  trainingType TrainingType
  status       BookingStatus @default(PENDING)
  reference    String        @unique @default(cuid())
  notes        String?
  createdAt    DateTime      @default(now())
  reviewedAt   DateTime?
  reviewedBy   String?

  @@index([status])
  @@index([createdAt])
  @@index([phone])
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  studentId String?
  student   Student?         @relation(fields: [studentId], references: [id])
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([userId, isRead])
  @@index([createdAt])
}

model Inquiry {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String?
  message   String
  createdAt DateTime @default(now())
  resolved  Boolean  @default(false)
  notes     String?
}

model SiteConfig {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
```

---

## PRE-BUILD STEP 3 — .env.example
### Create this file in repo root — fill actual values in .env.local

```env
# Neon PostgreSQL — get from neon.tech dashboard
# IMPORTANT: Add ?pgbouncer=true&connection_limit=1 to DATABASE_URL
DATABASE_URL="postgresql://user:password@host/dbname?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (free tier — for profile photos only)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ACADEMY_NAME="Sri Guru Driving Academy"
```

---

## SESSION 0 — Project Bootstrap & Foundation
### Run first. No UI. Foundation only.

```
Read ARCHITECTURE.md.

Set up the Next.js 14 project with these exact specifications:

DEPENDENCIES to install:
- next@14, react, react-dom, typescript
- tailwindcss, postcss, autoprefixer
- framer-motion
- @tanstack/virtual
- zustand
- prisma, @prisma/client
- next-auth
- lucide-react
- bcryptjs, @types/bcryptjs
- zod (for validation)
- swr (for data fetching)
- clsx, tailwind-merge (for className utility)
- @tanstack/react-query (for server state)

FONTS — load via next/font/google:
- Outfit (weights: 400, 600, 700, 800)
- DM_Sans (weights: 400, 500)
- JetBrains_Mono (weight: 400)

TAILWIND CONFIG — extend with ALL tokens from ARCHITECTURE.md:
- Add all color tokens as named colors
- Add spacing tokens: space-xs through space-section
- Add animation easing: ease-spring, ease-smooth, ease-snap
- Add font families: outfit, dm-sans, mono

FILE: /lib/cn.ts
A utility combining clsx + tailwind-merge for className merging.

FILE: /lib/db.ts
Prisma client singleton using globalThis pattern to avoid connection pooling issues in dev.

FILE: /lib/auth.ts
NextAuth config with credentials provider:
- Accepts email + password
- Hashes with bcrypt (saltRounds: 10)
- Returns user id, name, email, role in JWT
- JWT strategy (not database sessions — saves DB queries)
- Callback: redirect based on role (STUDENT→/student/dashboard, INSTRUCTOR→/instructor/dashboard, ADMIN→/admin/dashboard)

FILE: /middleware.ts
RBAC route protection:
- /student/* → requires role STUDENT
- /instructor/* → requires role INSTRUCTOR
- /admin/* → requires role ADMIN
- Redirect unauthorized users to /auth/login
- Public routes: /, /booking, /auth/*, /api/public/*

FILE: /lib/icons/road-signs.tsx
SVG components for ALL these signs as real SVG paths (not styled divs, not emoji):
STOP_SIGN, YIELD, SPEED_LIMIT (takes limit:number prop), NO_ENTRY,
PEDESTRIAN_CROSSING, TRAFFIC_LIGHT (takes state:'red'|'amber'|'green' prop),
GIVE_WAY, SCHOOL_ZONE, NO_PARKING, ONE_WAY, NO_OVERTAKING,
ROUNDABOUT, SPEED_BUMP, HOSPITAL_AHEAD, PARKING_ALLOWED,
TURN_LEFT, TURN_RIGHT, U_TURN_PROHIBITED, HORN_PROHIBITED

FILE: /lib/rate-limit.ts
In-memory token bucket rate limiter (no Redis):
- Max 20 requests per IP per minute for public routes
- Max 60 requests per IP per minute for auth routes
- Returns { success: boolean, remaining: number }

ZUSTAND STORES — create all 5:
/lib/stores/xp-store.ts → { xp, level, streakDays, badges, pendingToasts, pendingLevelUp, addXP, addToast, clearToast, setLevelUp }
/lib/stores/session-store.ts → { sessions, activeSession, setSessions, setActiveSession }
/lib/stores/rto-store.ts → { questions, currentIndex, answers, weakTopics, quizMode, score, setMode, answerQuestion, reset }
/lib/stores/student-store.ts → { profile, roadmapProgress, attendance, setProfile, updateProgress }
/lib/stores/ui-store.ts → { activeModal, notifications, unreadCount, openModal, closeModal, addNotification, markRead }

Do NOT build any UI. Foundation only. 
Run git commit when done.
```

---

## SESSION 0.5 — Design System Component Library
### CRITICAL — build before any portal. Every portal imports from here.

```
Read ARCHITECTURE.md.

Build /components/ui/ — the complete design system.
Every component MUST use ONLY tokens from ARCHITECTURE.md.
NO ShadCN defaults. NO arbitrary Tailwind values.
Every component must work in both light and dark theme (use CSS variables).

Components to build:

1. /components/ui/stat-block.tsx
Props: value: string|number, label: string, trend?: 'up'|'down'|null, trendValue?: string
Layout: large value in Outfit 700, small label in DM Sans, optional trend indicator
Style: no background, no border — just typography. Used in dashboard stat rows.

2. /components/ui/progress-ring.tsx
Props: percent: number, size: number, strokeWidth?: number, color?: string, children?: ReactNode
Built as raw SVG circle with stroke-dashoffset animation on mount.
Children render centered inside the ring.

3. /components/ui/xp-bar.tsx
Props: current: number, max: number, level: number, showLabel?: boolean
Amber fill bar with level markers. Animated fill on mount using Framer Motion.
Shows "Level N" text on left, XP numbers on right.

4. /components/ui/skill-bar.tsx
Props: skill: string, score: number, maxScore?: number, animated?: boolean
Labeled horizontal bar. Color shifts: 0-4 red, 5-7 amber, 8-10 green.
Spring animation on mount.

5. /components/ui/badge-pill.tsx
Props: children, variant: 'success'|'warning'|'danger'|'primary'|'muted'|'accent', size?: 'sm'|'md'
Pill shape, correct color per variant, no box-shadow.

6. /components/ui/session-card.tsx
Props: time: string, date: string, instructor: string, type: string, status: 'upcoming'|'completed'|'cancelled'
Left border accent only (no full border box-shadow).
Color of left border changes per status: blue upcoming, green completed, red cancelled.

7. /components/ui/activity-item.tsx
Props: icon: LucideIcon, title: string, description: string, time: string, type: 'xp'|'badge'|'session'|'quiz'|'feedback'
Timeline dot + icon + text + relative timestamp.
Icon and dot color changes per type.

8. /components/ui/page-shell.tsx
Props: children, title?: string, subtitle?: string, actions?: ReactNode
Wraps each portal page with consistent background, padding, header.
Uses var(--color-void) background. Max-width constraint with horizontal padding.

9. /components/ui/empty-state.tsx
Props: icon: LucideIcon, title: string, description: string, action?: ReactNode
Shown when a section has no data. Centered, icon above text, optional CTA button.
Every list/table in the app MUST use this when empty — no blank space.

10. /components/ui/skeleton.tsx
Props: className?, width?, height?, rounded?: boolean
Animated shimmer skeleton for loading states.
Export: Skeleton (single), SkeletonCard, SkeletonList, SkeletonStat

11. /components/ui/button.tsx
Props: variant: 'primary'|'secondary'|'ghost'|'danger'|'accent', size: 'sm'|'md'|'lg', loading?: boolean, children, ...rest
Primary: amber fill (accent color). Secondary: border only. Ghost: no border.
Loading state shows spinner inside button, disables click.

12. /components/ui/input.tsx
Props: label, error?, hint?, ...inputProps
Dark surface background, border on focus transitions to primary color.
Error state shows red border + error message below.
Always show label above — never placeholder-only inputs.

13. /components/ui/modal.tsx
Props: open, onClose, title, children, size?: 'sm'|'md'|'lg'
Uses Framer Motion AnimatePresence for mount/unmount.
Backdrop blur effect. Closes on backdrop click and Escape key.
Focus trap when open.

14. /components/ui/data-table.tsx
Props: columns: ColDef[], data: any[], loading?, emptyState?
Uses @tanstack/virtual for virtualization — handles any size dataset.
Sortable columns. Loading shows SkeletonList. Empty shows empty-state.

15. /components/ui/tooltip.tsx
Props: content: string, children, position?: 'top'|'bottom'|'left'|'right'
CSS-only tooltip (no JS library). Shows on hover/focus.

After building all components, create /components/ui/index.ts
that exports everything. Every portal imports from here — never builds its own base components.

Run git commit when done.
```

---

## SESSION 1 — Student Dashboard
### The most important portal. Make it feel like Duolingo meets a driving game.

```
Read ARCHITECTURE.md. Import all UI components from /components/ui/index.ts.

Build /app/(student)/dashboard/page.tsx and its supporting components.

LAYOUT (no sidebar — this is non-negotiable):

Top orbital navigation (/components/student/OrbitalNav.tsx):
- Floating pill at top of page — NOT a full-width header bar
- Items: Home (dashboard), Roadmap, Learn, RTO, Badges
- Active item: animated underline using Framer Motion layoutId="nav-indicator"
- Pill background: var(--color-surface), border: var(--color-border)
- On mobile: becomes a bottom tab bar

Main grid — CSS Grid named areas:
- "hero stats" occupying left 62%
- "activity" occupying right 38%
- Gap: 24px. No equal heights forced.

HERO AREA (left column):

XP Ring section:
- Use ProgressRing component (size: 180px, strokeWidth: 12)
- Level number centered in ring, Outfit 800, 36px
- Below ring: "Level {n} Driver" subtitle
- Streak: flame icon (Lucide Flame, amber) + "{n} day streak"
- If streak is 0: show "Start your streak today" in muted text

Confidence Meter:
- Label: "Confidence Score"
- Road-inspired: dashed line segments (not solid bar)
- Built as SVG with dashed stroke-dasharray segments colored by fill amount
- Low (0-40): red segments, Medium (41-70): amber, High (71-100): green

Next Session Card:
- Use SessionCard component
- Shows date, time, instructor name, lesson type
- If no upcoming session: EmptyState with "No sessions scheduled" + "Contact admin" CTA

Stats Row (2x2 mini grid, below hero):
- Use StatBlock for: Sessions Completed, Quiz Accuracy %, Attendance %, Skills Mastered
- NOT equal cards — first stat slightly larger
- Values animate count-up on mount using requestAnimationFrame

ACTIVITY FEED (right column):

Header: "Recent Activity" in Outfit 600
Timeline list:
- Use ActivityItem component for each item
- Items: lesson completed, badge earned, quiz result, instructor feedback, XP gained
- Stagger animation: each item slides in with 50ms delay between items
- If empty: EmptyState component
- Show max 10 items — "View all" link below

DATA FETCHING:
- GET /api/student/dashboard → returns { xpData, upcomingSession, recentActivity, stats }
- Use SWR with refreshInterval: 60000 (1 min)
- Show SkeletonCard while loading
- Show error boundary if fetch fails

API ROUTE /api/student/dashboard:
- Verify session user is STUDENT role
- Fetch from DB using select:{} — only needed fields
- Return structured data matching frontend types
- Add cache header: Cache-Control: private, max-age=30

ANIMATIONS:
- All using Framer Motion viewport prop (not scroll listeners)
- transform + opacity ONLY
- ease-spring for XP ring reveal
- ease-smooth for stats count-up
```

---

## SESSION 2 — Learning Cards System
### Swipeable practical skill cards — the core learning experience.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

Build /app/(student)/learn/page.tsx

PAGE LAYOUT:
- Road progress indicator at top: SVG path styled as a road with dashes
  Filled using stroke-dashoffset animation based on completion percentage
  NOT a standard progress bar
- Category filter tabs below: All, Basics, Control, Parking, Road, Safety, Advanced
- Card deck area takes remaining height

LEARNING CARD DECK (/components/student/LearningCardDeck.tsx):

Visual concept — stacked deck:
- Active card: full size, centered
- Next card: peeking behind at translateY(8px) scale(0.96) opacity(0.7)
- Card after: translateY(16px) scale(0.92) opacity(0.4)
- Framer Motion drag on active card

Card Interior Layout (/components/student/LearningCard.tsx):
- Top 35%: Illustration zone
  NOT a placeholder box — generate a geometric SVG road scene for each category:
  * Parking cards: top-view car + bay lines SVG
  * Control cards: steering wheel + hands SVG
  * Safety cards: shield + road SVG
  * Road rules: road sign + car SVG
  Each is a simple geometric SVG — not detailed illustration, just recognizable
- Middle 45%: Content
  Card title in Outfit 700, 22px
  Step-by-step list — each step reveals with stagger on card entry (Framer Motion)
  Common Mistakes: amber pill header + list
  Safety Warning: red pill header + warning text
- Bottom 20%: Stats strip
  XP reward badge (amber pill, "+{n} XP")
  Estimated time ("~{n} min")
  Difficulty badge (green/amber/red)

SWIPE INTERACTION:
- Drag left (velocity > 200): skip card, shuffles to back of deck
- Drag right (velocity > 200): mark complete
  → calls useXPStore.addXP(card.xpReward)
  → POST /api/student/progress { cardId, completed: true }
  → spring animation: card flies off right + checkmark overlay
- Drag up: opens mini-quiz overlay

MINI QUIZ OVERLAY:
- Slides up from bottom using Framer Motion (spring, y: 0 from y: 100%)
- Single question from card.quizQuestion
- 4 options as large tap targets (min-height: 52px each)
- Correct: green flash + XP toast + card marked complete
- Wrong: red flash + correct answer highlighted + "Try again tomorrow" hint
- Question text in Outfit 600, options in DM Sans

KEYBOARD/ACCESSIBILITY:
- Arrow keys: left = skip, right = complete
- Enter: open quiz
- Escape: close quiz overlay
- All interactive elements have aria-labels

API ROUTE /api/student/learning-cards:
- GET: returns paginated cards filtered by category and phase
  Uses select:{} — only fetch needed fields
  Sorted by orderIndex
  Includes student's completion status for each card
- POST /api/student/progress:
  Updates LearningProgress, awards XP via XPEvent, checks badge conditions

EMPTY STATE: if all cards in category complete, show completion celebration
with total XP earned and "Move to next phase" CTA.
```

---

## SESSION 3 — RTO Learning Center
### Complete Indian road theory preparation system.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.
Import road signs from /lib/icons/road-signs.tsx.

Build /app/(student)/rto/page.tsx

PAGE MODES (tab switcher at top, not a router):
- Signs Library
- Mock Test
- Flashcards
- Weak Topics
- Progress

--- SIGNS LIBRARY ---

Category scroll bar:
- CSS scroll-snap (overflow-x: auto, scroll-snap-type: x mandatory)
- NO carousel library
- Categories: All Signs, Warning, Mandatory, Informatory, Prohibition, Road Markings, Signals

Sign Grid:
- Responsive grid: 4 cols desktop, 3 cols tablet, 2 cols mobile
- Use @tanstack/virtual for virtualization (there are 50+ signs)

SignCard (/components/student/SignCard.tsx):
- Fixed 148x148px
- Background: var(--color-surface), border: var(--color-border)
- SVG road sign: 64px centered (from /lib/icons/road-signs.tsx)
- Sign name: 11px uppercase, letter-spacing: 0.1em
- XP badge: amber pill top-right "+5 XP"
- Hover: border → var(--color-primary), scale 1.03, ease-spring
- Learned state: green checkmark overlay at 30% opacity

Sign Detail Modal (opens on click, uses Modal component):
- Large sign SVG (120px)
- Sign name + category badge
- Full explanation text
- What it means for drivers
- Common mistakes section
- "Take Quick Quiz" button (single question, inline)
- "+5 XP" awarded on first view

--- MOCK TEST ---

Test config screen:
- Number of questions: 10 / 20 / 30 (tap to select)
- Category filter: All / specific category
- Time per question: 30s / 45s / 60s
- Start button

Test screen:
- Progress: "Question 5 of 20" + thin progress bar at top
- Timer: MUST use requestAnimationFrame stored in useRef
  Visual: circular countdown ring (raw SVG, stroke-dashoffset)
  Color: green → amber → red as time decreases
  When reaches 0: auto-advance, mark as wrong
- Question: sign SVG (80px) + question text in Outfit 600
- 4 options: large tap targets, min-height 56px
  Default: border only
  Selected: blue border + blue background tint
  Correct reveal: green fill + checkmark icon
  Wrong reveal: red fill + X icon + correct option highlighted green
- XP: correct = +10 XP (via useXPStore), wrong = +0 XP
  Wrong answer adds questionId to useRTOStore.weakTopics

Results screen:
- Score: large number, Outfit 800
- Accuracy percentage
- Radar/spider chart showing accuracy per category
  MUST be built with raw SVG polygon — NOT recharts, NOT chart.js
  Calculate polygon points from category scores
  Animated: polygon morphs from center point to final shape on mount
- "Retry weak topics" CTA

--- FLASHCARDS ---

CSS 3D flip cards (no library):
- perspective: 1000px on container
- card: transform-style: preserve-3d, transition: transform 0.5s ease-smooth
- front face: sign SVG + "What does this sign mean?"
- back face: sign name + meaning + rule + example
- Click or spacebar: flip
- Left/right arrow: previous/next card
- Swipe left (pointer events): mark as "don't know", goes back into deck
- Swipe right: mark as "know", removed from deck
- Deck counter: "12 remaining"
- Completion: confetti animation (30 divs, CSS keyframes, no library)

--- WEAK TOPICS ---

Pulls from useRTOStore.weakTopics (populated during mock tests)
Shows SignCard grid filtered to only weak topics
"Practice All Weak Topics" button starts a focused mock test

--- PROGRESS ---

Stats: Total Studied, Pass Rate, Questions Answered, Streak
Category breakdown: simple horizontal bars (raw SVG, not a chart library)
Recent test history: list of past tests with scores + dates

API ROUTES:
- GET /api/student/rto-questions?category=&limit=&offset= (paginated)
- POST /api/student/quiz-attempt { questionId, answer, timeSpent }
- GET /api/student/rto-progress (stats + weak topics from DB)
All routes: verify student session, use select:{}, paginate properly.
```

---

## SESSION 4 — Learning Roadmap
### Visual journey map — not a list of lessons.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

Build /app/(student)/roadmap/page.tsx

VISUAL CONCEPT — A winding road SVG:
- Road travels down the page as an SVG path (bezier curves, not straight)
- Road has: center dashed lane marking, edge lines
- Completed sections: full white/light road
- Upcoming sections: dashed/faded road at 30% opacity
- Nodes (milestones) are positioned ON the road path
- Total road height: ~3000px (scrollable SVG)
- SVG uses viewBox, scales with container width

ROAD SVG GENERATION:
Create /components/student/RoadmapSVG.tsx
- Build road as SVG <path> with cubic bezier curves
- Road width: 80px
- 5 phases, each phase has multiple nodes
- Calculate node positions along the path using path percentage
- Export node coordinates for absolute positioning of interactive elements

NODE STATES:
Each node is an SVG circle + overlaid HTML button (foreignObject):
- LOCKED: gray fill + Lucide Lock icon overlay + tooltip "Complete X more to unlock"
- AVAILABLE: blue fill + pulse glow animation (CSS keyframes, opacity only)
- IN_PROGRESS: amber fill + spinning dashed border (CSS animation, transform only)
- COMPLETED: green fill + Lucide CheckCircle icon

NODE CLICK PANEL:
Slides up from bottom (Framer Motion, spring animation):
- Node title + phase badge
- Description
- Skills covered (tag list)
- Required cards to complete
- Progress bar (how many required cards done)
- CTA: "Continue" (if in progress) / "Start" (if available) / "Review" (if completed)
- XP reward shown

PHASE LABELS:
Floating labels beside the road at each phase start:
1. Beginner Zone: Vehicle Basics, Controls, Slow Speed (teal)
2. Intermediate Zone: Traffic, Parking, Signals (blue)
3. Advanced Zone: Highway, Night, Rain, Emergency (amber)
4. RTO Zone: Theory, Mock Tests, Documentation (purple)
5. Mastery Zone: Confidence Challenges, Independence (green)

PHASE UNLOCK LOGIC:
- Phase 2 unlocks when 80% of Phase 1 nodes complete
- Locked phases: road is black dashed line, nodes are gray circles
- Lock message shown on click: "Complete Phase 1 to unlock"

TOP STATS BAR (fixed at top, scrolls with page):
- Current phase badge
- "X of Y milestones complete"
- Overall progress %
- Estimated completion based on sessions/week

WEAK AREA SECTION (below road, outside SVG):
- Only shown if quiz accuracy < 70% on any RTO topic
- "Focus Areas" heading
- Small SignCards for weak topics
- "Practice Now" button → navigates to RTO weak topics mode

API ROUTE /api/student/roadmap:
- GET: returns all roadmap nodes with student's status for each
- PATCH /api/student/roadmap/:nodeId: update node status
Both: verify student session, use select:{} only
```

---

## SESSION 5 — Badges & Gamification Layer
### The global overlay system — XP toasts, level ups, badge reveals.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

Build the complete gamification system.

--- XP TOAST SYSTEM ---

/components/shared/XPToast.tsx:
- Fixed position: bottom-right, z-index: 9999
- Reads useXPStore.pendingToasts[]
- Each toast: "+{xp} XP" in Outfit 700, amber, 24px
  Secondary line: reason text in DM Sans, smaller
- Animation: slide up from y:20, fade out after 2.5s
- Multiple toasts stack vertically with gap
- Framer Motion AnimatePresence for enter/exit
- After display: calls useXPStore.clearToast(id)
  Then: POST /api/student/xp { amount, reason, source }
  After DB save: check if level up (xp >= levelThreshold)
  Level thresholds: [0,100,250,500,900,1400,2000,2800,3800,5000] (10 levels)
  If level up: useXPStore.setLevelUp(newLevel)

--- LEVEL UP OVERLAY ---

/components/shared/LevelUpOverlay.tsx:
- Triggered by useXPStore.pendingLevelUp
- Full screen: dark overlay (rgba(0,0,0,0.85))
- Center content:
  "LEVEL UP" in Outfit 800, 14px uppercase letter-spacing, amber
  Level number in Outfit 800, 96px, white
  "You're now a Level {n} Driver" subtitle
  Road burst: CSS animation — 8 lines radiating from center
    (transform: scaleX, opacity keyframes — no SVG animation)
  New level title text (Level 1: Learner, 2: Novice, 3: Improver, etc.)
- Auto-dismisses after 3.5s or on click/tap
- Framer Motion: scale from 0.5 to 1, spring easing

LEVEL TITLES:
1: Learner, 2: Novice, 3: Improver, 4: Confident, 5: Skilled,
6: Advanced, 7: Expert, 8: Master, 9: Elite, 10: Legend

--- BADGE REVEAL ---

/components/shared/BadgeReveal.tsx:
- Triggered when a new badge is awarded (check after every XP event)
- Full screen overlay
- Badge icon (Lucide icon) scales from 0 to 120px, ease-spring
- Badge name in Outfit 700, 28px
- "Badge Unlocked!" header in amber
- Description text
- Rarity pill (Common/Rare/Legendary)
- Confetti: 40 small divs (8px circles/squares), randomized CSS animation
  position: fixed, random x/y starting positions, fall + fade keyframes
  No library — pure CSS animations
- "Awesome!" dismiss button
- "Share" button: copies "I just earned the {badge} badge on Sri Guru Driving Academy!" to clipboard

--- STREAK REMINDER ---

/components/shared/StreakBanner.tsx:
- Shown in student portal layout if: lastStreakAt is > 20 hours ago
- Non-blocking: slides in from bottom of page (not a modal)
- Amber background strip
- Flame icon + "Your {n}-day streak ends in {x}h — complete a lesson!"
- X dismiss button (dismisses for this session only, via useUIStore)
- CTA: "Keep Streak" → navigates to /student/learn

--- BADGES PAGE ---

/app/(student)/badges/page.tsx:
- Grid of ALL badges (earned and locked)
- Earned: full color, earned date shown
- Locked: grayscale + lock icon + unlock condition shown
- Click earned badge: shows BadgeReveal-style modal with details
- Click locked: shows what's needed to earn it
- Progress towards next badge: XPBar showing current XP vs required

--- LEADERBOARD ---

/app/(student)/leaderboard/page.tsx:
- Top 20 students by XP (academy-wide)
- Virtualized list using @tanstack/virtual
- Current student highlighted
- Rank, name (first name + last initial for privacy), level, XP
- Rank 1/2/3: gold/silver/bronze badge
- Refreshes every 5 minutes (SWR refreshInterval: 300000)

Wire XPToast + LevelUpOverlay + BadgeReveal + StreakBanner into:
/app/(student)/layout.tsx

API ROUTES:
- POST /api/student/xp { amount, reason, source } → creates XPEvent, updates Student.xp, returns { newXp, newLevel, leveledUp, newBadges[] }
- GET /api/student/badges → all badges with earned status
- GET /api/student/leaderboard → top 20, include current student rank
All: verify STUDENT session, use select:{} only
```

---

## SESSION 6 — Instructor Portal
### Professional coaching workspace — split-panel, data-focused.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

Build /app/(instructor)/dashboard/page.tsx

LAYOUT — split panel workspace:
- Left panel: 340px fixed, student roster
- Right panel: remaining width, active student view or schedule
- Framer Motion layoutId transition when switching between views
- No sidebar. Clean top bar: instructor name + avatar + date

--- LEFT PANEL: STUDENT ROSTER ---

/components/instructor/StudentRoster.tsx:
- Search input at top (filters in Zustand state — NO API call per keystroke)
  Debounce: 300ms via useRef, then update filter
- Student list (virtualized with @tanstack/virtual if > 20 students)

StudentRosterItem (/components/instructor/StudentRosterItem.tsx):
- Avatar circle: initials, colored by name hash
- Student name (Outfit 600)
- Last session: relative time ("3 days ago")
- Small ProgressRing: 32px, shows completion %
- Attendance streak indicator
- Active state: left border var(--color-primary) + surface-2 background

IMPORTANT SECURITY — server enforced:
API /api/instructor/students MUST filter by instructorId from JWT session.
Never rely on frontend filtering alone.

--- RIGHT PANEL: STUDENT DETAIL VIEW ---

When student selected:

TOP STRIP:
- Student name + enrollment date + total sessions
- Training type badge
- 3 action buttons (use Button component):
  "Mark Attendance" (primary), "Add Feedback" (secondary), "Log Session" (ghost)

ATTENDANCE SECTION:
- Shows today's scheduled session if exists
- If session today: large "Mark Present" + "Mark Absent" buttons
- NO OTP, NO QR, NO biometrics
- On mark: POST /api/instructor/attendance { studentId, sessionId, status }
  Success: green confirmation strip slides down, auto-removes after 2s
  Error: red strip with error message
- Recent attendance: last 10 sessions as colored dots (green/red/amber)

SKILL SCORES (/components/instructor/SkillScoreEditor.tsx):
- Skills: Parking, Control, Road Rules, Safety, Highway, Theory
- Each: SkillBar component + edit button
- Click edit: inline 0-10 slider appears (Framer Motion height animation)
- Save on slider release: PUT /api/instructor/skill-score { studentId, skill, score }
- Optimistic update: update UI immediately, revert if API fails

FEEDBACK SECTION:
- Tag selector: "Strength" / "Needs Work" / "Critical" (colored pill buttons, single select)
- Textarea: max 500 chars, char counter
- Submit: POST /api/instructor/feedback { studentId, tag, content }
- Past feedback timeline: ActivityItem components, last 5 entries
  "View all" expands list with Framer Motion height animation

DAILY LOG:
- Simple dated textarea
- Auto-saves with 1s debounce (useRef timer, not a library)
- POST /api/instructor/log { date, content } (upsert)
- Shows last 5 days as collapsed items, expand on click

--- SCHEDULE VIEW (when no student selected) ---

/components/instructor/TodaySchedule.tsx:
- "Today's Schedule" heading + date
- Sessions in time order: SessionCard component for each
- Click session → loads that student in left panel
- Empty today: EmptyState "No sessions today"
- Tomorrow preview: collapsed section, expands on click

API ROUTES:
- GET /api/instructor/students → MUST filter by instructorId from session JWT
- GET /api/instructor/student/:id → full student detail (verify instructorId match)
- POST /api/instructor/attendance
- PUT /api/instructor/skill-score
- POST /api/instructor/feedback
- POST /api/instructor/log (upsert by date)
- GET /api/instructor/schedule?date= → sessions for date
All routes: verify INSTRUCTOR role AND instructorId ownership — never trust frontend.
```

---

## SESSION 7 — Admin Command Center
### Dense, data-rich operations portal — not a SaaS dashboard.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

Build /app/(admin)/dashboard/page.tsx

LAYOUT — 3 column grid:
- Left: 200px, nav tree (fixed, scrolls independently)
- Center: flex-1, main content area
- Right: 260px, live activity feed
- Top bar: "Sri Guru Driving Academy" + Admin badge + notification bell

LEFT NAV TREE (/components/admin/AdminNav.tsx):
Sections with expand/collapse (Framer Motion height animation):
- Overview (default open)
- Students (sub: All Students, Add Student, Import)
- Instructors (sub: All Instructors, Assign)
- Bookings (sub: Pending, Approved, Calendar)
- Slots (sub: Manage Slots, Add Slot)
- Analytics (sub: Attendance, Engagement, XP)
- Content (sub: Learning Cards, RTO Questions)
- Gamification (sub: Badges, XP Config, Leaderboard)
- Reports
- Settings

Active section: left border var(--color-primary) + surface-2 background.
Each section click updates useUIStore.activeAdminSection (no router navigation — SPA style for admin).

CENTER — OVERVIEW STATE:

System health strip (top of center):
- 3 metrics in JetBrains Mono: Active Students, Sessions Today, Pending Bookings
- Each has a small trend indicator (up/down arrow + %)

Analytics grid (2x3, asymmetric — NOT equal cards):

Cell 1 (large, spans 2 rows): Enrollment Trend
- Sparkline: 30-day enrollment count
- Raw SVG polyline — NO chart library
- Points: array of [x,y] scaled to container
- Hover: vertical line + tooltip showing date + count

Cell 2: Top Students
- Ranked list, top 5 by XP
- Avatar initial + name + XP bar (compact)

Cell 3: Instructor Utilization
- Horizontal bars, one per instructor
- Sessions this week / max capacity
- Raw SVG bars — NO chart library

Cell 4: Booking Pipeline
- 3 columns: Pending, Approved, Completed
- Count badges on each column header
- Compact booking items (name + training type + date)
- "Approve/Reject" quick actions on pending items

Cell 5: Attendance Heatmap
- 7 columns (Mon-Sun) × 8 rows (last 8 weeks)
- Each cell: colored square (green = high attendance, red = low, gray = no session)
- GitHub-style: raw SVG <rect> elements
- Hover: tooltip with date + attendance %

Cell 6: Recent Activity Log
- Scrollable (max 300px height, overflow-y: auto)
- Monospaced timestamps (JetBrains Mono)
- Icon + description for each event
- Auto-refreshes every 30s (SWR refreshInterval)

RIGHT LIVE FEED (/components/admin/LiveFeed.tsx):
- SWR with refreshInterval: 30000
- New items: subtle pulse animation on entry (Framer Motion)
- Event types: new booking, session completed, badge earned, quiz passed
- Each: small icon + text + relative time
- "Clear feed" button

ADMIN SECTION VIEWS — build these as separate components,
rendered in center panel based on useUIStore.activeAdminSection:

/components/admin/sections/StudentManagement.tsx:
- DataTable with: name, training type, instructor, XP, progress %, enrollment date
- Search + filter by training type + filter by instructor
- Click row: opens student detail modal
- "Add Student" button: modal with form (name, email, phone, training type, instructor)

/components/admin/sections/BookingManagement.tsx:
- Tabs: Pending / Approved / Rejected / Completed
- Each booking: name, phone, training type, requested slot, date
- Pending: Approve + Reject buttons
- Approve: opens slot assignment modal
- All: contact info shown

/components/admin/sections/SlotManagement.tsx:
- Week grid view: 7 days × 6 time slots
- Empty cell click: popover to create slot (instructor, training type, capacity)
- Existing slot: shows booked count / capacity + status color
- DRAFT gray, ACTIVE green, FULL amber, CLOSED red

API ROUTES:
- GET /api/admin/overview → stats, recent activity (verify ADMIN role)
- GET /api/admin/students → paginated, filterable
- POST /api/admin/students → create student + user
- GET /api/admin/bookings?status= → paginated
- PATCH /api/admin/bookings/:id → approve/reject
- GET /api/admin/slots?week= → slots for week
- POST /api/admin/slots → create slot
- PATCH /api/admin/slots/:id → update slot
All: verify ADMIN role on every request — never trust client.
```

---

## SESSION 8 — Public Landing Page
### Premium brand experience — feels like a funded EdTech startup.

```
Read ARCHITECTURE.md.

Build /app/(public)/page.tsx
NO imports from portal-specific components. Public page is self-contained.

SECTION 1 — HERO (100vh):
Background: var(--color-void)
Animated road: SVG dashed center line with CSS keyframe animation
  (dashes scroll downward, creates "driving forward" illusion)
  Use: strokeDashoffset animated with @keyframes at consistent speed

Left side (60%):
- Small pill badge: "Certified Driving Academy" (border pill)
- Headline: "Learn to Drive." on one line, "Master the Road." on next
  Outfit 800, 68px, white — NOT centered
- Tagline: "Professional driving education with modern learning technology."
  DM Sans, 18px, var(--color-text-2)
- CTA: "Start Your Journey" button (amber/accent variant, large)
  Links to /booking
- Secondary: "Already enrolled?" text link to /auth/login

Right side (40%):
- Geometric car SVG (simple shapes — rectangles, circles for wheels, trapezoid for body)
  Side profile, minimal, modern
  Levitation animation: translateY(-8px) to translateY(8px), 3s infinite ease-in-out
- Behind car: speed lines (thin horizontal SVG lines, opacity 0.2)

NO stock photos. NO hero images. SVG + CSS only.

SECTION 2 — STATS BAR:
Full-width strip, var(--color-surface) background
4 stats in a horizontal row with dividers:
- 500+ Students Trained
- 94% Pass Rate
- 8 Years Experience
- 12 Certified Instructors
Numbers: animate count-up when scrolled into view
  Use Intersection Observer + requestAnimationFrame counter
  JetBrains Mono font for the numbers

SECTION 3 — HOW IT WORKS:
NOT a 3-step card grid. Horizontal scroll timeline on desktop.
Steps: Enroll → Theory → Practical → RTO Prep → Get Licensed
Each step: large step number (Outfit 800, 64px, very muted), icon (Lucide), 2-line description
Connecting line between steps: SVG path, stroke-dashoffset animates as user scrolls into view
  (Intersection Observer on the section, then animate over 1.5s)

SECTION 4 — TRAINING PROGRAMS:
Asymmetric layout (NOT equal cards):
- Beginner (large, left, spans 2 rows in grid): "21 Days to Confident Driving"
  Skills: Vehicle controls, Basic maneuvers, City driving, RTO basics
- Advanced (smaller, top-right): "14 Days to Road Mastery"
  Skills: Highway, Night driving, Advanced parking
- RTO Fast Track (smaller, bottom-right): "7 Days to License"
  Skills: Theory only, Mock tests, Documentation
Each: duration, session count, key skills list, "Book Demo" CTA button

SECTION 5 — INSTRUCTOR HIGHLIGHTS:
Horizontal scroll row (CSS scroll-snap, NOT a carousel library)
Instructor cards: name, years experience, specialization, student count
Visual: large initial avatar (no photos), colored background

SECTION 6 — TESTIMONIALS:
Stacked card effect: one prominent, others peek behind with rotation (-6deg, -12deg)
Auto-cycles every 4s with Framer Motion AnimatePresence
Star rating, student name, city, short quote (2-3 sentences max)
3 testimonials total

SECTION 7 — RTO PREVIEW:
"Master Indian Road Rules" heading
3 sample SignCards (import /lib/icons/road-signs.tsx signs directly)
Progress stat: "50+ Signs Covered"
CTA: "Start Free RTO Practice" → /auth/login (or /booking if not enrolled)

SECTION 8 — FAQ ACCORDION:
8 questions, Framer Motion height animation (NOT CSS max-height hack)
Questions:
1. How long does the full course take?
2. What vehicles will I learn on?
3. Is there an online payment system?
   Answer: "All fees are handled in-person at the academy. We believe in transparent, direct transactions."
4. How does the RTO test preparation work?
5. Can I choose my instructor?
6. What if I miss a session?
7. How do I track my progress?
8. What happens after I get my license?

SECTION 9 — CONTACT:
Split: left = contact form (name, phone, message)
Form: controlled state + onClick (NO <form> tags)
Submit: POST /api/public/inquiry
Success: inline success message (not a toast — replace form with thank you message)
Right: Google Maps iframe placeholder (styled gray box, "Academy Location" text, no real API key)
Academy address, phone, email displayed

SECTION 10 — FOOTER:
3-column: branding + tagline | quick links | contact info
Bottom: "© 2024 Sri Guru Driving Academy. All rights reserved."
Road texture: CSS repeating-linear-gradient (subtle, low opacity)

API ROUTE /api/public/inquiry:
Rate limited (use /lib/rate-limit.ts)
Saves to Inquiry model
No email sending needed — admin sees in dashboard
```

---

## SESSION 9 — Booking System
### Multi-step public booking flow + admin slot management.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

Build /app/(public)/booking/page.tsx

MULTI-STEP FLOW (single page, no navigation between steps):
State managed in React useState — all 4 steps render conditionally.
Step indicator: 4 dots connected by a line at top
  Active dot: amber glow pulse animation (box-shadow, CSS keyframes)
  Completed dot: green filled

STEP 1 — PERSONAL DETAILS:
Fields (use Input component):
- Full Name
- Phone Number (Indian format: 10 digits, starts with 6-9)
  Real-time validation: show ✓ when valid, error when invalid
- Email Address (optional, validate format if provided)
Validation runs on blur + on "Next" click.
NO <form> tags — use controlled state + onClick handler.

STEP 2 — TRAINING TYPE:
3 large tap-target option cards (NOT dropdown, NOT radio buttons):
- Beginner: "21 Days · For first-time learners"
  Icon: Lucide GraduationCap
- Advanced: "14 Days · Build confidence & skills"
  Icon: Lucide TrendingUp
- RTO Fast Track: "7 Days · Theory & test prep only"
  Icon: Lucide FileCheck

Each card: full border, icon + name + description + duration
Selected state: border → var(--color-primary), background tint, checkmark appears top-right
Framer Motion: scale 0.98 on press, spring back on release

STEP 3 — SLOT SELECTION:
Fetch: GET /api/public/slots?type={trainingType}
Loading: SkeletonCard × 6
Error: EmptyState with retry button

Week calendar grid:
- Columns: Mon – Sun (7 cols)
- Rows: 8AM, 10AM, 12PM, 2PM, 4PM, 6PM
- Available slot: clickable, blue border on hover, shows instructor name on hover
- Full slot: grayed out, "Full" text, cursor not-allowed
- No slots for a day: cell shows "—"
- Selected: amber fill, white text, checkmark icon

Navigation: Prev week / Next week arrows (only show future weeks)

STEP 4 — CONFIRM:
Summary card: name, phone, training type, selected slot, instructor
"Important" notice block (amber left border):
  "Our team will call you within 24 hours to confirm your enrollment.
   No payment is required at this stage."
Submit button: "Confirm Booking Request" (primary/accent)
POST /api/public/bookings on submit

SUCCESS STATE (replaces form entirely):
- Large checkmark icon (animated in, Framer Motion spring)
- "Booking Request Received!"
- Reference number: first 8 chars of booking.reference in JetBrains Mono
- "We'll call {phone} within 24 hours"
- "While you wait" section: links to /rto (try RTO practice) and back to home

--- ADMIN SLOT MANAGEMENT ---

Build /app/(admin)/slots/page.tsx (admin section already rendered in admin center,
but also build as standalone for direct navigation)

Week grid view (same visual as booking but editable):
- Click empty cell: inline popover form (Framer Motion AnimatePresence)
  Fields: Training type (select), Max capacity (1/2/3), Instructor (select from list)
  Save: POST /api/admin/slots
- Click existing slot: side panel slides in (right side)
  Shows: booked students list, slot details
  Actions: Activate, Close, Edit capacity
  PATCH /api/admin/slots/:id

Booking approvals sidebar:
- List of PENDING bookings
- Each: name, phone, training type, requested info
- Actions: "Approve & Assign Slot" / "Reject" / "Call" (tel: link)
- Approve: opens slot picker modal, then PATCH /api/admin/bookings/:id

API ROUTES:
- GET /api/public/slots?type=&week= → only ACTIVE, non-FULL slots (public, no auth, cached)
- POST /api/public/bookings → rate limited, saves to DB
- GET /api/admin/slots?week= → all slots including DRAFT
- POST /api/admin/slots → create slot (ADMIN only)
- PATCH /api/admin/slots/:id → update (ADMIN only)
- GET /api/admin/bookings?status=PENDING → pending bookings (ADMIN only)
- PATCH /api/admin/bookings/:id → approve/reject (ADMIN only)
```

---

## SESSION 10 — Auth Flow + Notifications
### Login pages + notification system.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

--- AUTH PAGES ---

/app/(auth)/login/page.tsx:
Full dark page, NO centered card on gray background.
Split layout:
- Left 50%: academy branding
  Large academy name in Outfit 800
  Tagline
  Animated road SVG (same dashed line animation as hero section)
  3 small trust indicators: "500+ Students", "8 Years", "Certified"
- Right 50%: login form
  "Welcome back" in Outfit 700
  Email + Password fields (use Input component)
  "Forgot password?" link below password field
  "Sign In" button (full width, accent/amber)
  Below form: "New student? Book a demo first" → /booking

Form handling:
- Controlled state, NOT <form> submit
- onClick calls signIn('credentials', { email, password, redirect: false })
- Loading state: button shows spinner
- Error: inline error message below form (NOT a toast)
  Common errors: "Invalid email or password", "Account not found"
- Success: router.push based on role (from session)

NO NextAuth default pages. NO "powered by" branding.

/app/(auth)/forgot-password/page.tsx:
Simple centered form (this one can be centered — it's utility, not brand):
- Email input
- "Send Reset Link" button
- POST /api/auth/forgot-password
For now: generate reset token, store in DB (ResetToken model if not exists),
show token on screen in dev (no email sending needed)
Add reset token to schema: { id, userId, token, expiresAt, used }

--- NOTIFICATION SYSTEM ---

/components/shared/NotificationBell.tsx:
- Bell icon (Lucide Bell)
- Unread count badge: amber pill, top-right of bell, pulse animation if > 0
- Click: dropdown panel (Framer Motion AnimatePresence, slides down)
  Width: 320px, max-height: 400px, overflow-y: auto

Notification item types with icons + colors:
- SESSION_REMINDER → Calendar icon, blue
- BADGE_EARNED → Trophy icon, amber
- FEEDBACK_RECEIVED → MessageSquare icon, green
- BOOKING_APPROVED → CheckCircle icon, green
- BOOKING_REJECTED → XCircle icon, red
- STREAK_AT_RISK → Flame icon, amber (warning)
- LEVEL_UP → TrendingUp icon, amber
- QUIZ_PASSED → Star icon, green

Each notification: icon + title + message + relative time
Unread: slightly lighter background
Click: mark as read + navigate to relevant section

Header: "Notifications" + "Mark all read" button
Footer: "View all" link

Data fetching: SWR GET /api/notifications, refreshInterval: 60000
Mark read: PATCH /api/notifications/:id/read (optimistic update)
Mark all read: PATCH /api/notifications/read-all

Add NotificationBell to:
- /app/(student)/layout.tsx (in orbital nav)
- /app/(instructor)/layout.tsx (in top bar)
- /app/(admin)/layout.tsx (in top bar)

API ROUTES:
- POST /api/auth/forgot-password
- GET /api/notifications?limit=20 → unread first, then recent read
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/read-all
All: verify user session (any role), filter by userId from JWT.
```

---

## SESSION 11 — Empty States, Error Handling & Loading
### Every unhappy path handled — this is what separates real apps from demos.

```
Read ARCHITECTURE.md. Import from /components/ui/index.ts.

This session adds proper handling for EVERY edge case.
No new features. Only resilience work.

TASK 1 — ERROR BOUNDARIES:
Create /components/shared/ErrorBoundary.tsx (class component):
- Catches JS errors anywhere in child tree
- Shows: icon + "Something went wrong" + "Try refreshing" button
- Reports error to console (Sentry integration placeholder: console.error with structured data)

Wrap these in ErrorBoundary:
- /app/(student)/layout.tsx → wraps all student content
- /app/(instructor)/layout.tsx
- /app/(admin)/layout.tsx
- Individual: RTO quiz, Learning card deck, Roadmap SVG, Leaderboard

TASK 2 — LOADING STATES:
Add loading.tsx to EVERY route segment:
- /app/(student)/loading.tsx → OrbitalNav skeleton + page shell skeleton
- /app/(student)/dashboard/loading.tsx → SkeletonStat × 4 + SkeletonCard × 2
- /app/(student)/learn/loading.tsx → card deck skeleton (3 stacked rectangles)
- /app/(student)/rto/loading.tsx → sign grid skeleton (SkeletonCard × 12)
- /app/(student)/roadmap/loading.tsx → road line skeleton (long rectangle)
- /app/(student)/badges/loading.tsx → badge grid skeleton
- /app/(instructor)/loading.tsx → split panel skeleton
- /app/(admin)/loading.tsx → 3-col skeleton

TASK 3 — EMPTY STATES:
Audit every list, table, and data section. Add EmptyState component where missing.
Required empty states:
- Student dashboard: no upcoming sessions → "No sessions scheduled. Contact your academy."
- Student dashboard: no recent activity → "Start a lesson to see your activity here."
- Learn page: no cards in category → "All caught up! Try another category."
- Learn page: all cards complete → celebration state with XP total earned
- RTO: no weak topics → "Great job! No weak topics found."
- Instructor roster: no students assigned → "No students assigned yet."
- Admin bookings: no pending → "All bookings are handled."
- Admin students: search returns nothing → "No students match your search."

TASK 4 — FORM VALIDATION (audit all forms):
Every form must have:
- Real-time validation on blur (not just on submit)
- Clear error messages (specific, not "invalid input")
- Disabled submit button when form has errors
- Loading state during submission
- Success/error feedback after submission

Forms to audit: Login, Booking (all 4 steps), Contact inquiry, Instructor feedback, Admin slot creation.

TASK 5 — API ERROR HANDLING:
Every API route must:
- Return structured errors: { error: string, code: string }
- Never leak stack traces or DB errors to client
- 400 for validation errors, 401 for auth, 403 for authorization, 500 for server errors
- Log actual error server-side, return safe message to client

Add global error handler wrapper /lib/utils/api-handler.ts:
withApiHandler(handler) wraps any API route with try/catch + structured error response.

TASK 6 — OPTIMISTIC UPDATES:
Add optimistic updates to:
- Attendance marking (show Present/Absent immediately, revert if API fails)
- Learning card completion (mark complete immediately, revert if API fails)
- Mark notification as read (immediate, revert if API fails)
- Skill score update in instructor portal (show new score immediately)

TASK 7 — 404 AND OFFLINE:
/app/not-found.tsx — custom 404 page:
- Road with "Dead End" sign SVG
- "Page not found" message
- Back to home button

Add offline detection hook /lib/hooks/use-online-status.ts:
When offline: show non-blocking amber banner at top "You're offline. Some features may be unavailable."
When back online: banner auto-dismisses after 2s.
```

---

## SESSION 12 — Accessibility Pass
### Keyboard navigation, screen readers, focus management.

```
Read ARCHITECTURE.md.

Audit and fix the entire codebase for accessibility.
Every fix must not break existing visual design.

TASK 1 — FOCUS MANAGEMENT:
- Every interactive element must be keyboard-focusable
- Focus ring: replace default browser outline with custom:
  outline: 2px solid var(--color-primary); outline-offset: 3px;
  Add to global CSS, use :focus-visible (not :focus)
- Modal (/components/ui/modal.tsx): add focus trap
  On open: move focus to first focusable element inside
  Tab cycles through focusable elements inside only
  Escape: close modal and return focus to trigger element
  Use /lib/hooks/use-focus-trap.ts

TASK 2 — ARIA LABELS:
Audit every interactive element. Add missing:
- All icon-only buttons: aria-label="description"
- All icon+text buttons where icon is decorative: aria-hidden="true" on icon
- ProgressRing: role="img" aria-label="XP progress: {percent}%"
- Loading skeletons: aria-busy="true" aria-label="Loading..."
- Notification bell: aria-label="Notifications, {n} unread" aria-haspopup="true"
- Roadmap nodes: aria-label="{title}, {status}" role="button"
- Sign cards in RTO: aria-label="{sign name} road sign"
- Learning card deck: aria-label="Learning card {n} of {total}: {title}"

TASK 3 — KEYBOARD NAVIGATION:
- OrbitalNav: full keyboard nav, arrow keys between items, Enter to select
- RTO sign cards: Enter or Space to open detail, Escape to close
- Learning card deck: arrow keys left/right to navigate, Enter to open quiz
- Admin data tables: Tab through rows, Enter to expand row detail
- Accordion FAQ: Enter/Space to toggle, arrow keys between items

TASK 4 — COLOR CONTRAST:
Audit every text + background combination.
Minimum ratios: 4.5:1 normal text, 3:1 large text.
Common failures to check:
- var(--color-text-3) on var(--color-void) → may be too low, adjust text-3 value
- Amber text on white backgrounds → amber (#F59E0B) on white fails, darken text
- Muted text on surface cards
Fix all failures. Document the corrected values in ARCHITECTURE.md.

TASK 5 — SEMANTIC HTML:
- All page sections: correct landmark roles (main, nav, header, footer, aside)
- Student dashboard sections: use <section> with aria-labelledby
- Lists: ul/li for activity feeds, not divs
- Data tables in admin: proper <table>, <thead>, <tbody>, <th scope>
- Form labels: every input has associated <label> (already using Input component, verify it)

TASK 6 — REDUCED MOTION:
Wrap ALL Framer Motion animations in:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
If true: set duration to 0.01 on all animations (don't remove — removing causes layout shifts)
Add global /lib/hooks/use-reduced-motion.ts hook.
Use in: XPToast, LevelUpOverlay, BadgeReveal, RoadmapSVG, LearningCardDeck.
```

---

## SESSION 13 — Performance Hardening & Free-Tier Optimization
### Make it fast. Make it free-tier sustainable.

```
Read ARCHITECTURE.md.

TASK 1 — DATABASE QUERY AUDIT:
Run this check on EVERY Prisma query in /app/api/**:
□ Has select:{} — no findMany without explicit field selection
□ Has where clause — no unbounded fetches
□ Has take:50 or less — no unlimited result sets
□ Parallel queries use Promise.all — no sequential awaits that could be parallel
□ Complex aggregations use raw Prisma aggregation, not in-memory JS

Fix every violation. Add a comment // DB-OPTIMIZED above each query after fixing.

Specific fixes needed:
- Leaderboard: use select: { id, user: { select: { name: true } }, xp: true, level: true }
- Dashboard stats: run 4 count queries in parallel with Promise.all
- RTO questions: ensure pagination with skip/take on every fetch
- Activity feed: limit to 20 items, select only needed fields

TASK 2 — NEON CONNECTION (CRITICAL):
Verify DATABASE_URL ends with: ?pgbouncer=true&connection_limit=1&sslmode=require
Verify /lib/db.ts uses globalThis pattern to prevent connection leak in development:
```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

TASK 3 — API CACHING:
Add appropriate Cache-Control headers to these routes:
- GET /api/public/slots → Cache-Control: public, s-maxage=300, stale-while-revalidate=600
- GET /api/student/rto-questions → Cache-Control: private, max-age=3600
- GET /api/student/learning-cards → Cache-Control: private, max-age=1800
- GET /api/student/leaderboard → Cache-Control: private, s-maxage=300
- GET /api/public/* (inquiry confirmation) → Cache-Control: no-store

TASK 4 — FRONTEND BUNDLE:
Add /next.config.ts optimizations:
- images.formats: ['image/webp', 'image/avif']
- images.deviceSizes: [640, 750, 828, 1080, 1200]
- experimental.optimizeCss: true
- Remove console.log in production: compiler.removeConsole: { exclude: ['error', 'warn'] }

Audit imports:
- Confirm @tanstack/virtual is used on: leaderboard, admin student table, RTO sign grid, instructor roster
- Confirm NO full library imports (import _ from 'lodash' → import debounce from 'lodash/debounce')
- Confirm framer-motion is only imported in client components ('use client')

TASK 5 — RATE LIMITING VERIFICATION:
Confirm /lib/rate-limit.ts is applied to:
- POST /api/public/bookings ← most important
- POST /api/public/inquiry
- POST /api/auth/forgot-password
- All POST /api/auth/* routes

TASK 6 — SECURITY HEADERS:
Add to next.config.ts headers():
```javascript
{
  key: 'X-Frame-Options', value: 'DENY'
},
{
  key: 'X-Content-Type-Options', value: 'nosniff'
},
{
  key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'
},
{
  key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'
},
{
  key: 'X-XSS-Protection', value: '1; mode=block'
}
```

TASK 7 — INPUT SANITIZATION:
Add Zod validation schemas in /lib/validators/:
- bookingSchema: name, phone (Indian mobile regex), email (optional), trainingType enum
- inquirySchema: name, phone, message (max 1000 chars)
- feedbackSchema: studentId, tag enum, content (max 500 chars)
- loginSchema: email, password (min 8 chars)

Every API route that accepts input MUST validate with Zod before touching the DB.
Return 400 with specific field errors if validation fails.

TASK 8 — IMAGE OPTIMIZATION:
All next/image components — audit for:
- sizes prop set correctly for each usage context
- priority prop on above-the-fold images only
- placeholder="blur" with blurDataURL for any real images
- Profile images: maximum 200x200, enforce in upload handler
```

---

## SESSION 14 — Seed Data & Final Audit
### Populate the DB with realistic data. Then final quality check.

```
Read ARCHITECTURE.md.

PART 1 — SEED FILE:
Create prisma/seed.ts with complete seed data.
Run with: npx prisma db seed

Seed:
- 1 admin user: admin@sriguru.in / Admin@123
- 2 instructors:
  rajesh@sriguru.in / Instructor@123 — "Rajesh Kumar", 8 years, Beginner & Highway
  priya@sriguru.in / Instructor@123 — "Priya Sharma", 5 years, RTO Prep & Advanced
- 5 students (each with realistic XP, level, streak data):
  arjun.reddy@student.in / Student@123 — Level 4, 680 XP, 7-day streak, BEGINNER
  sneha.patel@student.in / Student@123 — Level 2, 210 XP, 3-day streak, ADVANCED
  vikram.singh@student.in / Student@123 — Level 6, 1450 XP, 12-day streak, BEGINNER
  kavya.nair@student.in / Student@123 — Level 1, 45 XP, 1-day streak, RTO_FAST_TRACK
  rohit.mehta@student.in / Student@123 — Level 3, 420 XP, 5-day streak, ADVANCED
- 12 badges (all BadgeType values)
- 18 LearningCards (all skills — use the card data from previous context)
- 12 RoadmapNodes (across all 5 phases)
- 50+ RTOQuestions (across all categories — use question data from previous context)
- 10 Slots (mix of ACTIVE and FULL, next 2 weeks)
- 3 Bookings (1 PENDING, 1 APPROVED, 1 COMPLETED)
- 5 Sessions (mix of SCHEDULED and COMPLETED)
- Sample attendance, feedback, and XP events for the student data

PART 2 — FINAL AUDIT:
Run through this complete checklist and fix every failure.

VISUAL AUDIT:
□ No box-shadow on any card component (grep for "box-shadow" in components/)
□ No purple/violet colors anywhere (grep for "purple\|violet\|#[89A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]")
□ No emoji used as icons (grep for emoji characters in JSX)
□ Road signs are SVG paths from /lib/icons/road-signs.tsx
□ Outfit font used for all headings (grep for font-family or Outfit class)
□ All lists > 20 items use @tanstack/virtual

ANIMATION AUDIT:
□ No animation uses width, height, top, left, margin, padding as animated property
□ All scroll reveals use Framer Motion viewport prop
□ RTO mock test timer uses requestAnimationFrame (grep for setInterval)
□ Reduced motion hook used in all major animated components

PERFORMANCE AUDIT:
□ Every Prisma findMany has select:{}
□ DATABASE_URL has pgbouncer=true
□ Caching headers on appropriate API routes
□ next/image with sizes prop everywhere
□ loading.tsx exists for every route segment

SECURITY AUDIT:
□ /api/instructor/* verifies instructorId matches session user
□ /api/admin/* verifies role === 'ADMIN'
□ /api/student/* verifies studentId matches session user
□ No raw SQL anywhere (all Prisma ORM)
□ Rate limiting on all public POST routes
□ Zod validation on all API routes that accept input
□ Security headers in next.config.ts

ACCESSIBILITY AUDIT:
□ All icon-only buttons have aria-label
□ All loading states have aria-busy
□ Focus trap in modals
□ :focus-visible ring on all interactive elements
□ Keyboard navigation works on: nav, cards, modals, accordions
□ Color contrast passes 4.5:1 for normal text

UX AUDIT:
□ EmptyState shown for every possible empty data scenario
□ Every form has loading state + success/error feedback
□ Optimistic updates on: attendance, card completion, notification read
□ ErrorBoundary wrapping all portal content
□ Offline detection banner working

LAYOUT AUDIT:
□ Student portal has orbital nav (NO sidebar)
□ Admin portal uses 3-column layout
□ Instructor portal uses split-panel layout
□ No equal-height 3-column card grids on any dashboard

Fix every failure. Report what was fixed and what remains as known limitations.
Run: git add -A && git commit -m "Session 14: Seed data + final audit complete"
```

---

## DEPLOYMENT CHECKLIST
### Run when ready to go live on Vercel + Neon

```
PRE-DEPLOYMENT:

1. Neon setup:
   - Create project at neon.tech (free tier)
   - Copy both connection strings (pooled + direct)
   - Add ?pgbouncer=true&connection_limit=1 to DATABASE_URL
   - Run: npx prisma migrate deploy
   - Run: npx prisma db seed

2. Vercel setup:
   - Connect GitHub repo
   - Framework preset: Next.js
   - Add ALL environment variables from .env.example
   - Generate NEXTAUTH_SECRET: openssl rand -base64 32
   - Set NEXTAUTH_URL to your Vercel domain

3. Environment variables in Vercel:
   DATABASE_URL (pooled, with pgbouncer)
   DIRECT_URL (direct, without pgbouncer)
   NEXTAUTH_SECRET
   NEXTAUTH_URL (set after first deploy)
   NEXT_PUBLIC_APP_URL
   NEXT_PUBLIC_ACADEMY_NAME

4. Post-deploy verification:
   □ Homepage loads
   □ /auth/login works
   □ Admin login (admin@sriguru.in) works
   □ Student login works
   □ Booking form submits
   □ API routes return 200 (not 500)
   □ No console errors in browser

FREE TIER LIMITS TO WATCH:
- Neon: 512MB storage, 1GB data transfer/month — should be fine for an academy
- Vercel: 100GB bandwidth, 100 serverless function invocations/day on hobby
  (upgrade to Pro at ~50 active daily users)
- Cloudinary: 25GB storage, 25GB bandwidth/month — fine for profile photos only

MONITORING (all free):
- Vercel Analytics: enable in project settings (free)
- Vercel Speed Insights: enable in project settings (free)
- Error monitoring: add Sentry free tier if desired
  npx @sentry/wizard@latest -i nextjs
```

---

## QUICK REFERENCE — Login Credentials After Seeding

| Role       | Email                        | Password      |
|------------|------------------------------|---------------|
| Admin      | admin@sriguru.in             | Admin@123     |
| Instructor | rajesh@sriguru.in            | Instructor@123 |
| Instructor | priya@sriguru.in             | Instructor@123 |
| Student    | arjun.reddy@student.in       | Student@123   |
| Student    | vikram.singh@student.in      | Student@123   |

---

*Total: 14 sessions + 3 pre-build steps + deployment checklist*
*Estimated build time: 14–20 focused Claude Code sessions*
*Free tier: Vercel (hobby) + Neon (free) + Cloudinary (free) — $0/month*
