#!/bin/bash

# Mini-Commerce Setup Script for Ubuntu
# This script sets up the complete environment for running Mini-Commerce

set -e  # Exit on error

echo "=========================================="
echo "Mini-Commerce Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}Please do not run this script as root${NC}"
    exit 1
fi

# Step 1: Update system packages
echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Step 2: Install Node.js and npm
echo -e "${YELLOW}Step 2: Installing Node.js and npm...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
echo -e "${GREEN}Node.js version: $(node -v)${NC}"
echo -e "${GREEN}npm version: $(npm -v)${NC}"

# Step 3: Install PM2 globally
echo -e "${YELLOW}Step 3: Installing PM2...${NC}"
sudo npm install -g pm2
pm2 -v

# Step 4: Install Nginx
echo -e "${YELLOW}Step 4: Installing Nginx...${NC}"
sudo apt-get install -y nginx

# Step 5: Clone or setup project
PROJECT_DIR="/home/$(whoami)/mini-commerce"

if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}Step 5: Setting up project directory...${NC}"
    mkdir -p "$PROJECT_DIR"
    echo -e "${GREEN}Project directory created at: $PROJECT_DIR${NC}"
else
    echo -e "${GREEN}Project directory already exists${NC}"
fi

# Step 6: Install project dependencies
echo -e "${YELLOW}Step 6: Installing project dependencies...${NC}"
cd "$PROJECT_DIR"
npm install

# Step 7: Create data directory
echo -e "${YELLOW}Step 7: Creating data directory...${NC}"
mkdir -p "$PROJECT_DIR/data"
mkdir -p "$PROJECT_DIR/logs"

# Step 8: Setup Nginx configuration
echo -e "${YELLOW}Step 8: Setting up Nginx configuration...${NC}"
sudo cp nginx.conf /etc/nginx/sites-available/mini-commerce
sudo ln -sf /etc/nginx/sites-available/mini-commerce /etc/nginx/sites-enabled/

# Remove default Nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Step 9: Start Nginx
echo -e "${YELLOW}Step 9: Starting Nginx...${NC}"
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx

# Step 10: Setup PM2 startup
echo -e "${YELLOW}Step 10: Setting up PM2 startup...${NC}"
cd "$PROJECT_DIR"
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u "$(whoami)" --hp "/home/$(whoami)"

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete! 🎉"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}Application Details:${NC}"
echo -e "  Project Directory: ${GREEN}$PROJECT_DIR${NC}"
echo -e "  Application Port: ${GREEN}3000${NC}"
echo -e "  Nginx Port: ${GREEN}80${NC}"
echo -e "  Health Check: ${GREEN}http://localhost/health${NC}"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs:        pm2 logs mini-commerce"
echo "  Restart app:      pm2 restart mini-commerce"
echo "  Stop app:         pm2 stop mini-commerce"
echo "  Start app:        pm2 start ecosystem.config.js"
echo "  Nginx restart:    sudo systemctl restart nginx"
echo "  Check status:     pm2 status"
echo ""
echo -e "${YELLOW}Access your application:${NC}"
echo -e "  ${GREEN}http://localhost${NC} (via Nginx)"
echo ""
