# Healthcare System Firebase Deployment Guide

## 🚀 Deployment Status

✅ **LandingPage**: Build successful, ready for deployment
✅ **Login System**: Build successful, ready for deployment  
✅ **Admin Dashboard**: Configuration ready
✅ **CI/CD Pipeline**: Updated with comprehensive workflow

## 📋 Deployment Steps

### 1. Firebase Project Setup
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create new project or select existing one
- Enable Firebase Hosting

### 2. GitHub Secrets Configuration
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Option A: Firebase Service Account (Recommended)
```bash
# Get service account JSON from Firebase Console
# Project Settings → Service Accounts → Generate new private key
```
**Secret Name**: `FIREBASE_SERVICE_ACCOUNT`
**Value**: Entire JSON content from Firebase

#### Option B: Firebase CLI Token
```bash
npm install -g firebase-tools
firebase login:ci
```
**Secret Name**: `FIREBASE_TOKEN`
**Value**: Generated token

### 3. Update Project ID
Edit `.github/workflows/firebase-hosting-complete.yml` and replace with your actual Firebase project ID:
```yaml
projectId: health-centre-automation
```

Your Firebase project ID is: **health-centre-automation**

### 4. Hosting Targets Configuration
Your firebase.json now supports multiple hosting targets:
- **landing**: LandingPage (main site)
- **login**: Login System
- **admin**: Admin Dashboard

### 5. Deploy Commands

#### Automatic Deployment (GitHub Actions)
```bash
# Push to main branch triggers full deployment
git push origin main

# Push to login branch triggers landing page deployment
git push origin login
```

#### Manual Deployment (Optional)
```bash
# Deploy all targets
firebase deploy

# Deploy specific target
firebase deploy --only hosting:landing
firebase deploy --only hosting:login
firebase deploy --only hosting:admin
```

## 🔗 Expected URLs After Deployment

- **Landing Page**: `https://health-centre-automation.web.app`
- **Login System**: `https://health-centre-automation.web.app/login`
- **Admin Dashboard**: `https://health-centre-automation.web.app/admin`

## 🛠️ Backend Deployment (Next Steps)

Your FastAPI backend needs separate deployment. Recommended options:

1. **Google Cloud Run** (Recommended for FastAPI)
2. **Firebase Functions** (Serverless)
3. **Heroku** (Easiest setup)
4. **AWS/GCP/Azure** (Full control)

## 📝 Build Verification

All frontend builds have been tested and verified:
```bash
✅ LandingPage: Built successfully (3.13s)
✅ Login System: Built successfully (3.20s)
```

## 🚨 Common Issues & Solutions

### Build Failures
- Ensure all dependencies are installed: `npm ci`
- Check Node.js version compatibility (v18 recommended)
- Verify Vite configuration files

### Deployment Failures
- Verify Firebase project ID is correct
- Check GitHub secrets are properly configured
- Ensure firebase.json targets match workflow configuration

### Authentication Issues
- Verify Firebase service account has proper permissions
- Check if Firebase Hosting is enabled in your project

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs for detailed error messages
2. Verify all builds work locally before deployment
3. Ensure Firebase project is properly configured
4. Check that all secrets are correctly set in GitHub

---

**Next Action**: Set up your Firebase project ID and GitHub secrets, then push to trigger deployment! 🎉