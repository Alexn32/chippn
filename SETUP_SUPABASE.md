# Supabase Setup Instructions

## 1. Run SQL Migrations

Go to your Supabase dashboard:
1. **https://app.supabase.com** → Select your project (ilhihpjechjzgqcukbuz)
2. **SQL Editor** (left sidebar)
3. **New Query**
4. Copy the entire contents of `migrations/001_initial_schema.sql`
5. Paste into the editor
6. Click **Run** (▶️ button)
7. Wait for completion (should see "✓ Success")

Then repeat for `migrations/002_rls_policies.sql`

## 2. Configure Storage (for photos)

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. **New bucket** → Name: `chore-photos`
3. Set to **Public** (so photos can be viewed)
4. Click **Create bucket**

## 3. Configure Auth (Email)

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (should be by default)
3. Go to **Email Templates**
4. Confirm "Confirm signup" is set up (default is fine)

## 4. Test Connection from App

Once migrations are done, you can start testing in Expo Go:

```bash
cd /data/.openclaw/workspace/chippn
npm install
npm start
```

Then scan the QR code with your phone.

## 5. Verify Schema

To verify tables were created:
1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. You should see: `users`, `households`, `household_members`, `chores`, `chore_assignments`, `chat_messages`, `notification_tokens`
3. Click each one to verify columns and data types

## Common Supabase Issues

**Error: "Relation does not exist"**
- Migration didn't run. Check SQL syntax in the editor and try again.

**Error: "Permission denied" when signing up**
- RLS policies not applied. Run migration 002 again.

**Photos not uploading**
- Storage bucket not created. Run step 2 above.

**Can't see data in app**
- Check RLS policies in **Authentication → Policies** (show all policies)
- Ensure auth.uid() matches the logged-in user ID

---

## When to Test in Expo Go

**Test after running both migrations (001 + 002):**

1. Auth flow (sign up → sign in)
2. Create household
3. Join household (use the invite code)
4. Verify data appears in Supabase table editor

**You should NOT test** the chore/chat screens yet — those screens need more implementation work.

---

Let me know when migrations are done running! 🚀
