/* src/main.js */
const products = [
  { id: 1, title: 'Minimalist Signature Jacket', category: 'clothes', price: 249.00, image: '/images/product_clothes_1776297862770.png' },
  { id: 2, title: 'Luxury Leather Handbag', category: 'bags', price: 890.00, image: '/images/product_bag_1776297734162.png' },
  { id: 3, title: 'Modern Urban Sneaker', category: 'shoes', price: 185.00, image: '/images/product_shoe_1776297754532.png' },
  { id: 4, title: 'Classic Trench Coat', category: 'clothes', price: 320.00, image: '/images/product_clothes_1776297862770.png' },
  { id: 5, title: 'Mini Crossbody Bag', category: 'bags', price: 450.00, image: '/images/product_bag_1776297734162.png' },
  { id: 6, title: 'High-Top Runner', category: 'shoes', price: 210.00, image: '/images/product_shoe_1776297754532.png' }
];

let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const header = document.querySelector('.header');
const heroBg = document.querySelector('.hero-bg');

// Checkout DOM
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutTitle = document.getElementById('checkout-title');

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');

// Theme SVG Icons
const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

// Set Hero Background Image randomly or fixed
if(heroBg) heroBg.style.backgroundImage = `url('/images/hero_fashion_1776297697230.png')`;

// Initialization
function init() {
  initTheme();
  renderProducts('all');
  setupEventListeners();
  loadCart();
  initIntersectionObserver();
}

function initTheme() {
    const savedTheme = localStorage.getItem('lumiere_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-icon').innerHTML = savedTheme === 'dark' ? sunIcon : moonIcon;
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function renderProducts(filterCategory) {
  productsGrid.innerHTML = '';
  const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach((product, i) => {
    const card = document.createElement('div');
    card.classList.add('product-card', 'reveal');
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.title}" class="product-img">
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
      </div>
    `;
    productsGrid.appendChild(card);
    // Observe for reveal
    setTimeout(() => card.classList.add('active'), 50); // fast trigger for dynamic inject
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

function showStep(stepEl, title) {
    [step1, step2, step3, step4].forEach(el => el.classList.remove('active'));
    stepEl.classList.add('active');
    checkoutTitle.innerText = title;
}

function setupEventListeners() {
  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('lumiere_theme', nextTheme);
      document.getElementById('theme-icon').innerHTML = nextTheme === 'dark' ? sunIcon : moonIcon;
  });

  // Category Filtering
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      const target = e.target;
      target.classList.add('active');
      const category = target.getAttribute('data-category');
      renderProducts(category);
    });
  });

  // Header Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Multistep Checkout Listeners
  cartBtn.addEventListener('click', () => {
    showStep(step1, 'Your Cart');
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
  });

  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Flow Navigation
  document.getElementById('go-to-shipping').addEventListener('click', () => {
      if(cart.length === 0) return alert('Your cart is empty!');
      showStep(step2, 'Shipping Details');
  });
  
  document.getElementById('back-to-cart').addEventListener('click', () => showStep(step1, 'Your Cart'));
  
  document.getElementById('go-to-payment').addEventListener('click', () => showStep(step3, 'Payment Info'));
  
  document.getElementById('back-to-shipping').addEventListener('click', () => showStep(step2, 'Shipping Details'));
  
  document.getElementById('confirm-order').addEventListener('click', () => {
      cart = []; saveCart(); updateCartUI();
      showStep(step4, 'Success');
  });

  document.getElementById('close-success').addEventListener('click', () => {
      closeCart();
      showStep(step1, 'Your Cart');
  });
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  saveCart(); updateCartUI();
  
  cartBtn.style.transform = 'scale(1.1)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);

  showNotification(`${product.title} added to cart`);
}

function showNotification(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">✓</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart(); updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  let totalCount = 0; let totalPrice = 0;

  if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="color:var(--text-muted)">Your cart is empty.</p>';
  } else {
      cart.forEach(item => {
        totalCount += item.quantity; totalPrice += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
  }

  cartCount.innerText = totalCount;
  cartTotalPrice.innerText = totalPrice.toFixed(2);

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
}

function saveCart() { localStorage.setItem('lumiere_cart', JSON.stringify(cart)); }
function loadCart() {
  const savedCart = localStorage.getItem('lumiere_cart');
  if (savedCart) { cart = JSON.parse(savedCart); updateCartUI(); }
}

init();
