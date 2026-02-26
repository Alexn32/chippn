# Chippn — AI-Powered Roommate Coordination App

## Overview

Chippn is a mobile app that eliminates roommate conflict by using AI to manage household chores fairly and transparently.

**Stack:** React Native (Expo) + Supabase + Claude API + RevenueCat

---

## Getting Started

### 1. Install Dependencies

```bash
cd /data/.openclaw/workspace/chippn
npm install
```

### 2. Set Up Supabase Schema

Follow the instructions in `SETUP_SUPABASE.md`:
- Run the two SQL migrations in your Supabase dashboard
- Create the `chore-photos` storage bucket
- Verify all tables are created

### 3. Start Developing

```bash
npm start
```

Scan the QR code with your phone using Expo Go app.

---

## Project Structure

```
chippn/
├── src/
│   ├── screens/          # All UI screens
│   │   ├── auth/         # Sign up, sign in, welcome
│   │   ├── onboarding/   # 5-step onboarding flow
│   │   ├── app/          # Main app screens (my chores, all chores, chat, profile)
│   │   └── payment/      # Paywall screen
│   ├── context/          # State management (Auth, Household)
│   ├── hooks/            # Custom hooks (useSubscription, etc.)
│   ├── lib/              # Utilities (Supabase client, queries)
│   ├── components/       # Reusable components
│   └── navigation/       # Navigation stack + router
├── migrations/           # SQL migrations
├── App.tsx              # Root component
├── app.json             # Expo config
└── package.json         # Dependencies
```

---

## Key Features & Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Auth (signup/signin) | ✅ Done | Supabase Auth |
| Onboarding flow | ✅ Done | 5 screens, stores user pain points |
| Create household | ✅ Done | Auto-generates 6-char invite codes |
| Join household | ✅ Done | Via invite code |
| My chores screen | 🚧 In Progress | Display assigned chores, complete button |
| Create chore | 🚧 In Progress | Form for adding chores |
| Complete chore | 🚧 In Progress | Photo optional, send to Claude for verification |
| Chat | 🚧 In Progress | Real-time group messages, anonymous toggle |
| Notifications | 🚧 In Progress | Push reminders, overdue alerts |
| RevenueCat paywall | 🚧 In Progress | Fully integrated with subscription checking |

---

## Design System

### Colors
- **Primary:** `#10B981` (Emerald)
- **Secondary:** `#F59E0B` (Amber)
- **Background:** `#FFFFFF`
- **Text:** `#111827` (dark), `#6B7280` (muted)

### Typography
- **Font:** Inter
- **H1:** 32px, 700
- **H2:** 24px, 600
- **Body:** 16px, 400

### Components
- Buttons: Rounded 8px, min 48px height
- Inputs: Rounded 8px, border 1px solid #E5E7EB
- Cards: Rounded 12px, soft shadow

---

## Supabase Schema

### Key Tables

**users**
- `id` (UUID)
- `email` (unique)
- `display_name`
- `subscription_status` (free | active | cancelled)
- `subscription_expiry` (timestamp)

**households**
- `id` (UUID)
- `name`
- `invite_code` (unique, 6 chars)
- `created_by` (user ID)

**chore_assignments**
- Tracks who's doing what, when
- Has `status` (pending | completed | overdue)
- Has `photo_url` and `photo_verified`

**chat_messages**
- `is_anonymous` toggle
- Real-time via Supabase subscriptions

---

## Common Tasks

### Adding a New Screen

1. Create file in `src/screens/{category}/{ScreenName}.tsx`
2. Import in navigation (`src/navigation/RootNavigator.tsx`)
3. Add route to the appropriate stack
4. Update navigation props type

### Fetching Data

Use query functions from `src/lib/queries.ts`:

```tsx
import { getUserChores, getHouseholdMembers } from '../lib/queries';

const myChores = await getUserChores(userId, householdId);
const members = await getHouseholdMembers(householdId);
```

### Handling Auth State

Use the `useAuth()` hook:

```tsx
import { useAuth } from '../context/AuthContext';

export function MyScreen() {
  const { user, signOut } = useAuth();
  
  if (!user) return <Text>Not logged in</Text>;
  
  return <Text>Welcome, {user.email}</Text>;
}
```

---

## Useful Scripts

```bash
# Start dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Build for TestFlight
npm run build:ios

# Submit to TestFlight
npm run submit:ios
```

---

## Environment Variables

See `.env.local` for:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_API_KEY`
- `EXPO_PUBLIC_CLAUDE_API_KEY`

(Keys are already set up — don't commit to git)

---

## Testing Checklist

Before TestFlight, verify:

- [ ] Auth flow works (signup → confirm email → signin)
- [ ] Can create household
- [ ] Can join household with invite code
- [ ] Household info displays (members, invite code)
- [ ] Can create a chore
- [ ] Can complete a chore (with photo)
- [ ] Photo uploads to Claude for verification
- [ ] Can send chat messages (anonymous option works)
- [ ] Push notifications send on schedule
- [ ] Paywall shows after joining household
- [ ] Subscription status updates after payment
- [ ] All errors handled gracefully

---

## Debugging Tips

**Nothing shows up?**
- Check console logs: `npm start` shows warnings/errors
- Verify Supabase keys in `.env.local`
- Make sure migrations ran successfully

**Auth not working?**
- Check Supabase email confirmation in dashboard
- Verify RLS policies are enabled

**Photos not uploading?**
- Check `chore-photos` bucket exists in Supabase Storage
- Verify bucket is public

**Chat not real-time?**
- Supabase realtime subscription might not be active
- Check browser console for connection errors

---

## Next Steps (Priority Order)

1. ✅ Supabase schema setup (run migrations)
2. 🚧 Implement household screen (display members, copy invite)
3. 🚧 Implement my chores screen (list, complete button)
4. 🚧 Implement complete flow (camera, photo verification)
5. 🚧 Implement chat screen (real-time)
6. 🚧 Implement notifications
7. 🚧 Polish + error handling
8. 🚧 TestFlight build + submit

---

## When to Test in Expo Go

**Start testing after:**
- Running both SQL migrations successfully
- Creating `chore-photos` bucket
- Verifying all tables exist in Supabase

**Test these flows:**
1. Sign up with email
2. Create household
3. Join household (use the code)
4. See data appear in Supabase

Let Chippy know when migrations are done! 🚀
