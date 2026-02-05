# 💌 Love Letter Email Setup Guide

Your proposal app now has email functionality! Here's how to set it up:

## 🎯 What's New

- Users can send love letters directly to their recipient's email
- Customizable email templates with beautiful HTML formatting
- Frontend collects sender and recipient email addresses
- Backend handles SMTP email delivery

## 🚀 Setup Instructions

### Step 1: Configure Email Credentials

#### Option A: Using Gmail (Recommended)
1. Go to your Google Account: https://myaccount.google.com
2. Enable 2-Factor Authentication (if not already enabled)
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Create a `.env` file in the root directory (copy from `.env.example`):
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SENDER_EMAIL=your-email@gmail.com
   SENDER_PASSWORD=your-app-password
   ```

#### Option B: Using Outlook
```
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SENDER_EMAIL=your-email@outlook.com
SENDER_PASSWORD=your-password
```

#### Option C: Using Other Email Providers
Check their SMTP settings and add them to `.env`

### Step 2: Local Testing

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Run backend
python -m uvicorn backend.main:app --reload

# In another terminal, run frontend
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 and test the love letter flow.

### Step 3: Deploy to Production

#### Frontend (Netlify) - Already Deployed ✅
Your frontend should auto-deploy when you push to GitHub.

#### Backend (Render) - Follow These Steps

1. Go to [render.com](https://render.com) and sign in
2. Click **"Create new"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `proposal-app-backend`
   - **Environment**: Docker
   - **Build Command**: (leave auto-detected)
   - **Start Command**: (leave auto-detected)
5. Add Environment Variables:
   - `SMTP_SERVER`: smtp.gmail.com
   - `SMTP_PORT`: 587
   - `SENDER_EMAIL`: your-email@gmail.com
   - `SENDER_PASSWORD`: your-app-password
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://proposal-app-backend.onrender.com`)

### Step 4: Update Frontend API URL

Edit `frontend/src/components/LoveLetter.jsx` and `Proposal.jsx`:

Find:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
```

Add to `frontend/.env`:
```
VITE_API_URL=https://proposal-app-backend.onrender.com
```

Or update the default in the components to your backend URL.

### Step 5: Test End-to-End

1. Visit your Netlify frontend URL
2. Select "Start with a Love Letter"
3. Fill in:
   - Recipient's name and email
   - Your name and email
   - Choose a template
   - Add a personal message
4. Preview and send
5. Check the recipient's email inbox!

## 📧 How It Works

### Frontend Flow
1. User selects a love letter template (Romantic, Poetic, Sweet, Classic)
2. Enters recipient's name and email
3. Enters their own name and email
4. Optionally adds a personal message
5. Previews the generated letter
6. Clicks "Send Letter" → Letter is sent via backend

### Backend Flow
1. Receives love letter data from frontend
2. Validates email addresses
3. Connects to SMTP server
4. Sends HTML-formatted email to recipient
5. Returns success/error response to frontend

## 🔒 Security Notes

- **Never commit `.env` file** - it contains passwords!
- `.env` is already in `.gitignore`
- Use app-specific passwords for Gmail (not your main password)
- On Render, environment variables are encrypted

## 🐛 Troubleshooting

### Email not sending?
- Check email credentials are correct
- Verify SMTP settings match your email provider
- Check backend logs for error messages
- For Gmail: ensure 2FA is enabled and app password is generated

### "Email config not set" message?
- Add environment variables to your production server
- Or leave empty for development (letters log to console instead)

### CORS errors?
- Backend already has CORS enabled for all origins
- Check browser console for detailed error messages

## 📝 Environment Variables Reference

```env
# SMTP Server Settings
SMTP_SERVER=smtp.gmail.com          # Email provider's SMTP server
SMTP_PORT=587                        # Usually 587 for TLS, 465 for SSL

# Sender Email Account
SENDER_EMAIL=sender@gmail.com        # Email account that sends letters
SENDER_PASSWORD=app-password         # App-specific password (not your main password)
```

## 🎉 You're All Set!

Your proposal app now has:
- ✨ Beautiful home screen with two options
- 💌 4 customizable love letter templates
- 📧 Email sending functionality
- 💍 Interactive proposal with moving "No" button
- 🎯 Success celebration screen

Go impress your special someone! 💕
