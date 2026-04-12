# DentalBook - Agent Instructions

## Project Summary
A Next.js 14 dental appointment booking system with patient self-service, dentist portals, and admin management. Uses SQLite via Prisma, NextAuth credentials auth, Resend emails, and Stripe payments.

## Commands
```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run lint       # ESLint (next lint)
npm run db:seed    # Seed database with test data
```

## Database
- **SQLite** via Prisma (file: `prisma/dev.db`)
- Run `npx prisma db push` after schema changes
- Run `npx prisma generate` after schema changes
- Seed credentials: `admin@dentalbook.com`, `dentist1@dentalbook.com`, `dentist2@dentalbook.com`, `dentist3@dentalbook.com` (all: `password123`)

## Design System (shadcn/ui)
The project uses shadcn/ui components with custom brand color `#00663d` (forest green).

### UI Components
Located in `src/components/ui/`:
- **Button** - Variants: default, destructive, outline, secondary, ghost, link
- **Input, Textarea, Label** - Form inputs
- **Card** - CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Badge** - Variants: default, secondary, destructive, outline, success, warning
- **Table** - Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- **Dialog** - Modal dialogs
- **Select, Checkbox** - Form controls
- **Avatar** - Avatar, AvatarImage, AvatarFallback
- **Tabs** - TabsList, TabsTrigger, TabsContent
- **Separator** - Section dividers
- **Skeleton** - Loading placeholders
- **DropdownMenu** - Dropdown menus
- **Sheet** - Side panels
- **Toast** - Notifications (use `useToast` hook)

### CSS Variables (globals.css)
Primary color: `#00663d` (mapped via `hsl(var(--primary))`)
- `--primary`: Main brand color
- `--primary-foreground`: Text on primary
- `--destructive`: Red for errors
- `--muted`: Backgrounds, secondary content
- Supports light/dark mode via `.dark` class

### Utilities
- `cn()` from `lib/utils.ts` - Merge tailwind classes

## Key Files
| Path | Purpose |
|------|---------|
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/auth.ts` | NextAuth config (credentials only) |
| `src/lib/email.ts` | Resend email functions |
| `src/app/api/` | API routes |
| `src/components/ui/` | shadcn/ui components |
| `src/app/dashboard/` | Admin/dentist dashboard routes |
| `src/app/book/` | Patient booking flow |

## User Roles
`PATIENT` | `DENTIST` | `ADMIN` - stored as strings in `User.role`

## Prisma Schema
String enums used (not native Prisma enums): `role`, `status`, `paymentStatus`, `category`

## API Routes
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/appointments` - POST (create booking), checks for double-booking
- `/api/dentists` - GET list, POST create
- `/api/dentists/[id]` - GET, PUT, DELETE
- `/api/dentists/[id]/availability` - GET, PUT weekly schedule
- `/api/dentists/[id]/availability/block` - POST, DELETE blocked dates
- `/api/dentists/[id]/slots` - GET available slots for date
- `/api/services` - GET list, POST create
- `/api/services/[id]` - PUT, DELETE
- `/api/payments/create-session` - Stripe checkout
- `/api/payments/webhook` - Stripe webhook
- `/api/settings` - GET, PUT clinic settings

## Important Patterns
- All Prisma queries use `prisma` singleton from `@/lib/prisma`
- Server components fetch data directly (no API calls needed)
- Client components use `'use client'` directive
- Use `date-fns` for date manipulation
- Form handling via `react-hook-form` + `zod` + `@hookform/resolvers`
- Toast notifications: `const { toast } = useToast()` hook

## Live Chat (Chatwoot)
Real-time live chat widget available on all pages for customer support.

### Setup
1. Create account at [chatwoot.com](https://app.chatwoot.com) (free tier: 1 agent)
2. Create a website inbox and get the website token
3. Add token to `.env`:
   ```
   NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN="your-token-here"
   ```
4. Configure in Chatwoot dashboard:
   - Set working hours (Mon-Fri 8AM-6PM)
   - Add greeting messages
   - Create canned responses for common questions
   - Add agent accounts for clinic staff

### Features
- Pre-chat form (collects name & email)
- Offline message collection
- Real-time WebSocket messaging
- File attachments
- Agent dashboard for staff
- Mobile responsive

### Files
- `src/components/chat/chatwoot-provider.tsx` - Chatwoot SDK wrapper
- `src/components/chat/chat-button.tsx` - Floating chat button component
