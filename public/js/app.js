// API Base URL - adjust if needed when deploying
const API_BASE = '/api';
let editingProductId = null;

// DOM Elements
const form = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productStockInput = document.getElementById('productStock');
const productDescriptionInput = document.getElementById('productDescription');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  form.addEventListener('submit', handleFormSubmit);
  cancelEditBtn.addEventListener('click', cancelEdit);
  searchInput.addEventListener('input', handleSearch);
});

// Load all products
async function loadProducts() {
  try {
    productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
    const response = await fetch(`${API_BASE}/products`);
    const result = await response.json();
    
    if (result.success) {
      displayProducts(result.data);
    } else {
      showError('Failed to load products');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showError('Error loading products: ' + error.message);
  }
}

// Display products in grid
function displayProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">No products available. Add your first product!</div>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-header">
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        <span class="product-id">ID: ${product.id}</span>
      </div>
      <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
      <p class="product-description">${escapeHtml(product.description || 'No description provided')}</p>
      <div class="product-stock">
        <span class="stock-label">Stock:</span>
        <span class="stock-value ${getStockClass(product.stock)}">${product.stock}</span>
      </div>
      <div class="product-actions">
        <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Get stock status class
function getStockClass(stock) {
  if (stock === 0) return 'out';
  if (stock < 10) return 'low';
  return '';
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const productData = {
    name: productNameInput.value,
    price: parseFloat(productPriceInput.value),
    stock: parseInt(productStockInput.value),
    description: productDescriptionInput.value
  };

  try {
    let response;
    
    if (editingProductId) {
      // Update existing product
      response = await fetch(`${API_BASE}/products/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
    } else {
      // Create new product
      response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
    }

    const result = await response.json();

    if (result.success) {
      showSuccess(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
      form.reset();
      editingProductId = null;
      updateFormUI();
      loadProducts();
    } else {
      showError(result.error || 'Failed to save product');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    showError('Error: ' + error.message);
  }
}

// Edit product
async function editProduct(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    const result = await response.json();

    if (result.success) {
      const product = result.data;
      productNameInput.value = product.name;
      productPriceInput.value = product.price;
      productStockInput.value = product.stock;
      productDescriptionInput.value = product.description || '';
      editingProductId = id;
      updateFormUI();
      productNameInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showError('Failed to load product for editing');
    }
  } catch (error) {
    console.error('Error editing product:', error);
    showError('Error: ' + error.message);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (result.success) {
      showSuccess('Product deleted successfully!');
      loadProducts();
    } else {
      showError(result.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showError('Error: ' + error.message);
  }
}

// Cancel edit mode
function cancelEdit() {
  editingProductId = null;
  form.reset();
  updateFormUI();
  loadProducts();
}

// Update form UI based on mode
function updateFormUI() {
  if (editingProductId) {
    submitBtn.textContent = 'Update Product';
    cancelEditBtn.style.display = 'inline-block';
    document.querySelector('.form-container h2').textContent = 'Edit Product';
  } else {
    submitBtn.textContent = 'Add Product';
    cancelEditBtn.style.display = 'none';
    document.querySelector('.form-container h2').textContent = 'Add New Product';
  }
}

// Handle search
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const productName = card.querySelector('.product-name').textContent.toLowerCase();
    const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
    
    if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  // Check if any products are visible
  const visibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');
  if (visibleCards.length === 0 && searchTerm.length > 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No products found matching "${escapeHtml(searchTerm)}"</div>
      </div>
    `;
  }
}

// Show success message
function showSuccess(message) {
  showAlert(message, 'success');
}

// Show error message
function showError(message) {
  showAlert(message, 'error');
}

// Show alert
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  document.querySelector('main').insertBefore(alert, document.querySelector('.form-section'));
  
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
