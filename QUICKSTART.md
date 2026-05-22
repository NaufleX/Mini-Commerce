# 🚀 Mini-Commerce Quick Start Guide

Get Mini-Commerce up and running in minutes!

## Local Development (Windows, Mac, Linux)

### 1️⃣ Prerequisites
- Node.js v14+ (v18+ recommended)
- Git

### 2️⃣ Installation
```bash
# Clone repository
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce

# Install dependencies
npm install
```

### 3️⃣ Run Application
```bash
npm run dev
```

### 4️⃣ Access Application
Open your browser: **http://localhost:3000**

---

## Ubuntu Server Deployment

### 1️⃣ Prerequisites
- Ubuntu 18.04+ (with sudo access)
- Git installed

### 2️⃣ Quick Setup
```bash
# Clone repository
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce

# Make setup script executable
chmod +x setup.sh

# Run setup (answer prompts for sudo)
./setup.sh
```

### 3️⃣ Access Application
Open your browser: **http://your-server-ip**

---

## Available Commands

### Development
```bash
npm run dev      # Start with hot-reload (requires nodemon)
npm start        # Start production server
```

### PM2 Management
```bash
npm run pm2-start      # Start with PM2
npm run pm2-stop       # Stop PM2 processes
npm run pm2-restart    # Restart processes
npm run pm2-logs       # View logs
```

### Direct Commands
```bash
# Start server directly
node src/server.js

# View PM2 status
pm2 status

# View logs
pm2 logs mini-commerce
```

---

## API Quick Reference

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "stock": 5,
    "description": "High performance"
  }'
```

### Update Product
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 10}'
```

### Delete Product
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## Useful Ports

| Service | Port | URL |
|---------|------|-----|
| Node.js | 3000 | http://localhost:3000 |
| Nginx   | 80   | http://localhost |
| HTTPS   | 443  | https://localhost |

---

## Directory Structure

```
mini-commerce/
├── src/           # Backend (Express server)
├── public/        # Frontend (HTML, CSS, JS)
│   ├── css/
│   ├── js/
│   └── index.html
├── data/          # Data storage (auto-created)
├── logs/          # PM2 logs (auto-created)
├── package.json   # Dependencies
└── README.md      # Full documentation
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### PM2 Won't Start
```bash
# Clear PM2
pm2 kill

# Start fresh
pm2 start ecosystem.config.js
```

### Nginx 502 Error
```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart PM2
pm2 restart mini-commerce
```

---

## Full Documentation

- 📖 [README.md](README.md) - Complete documentation
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- 🔧 [API Reference](README.md#-api-endpoints) - API endpoints

---

## Next Steps

1. ✅ Run application
2. 📝 Add some products via the UI
3. 🧪 Test the API
4. 🚀 Deploy to Ubuntu VM
5. 🔒 Setup HTTPS
6. 📊 Monitor and maintain

---

**Happy coding! 🎉**
