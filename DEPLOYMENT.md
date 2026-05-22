# 🚀 Mini-Commerce Deployment Guide

Complete guide for deploying Mini-Commerce on Ubuntu VM with Node.js, PM2, and Nginx.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Option 1: Automated Setup](#option-1-automated-setup-recommended)
3. [Option 2: Manual Setup](#option-2-manual-setup)
4. [Option 3: Docker Deployment](#option-3-docker-deployment)
5. [Verification](#verification)
6. [SSL/HTTPS Setup](#sslhttps-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- Ubuntu 18.04+ (20.04 or 22.04 recommended)
- Minimum 2GB RAM
- 10GB disk space
- Root or sudo access
- Internet connection

### Before You Start
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Check Ubuntu version
lsb_release -a

# Check if Node.js is already installed
node -v
npm -v
```

---

## Option 1: Automated Setup (Recommended) ⭐

### Step 1: Clone Repository
```bash
# Clone the repository
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce

# Or if you have SSH key setup
git clone git@github.com:yourusername/mini-commerce.git
cd mini-commerce
```

### Step 2: Run Setup Script
```bash
# Make script executable
chmod +x setup.sh

# Run setup (it will prompt for sudo password)
./setup.sh
```

### Step 3: Verify Installation
```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Test application
curl http://localhost/health
```

### Step 4: Access Application
Open browser and go to: `http://your-server-ip`

---

## Option 2: Manual Setup

### Step 1: Update System
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### Step 2: Install Node.js v18
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node -v
npm -v
```

### Step 3: Install PM2 Globally
```bash
sudo npm install -g pm2

# Verify
pm2 -v
```

### Step 4: Install Nginx
```bash
sudo apt-get install -y nginx

# Enable and start
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify
sudo systemctl status nginx
```

### Step 5: Clone and Setup Application
```bash
# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce

# Install dependencies
npm install

# Create data and logs directories
mkdir -p data logs
chmod 755 data logs
```

### Step 6: Configure Nginx
```bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/mini-commerce

# Create symlink
sudo ln -sf /etc/nginx/sites-available/mini-commerce /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Output should be:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload Nginx
sudo systemctl reload nginx
```

### Step 7: Start Application with PM2
```bash
# Start application
pm2 start ecosystem.config.js

# Verify
pm2 status

# Save PM2 configuration
pm2 save
```

### Step 8: Setup PM2 Startup
```bash
# Generate startup script
sudo pm2 startup systemd -u $USER --hp $HOME

# This will output a command to run - execute it
# Usually something like:
# sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username

# Verify startup is configured
pm2 status
```

### Step 9: Reboot and Verify
```bash
# Reboot the system
sudo reboot

# After reboot, verify everything is running
pm2 status
curl http://localhost/health
```

---

## Option 3: Docker Deployment

### Prerequisites
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install -y docker-compose

# Add current user to docker group (optional, for non-root access)
sudo usermod -aG docker $USER
newgrp docker
```

### Deployment Steps
```bash
# Clone repository
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce

# Build and run with Docker Compose
docker-compose up -d

# Verify containers are running
docker-compose ps

# View logs
docker-compose logs -f app

# Stop containers
docker-compose stop

# Start containers
docker-compose start

# Remove containers
docker-compose down
```

### Docker Useful Commands
```bash
# Build image manually
docker build -t mini-commerce:latest .

# Run container
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data --name mini-commerce mini-commerce:latest

# View logs
docker logs -f mini-commerce

# Stop container
docker stop mini-commerce

# Start container
docker start mini-commerce

# Remove container
docker rm mini-commerce
```

---

## Verification

### Check Application Status
```bash
# PM2 status
pm2 status

# View PM2 logs
pm2 logs mini-commerce

# Monitor CPU and memory
pm2 monit
```

### Check Nginx Status
```bash
sudo systemctl status nginx

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Test Health Endpoints
```bash
# Test application endpoint
curl http://localhost:3000/health

# Test via Nginx
curl http://localhost/health

# Get all products
curl http://localhost/api/products

# Pretty print JSON
curl http://localhost/api/products | jq
```

### Test CRUD Operations
```bash
# Create a product
curl -X POST http://localhost/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "stock": 10,
    "description": "Test Description"
  }'

# Get all products
curl http://localhost/api/products

# Update a product
curl -X PUT http://localhost/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 5}'

# Delete a product
curl -X DELETE http://localhost/api/products/1
```

---

## SSL/HTTPS Setup

### Option A: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate (replace domain.com with your domain)
sudo certbot certonly --nginx -d domain.com -d www.domain.com

# Update Nginx configuration with HTTPS
# Edit /etc/nginx/sites-available/mini-commerce
# Add the SSL configuration from nginx.conf comments
# Update server_name to your domain

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Option B: Self-signed Certificate

```bash
# Generate certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/mini-commerce.key \
  -out /etc/ssl/certs/mini-commerce.crt

# Update Nginx configuration with certificate paths
sudo nano /etc/nginx/sites-available/mini-commerce

# Uncomment HTTPS section and update paths
# ssl_certificate /etc/ssl/certs/mini-commerce.crt;
# ssl_certificate_key /etc/ssl/private/mini-commerce.key;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## Troubleshooting

### Issue: Port 3000 already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use sudo if needed
sudo kill -9 <PID>
```

### Issue: Nginx 502 Bad Gateway
```bash
# Check if PM2 app is running
pm2 status

# Restart PM2 app
pm2 restart mini-commerce

# Check Nginx configuration
sudo nginx -t

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: Permission Denied
```bash
# For data directory
chmod 755 ~/mini-commerce/data

# For logs directory
chmod 755 ~/mini-commerce/logs

# For Nginx config
sudo chown root:root /etc/nginx/sites-available/mini-commerce
sudo chmod 644 /etc/nginx/sites-available/mini-commerce
```

### Issue: Application not starting
```bash
# Check Node.js installation
node -v
npm -v

# Check package installation
npm list

# Check data directory exists
ls -la data/

# View PM2 error logs
pm2 logs mini-commerce --err
```

### Issue: Data file missing
```bash
# The file is auto-created on first run
# If missing, restart PM2
pm2 restart mini-commerce

# Or manually create
mkdir -p data
echo '[]' > data/products.json
```

### Issue: Cannot connect to application
```bash
# Check if server is listening
sudo netstat -tlnp | grep 3000

# Check firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # for direct connection

# Check DNS resolution
ping domain.com
nslookup domain.com
```

---

## Backup and Recovery

### Backup Data
```bash
# Backup data directory
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Backup entire application
tar -czf mini-commerce-backup-$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=logs .
```

### Restore Data
```bash
# Restore data
tar -xzf backup-*.tar.gz
pm2 restart mini-commerce
```

---

## Monitoring and Maintenance

### Regular Maintenance
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix

# Update Node.js
sudo apt-get upgrade nodejs

# Update PM2
sudo npm install -g pm2@latest
pm2 update
```

### Monitor Application
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs mini-commerce

# View specific error logs
pm2 logs mini-commerce --err

# Clear logs
pm2 flush

# View PM2 configuration
pm2 info mini-commerce
```

---

## Performance Tuning

### Optimize Node.js
```bash
# Increase max file descriptors
ulimit -n 65536

# Make permanent in /etc/security/limits.conf
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf
```

### Optimize Nginx
```bash
# Already configured in nginx.conf:
# - Gzip compression
# - Connection pooling
# - Caching headers
# - Security headers
```

### Monitor Performance
```bash
# Check system resources
top
free -h
df -h

# Check PM2 memory
pm2 status

# View detailed process info
pm2 describe mini-commerce
```

---

## Next Steps

1. ✅ Application is running
2. 🔒 Setup HTTPS/SSL
3. 📊 Configure monitoring
4. 🔄 Setup automated backups
5. 📈 Plan database integration
6. 🛡️ Implement authentication
7. 📝 Setup logging aggregation

---

**Deployment Complete! 🎉**

For more help, refer to README.md or check the official documentation for Node.js, PM2, and Nginx.
