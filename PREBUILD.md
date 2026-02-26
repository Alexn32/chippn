# Pre-Build Checklist for TestFlight

## ✅ Code Complete
- [x] Auth flow (signup/signin)
- [x] Onboarding (5 screens)
- [x] Household management
- [x] My Chores (list + complete)
- [x] Complete Chore flow (camera + Claude verification)
- [x] Chat (real-time messages, anonymous)
- [x] All Chores view
- [x] Profile + settings
- [x] RevenueCat integration
- [x] Supabase queries

## ✅ Configuration
- [x] app.json configured for iOS
- [x] Bundle ID: com.alexn32.chippn
- [x] Team ID: 935300545
- [x] Info.plist permissions (camera, photos)
- [x] .env.local.example created
- [x] All dependencies in package.json

## ✅ Supabase
- [x] Schema migrated (7 tables)
- [x] RLS policies enabled
- [x] Storage bucket created (chore-photos)

## ✅ APIs Configured
- [x] Supabase: ilhihpjechjzgqcukbuz.supabase.co
- [x] RevenueCat: test_sTZRRHMrnCngyDnptPYRFFCmxIS
- [x] Claude: Haiku 4.5 for photo verification
- [x] Apple Team ID: 935300545

## 🚀 Ready for TestFlight

**On your Mac:**

```bash
cd ~/projects/chippn
git pull origin main
npm install
npm start
```

**Then when ready for EAS build:**

```bash
npm install -g eas-cli
eas login  # Use asnielsen99@icloud.com
eas build --platform ios
eas submit --platform ios
```

## ⚠️ Notes

- Photos are verified with Claude Haiku (cheapest model, ~$0.003 per verification)
- RevenueCat is in test mode (use test credentials to avoid real charges)
- All data stored in Supabase (secure, backed up)
- App is production-ready for TestFlight

## 📊 What's Included

- **Full auth** with email verification
- **Complete onboarding** flow
- **Household management** with invite codes
- **Chore system** with rotation algorithm
- **Photo verification** via Claude AI
- **Real-time chat** with anonymous mode
- **Push notifications** (when iOS allows)
- **Subscription paywall** (RevenueCat)
- **User profiles** and settings
- **Dark mode ready** (light theme currently)

## 🔐 Security

- Row-level security (RLS) on all tables
- Auth required for all actions
- No secrets in git (use .env.local)
- Photo verification prevents fake uploads
- Anonymous chat doesn't expose email

---

**App is ready. Tomorrow on Mac: `eas build --platform ios` 🚀**
