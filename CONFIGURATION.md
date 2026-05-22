# Configuration Guide

This guide explains how to configure Mini-Commerce for different environments and use cases.

## Environment Variables

### Basic Configuration

Create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env
```

### Available Environment Variables

```bash
# Node Environment
NODE_ENV=production          # production, development, testing
PORT=3000                    # Application port
HOST=0.0.0.0                 # Bind address

# Data Storage
DATA_DIR=./data             # Path to data directory
LOG_DIR=./logs              # Path to logs directory

# Application
APP_NAME=Mini-Commerce       # Application name
APP_VERSION=1.0.0           # Application version

# Security
CORS_ORIGIN=*               # CORS allowed origins
MAX_REQUEST_SIZE=10mb       # Max request body size

# PM2 Settings
PM2_INSTANCES=max           # Number of instances (max = CPU cores)
PM2_WATCH=false             # Watch for file changes
PM2_MERGE_LOGS=true         # Merge PM2 logs
PM2_MAX_MEMORY_RESTART=500M # Max memory before restart
```

## Server Configuration

### ecosystem.config.js

The PM2 configuration file controls how the application runs:

```javascript
// Key settings:
- exec_mode: 'cluster' or 'fork'    // Cluster mode for multiple processes
- instances: 'max'                  // Use all CPU cores
- error_file: './logs/pm2-error.log' // Error log location
- out_file: './logs/pm2-out.log'     // Output log location
- max_memory_restart: '500M'         // Auto-restart if memory exceeds 500MB
```

**To modify:**
```bash
# Edit the file
nano ecosystem.config.js

# Restart PM2
pm2 restart mini-commerce
```

## Nginx Configuration

### nginx.conf

The Nginx reverse proxy configuration:

**Key settings:**
```nginx
# Upstream servers (load balancing)
upstream mini_commerce {
    least_conn;                          # Load balancing method
    server 127.0.0.1:3000;              # Application servers
}

# Proxy settings
proxy_pass http://mini_commerce;        # Forward requests to app
proxy_set_header Host $host;            # Forward host header
proxy_set_header X-Real-IP $remote_addr; # Forward client IP

# Gzip compression
gzip on;                                 # Enable compression
gzip_min_length 1000;                   # Compress if > 1KB

# Caching
expires 1y;                              # Cache static files for 1 year
```

**To modify:**
```bash
# Edit nginx.conf
sudo nano /etc/nginx/sites-available/mini-commerce

# Test changes
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Multiple Application Instances

Update nginx.conf to load balance across multiple instances:

```nginx
upstream mini_commerce {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
    keepalive 64;
}
```

Update ecosystem.config.js:
```javascript
instances: 4,  // or 'max' for CPU cores
```

## Application Configuration

### Port Configuration

**Using environment variable:**
```bash
PORT=8080 npm start
```

**Or set in .env:**
```bash
PORT=8080
```

**Or set in ecosystem.config.js:**
```javascript
env: {
    PORT: 8080
}
```

### Data Directory

By default, data is stored in `data/products.json`.

**To change:**
```bash
# Edit src/server.js
const dataFile = path.join(__dirname, '../data/products.json');
// Change to:
const dataFile = '/var/mini-commerce/data/products.json';
```

### Logging Configuration

**PM2 logging:**
- Error logs: `logs/pm2-error.log`
- Output logs: `logs/pm2-out.log`

**View logs:**
```bash
pm2 logs mini-commerce           # Real-time logs
pm2 logs mini-commerce --lines 100  # Last 100 lines
pm2 logs mini-commerce --err     # Error logs only
```

## Performance Tuning

### Node.js Optimization

```bash
# Increase max file descriptors
ulimit -n 65536

# Set memory limit
NODE_OPTIONS="--max-old-space-size=512" npm start
```

### Nginx Optimization

```nginx
# In nginx.conf:
worker_processes auto;              # Auto-detect CPU cores
worker_connections 4096;            # Max connections per worker
keepalive_timeout 65;               # Connection timeout
```

### PM2 Optimization

```javascript
// In ecosystem.config.js:
{
    exec_mode: 'cluster',           // Use cluster mode
    instances: 'max',               // Use all CPU cores
    max_memory_restart: '500M',     // Restart if > 500MB
    merge_logs: true                // Combine logs
}
```

## Security Configuration

### CORS Settings

**Allow specific origins (production):**
```bash
# In src/server.js, modify:
app.use(cors({
    origin: ['https://example.com', 'https://www.example.com'],
    credentials: true
}));
```

### SSL/HTTPS

**Using Let's Encrypt:**
```bash
sudo certbot certonly --nginx -d example.com
```

**Update nginx.conf:**
```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

### Security Headers

**Already configured in nginx.conf:**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## Docker Configuration

### Dockerfile Settings

**To modify resource limits:**
```dockerfile
# In Dockerfile, add memory limit to CMD:
CMD ["node", "--max-old-space-size=512", "src/server.js"]
```

### Docker Compose Settings

**Modify docker-compose.yml:**
```yaml
services:
  app:
    # Limit CPU and memory
    cpus: '1.0'
    memory: '512M'
    
    # Environment variables
    environment:
      - NODE_ENV=production
      - PORT=3000
```

## Monitoring Configuration

### PM2 Monitoring

```bash
# Monitor CPU and memory
pm2 monit

# View detailed info
pm2 info mini-commerce

# Export metrics
pm2 web
# Access at http://localhost:9615
```

### System Monitoring

```bash
# Real-time system stats
top

# Disk usage
df -h

# Memory usage
free -h

# Network traffic
nethogs
```

## Backup Configuration

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/home/user/mini-commerce"

# Create backup
tar -czf $BACKUP_DIR/mini-commerce-$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=logs \
    $PROJECT_DIR

# Keep only last 7 days
find $BACKUP_DIR -type f -name "mini-commerce-*.tar.gz" -mtime +7 -delete

echo "Backup completed: mini-commerce-$DATE.tar.gz"
```

**Schedule with cron:**
```bash
# Edit crontab
crontab -e

# Add (daily at 2 AM):
0 2 * * * /path/to/backup.sh
```

## Testing Configuration

### Health Check

**Verify application health:**
```bash
curl http://localhost:3000/health
```

**Nginx health check endpoint:**
```bash
curl http://localhost/health
```

### Load Testing

**Using Apache Bench:**
```bash
# 100 concurrent requests, 1000 total
ab -n 1000 -c 100 http://localhost/
```

**Using wrk:**
```bash
# 4 threads, 100 connections, 30 seconds
wrk -t4 -c100 -d30s http://localhost/
```

## Troubleshooting Configuration Issues

### Application won't start
```bash
# Check for syntax errors
node -c src/server.js

# Run with error output
NODE_DEBUG=* npm start
```

### Nginx not forwarding requests
```bash
# Test configuration
sudo nginx -t

# Check upstream connectivity
curl http://127.0.0.1:3000/health
```

### High memory usage
```bash
# Check process memory
ps aux | grep node

# Reduce PM2 instances or set memory limit
# in ecosystem.config.js
```

## Configuration Checklist

- [ ] .env file created and configured
- [ ] Port accessible from outside
- [ ] Nginx configuration tested
- [ ] PM2 auto-startup configured
- [ ] Data directory writable
- [ ] Logs directory writable
- [ ] SSL/HTTPS configured (production)
- [ ] Security headers verified
- [ ] Backup schedule set
- [ ] Monitoring enabled

---

For more help, see [DEPLOYMENT.md](DEPLOYMENT.md) or [README.md](README.md).
