const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data storage file
const dataFile = path.join(__dirname, '../data/products.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  // Initialize with sample data
  const sampleData = [
    { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop', stock: 5 },
    { id: 2, name: 'Mouse', price: 29.99, description: 'Wireless mouse', stock: 50 },
    { id: 3, name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard', stock: 25 }
  ];
  fs.writeFileSync(dataFile, JSON.stringify(sampleData, null, 2));
}

// Helper function to read products
function getProducts() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products:', err);
    return [];
  }
}

// Helper function to write products
function saveProducts(products) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

// Helper function to get next ID
function getNextId(products) {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// ==================== API Routes ====================

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const products = getProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE new product
app.post('/api/products', (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    
    // Validation
    if (!name || !price || !stock === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, price, stock' 
      });
    }
    
    const products = getProducts();
    const newProduct = {
      id: getNextId(products),
      name: String(name).trim(),
      price: parseFloat(price),
      description: String(description || '').trim(),
      stock: parseInt(stock),
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    const products = getProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const product = products[index];
    if (name !== undefined) product.name = String(name).trim();
    if (price !== undefined) product.price = parseFloat(price);
    if (description !== undefined) product.description = String(description).trim();
    if (stock !== undefined) product.stock = parseInt(stock);
    product.updatedAt = new Date().toISOString();
    
    saveProducts(products);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = getProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const deletedProduct = products.splice(index, 1);
    saveProducts(products);
    
    res.json({ success: true, message: 'Product deleted', data: deletedProduct[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mini-Commerce server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Data file: ${dataFile}`);
});
