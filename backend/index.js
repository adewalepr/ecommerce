const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, title: 'Minimalist Signature Jacket', category: 'clothes', price: 249.00, image: '/images/product_clothes_1776297862770.png' },
  { id: 2, title: 'Luxury Leather Handbag', category: 'bags', price: 890.00, image: '/images/product_bag_1776297734162.png' },
  { id: 3, title: 'Modern Urban Sneaker', category: 'shoes', price: 185.00, image: '/images/product_shoe_1776297754532.png' },
  { id: 4, title: 'Classic Trench Coat', category: 'clothes', price: 320.00, image: '/images/product_clothes_1776297862770.png' },
  { id: 5, title: 'Mini Crossbody Bag', category: 'bags', price: 450.00, image: '/images/product_bag_1776297734162.png' },
  { id: 6, title: 'High-Top Runner', category: 'shoes', price: 210.00, image: '/images/product_shoe_1776297754532.png' }
];

app.get('/', (req, res) => {
    res.send("Lumiere E-Commerce Backend is running.");
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if(email && password) {
        res.json({ success: true, token: "mock_jwt_token_12345", message: "Logged in successfully" });
    } else {
        res.status(400).json({ success: false, message: "Email and password required" });
    }
});

app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    if(name && email && password) {
        res.json({ success: true, token: "mock_jwt_token_67890", message: "Signed up successfully" });
    } else {
        res.status(400).json({ success: false, message: "All fields required" });
    }
});

app.post('/api/checkout', (req, res) => {
    const { cart, shipping, payment } = req.body;
    // Basic validation
    if(!cart || cart.length === 0) return res.status(400).json({ success: false, message: "Cart is empty" });
    
    // Process order -> db logic goes here
    res.json({ success: true, message: "Order processed successfully", orderId: Math.floor(Math.random() * 1000000) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
