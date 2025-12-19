# 🚀 Deployment Guide - Daily Urlist

## Current Situation

- **Local Development:** ✅ Working (using SSH tunnel to Hetzner database)
- **Production:** Currently on Vercel, but **cannot connect to Hetzner database** (database is internal-only)

## Problem

Your Next.js app has API routes that connect directly to PostgreSQL using Prisma. Since the database is:
- ✅ Internal-only (not exposed to internet - this is good for security!)
- ✅ Only accessible from within Docker network on Hetzner server

**Vercel (running on AWS/GCP) cannot connect to your internal database.**

## Solution: Deploy to Coolify

Deploy your Next.js app to Coolify on your Hetzner server. This way:
- ✅ App runs in same Docker network as database
- ✅ Database stays secure (internal-only)
- ✅ Everything on one server (easier management)

---

## 📋 Step-by-Step: Deploy to Coolify

### Step 1: Commit Your Current Changes

```bash
git add .
git commit -m "feat: migrate to Hetzner PostgreSQL, add seed script, fix auth race condition"
git push
```

### Step 2: Deploy to Coolify

1. **Go to Coolify Dashboard**: `http://77.42.71.87:8000`

2. **Create New Application**:
   - Click "New Application" → "Git Repository"
   - Connect your GitHub repository
   - Select `daily-urlist` repository
   - Branch: `main`

3. **Configure Application**:
   - **Name**: `daily-urlist`
   - **Build Pack**: `Dockerfile` (if you have one) or `Node.js`
   - **Port**: `3000`
   - **Root Directory**: `/` (default)

4. **Set Environment Variables** in Coolify:

   ```
   # Base URL
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   # Or use IP: http://77.42.71.87:3000 (if no domain yet)

   # Database - Use internal Docker network
   DATABASE_URL=postgresql://daily_urlist_user:mIst200814013@xok0c8w8808g8080og4gccwc:5432/daily_urlist_db
   DIRECT_URL=postgresql://daily_urlist_user:mIst200814013@xok0c8w8808g8080og4gccwc:5432/daily_urlist_db

   # MongoDB - Use internal Docker network
   MONGODB_URI=mongodb://admin:7djTLiH2TJPWz7XBRgmCMEXwXZhQaExrPrNe0Q7SGhh6ZZ8CDRR8hdkxD5uG9hqA@t08sgc800wo08co48480ksgw:27017/admin?directConnection=true

   # NextAuth
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production

   # Copy all other env vars from .env.local:
   # SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
   # CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   # GOOGLE_GEMINI_API_KEY, GROQ_LLAMA_API_KEY, etc.
   # UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
   # UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN
   # QSTASH_URL, QSTASH_TOKEN, etc.
   ```

   **Important**: Use the **container names** (`xok0c8w8808g8080og4gccwc`, `t08sgc800wo08co48480ksgw`) in connection strings, NOT `localhost`!

5. **Build Settings** (if using Node.js build pack):
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: `20` (or latest LTS)

6. **Deploy**:
   - Click "Deploy"
   - Wait for build and deployment (5-10 minutes)

### Step 3: Configure Domain (Optional)

1. **If you have a domain**:
   - Add DNS A record pointing to `77.42.71.87`
   - In Coolify, add domain to your application
   - Coolify will auto-configure SSL (Let's Encrypt)

2. **If no domain yet**:
   - Access via IP: `http://77.42.71.87:PORT` (Coolify will assign a port)
   - Or use Coolify's built-in reverse proxy

### Step 4: Update Vercel (Optional - Keep as Backup)

**You can keep Vercel deployment as a backup**, but it won't work with the database. To disable it:
- In Vercel dashboard, pause the project (or delete it)

---

## 🔄 Migration Checklist

- [ ] Commit current changes to Git
- [ ] Push to GitHub
- [ ] Create application in Coolify
- [ ] Configure environment variables in Coolify (use container names!)
- [ ] Deploy application
- [ ] Test deployment
- [ ] Configure domain (optional)
- [ ] Update DNS (if using domain)
- [ ] Test production site
- [ ] Pause/delete Vercel deployment (optional)

---

## 🆘 Troubleshooting

### Database Connection Fails

**Problem**: App cannot connect to database

**Solution**:
- Verify container names are correct (`xok0c8w8808g8080og4gccwc` for PostgreSQL)
- Use internal Docker network names, NOT `localhost` or IP addresses
- Check environment variables in Coolify match exactly

### Build Fails

**Problem**: Build errors during deployment

**Solution**:
- Check build logs in Coolify
- Verify Node.js version matches your `.nvmrc` or `package.json` engines
- Check if all dependencies are in `package.json`

### App Works but API Routes Fail

**Problem**: Frontend loads but API calls fail

**Solution**:
- Check environment variables are set correctly
- Verify `DATABASE_URL` and `DIRECT_URL` use container names
- Check application logs in Coolify

---

## 📝 Notes

- **Vercel**: Keep paused/disabled (can't access internal database)
- **Coolify**: Primary deployment (same network as database)
- **Database**: Stays internal-only (secure)
- **Local Dev**: Continue using SSH tunnel

---

**Last Updated:** December 19, 2025  
**Status:** Ready for Coolify deployment ✅

