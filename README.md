# 🛍️ Mini-Commerce - Simple Product Catalog

A lightweight, production-ready Node.js web application for managing a simple product catalog. Built with Express.js and designed to run on Ubuntu with PM2 and Nginx.

**Features:**
- ✅ Full CRUD operations for products
- ✅ No database required (file-based JSON storage)
- ✅ Beautiful, responsive web UI
- ✅ RESTful API with JSON responses
- ✅ Production-ready with PM2 process management
- ✅ Nginx reverse proxy configuration included
- ✅ Easy deployment on Ubuntu VMs
- ✅ Search and filter functionality
- ✅ Real-time stock management

---
## 📋 Prerequisites

- **Node.js** v14+ (v18+ recommended)
- **npm** v6+
- **Ubuntu** 18.04+ (for production deployment)
- **Git** for version control

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🏗️ Project Structure

```
mini-commerce/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── style.css      # Stylesheet
│   └── js/
│       └── app.js         # Frontend JavaScript
├── src/
│   └── server.js          # Express server
├── data/                  # Data storage (auto-created)
│   └── products.json      # Products data file
├── logs/                  # PM2 logs (auto-created)
├── ecosystem.config.js    # PM2 configuration
├── nginx.conf             # Nginx configuration template
├── setup.sh               # Ubuntu setup script
├── package.json           # Node.js dependencies
└── README.md              # This file
```

---

## 📡 API Endpoints

### Get All Products
```bash
GET /api/products
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "description": "High-performance laptop",
      "stock": 5,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Get Single Product
```bash
GET /api/products/:id
```

### Create Product
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "price": 99.99,
  "description": "Product description",
  "stock": 10
}
```

### Update Product
```bash
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 8
}
```

### Delete Product
```bash
DELETE /api/products/:id
```

### Health Check
```bash
GET /health
```

---

## 🔧 Production Deployment on Ubuntu

### Automated Setup (Recommended)

1. **Clone the repository on your Ubuntu VM:**
```bash
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce
```

2. **Make setup script executable:**
```bash
chmod +x setup.sh
```

3. **Run the setup script:**
```bash
./setup.sh
```

This script will:
- Update system packages
- Install Node.js and npm
- Install PM2 globally
- Install Nginx
- Install project dependencies
- Configure Nginx as reverse proxy
- Setup PM2 auto-startup
- Create necessary directories

### Manual Setup

If you prefer manual setup:

1. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2:**
```bash
sudo npm install -g pm2
```

3. **Install Nginx:**
```bash
sudo apt-get install -y nginx
```

4. **Setup application:**
```bash
git clone https://github.com/yourusername/mini-commerce.git
cd mini-commerce
npm install
mkdir -p data logs
```

5. **Configure Nginx:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/mini-commerce
sudo ln -sf /etc/nginx/sites-available/mini-commerce /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
```

6. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u $USER --hp $HOME
```

---

## 📊 PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# View logs
pm2 logs mini-commerce

# Restart application
pm2 restart mini-commerce

# Stop application
pm2 stop mini-commerce

# Delete from PM2
pm2 delete mini-commerce

# View application status
pm2 status

# Monitor CPU and memory
pm2 monit
```

---

## 🌐 Nginx Commands

```bash
# Check Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# View Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Enable auto-start on boot
sudo systemctl enable nginx
```

---

## 🔒 Security Considerations

1. **Use HTTPS in Production:**
   - Set up SSL/TLS with Let's Encrypt or similar
   - Update Nginx configuration with SSL certificates
   - Redirect HTTP to HTTPS

2. **Environment Variables:**
   - Never commit sensitive data to Git
   - Use environment variables for configuration
   - Store credentials securely

3. **Input Validation:**
   - The API validates all inputs
   - Frontend also includes client-side validation
   - Escape HTML to prevent XSS attacks

4. **Nginx Security Headers:**
   - Security headers are configured in nginx.conf
   - CORS is enabled by default
   - Adjust as needed for your use case

---

## 🚨 Troubleshooting

### Application won't start
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill process using the port
kill -9 <PID>

# Check for Node.js installation
node -v
npm -v
```

### Nginx 502 Bad Gateway
```bash
# Verify PM2 app is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Permission Denied Errors
```bash
# For setup.sh
chmod +x setup.sh

# For Nginx configuration
sudo chown root:root /etc/nginx/sites-available/mini-commerce
sudo chmod 644 /etc/nginx/sites-available/mini-commerce
```

### Data file missing
```bash
# The data directory and file are created automatically
# If missing, PM2 restart will recreate them
pm2 restart mini-commerce
```

---

## 📈 Performance Optimization

1. **Enable Gzip compression** ✅ (configured in nginx.conf)
2. **Caching headers** ✅ (configured for static files)
3. **Load balancing** ✅ (PM2 cluster mode, multiple upstreams in Nginx)
4. **Connection pooling** ✅ (Nginx keepalive)
5. **Memory limits** ✅ (500MB in ecosystem.config.js)

---

## 🔄 Data Persistence

Data is stored in `data/products.json` as a JSON file. This provides:
- ✅ No external database required
- ✅ Simple backup (just copy the file)
- ✅ Easy to inspect and debug
- ✅ Suitable for small to medium deployments

For larger deployments, consider integrating a database like MongoDB or PostgreSQL.

---

## 📝 API Testing Examples

### Using cURL

```bash
# Get all products
curl http://localhost:3000/api/products

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone","price":999,"stock":10,"description":"Latest model"}'

# Update a product
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock":5}'

# Delete a product
curl -X DELETE http://localhost:3000/api/products/1
```

### Using Postman
1. Import the API endpoints
2. Set Content-Type to application/json
3. Use the examples above in Postman

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 📞 Support

For issues and questions:
1. Check the Troubleshooting section
2. Review PM2 and Nginx logs
3. Check GitHub Issues
4. Open a new issue with details

---

## 🎯 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Product categories
- [ ] Order management
- [ ] Admin dashboard
- [ ] Inventory alerts
- [ ] API rate limiting
- [ ] Advanced search and filters

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

**Happy coding! 🚀**
#   M i n i - C o m m e r c e 
 
 
