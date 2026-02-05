# 📧 Netlify Functions Email Setup

Your proposal app now uses **Netlify Functions** - no separate backend needed! All email sending happens directly on Netlify.

## 🚀 Setup Steps

### Step 1: Add Environment Variables to Netlify

1. Go to your Netlify project dashboard: https://app.netlify.com
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Add environment variables**
4. Add these variables:

**For Gmail:**
```
SENDER_EMAIL = your-email@gmail.com
SENDER_PASSWORD = your-app-password
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com
2. Enable 2-Factor Authentication (if not done)
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer" (or your device)
5. Copy the generated 16-character password
6. Paste it as SENDER_PASSWORD in Netlify

### Step 2: That's It!

The changes are already deployed. Netlify will automatically:
- Install dependencies (including nodemailer)
- Deploy the Netlify Functions
- Use the environment variables

## ✅ How It Works Now

**Frontend (Netlify Static Site) →**  
**Netlify Functions (Serverless) →**  
**Email Sent (Gmail/Other Provider)**

No backend server needed!

## 🧪 Testing

1. Visit your Netlify site
2. Go to "Start with a Love Letter"
3. Fill in all fields including emails
4. Click "Send Letter"
5. Check the recipient's inbox!

## 📍 Function Endpoints

- `/.netlify/functions/send-love-letter` - Sends love letters
- `/.netlify/functions/proposal-response` - Records proposal responses

These are automatically available on your Netlify site.

## 🔒 Security

- Environment variables are encrypted on Netlify
- Never commit `.env` or credentials to Git
- Netlify Functions run in a secure environment

## 🐛 Troubleshooting

### Email not sending?
- Check environment variables are set in Netlify
- Verify email addresses are correct
- Check Gmail account has 2FA enabled
- Check app password is 16 characters

### "Cannot find module nodemailer"?
- Netlify should auto-install from package.json
- Check build logs in Netlify dashboard
- Try triggering a new deploy

### See Netlify Build Logs
1. Go to **Deploys** tab in Netlify
2. Click the latest deploy
3. Click **Build log** to see details

## 🎯 You're Ready!

Everything is now hosted on Netlify only:
- Frontend: Static React app ✅
- Functions: Email sending ✅
- No separate backend needed ✅

Your app is production-ready! 🎉
