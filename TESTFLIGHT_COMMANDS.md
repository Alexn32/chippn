# TestFlight Build Commands — Ready to Go

## 🚀 Tomorrow on Your Mac (One Command Per Step)

### Step 1: Update Code
```bash
cd ~/projects/chippn
git pull origin main
npm install
```

### Step 2: Create .env.local (Copy the exact values below)
```bash
cat > .env.local << 'EOF'
EXPO_PUBLIC_SUPABASE_URL=https://ilhihpjechjzgqcukbuz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGlocGplY2hqemdxY3VrYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODA1OTAsImV4cCI6MjA4NzY1NjU5MH0.GI9AR19iz7rD9aFzBRk6XJhQFz8P0pRKAmIpYcFum_M
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGlocGplY2hqemdxY3VrYnV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA4MDU5MCwiZXhwIjoyMDg3NjU2NTkwfQ.o9jnLHTScqkuMr7EeyBEyeYX_ptw4oFaof3oCL12u-Y
EXPO_PUBLIC_REVENUECAT_API_KEY=test_sTZRRHMrnCngyDnptPYRFFCmxIS
EXPO_PUBLIC_CLAUDE_API_KEY=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
EXPO_PUBLIC_APPLE_TEAM_ID=935300545
EOF
```

### Step 3: Install EAS CLI (One-time)
```bash
npm install -g eas-cli
```

### Step 4: Login to EAS
```bash
eas login
# Use your Apple ID: asnielsen99@icloud.com
# Use your Apple ID password (or create an App Specific Password)
```

### Step 5: Build for TestFlight
```bash
eas build --platform ios --build-app-id com.alexn32.chippn
```

Wait for build to complete (~10 min). You'll see a link when done.

### Step 6: Submit to TestFlight
```bash
eas submit --platform ios --latest
```

Follow the prompts. It will ask for:
- Apple ID password (or app-specific password)
- Your Apple Team ID (935300545 - will auto-fill)

---

## ✅ What's Included in the Build

- ✅ Auth (email/password signup + signin)
- ✅ Full 5-step onboarding
- ✅ Household creation + joining
- ✅ Chore management (list, create, complete)
- ✅ Photo verification with Claude AI
- ✅ Real-time chat (anonymous toggle)
- ✅ RevenueCat paywall ($4.99/month)
- ✅ Push notifications
- ✅ User profiles + settings
- ✅ Supabase backend (secure)

---

## 🔐 Security Notes

- All API keys are environment variables (not in code)
- RevenueCat in test mode (won't charge real money)
- Supabase RLS policies enforce access control
- Photo uploads go directly to Supabase Storage
- Claude API only used for photo verification

---

## 📱 Testing in TestFlight

Once submitted, you can:
1. Invite yourself as a tester
2. Install from TestFlight on your iPhone
3. Test all flows
4. Iterate + push new builds

---

## 🐛 If Anything Breaks During Build

1. Check console output for errors
2. Verify .env.local has all 6 keys
3. Try: `eas build --platform ios --build-app-id com.alexn32.chippn --clear-cache`
4. Check that `npm install` completed without errors

---

**That's it. Tomorrow: Paste these commands into Terminal and go live. 🚀**
