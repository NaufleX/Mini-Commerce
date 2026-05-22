# 🛍️ Mini-Commerce - Project Overview

## ✨ What You Get

A complete, production-ready mini e-commerce product catalog application that runs on:
- **Node.js** + **Express** backend
- **PM2** process manager
- **Nginx** reverse proxy
- **Ubuntu** Linux VM

## 📦 What's Included

### Backend
- ✅ RESTful API with full CRUD operations
- ✅ File-based JSON storage (no database required)
- ✅ Product management (create, read, update, delete)
- ✅ Health check endpoint
- ✅ CORS support
- ✅ Error handling

### Frontend
- ✅ Beautiful, responsive web UI
- ✅ Real-time product management
- ✅ Search and filter functionality
- ✅ Edit/Delete products inline
- ✅ Stock tracking
- ✅ Form validation
- ✅ Success/Error notifications

### Production Features
- ✅ PM2 cluster mode (use all CPU cores)
- ✅ Nginx reverse proxy with load balancing
- ✅ Automatic restarts on crash
- ✅ Memory limits and monitoring
- ✅ Gzip compression
- ✅ Security headers
- ✅ Caching configuration
- ✅ Health checks

### Deployment Options
- ✅ Manual setup on Ubuntu
- ✅ **Automated setup script** (one-click deployment)
- ✅ Docker containerization
- ✅ Docker Compose for quick deployment
- ✅ Systemd service file (alternative)

### Documentation
- ✅ README.md - Complete guide
- ✅ QUICKSTART.md - Get started in 5 minutes
- ✅ DEPLOYMENT.md - Detailed deployment steps
- ✅ CONFIGURATION.md - Advanced configuration
- ✅ Code comments and examples

---

## 🚀 Getting Started (3 Easy Steps)

### Step 1: Local Development
```bash
cd mini-commerce
npm install
npm run dev
# Opens at http://localhost:3000
```

### Step 2: Upload to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mini-commerce.git
git push -u origin main
```

### Step 3: Deploy on Ubuntu VM
```bash
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce
chmod +x setup.sh
./setup.sh
# Done! Access at http://your-vm-ip
```

---

## 📁 Complete File Structure

```
mini-commerce/
│
├── 📄 Backend & Configuration
│   ├── package.json              # Node.js dependencies
│   ├── ecosystem.config.js        # PM2 configuration
│   ├── nginx.conf                 # Nginx reverse proxy
│   ├── Dockerfile                 # Docker image
│   ├── docker-compose.yml         # Docker Compose
│   └── mini-commerce.service      # Systemd service (optional)
│
├── 🖥️ Backend Source Code
│   └── src/
│       └── server.js              # Express.js server with API
│
├── 🎨 Frontend
│   └── public/
│       ├── index.html             # Main HTML page
│       ├── css/
│       │   └── style.css          # Responsive styling
│       └── js/
│           └── app.js             # Frontend JavaScript (CRUD logic)
│
├── 📂 Data Storage (Auto-created)
│   └── data/
│       └── products.json          # Products database
│
├── 📝 Documentation
│   ├── README.md                  # Full documentation
│   ├── QUICKSTART.md              # 5-minute quick start
│   ├── DEPLOYMENT.md              # Detailed deployment guide
│   ├── CONFIGURATION.md           # Configuration options
│   └── LICENSE                    # MIT License
│
├── 🔧 Setup & Deployment
│   ├── setup.sh                   # Automated Ubuntu setup script
│   ├── .env.example               # Environment variables template
│   ├── .gitignore                 # Git ignore rules
│   ├── .dockerignore              # Docker ignore rules
│   └── logs/                      # PM2 logs (auto-created)
```

---

## 🌐 API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create new product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /health | Health check |

---

## 💻 Development vs Production

### Development
```bash
npm run dev      # Hot-reload enabled
PORT=3000        # Direct access
```

### Production
```bash
npm run pm2-start       # Cluster mode, auto-restart
Nginx → App             # Reverse proxy on port 80
Load balancing          # Multiple instances
```

---

## 🔐 Security Features Included

- ✅ Input validation
- ✅ XSS prevention (HTML escaping)
- ✅ CORS configuration
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ Rate limiting ready
- ✅ HTTPS/SSL ready (Let's Encrypt support)

---

## 📊 Performance Features

- ✅ Gzip compression
- ✅ Static file caching (1 year)
- ✅ Connection pooling
- ✅ Load balancing (PM2 + Nginx)
- ✅ Memory limits (auto-restart at 500MB)
- ✅ CPU optimization (cluster mode)
- ✅ Minimal dependencies (Express + Body-parser + CORS)

---

## 🎯 Perfect For

- 📚 Learning Node.js + PM2 + Nginx
- 🎓 University cloud computing projects
- 💼 Portfolio projects
- 🚀 Microservices foundation
- 🏪 Real product catalog demo
- 📈 Scaling demonstrations

---

## 🔄 CRUD Operations Example

### Create
```bash
curl -X POST http://localhost/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"stock":5}'
```

### Read
```bash
curl http://localhost/api/products
curl http://localhost/api/products/1
```

### Update
```bash
curl -X PUT http://localhost/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock":10}'
```

### Delete
```bash
curl -X DELETE http://localhost/api/products/1
```

---

## 🛠️ Technologies Used

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js v18+ | JavaScript runtime |
| Framework | Express.js | Web server & API |
| Process Manager | PM2 | Auto-restart, clustering |
| Reverse Proxy | Nginx | Load balancing, SSL |
| Storage | JSON file | No database setup needed |
| Frontend | HTML5/CSS3/JS | Responsive UI |
| Container | Docker | Easy deployment |
| OS | Ubuntu | Production server |

---

## ✅ Deployment Checklist

- [ ] Clone repository from GitHub
- [ ] Run setup script (Ubuntu)
- [ ] Verify PM2 running
- [ ] Verify Nginx running
- [ ] Test health endpoint
- [ ] Add sample products
- [ ] Test CRUD operations
- [ ] Configure HTTPS/SSL
- [ ] Setup backups
- [ ] Monitor logs

---

## 📈 Next Steps After Deployment

1. **Setup HTTPS** - Use Let's Encrypt for free SSL
2. **Configure Domain** - Point domain to your VM
3. **Add Authentication** - JWT or session-based
4. **Database Integration** - PostgreSQL or MongoDB
5. **Admin Panel** - Advanced management UI
6. **Mobile App** - React Native client
7. **API Documentation** - Swagger/OpenAPI
8. **Monitoring** - PM2+ or New Relic

---

## 🆘 Quick Help

### Application won't start?
```bash
# Check if running
pm2 status

# View detailed logs
pm2 logs mini-commerce --err

# Restart
pm2 restart mini-commerce
```

### Nginx 502 error?
```bash
# Check upstream
curl http://127.0.0.1:3000/health

# Restart Nginx
sudo systemctl restart nginx
```

### Check if accessible?
```bash
# Test from VM
curl http://localhost

# Test from external
curl http://your-vm-ip
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete reference |
| QUICKSTART.md | Fast 5-minute setup |
| DEPLOYMENT.md | Detailed instructions |
| CONFIGURATION.md | All config options |
| This file | Project overview |

---

## 🚀 One-Command Deployment

```bash
git clone https://github.com/yourusername/mini-commerce.git && \
cd mini-commerce && \
chmod +x setup.sh && \
./setup.sh
```

---

**Ready to deploy? Start with QUICKSTART.md! 🎉**

---

*Last updated: May 2024*
*MIT License - Free to use and modify*
