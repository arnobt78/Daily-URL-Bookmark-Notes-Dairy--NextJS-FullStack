# 🚀 Complete Hetzner VPS Migration Guide

## MongoDB, PostgreSQL & Backend Migration from Free Tiers to Self-Hosted VPS

---

## ✅ PROGRESS TRACKING

### Completed Steps ✓

- [x] **Hetzner Account Creation** - Account created, billing verified, 2FA enabled, DPA configured
- [x] **Server Purchase** - CX33 server purchased in Helsinki (hel1): `77.42.71.87`
- [x] **Initial VPS Security** - System updated, non-root user created, SSH secured
- [x] **SSH Configuration** - Root login disabled, password auth disabled, key-based auth only
- [x] **Firewall (UFW)** - Configured with OpenSSH, HTTP (80), HTTPS (443), Coolify (8000)
- [x] **Fail2Ban** - Installed and enabled (protecting SSH)
- [x] **Automatic Security Updates** - Enabled and configured
- [x] **Swap** - 2GB swap file created and activated
- [x] **Docker Installation** - Docker 27.0 installed and running
- [x] **Coolify Installation** - Coolify 4.0.0-beta.454 installed and running
- [x] **Coolify Admin Account** - Admin account created successfully
- [x] **Environment Variables Backup** - `.env` file backed up securely
- [x] **Coolify Server Validation** - Localhost server validated successfully (SSH keys configured, UFW rules added, passwordless sudo enabled)
- [x] **PostgreSQL Database Deployment** - PostgreSQL 17-alpine container deployed and running (`xok0c8w8808g8080og4gccwc`)
- [x] **MongoDB Database Deployment** - MongoDB 7 container deployed and running (`t08sgc800wo08co48480ksgw`)
- [x] **Database Security Verification** - Both databases verified as secure (network isolated, not exposed externally, proper permissions)
- [x] **Hetzner Cloud Firewall** - Network-level firewall configured and tested (4 rules: SSH, HTTP, HTTPS, Coolify UI)
- [x] **PostgreSQL Database Creation** - Created `daily_urlist_db` database with dedicated user
- [x] **Data Migration** - Migrated all existing data from CSV files to PostgreSQL (users, lists, sessions, comments, activities)

### Current Status

**Server Details:**

- IP Address: `77.42.71.87`
- Location: Helsinki (hel1), Finland
- OS: Ubuntu 24.04 LTS
- User: `deploy` (with sudo privileges)
- Coolify UI: `http://77.42.71.87:8000`

**Database Status:**

- **PostgreSQL:** ✅ Running and healthy (container: `xok0c8w8808g8080og4gccwc`)

  - Resource limits: 2GB RAM
  - Network: Internal only (not exposed)
  - SSL: Disabled (acceptable for internal-only use)
  - Status: Ready for project databases

- **MongoDB:** ✅ Running and healthy (container: `t08sgc800wo08co48480ksgw`)
  - Resource limits: 2GB RAM
  - Network: Internal only (not exposed)
  - SSL: Disabled (acceptable for internal-only use)
  - Status: Ready for project databases

**Security Status:**

- ✅ Network isolation: Databases only accessible via Docker network
- ✅ Firewall: Properly configured, database ports not exposed
- ✅ Resource limits: Configured appropriately
- ✅ Auto-restart: Enabled (`unless-stopped`)
- ✅ Data persistence: Volumes configured
- ✅ Connectivity: Verified and working

See `DATABASE_SECURITY_VERIFICATION.md` for complete security audit report.

### Next Steps 🎯

- [x] **Configure Hetzner Cloud Firewall** - Network-level firewall configured and tested ✅
- [x] **Create Project Databases** - Created `daily_urlist_db` in PostgreSQL ✅
- [x] **Data Migration** - Migrated all existing data to PostgreSQL ✅
- [ ] **Backend Deployment** - Deploy backend applications and connect to databases
- [ ] **SSL/HTTPS Setup** - Configure domains and SSL certificates for backend APIs
- [ ] **Backup Strategy** - Set up automated database backups (critical before production use)
- [ ] **Monitoring** - Set up uptime monitoring and alerts

---

## 📋 TABLE OF CONTENTS

1. [Why This Migration?](#-why-this-migration)
2. [Account Creation & Server Purchase](#-account-creation--server-purchase)
3. [Initial VPS Setup & Security](#-initial-vps-setup--security)
4. [Coolify Installation & Configuration](#-coolify-installation--configuration)
5. [Database Setup (PostgreSQL & MongoDB)](#-database-setup)
6. [Backend Deployment](#-backend-deployment)
7. [Frontend Integration](#-frontend-integration)
8. [Security Best Practices](#-security-best-practices)
9. [Backup Strategy](#-backup-strategy)
10. [Cost Analysis](#-cost-analysis)
11. [Is This a Good Idea?](#-is-this-a-good-idea)

---

## 🎯 WHY THIS MIGRATION?

### Problem Statement

**Current Setup (Free Tiers):**

- **MongoDB Atlas Free Tier**: Databases pause after inactivity, cold starts, unpredictable delays
- **NeonDB/Supabase Free Tier**: PostgreSQL databases sleep, connection timeouts, no guaranteed uptime
- **Render Free Tier**: Backend services cold start (30-60 seconds), spin down after inactivity, random pauses
- **Issues:**
  - ❌ No notification before database pause
  - ❌ First request after pause takes 30-60 seconds
  - ❌ Unpredictable downtime
  - ❌ No control over infrastructure
  - ❌ Limited resources and quotas
  - ❌ Multiple services = multiple points of failure

### Solution: Self-Hosted VPS

**Target Architecture:**

```bash
Hetzner VPS (CX33: 4 vCPU, 8GB RAM, 80GB SSD)
│
├─ Coolify (Self-Hosted PaaS)
│   ├─ PostgreSQL Container (All projects share one instance, separate databases)
│   ├─ MongoDB Container (All projects share one instance, separate databases)
│   ├─ Backend API #1 (Node.js/Express)
│   ├─ Backend API #2
│   ├─ Backend API #3
│   └─ ... (8-10 backend projects)
│
└─ Nginx + SSL (Managed by Coolify)

Frontends:
├─ Vercel (Next.js frontends)
└─ Netlify (Alternative frontends)

External Services:
└─ Cloudinary (Image storage - URLs only in DB)
```

**Benefits:**

- ✅ **24/7 Uptime**: No cold starts, no pauses, always online
- ✅ **Fixed Monthly Cost**: €6.53/month (predictable billing)
- ✅ **Full Control**: Complete infrastructure control
- ✅ **No Limits**: Unlimited projects, databases, deployments
- ✅ **Fast Response**: No cold start delays
- ✅ **Production-Ready**: Suitable for demo and real-world projects
- ✅ **Single Point of Management**: All backends and DBs in one place

---

## 🔐 ACCOUNT CREATION & SERVER PURCHASE

### Step 1: Create Hetzner Account

1. **Go to**: <https://www.hetzner.com/cloud/>
2. **Click**: "Get started" or "Sign Up"
3. **You'll be redirected to**: <https://accounts.hetzner.com/login>
4. **If you don't have an account**:
   - Click "Register now"
   - Fill in:
     - Email address
     - Password (strong password)
     - Country
     - Accept terms
   - Verify your email (check inbox)
5. **Add Billing Information**:
   - Go to billing settings
   - Add credit card or PayPal
   - Verify payment method

### Step 2: Access Cloud Console

1. **Login**: <https://console.hetzner.cloud>
2. **Create a Project**:
   - Click "New Project"
   - **Name**: Choose a professional name for your platform:
     - `dev-platform` - Development platform
     - `demo-hub` - Demo projects hub
     - `project-stack` - Project stack
     - `dev-infra` - Development infrastructure
     - `demo-vps` - Demo VPS platform
     - Or your own preferred name
   - **Description**: "Self-hosted platform for all demo and development projects"
   - **Note**: The project name is like a root folder/container that organizes all your servers, databases, and resources in Hetzner Cloud Console. It's for logical grouping and doesn't affect functionality.

### Step 3: Create Server (CX33)

1. **In your project**, click "Add Server"
2. **Configure Server**:

   - **Location**: Choose closest to you:
     - `Nuremberg (nbg1)` - Germany ⭐ **Recommended for Frankfurt area** (lowest latency)
     - `Falkenstein (fsn1)` - Germany (alternative German location)
     - `Helsinki (hel1)` - Finland
     - `Ashburn (ash)` - USA (East Coast)
     - `Hillsboro (hil)` - USA (West Coast)
     - `Singapore (sin)` - Asia
     - **For Frankfurt, Germany**: Choose **Nuremberg (nbg1)** for best performance and lowest latency
   - **Image**: `Ubuntu 22.04` (LTS recommended)
   - **Type**: `CX33` (Intel® / AMD)
     - 4 vCPU
     - 8 GB RAM
     - 80 GB NVMe SSD
     - 20 TB Traffic included
   - **SSH Keys**:

     - **IMPORTANT**: Add your local SSH public key
     - If you don't have one, generate it:

       ```bash
       ssh-keygen -t ed25519 -C "your_email@example.com"
       cat ~/.ssh/id_ed25519.pub
       ```

     - Copy the output and paste it in Hetzner console

   - **IPv4**: Enabled (default)
   - **IPv6**: Optional (can enable if needed)
   - **Networks**: Default (can add later)
   - **Firewalls**: Default (we'll configure manually)
   - **Backups**: Optional (€0.011/GB/month)
   - **Volumes**: None (we'll use local storage)

3. **Review & Create**:
   - Check all settings
   - Click "Create & Buy Now"
   - Server will be created in ~30 seconds
4. **Note Your Server IP**:
   - You'll see it in the console
   - Example: `123.45.67.89`
   - **Save this IP** - you'll need it!

### Step 4: Initial Server Access

```bash
# SSH into your server (replace with your IP)
ssh root@YOUR_SERVER_IP

# If you used a custom SSH key, specify it:
ssh -i ~/.ssh/your_key root@YOUR_SERVER_IP
```

---

## 🛡️ INITIAL VPS SETUP & SECURITY

### Step 1: System Update

```bash
# Update package list
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git ufw fail2ban unattended-upgrades
```

### Step 2: Create Non-Root User

```bash
# Create deploy user
adduser deploy

# Add to sudo group
usermod -aG sudo deploy

# Switch to deploy user
su - deploy

# Test sudo access
sudo whoami  # Should output: root
```

### Step 3: SSH Key Setup for Deploy User

```bash
# As deploy user, create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Copy your public key (from your local machine)
# On your LOCAL machine, run:
cat ~/.ssh/id_ed25519.pub

# Copy the output, then on SERVER:
nano ~/.ssh/authorized_keys

# Paste your public key, save (Ctrl+X, Y, Enter)
chmod 600 ~/.ssh/authorized_keys
```

### Step 4: Secure SSH Configuration

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

**Make these changes:**

```bash
# Disable root login
PermitRootLogin no

# Disable password authentication (use keys only)
PasswordAuthentication no
PubkeyAuthentication yes

# Change default port (optional but recommended)
Port 2222  # Change from 22 to 2222 (or any port 1024-65535)

# Disable empty passwords
PermitEmptyPasswords no

# Limit login attempts
MaxAuthTries 3

# Disable X11 forwarding (if not needed)
X11Forwarding no
```

**Restart SSH:**

```bash
sudo systemctl restart sshd

# Test connection from new terminal (don't close current!)
# If it works, you can close the old connection
```

### Step 5: Configure Firewall (UFW)

```bash
# Allow SSH (use your custom port if changed)
sudo ufw allow 2222/tcp  # or 22 if you kept default

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow Coolify port (default 8000)
sudo ufw allow 8000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### Step 6: Install Fail2Ban (Brute Force Protection)

```bash
# Fail2Ban is already installed, configure it
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

### Step 7: Automatic Security Updates

```bash
# Configure automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Enable automatic reboots (optional, for critical updates)
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Uncomment:
# Unattended-Upgrade::Automatic-Reboot "true";
# Unattended-Upgrade::Automatic-Reboot-Time "02:00";
```

### Step 8: Disable Unnecessary Services

```bash
# Check running services
sudo systemctl list-units --type=service --state=running

# Disable services you don't need (example)
sudo systemctl disable snapd  # If snapd is installed
sudo systemctl disable bluetooth  # If not needed
```

### Step 9: Set Up Swap (Optional but Recommended)

```bash
# Check current swap
free -h

# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make it permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

### Step 10: Server Hardening Summary

✅ **Completed:**

- Non-root user created
- SSH keys only (no passwords)
- Firewall enabled (UFW)
- Fail2Ban installed
- Automatic security updates
- SSH port changed (optional)
- Swap configured

**Your server is now significantly more secure!**

---

## 🐳 COOLIFY INSTALLATION & CONFIGURATION

### What is Coolify?

**Coolify** is a self-hosted alternative to Heroku, Vercel, Netlify, and Render. It:

- Manages Docker containers
- Handles SSL certificates (Let's Encrypt)
- Provides web UI for deployments
- Supports Git-based deployments
- Manages databases
- Handles environment variables
- Provides logs and monitoring

### Step 1: Install Coolify

```bash
# Make sure you're logged in as 'deploy' user
whoami  # Should output: deploy

# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# This will:
# - Install Docker
# - Install Docker Compose
# - Install Coolify
# - Set up networking
# - Start Coolify service

# Wait for installation (5-10 minutes)
```

### Step 2: Access Coolify UI

1. **Open browser**: `http://YOUR_SERVER_IP:8000`
2. **First-time setup**:
   - Create admin email (your email)
   - Create strong password
   - **Save these credentials!**
3. **You're now in Coolify dashboard!**

### Step 3: Configure Coolify Settings

1. **Go to Settings** (gear icon)
2. **Configure**:
   - **Server IP**: Your Hetzner server IP
   - **Domain**: Your domain (if you have one) or leave blank for now
   - **Email**: Your email (for Let's Encrypt SSL)
   - **Docker Network**: Default is fine
3. **Save settings**

### Step 4: Add Your Domain (Optional but Recommended)

If you have a domain (e.g., `yourdomain.com`):

1. **Add DNS Records** (in your domain registrar):

   ```dns
   Type: A
   Name: @
   Value: YOUR_SERVER_IP
   TTL: 3600

   Type: A
   Name: *
   Value: YOUR_SERVER_IP
   TTL: 3600
   ```

2. **In Coolify**:
   - Go to Settings → Domains
   - Add your domain
   - Verify DNS propagation

---

## 🗄️ DATABASE SETUP

### ⚠️ Security First: Database Architecture

**Important Security Principles:**

- ✅ **Databases are NOT publicly exposed** - Only accessible from within Docker network
- ✅ **Strong passwords required** - Generate and save securely
- ✅ **Network isolation** - Databases only accessible via internal Docker DNS
- ✅ **Separate databases per project** - Isolation at database level
- ✅ **Optional: Separate users per database** - For additional security

### PostgreSQL Setup (All Projects)

**Strategy**: One PostgreSQL container, multiple databases (one per project)

**Architecture:**

```bash
PostgreSQL Container (postgres-main)
├── project1_db (database)
├── project2_db (database)
└── project3_db (database)
```

**Security Configuration:**

- Port 5432: **Internal only** (not exposed to internet)
- Access: Only via Docker internal DNS (`postgres-main:5432`)
- Authentication: Strong password required
- Network: Isolated Docker network (Coolify manages this)

#### Step 1: Deploy PostgreSQL Container

1. **In Coolify Dashboard**:

   - Click "New Resource" (or "Add Resource")
   - Select "PostgreSQL"
   - **Configuration**:
     - **Name**: `postgres-main` (used as Docker container name and internal DNS, or use default)
     - **Version**: `17-alpine` (latest stable, recommended) or `16` (LTS)
     - **Database**: `postgres` (default admin database, we'll create project databases separately)
     - **User**: `postgres` (superuser, for admin tasks)
     - **Password**:
       - **IMPORTANT**: Generate a strong password (minimum 16 characters)
       - Use: Uppercase, lowercase, numbers, special characters
       - **Example format**: `Pg#2025!SecurePass$Word`
       - **SAVE THIS PASSWORD SECURELY** (password manager recommended)
     - **Port**: `5432` (internal Docker port, NOT exposed publicly)
     - **Volume**: `postgres-data` (persistent storage - data survives container restarts)
     - **Resources** (optional, defaults usually fine):
       - CPU: 0.5-1.0 (shared with other services)
       - Memory: 1-2GB (adjust based on usage)
   - Click "Deploy"

2. **Wait for deployment** (2-3 minutes)
   - Watch the logs in Coolify UI
   - Verify status shows "Healthy" or "Running"

#### Step 2: Verify PostgreSQL Deployment

```bash
# SSH into server
ssh deploy@77.42.71.87

# Check PostgreSQL container is running
sudo docker ps | grep postgres

# Verify container is healthy
sudo docker ps --format "table {{.Names}}\t{{.Status}}" | grep postgres

# Test connectivity
sudo docker exec xok0c8w8808g8080og4gccwc pg_isready -U postgres
```

**Expected Output:**

- Container name: `xok0c8w8808g8080og4gccwc` (Coolify-generated ID, or your custom name)
- Status: `Up X minutes (healthy)`
- Connectivity: `/var/run/postgresql:5432 - accepting connections`

**Note:** Coolify generates unique container IDs. Use `docker ps` to find your actual container name, or use the name you specified in Coolify (e.g., `postgres-main`).

#### Step 3: Create Databases for Each Project

**Security Note**: Each project gets its own database for isolation. Optionally create separate users per database for enhanced security.

```bash
# Find your PostgreSQL container name
sudo docker ps | grep postgres

# Connect to PostgreSQL container (replace with your actual container name)
sudo docker exec -it xok0c8w8808g8080og4gccwc psql -U postgres
# OR if you named it 'postgres-main':
sudo docker exec -it postgres-main psql -U postgres

# You'll be in PostgreSQL prompt: postgres=#
```

**Create Databases:**

```sql
-- Create database for Project 1
CREATE DATABASE project1_db;

-- Create database for Project 2
CREATE DATABASE project2_db;

-- Create database for Project 3
CREATE DATABASE project3_db;

-- Continue for all your projects...
-- CREATE DATABASE projectN_db;

-- List all databases to verify
\l

-- Exit PostgreSQL
\q
```

**Optional: Create Dedicated Users per Database (Enhanced Security):**

```sql
-- Connect again if you exited (replace with your actual container name)
sudo docker exec -it xok0c8w8808g8080og4gccwc psql -U postgres

-- Create user for project1_db
CREATE USER project1_user WITH PASSWORD 'StrongPassword123!@#';
GRANT ALL PRIVILEGES ON DATABASE project1_db TO project1_user;

-- Create user for project2_db
CREATE USER project2_user WITH PASSWORD 'StrongPassword456!@#';
GRANT ALL PRIVILEGES ON DATABASE project2_db TO project2_user;

-- Repeat for each project...
-- Note: Use different strong passwords for each user!

-- Verify users
\du

-- Exit
\q
```

**If using dedicated users, connection string format:**

```bash
postgresql://project1_user:PASSWORD@postgres-main:5432/project1_db
```

```bash
# SSH into server
ssh deploy@77.42.71.87

# Find your PostgreSQL container name
sudo docker ps | grep postgres

# Connect to PostgreSQL container (replace with your actual container name)
sudo docker exec -it xok0c8w8808g8080og4gccwc psql -U postgres

# Create databases (example)
CREATE DATABASE project1_db;
CREATE DATABASE project2_db;
CREATE DATABASE project3_db;
-- ... create for all your projects

# Create users (optional, for better security)
CREATE USER project1_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE project1_db TO project1_user;

# Exit
\q
```

#### Step 4: Connection String Configuration

**For Backend Applications** (use in your `.env` files):

**Option A: Using default postgres user (simpler, less secure):**

```bash
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@postgres-main:5432/PROJECT_DB_NAME
```

**Option B: Using dedicated user per database (recommended, more secure):**

```bash
DATABASE_URL=postgresql://project1_user:USER_PASSWORD@postgres-main:5432/project1_db
```

**Important Notes:**

- ✅ Use `postgres-main` (container name) - **NOT** `localhost` or IP address
- ✅ Port is `5432` (internal Docker port)
- ✅ Database name matches what you created (e.g., `project1_db`)
- ✅ Store connection strings securely in Coolify environment variables
- ✅ Never commit passwords to Git repositories

### MongoDB Setup (All Projects)

**Strategy**: One MongoDB container, multiple databases (one per project)

**Architecture:**

```bash
MongoDB Container (mongodb-main)
├── project1_db (database)
├── project2_db (database)
└── project3_db (database)
```

**Security Configuration:**

- Port 27017: **Internal only** (not exposed to internet)
- Access: Only via Docker internal DNS (`mongodb-main:27017`)
- Authentication: Required (admin user + project-specific users)
- Network: Isolated Docker network (Coolify manages this)

#### Step 1: Deploy MongoDB Container

1. **In Coolify Dashboard**:

   - Click "New Resource" (or "Add Resource")
   - Select "MongoDB"
   - **Configuration**:
     - **Name**: `mongodb-main` (used as Docker container name and internal DNS)
     - **Version**: `7.0` (latest stable, recommended) or `6.0` (LTS)
     - **Database**: `admin` (default authentication database)
     - **User**: `admin` (root user for admin tasks)
     - **Password**:
       - **IMPORTANT**: Generate a strong password (minimum 16 characters)
       - Use: Uppercase, lowercase, numbers, special characters
       - **Example format**: `Mongo#2025!SecurePass$Word`
       - **SAVE THIS PASSWORD SECURELY** (password manager recommended)
     - **Port**: `27017` (internal Docker port, NOT exposed publicly)
     - **Volume**: `mongodb-data` (persistent storage - data survives container restarts)
     - **Resources** (optional, defaults usually fine):
       - CPU: 0.5-1.0 (shared with other services)
       - Memory: 1-2GB (adjust based on usage)
   - Click "Deploy"

2. **Wait for deployment** (2-3 minutes)
   - Watch the logs in Coolify UI
   - Verify status shows "Healthy" or "Running"

#### Step 2: Verify MongoDB Deployment

```bash
# SSH into server (if not already connected)
ssh deploy@77.42.71.87

# Check MongoDB container is running
sudo docker ps | grep mongodb

# Verify container is healthy
sudo docker ps --format "table {{.Names}}\t{{.Status}}" | grep mongodb
```

**Expected Output:**

- Container name: `t08sgc800wo08co48480ksgw` (Coolify-generated ID, or your custom name)
- Status: `Up X minutes (healthy)`
- Connectivity: `{ ok: 1 }` when testing with `mongosh`

**Note:** Coolify generates unique container IDs. Use `docker ps` to find your actual container name, or use the name you specified in Coolify (e.g., `mongodb-main`).

#### Step 3: Create Databases and Users for Each Project

**Security Note**: MongoDB creates databases on first use, but we'll create them explicitly and set up dedicated users for better security and organization.

```bash
# Find your MongoDB container name
sudo docker ps | grep mongo

# Connect to MongoDB container (replace with your actual container name)
# Option 1: Interactive login (you'll be prompted for admin password)
sudo docker exec -it t08sgc800wo08co48480ksgw mongosh -u admin -p

# Option 2: Direct connection with password in environment
sudo docker exec -it t08sgc800wo08co48480ksgw mongosh -u admin -p YOUR_PASSWORD

# OR if you named it 'mongodb-main':
sudo docker exec -it mongodb-main mongosh -u admin -p

# Enter the admin password you set during deployment
```

#### Step 3a: Create Databases and Users

```javascript
// Switch to admin database (authentication database)
use admin

// Create database and user for Project 1
use project1_db
db.createUser({
  user: "project1_user",
  pwd: "StrongPassword123!@#",  // Use a strong, unique password
  roles: [{ role: "readWrite", db: "project1_db" }]
})

// Create database and user for Project 2
use project2_db
db.createUser({
  user: "project2_user",
  pwd: "StrongPassword456!@#",  // Use a different strong password
  roles: [{ role: "readWrite", db: "project2_db" }]
})

// Create database and user for Project 3
use project3_db
db.createUser({
  user: "project3_user",
  pwd: "StrongPassword789!@#",  // Use a different strong password
  roles: [{ role: "readWrite", db: "project3_db" }]
})

// Continue for all your projects...
// Each project should have:
// - Its own database (projectN_db)
// - Its own user (projectN_user)
// - Its own strong, unique password

// List all databases to verify
show dbs

// List users for a specific database
use project1_db
db.getUsers()

// Exit MongoDB shell
exit
```

**Important Security Notes:**

- ✅ Each project has its own database and user
- ✅ Each user has `readWrite` role only (not admin privileges)
- ✅ Users can only access their own database
- ✅ Use different strong passwords for each user
- ✅ Save all passwords securely (password manager)

#### Step 4: MongoDB Connection String Configuration

**For Backend Applications** (use in your `.env` files):

**Option A: Using admin user (simpler, less secure - not recommended for production):**

```bash
MONGODB_URI=mongodb://admin:YOUR_ADMIN_PASSWORD@mongodb-main:27017/PROJECT_DB_NAME?authSource=admin
```

**Option B: Using dedicated user per database (recommended, more secure):**

```bash
MONGODB_URI=mongodb://project1_user:USER_PASSWORD@mongodb-main:27017/project1_db?authSource=project1_db
```

**Connection String Breakdown:**

- `mongodb://` - Protocol
- `project1_user:USER_PASSWORD` - Database user and password
- `@mongodb-main:27017` - Container name (internal DNS) and port
- `/project1_db` - Database name
- `?authSource=project1_db` - Authentication database (same as target database for dedicated users)

**Important Notes:**

- ✅ Use `mongodb-main` (container name) - **NOT** `localhost` or IP address
- ✅ Port is `27017` (internal Docker port)
- ✅ Database name matches what you created (e.g., `project1_db`)
- ✅ `authSource` parameter is required for authentication
- ✅ Store connection strings securely in Coolify environment variables
- ✅ Never commit passwords to Git repositories

### 🔒 Database Security Summary

✅ **Network Isolation:**

- Databases are **NOT publicly exposed** to the internet
- Only accessible from within Docker network
- Backends connect via internal DNS (container names like `postgres-main`, `mongodb-main`)
- No external access = significantly more secure

✅ **Authentication:**

- Strong passwords required for all database users
- Separate users per database (recommended) for better isolation
- PostgreSQL: Role-based access control
- MongoDB: Database-level user permissions

✅ **Best Practices Implemented:**

- ✅ One container per database type (resource efficiency)
- ✅ Multiple databases per container (cost-effective)
- ✅ Persistent volumes (data survives container restarts)
- ✅ Regular backups recommended (see Backup section below)
- ✅ Connection strings use internal DNS (not localhost/IP)

✅ **Security Checklist:**

- [x] Databases not exposed to internet
- [x] Strong passwords generated and saved securely
- [x] Separate databases per project (isolation)
- [x] Optional: Separate users per database (enhanced security)
- [x] Persistent storage configured (data persistence)
- [ ] Automated backups configured (see Backup section)
- [ ] Connection strings stored securely (Coolify environment variables)

**Next Steps:**

1. Deploy PostgreSQL container
2. Deploy MongoDB container
3. Create databases for each project
4. Set up automated backups (see Backup section)
5. Start deploying backend applications

---

## 🚀 BACKEND DEPLOYMENT

### Step 1: Prepare Your Backend Project

**Requirements:**

- Your backend must have a `Dockerfile` OR
- Coolify can auto-detect Node.js projects

**Example Dockerfile (Node.js/Express):**

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
```

### Step 2: Deploy Backend in Coolify

1. **In Coolify Dashboard**:

   - Click "New Application"
   - Select "Git Repository"
   - **Connect GitHub/GitLab**:
     - Authorize Coolify
     - Select your repository
   - **Or use "Public Repository"**:
     - Enter repository URL
     - Add deploy key (Coolify will generate)

2. **Configure Application**:

   - **Name**: `project1-api` (or your project name)
   - **Build Pack**: `Dockerfile` (if you have one) or `Node.js`
   - **Port**: `3000` (or your app's port)
   - **Environment Variables**:

     ```bash
     NODE_ENV=production
     PORT=3000
     DATABASE_URL=postgresql://postgres:PASSWORD@postgres-main:5432/project1_db
     MONGODB_URI=mongodb://admin:PASSWORD@mongodb-main:27017/project1_db?authSource=admin
     JWT_SECRET=your_jwt_secret
     # ... all your other env vars
     ```

   - **Domain** (optional):
     - Subdomain: `api.project1.yourdomain.com`
     - Enable SSL: Yes (Let's Encrypt)
   - **Resources**:
     - CPU: 0.5 (or adjust based on needs)
     - Memory: 512MB (or adjust)
   - Click "Deploy"

3. **Wait for Deployment**:

   - Coolify will:
     - Clone repository
     - Build Docker image
     - Start container
     - Set up SSL (if domain provided)
   - Check logs for any errors

4. **Verify Deployment**:
   - Visit your API URL: `https://api.project1.yourdomain.com`
   - Or: `http://YOUR_SERVER_IP:PORT` (if no domain)

### Step 3: Repeat for All Backends

- Deploy each backend project following the same steps
- Use different subdomains:
  - `api.project1.yourdomain.com`
  - `api.project2.yourdomain.com`
  - `api.project3.yourdomain.com`
  - etc.

### Step 4: Update Backend Environment Variables

**For each backend**, update these in Coolify:

- Database connection strings
- API keys
- JWT secrets
- Any service URLs

**Important**: Use internal Docker DNS names:

- ✅ `postgres-main:5432` (not `localhost:5432`)
- ✅ `mongodb-main:27017` (not `localhost:27017`)

---

## 🌐 FRONTEND INTEGRATION

### Step 1: Update Frontend Environment Variables

**In Vercel/Netlify**, update your frontend `.env` files:

```env
# Old (Render/Free Tier)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# New (Hetzner VPS)
NEXT_PUBLIC_API_URL=https://api.project1.yourdomain.com
```

### Step 2: Redeploy Frontends

1. **Vercel**:

   - Go to project settings
   - Update environment variables
   - Redeploy

2. **Netlify**:
   - Go to site settings
   - Update environment variables
   - Trigger redeploy

### Step 3: Test Integration

1. **Test API calls** from frontend
2. **Check browser console** for errors
3. **Verify database operations** work correctly

**That's it!** Your frontends now communicate with your self-hosted backends.

---

## 🔒 SECURITY BEST PRACTICES

### 1. Database Security

✅ **Already Done:**

- Databases not publicly exposed
- Strong passwords
- Separate users per database (optional but recommended)

**Additional:**

```bash
# Regular password rotation
# Monitor database logs
# Set up database backups (see Backup section)
```

### 2. Backend Security

✅ **Best Practices:**

- Use HTTPS only (Coolify handles this)
- Validate all inputs
- Use rate limiting
- Implement CORS properly
- Keep dependencies updated
- Use environment variables for secrets
- Never commit secrets to Git

### 3. Server Security

✅ **Already Done:**

- SSH keys only
- Firewall enabled
- Fail2Ban installed
- Non-root user
- Automatic security updates

**Additional:**

```bash
# Regular security audits
sudo apt update && sudo apt upgrade

# Monitor logs
sudo journalctl -u coolify -f

# Check for failed login attempts
sudo fail2ban-client status sshd
```

### 4. Coolify Security

✅ **Best Practices:**

- Use strong admin password
- Enable 2FA (if available in future)
- Regularly update Coolify
- Monitor Coolify logs
- Restrict access to Coolify UI (optional: use VPN)

### 5. Network Security

✅ **Defense in Depth** (Multiple Layers):

1. **Hetzner Cloud Firewall** (✅ Configured):

   - Network-level firewall at cloud provider level
   - Blocks traffic before it reaches your server
   - **Status**: ✅ Configured with 4 rules (SSH, HTTP, HTTPS, Coolify UI)
   - See [Hetzner Cloud Firewall Configuration](#-hetzner-cloud-firewall-configuration) section below for details

2. **Server-level UFW** (already configured ✅):

   - OS-level firewall on the server
   - Additional layer of protection
   - Configured with SSH, HTTP, HTTPS, Coolify ports

3. **Docker Network Isolation** (already configured ✅):
   - Internal container networking
   - Databases isolated within Docker network

**Recommended Setup**:

- ✅ Configure Hetzner Cloud Firewall (see `HETZNER_CLOUD_FIREWALL_SETUP.md`)
- ✅ Keep UFW active (defense in depth)
- ✅ Maintain Docker network isolation

**Optional: VPN Setup** (for additional security):

```bash
# Install WireGuard (example)
# This allows secure access to Coolify UI from anywhere
# Tutorial: https://www.wireguard.com/install/
```

---

## 💾 BACKUP STRATEGY

### 1. Database Backups

**PostgreSQL Automated Backup:**

```bash
# Create backup script
nano ~/backup-postgres.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
# Replace with your actual PostgreSQL container name (use 'docker ps | grep postgres' to find it)
CONTAINER="xok0c8w8808g8080og4gccwc"  # Or your custom name like "postgres-main"

mkdir -p $BACKUP_DIR

# Backup all databases
docker exec $CONTAINER pg_dumpall -U postgres | gzip > $BACKUP_DIR/postgres_all_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/postgres_all_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x ~/backup-postgres.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add:
0 2 * * * /home/deploy/backup-postgres.sh
```

**MongoDB Automated Backup:**

```bash
# Create backup script
nano ~/backup-mongodb.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
# Replace with your actual MongoDB container name (use 'docker ps | grep mongo' to find it)
CONTAINER="t08sgc800wo08co48480ksgw"  # Or your custom name like "mongodb-main"

mkdir -p $BACKUP_DIR

# Backup all databases (with authentication if required)
docker exec $CONTAINER mongodump --username admin --password YOUR_PASSWORD --authenticationDatabase admin --archive --gzip | cat > $BACKUP_DIR/mongodb_all_$DATE.archive.gz

# OR without authentication if not configured:
# docker exec $CONTAINER mongodump --archive --gzip | cat > $BACKUP_DIR/mongodb_all_$DATE.archive.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/mongodb_all_$DATE.archive.gz"
```

```bash
# Make executable
chmod +x ~/backup-mongodb.sh

# Add to crontab
crontab -e
# Add:
0 3 * * * /home/deploy/backup-mongodb.sh
```

### 2. Off-Site Backup

**Option 1: Hetzner Storage Box** (€3.20/month for 1TB)

- Mount as network drive
- Copy backups there

**Option 2: Cloud Storage** (S3, Backblaze, etc.)

- Use `rclone` to sync backups

#### Option 3: Another VPS

- Set up secondary backup server

### 3. Coolify Backups

- Coolify can backup application data
- Configure in Coolify settings
- Or use Docker volume backups

---

## 💰 COST ANALYSIS

### Monthly Costs

**Hetzner VPS (CX33):**

- Server: €6.53/month
- **Total: €6.53/month**

**Compared to Free Tiers:**

- MongoDB Atlas: Free (but pauses) → **Now: €0** (included)
- NeonDB/Supabase: Free (but pauses) → **Now: €0** (included)
- Render: Free (but cold starts) → **Now: €0** (included)

**Additional Optional Costs:**

- Domain: €10-15/year (~€1/month)
- Storage Box (backups): €3.20/month (optional)
- **Total with backups: ~€10/month**

**Savings:**

- No cold start delays = Better UX
- No database pauses = Reliable service
- Unlimited projects = No per-project costs
- Full control = No vendor lock-in

---

## 🤔 IS THIS A GOOD IDEA?

### ✅ YES, If

1. **You have 15-20 demo projects** - One VPS can handle this easily
2. **You want 24/7 uptime** - No cold starts, no pauses
3. **You want predictable costs** - Fixed monthly bill
4. **You're comfortable with basic server management** - Or willing to learn
5. **You want full control** - Over infrastructure and deployments
6. **You're migrating from free tiers** - To avoid limitations

### ⚠️ CONSIDERATIONS

1. **Single Point of Failure**:

   - If VPS goes down, all projects go down
   - **Mitigation**: Regular backups, monitor uptime

2. **Resource Limits**:

   - CX33: 4 vCPU, 8GB RAM
   - **For 15-20 projects**: Should be fine for demo projects
   - **Monitor**: Use `htop` to check resource usage
   - **Upgrade**: Can upgrade to CX43 (8 vCPU, 16GB) if needed

3. **Maintenance**:

   - You're responsible for updates, security, backups
   - **Mitigation**: Automated updates, monitoring, backups

4. **Learning Curve**:
   - Need to learn Docker, Coolify, server management
   - **Mitigation**: Coolify makes it easier, good documentation

### 📊 RESOURCE ESTIMATION

**Per Project (Average):**

- Backend: ~100-200MB RAM, 0.1-0.2 vCPU
- Database: Shared, minimal per-project overhead

**Total for 20 Projects:**

- Backends: ~2-4GB RAM, 2-4 vCPU
- Databases: ~1-2GB RAM, 0.5-1 vCPU
- System: ~1GB RAM
- **Total: ~4-7GB RAM, 2.5-5 vCPU**

**CX33 (4 vCPU, 8GB RAM):**

- ✅ **Should handle 15-20 demo projects comfortably**
- ⚠️ **Monitor and upgrade if needed**

### 🎯 RECOMMENDATION

**YES, this is a good idea for your use case:**

1. **Start with 5-10 projects** - Test the setup
2. **Monitor resources** - Use `htop`, Coolify metrics
3. **Migrate gradually** - One project at a time
4. **Set up backups** - Before migrating critical projects
5. **Upgrade if needed** - CX43 (€11.29/month) if resources are tight

**Benefits outweigh risks for demo/real-world projects!**

---

## 📝 QUICK REFERENCE CHECKLIST

### Initial Setup ✅

- [x] Create Hetzner account
- [x] Add billing information (2FA enabled, DPA configured)
- [x] Create project in Cloud Console (`dev-platform`)
- [x] Create CX33 server (Helsinki - `77.42.71.87`)
- [x] Add SSH key (GitHub SSH key configured)
- [x] Note server IP (`77.42.71.87`)

### Security ✅

- [x] Update system (apt update && apt upgrade)
- [x] Create non-root user (`deploy` with sudo)
- [x] Configure SSH (root disabled, password auth disabled, keys only)
- [x] Set up firewall (UFW - OpenSSH, HTTP, HTTPS, Coolify ports)
- [x] Install Fail2Ban (enabled and running)
- [x] Enable automatic updates (unattended-upgrades configured)
- [x] Configure swap (2GB swap file created)

### Coolify ✅

- [x] Install Coolify (v4.0.0-beta.454)
- [x] Access Coolify UI (`http://77.42.71.87:8000`)
- [x] Create admin account
- [x] Backup `.env` file (environment variables saved)
- [x] Generate SSH keys for Coolify (`/data/coolify/ssh/keys/id.root@host.docker.internal`)
- [x] Add public key to `~/.ssh/authorized_keys`
- [x] **Server validation** ✅ (Resolved: configured passwordless sudo, UFW rules, SSH keys)
- [x] Configure server settings (General, Resource Limits, etc.)
- [ ] Add domain (optional, for SSL)

### Databases ✅ (Completed)

- [x] Deploy PostgreSQL container
  - [x] Container name: `xok0c8w8808g8080og4gccwc`
  - [x] Image: `postgres:17-alpine`
  - [x] Resource limits: 2GB RAM, 1 CPU
  - [x] Persistent volume configured
  - [x] Verified deployment (healthy status)
  - [x] Security verified (network isolated, not exposed)
- [x] Deploy MongoDB container
  - [x] Container name: `t08sgc800wo08co48480ksgw`
  - [x] Image: `mongo:7`
  - [x] Resource limits: 2GB RAM
  - [x] Persistent volumes configured
  - [x] Verified deployment (healthy status)
  - [x] Security verified (network isolated, not exposed)
- [x] **Create databases for each project** ✅
  - [x] PostgreSQL: Created `daily_urlist_db` for daily-urlist project
  - [x] PostgreSQL: Created dedicated user `daily_urlist_user`
  - [x] Data migration: Migrated all existing data from CSV files
  - [x] Test connections: Verified and working
  - [x] Connection strings: Configured in `.env` and `.env.local`

### Backends (After Database Setup)

- [ ] Deploy first backend
  - [ ] Connect GitHub/GitLab repository
  - [ ] Configure environment variables (database URLs, secrets)
  - [ ] Set up domain/SSL (optional)
  - [ ] Test API endpoints
- [ ] Repeat for all backends (8-10 projects)
  - [ ] Deploy each backend as separate application
  - [ ] Configure environment variables per project
  - [ ] Set up subdomains (api.project1.com, api.project2.com, etc.)
  - [ ] Enable SSL for each subdomain

### Frontends (After Backend Deployment)

- [ ] Update API URLs (change from Render/free tier to new VPS URLs)
- [ ] Update environment variables in Vercel/Netlify
- [ ] Redeploy frontends
- [ ] Test integration (verify API calls work)
- [ ] Monitor for errors

### Backups (Critical - Set Up Before Production Use)

- [ ] Set up PostgreSQL automated backups (daily cron job)
- [ ] Set up MongoDB automated backups (daily cron job)
- [ ] Configure backup retention (keep last 7-30 days)
- [ ] Test backup restore process
- [ ] Configure off-site backup (optional but recommended)
  - [ ] Hetzner Storage Box, or
  - [ ] Cloud storage (S3, Backblaze), or
  - [ ] Another VPS/server

### Monitoring (Recommended)

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure email alerts for downtime
- [ ] Monitor resource usage (htop, Coolify metrics)
- [ ] Set up log aggregation (optional)
- [ ] Configure disk space alerts

---

## 🆘 TROUBLESHOOTING

### Common Issues

**1. Can't SSH into server:**

- Check firewall rules
- Verify SSH key is correct
- Check if using correct port

**2. Coolify not accessible:**

- Check if port 8000 is open
- Verify Coolify is running: `sudo systemctl status coolify`
- Check logs: `sudo journalctl -u coolify -f`

**3. Database connection fails:**

- Verify container names (use `docker ps`)
- Check if databases are running
- Verify connection strings use container names, not `localhost`

**4. Backend deployment fails:**

- Check build logs in Coolify
- Verify Dockerfile is correct
- Check environment variables
- Review application logs

**5. Server validation fails (Permission denied publickey):** ✅ RESOLVED

**Issue:** Coolify shows "Server is not reachable" with "Permission denied (publickey)" error when trying to validate the localhost server.

**Root Cause:** Multiple issues needed to be addressed:

1. Docker container network isolation (UFW blocking SSH from containers)
2. Passwordless sudo required for Coolify to execute commands
3. SSH key configuration within Coolify container context

**Solution (All Steps Required):**

1. **Configure passwordless sudo for deploy user:**

   ```bash
   echo "deploy ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/deploy
   ```

2. **Add UFW rules to allow SSH from Docker containers:**

   ```bash
   # Find Coolify container IP
   sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' coolify

   # Allow SSH from Docker networks
   sudo ufw allow from 10.0.1.5 to any port 22 proto tcp
   sudo ufw allow from 172.16.0.0/12 to any port 22 proto tcp
   sudo ufw allow from 192.168.0.0/16 to any port 22 proto tcp
   sudo ufw allow from 10.0.0.0/8 to any port 22 proto tcp
   ```

3. **Generate and configure SSH keys for Coolify:**

   ```bash
   sudo mkdir -p /data/coolify/ssh/keys
   sudo ssh-keygen -t ed25519 -a 100 -f /data/coolify/ssh/keys/id.root@host.docker.internal -q -N "" -C root@coolify
   sudo chown -R 9999:9999 /data/coolify/ssh/keys
   sudo cat /data/coolify/ssh/keys/id.root@host.docker.internal.pub | tee -a ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

4. **Add "localhost's key" public key to authorized_keys:**

   - Get the public key from Coolify UI (Keys & Tokens → localhost's key)
   - Add it to `~/.ssh/authorized_keys` on the server

5. **Configure server in Coolify UI:**
   - IP Address/Domain: `host.docker.internal`
   - User: `deploy`
   - Port: `22`
   - Private Key: Use the generated key or localhost's key

**Status:** ✅ Resolved - Server validation now works correctly.

**6. PostgreSQL README.md Permission Denied Error:** ✅ RESOLVED

**Issue:** PostgreSQL database fails to start with error:

```bash
bash: line 12: /data/coolify/databases/xxxxx/README.md: Permission denied
```

This error occurs during Coolify's startup script execution, **before** the PostgreSQL container starts.

**Root Cause:** This was **NOT a Coolify bug**, but rather a **server configuration issue**. The problem was incorrect directory permissions on `/data/coolify` and its subdirectories:

1. `/data/coolify` directory had restrictive permissions (`drwx------` 700), preventing Coolify (user 9999) from accessing database directories
2. Database directories were owned by `deploy:deploy` instead of Coolify's user (9999)
3. Parent directory permissions blocked traversal even with correct permissions on database directories

**Solution:**

```bash
# Fix parent directory permissions (allows traversal)
sudo chmod 755 /data/coolify
sudo chown -R 9999:root /data/coolify

# Fix database directories ownership and permissions
sudo chown -R 9999:root /data/coolify/databases
sudo chmod -R 755 /data/coolify/databases

# For each database directory, ensure proper permissions
sudo chown -R 9999:root /data/coolify/databases/DATABASE_ID
sudo chmod -R 775 /data/coolify/databases/DATABASE_ID

# Create README.md with proper permissions if needed
sudo touch /data/coolify/databases/DATABASE_ID/README.md
sudo chmod 666 /data/coolify/databases/DATABASE_ID/README.md
sudo chown 9999:root /data/coolify/databases/DATABASE_ID/README.md
```

**Note:** The same issue affected MongoDB. Apply the same fix for MongoDB database directories.

**Status:** ✅ Resolved - Both PostgreSQL and MongoDB now deploy successfully.

**Additional Note - SSL Certificates:** There is a separate issue with SSL certificate permissions for PostgreSQL that we couldn't fully resolve (Docker bind mount UID mapping conflicts with PostgreSQL's strict private key permission requirements). For internal-only deployments, SSL is not necessary as databases are not exposed externally. SSL is currently disabled for both databases, which is acceptable for internal-only access.

**7. SSL certificate issues:**

- Verify DNS records
- Check domain is pointing to server IP
- Wait for DNS propagation (up to 48 hours)

---

## 📊 DATA MIGRATION

### Migrating Existing Data from CSV Files

If you have existing data in CSV format from a previous database, you can use the seed script to migrate it to the new PostgreSQL database.

#### Using the Seed Script

1. **Prepare CSV Files**:
   - Place CSV files in a directory (e.g., `/path/to/csv-files/`)
   - Required files: `users.csv`, `lists.csv`, `sessions.csv`, `comments.csv`, `activities.csv`

2. **Update Seed Script Path**:
   - Edit `prisma/seed.ts`
   - Update `CSV_DIR` constant to point to your CSV files directory

3. **Run Migration**:
   ```bash
   # Make sure SSH tunnel is running (for local development)
   ssh -N -L 5433:127.0.0.1:5433 -L 27018:127.0.0.1:27018 deploy@77.42.71.87
   
   # Run the seed script
   npm run db:seed
   ```

4. **Verify Migration**:
   ```bash
   # Check data was imported
   psql "postgresql://daily_urlist_user:PASSWORD@localhost:5433/daily_urlist_db" -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM lists;"
   ```

**Note:** The seed script uses `upsert`, so it's safe to run multiple times. It will update existing records or create new ones.

**Status:** ✅ Data migration completed for `daily-urlist` project (December 19, 2025)

---

## 🔥 HETZNER CLOUD FIREWALL CONFIGURATION

### Why Configure Hetzner Cloud Firewall?

**Defense in Depth Strategy** - Multiple layers of security:

```bash
Internet
    ↓
[Layer 1] Hetzner Cloud Firewall ← Blocks unwanted traffic at cloud level
    ↓
[Layer 2] Server-level UFW ← Additional protection on the server
    ↓
[Layer 3] Docker Network Isolation ← Internal container isolation
    ↓
Your Applications
```

**Benefits:**
- ✅ Network-level protection (blocks traffic before it reaches your server)
- ✅ Independent of server state (works even if UFW fails)
- ✅ Better performance (filtered at cloud level)
- ✅ Centralized management (web dashboard)

### Firewall Configuration

**Firewall Name:** `dev-platform-server-firewall`

**Inbound Rules:**

| Rule | Protocol | Port | Source | Action | Description |
|------|----------|------|--------|--------|-------------|
| 1 | TCP | 22 | Your IP(s) | Accept | SSH (restricted to your IP) |
| 2 | TCP | 80 | 0.0.0.0/0,::/0 | Accept | HTTP (public) |
| 3 | TCP | 443 | 0.0.0.0/0,::/0 | Accept | HTTPS (public) |
| 4 | TCP | 8000 | Your IP(s) | Accept | Coolify UI (restricted) |
| Default | - | - | - | Drop | Deny all other inbound |

**Outbound Rules:** Allow all (default)

### Step-by-Step Setup

1. **Find Your IP Address**:
   ```bash
   curl ifconfig.me
   ```

2. **Create Firewall in Hetzner Dashboard**:
   - Go to Hetzner Cloud Console → Firewalls → Create Firewall
   - Name: `dev-platform-server-firewall`
   - Add inbound rules as shown above
   - Default inbound policy: Drop
   - Default outbound policy: Accept

3. **Apply Firewall to Server**:
   - Go to Servers → dev-platform-server → Firewalls tab
   - Click "Apply Firewall"
   - Select `dev-platform-server-firewall`

4. **Verify Configuration**:
   - Test SSH access from your IP (should work)
   - Test HTTP/HTTPS from anywhere (should work)
   - Test Coolify UI from your IP (should work)
   - Test database ports (should be blocked - this is good!)

**Status:** ✅ Configured and tested

---

## 🔍 DATABASE SECURITY VERIFICATION

### Security Summary

**Network Isolation:** ✅ SECURE
- Databases are NOT publicly exposed
- Only accessible via Docker internal network
- Port bindings: None (verified secure)

**Firewall Configuration:** ✅ SECURE
- UFW active with proper rules
- Hetzner Cloud Firewall configured
- Database ports (5432, 27017) not exposed

**Resource Limits:** ✅ CONFIGURED
- PostgreSQL: 2GB RAM limit
- MongoDB: 2GB RAM limit
- Auto-restart: `unless-stopped`

**Data Persistence:** ✅ CONFIGURED
- Volumes configured for both databases
- Data survives container restarts

**Overall Security Rating:** ✅ SECURE

Both databases are operational, secure, and properly configured for internal Docker network use.

---

## 📚 ADDITIONAL RESOURCES

- **Hetzner Docs**: <https://docs.hetzner.com/>
- **Coolify Docs**: <https://coolify.io/docs>
- **Docker Docs**: <https://docs.docker.com/>
- **PostgreSQL Docs**: <https://www.postgresql.org/docs/>
- **MongoDB Docs**: <https://docs.mongodb.com/>

---

## 🎉 CONCLUSION

You now have a complete guide to migrate from free tiers to a self-hosted VPS solution. This setup provides:

- ✅ 24/7 uptime
- ✅ No cold starts
- ✅ No database pauses
- ✅ Full control
- ✅ Predictable costs
- ✅ Production-ready infrastructure

**Next Steps:**

1. Create Hetzner account
2. Set up server
3. Install Coolify
4. Migrate one project as a test
5. Gradually migrate all projects

Good luck with your migration! 🚀

---

**Last Updated:** December 19, 2025  
**Status:** Database Setup & Data Migration Completed ✅ | Ready for Backend Deployment
