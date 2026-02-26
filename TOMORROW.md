# Tomorrow: 5 Simple Steps to TestFlight 🚀

## Step 1: Get New Claude API Key (3 min)

**Why:** GitHub deactivated the old key for security. We need a fresh one.

1. Go to: https://platform.claude.com/settings/keys
2. Click **Create Key**
3. Copy the key (it starts with `sk-ant-...`)
4. Send it to me
5. I'll add it to the app

---

## Step 2: Pull Latest Code (1 min)

```bash
cd ~/projects/chippn
git pull origin main
npm install
```

---

## Step 3: Add Your API Keys to .env.local (1 min)

```bash
cat > .env.local << 'EOF'
EXPO_PUBLIC_SUPABASE_URL=https://ilhihpjechjzgqcukbuz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGlocGplY2hqemdxY3VrYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODA1OTAsImV4cCI6MjA4NzY1NjU5MH0.GI9AR19iz7rD9aFzBRk6XJhQFz8P0pRKAmIpYcFum_M
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGlocGplY2hqemdxY3VrYnV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA4MDU5MCwiZXhwIjoyMDg3NjU2NTkwfQ.o9jnLHTScqkuMr7EeyBEyeYX_ptw4oFaof3oCL12u-Y
EXPO_PUBLIC_REVENUECAT_API_KEY=test_sTZRRHMrnCngyDnptPYRFFCmxIS
EXPO_PUBLIC_CLAUDE_API_KEY=<PASTE YOUR NEW KEY HERE>
EXPO_PUBLIC_APPLE_TEAM_ID=935300545
EOF
```

Replace `<PASTE YOUR NEW KEY HERE>` with the Claude key you just created.

---

## Step 4: Install EAS CLI & Login (5 min, one-time)

```bash
npm install -g eas-cli
eas login
# Use: asnielsen99@icloud.com
# Use: Your Apple ID password (or create app-specific password)
```

---

## Step 5: Build & Submit to TestFlight (15 min)

```bash
eas build --platform ios --build-app-id com.alexn32.chippn
```

Wait for build to complete (~10 min). Once done:

```bash
eas submit --platform ios --latest
```

Follow the prompts. Done! 🎉

---

## What You'll Get

- ✅ App on TestFlight (can invite yourself as tester)
- ✅ Full app functionality tested
- ✅ Ready for App Store submission
- ✅ Can iterate quickly with new builds

---

## Total Time: ~25 minutes

---

## If Anything Goes Wrong

1. Check terminal output for error message
2. Make sure `.env.local` has all 6 keys
3. Make sure `npm install` completed without errors
4. Try: `eas build --platform ios --build-app-id com.alexn32.chippn --clear-cache`

---

## Questions Before You Start?

Let me know now. Otherwise, just follow these 5 steps tomorrow! 🚀
