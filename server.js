const http = require('http');
const url = require('url');
const querystring = require('querystring');

class ChatBotServer {
    constructor() {
        // Sample product data
        this.products = [
            {
                "id": "1",
                "name": "Wireless Bluetooth Headphones",
                "price": 89.99,
                "image": "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
                "description": "High-quality wireless headphones with noise cancellation",
                "category": "electronics",
                "rating": 4.5,
                "inStock": true
            },
            {
                "id": "2",
                "name": "Smart Fitness Watch",
                "price": 199.99,
                "image": "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400",
                "description": "Advanced fitness tracking with heart rate monitor",
                "category": "electronics",
                "rating": 4.3,
                "inStock": true
            },
            {
                "id": "3",
                "name": "Premium Coffee Maker",
                "price": 149.99,
                "image": "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400",
                "description": "Programmable coffee maker with built-in grinder",
                "category": "appliances",
                "rating": 4.7,
                "inStock": true
            },
            {
                "id": "4",
                "name": "Organic Cotton T-Shirt",
                "price": 29.99,
                "image": "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400",
                "description": "Comfortable organic cotton t-shirt",
                "category": "clothing",
                "rating": 4.2,
                "inStock": true
            },
            {
                "id": "5",
                "name": "Wireless Charging Pad",
                "price": 39.99,
                "image": "https://images.pexels.com/photos/4254553/pexels-photo-4254553.jpeg?auto=compress&cs=tinysrgb&w=400",
                "description": "Fast wireless charging for compatible devices",
                "category": "electronics",
                "rating": 4.1,
                "inStock": false
            },
            {
                "id": "6",
                "name": "Yoga Mat Premium",
                "price": 59.99,
                "image": "https://images.pexels.com/photos/3822844/pexels-photo-3822844.jpeg?auto=compress&cs=tinysrgb&w=400",
                "description": "Non-slip premium yoga mat with alignment lines",
                "category": "fitness",
                "rating": 4.6,
                "inStock": true
            }
        ];
        
        // Sample orders data
        this.orders = {
            "12345": {
                "id": "12345",
                "status": "shipped",
                "total": 149.98,
                "date": "2024-01-15",
                "items": [
                    {"product": this.products[0], "quantity": 1},
                    {"product": this.products[3], "quantity": 2}
                ]
            },
            "67890": {
                "id": "67890",
                "status": "delivered",
                "total": 89.99,
                "date": "2024-01-10",
                "items": [
                    {"product": this.products[1], "quantity": 1}
                ]
            }
        };
    }

    setCORSHeaders(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    handleRequest(req, res) {
        this.setCORSHeaders(res);

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const query = parsedUrl.query;

        if (req.method === 'POST' && path === '/chat') {
            this.handleChat(req, res);
        } else if (req.method === 'GET' && path === '/products') {
            this.handleGetProducts(res);
        } else if (req.method === 'GET' && path === '/products/search') {
            this.handleSearchProducts(query.q || '', res);
        } else if (req.method === 'GET' && path.startsWith('/orders/')) {
            const orderId = path.split('/').pop();
            this.handleGetOrder(orderId, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    }

    handleChat(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const message = (data.message || '').toLowerCase();
                
                const response = this.processMessage(message);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            } catch (error) {
                this.sendErrorResponse(res, error.message);
            }
        });
    }

    processMessage(message) {
        // Intent recognition based on keywords
        if (this.containsAny(message, ['track', 'order', 'status', 'delivery'])) {
            return this.handleOrderInquiry(message);
        } else if (this.containsAny(message, ['find', 'search', 'show', 'product', 'buy'])) {
            return this.handleProductSearch(message);
        } else if (this.containsAny(message, ['trending', 'popular', 'recommend', 'best'])) {
            return this.handleTrendingProducts();
        } else if (this.containsAny(message, ['help', 'support', 'customer', 'contact'])) {
            return this.handleCustomerSupport();
        } else if (this.containsAny(message, ['hi', 'hello', 'hey', 'good morning', 'good afternoon'])) {
            return this.handleGreeting();
        } else {
            return this.handleGeneralQuery(message);
        }
    }

    containsAny(text, words) {
        return words.some(word => text.includes(word));
    }

    handleGreeting() {
        return {
            "message": "Hello! Welcome to our store! I'm here to help you find products, track orders, or answer any shopping questions. What can I help you with today?",
            "type": "options",
            "data": {
                "options": [
                    "Show trending products",
                    "Search for electronics",
                    "Track my order",
                    "Customer support"
                ]
            }
        };
    }

    handleProductSearch(message) {
        const categoryMap = {
            'electronics': ['electronics', 'phone', 'headphone', 'watch', 'charger'],
            'clothing': ['clothing', 'shirt', 'pants', 'dress', 'fashion'],
            'appliances': ['appliances', 'coffee', 'kitchen', 'home'],
            'fitness': ['fitness', 'yoga', 'exercise', 'gym']
        };
        
        let matchedProducts = [];
        for (const [category, keywords] of Object.entries(categoryMap)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                matchedProducts = this.products.filter(p => p.category === category);
                break;
            }
        }
        
        if (matchedProducts.length === 0) {
            matchedProducts = this.products.slice(0, 4);
        }
        
        return {
            "message": "Here are some great products I found for you:",
            "type": "product",
            "data": {
                "products": matchedProducts.slice(0, 4)
            }
        };
    }

    handleTrendingProducts() {
        const trending = [...this.products].sort((a, b) => b.rating - a.rating).slice(0, 4);
        
        return {
            "message": "Here are our trending products with the highest ratings:",
            "type": "product",
            "data": {
                "products": trending
            }
        };
    }

    handleOrderInquiry(message) {
        const orderMatch = message.match(/\b\d{5}\b/);
        
        if (orderMatch) {
            const orderId = orderMatch[0];
            if (this.orders[orderId]) {
                const order = this.orders[orderId];
                return {
                    "message": "I found your order! Here are the details:",
                    "type": "order",
                    "data": {
                        "order": order
                    }
                };
            } else {
                return {
                    "message": "I couldn't find an order with that number. Please check the order ID and try again, or contact customer support if you need help.",
                    "type": "text"
                };
            }
        } else {
            return {
                "message": "I'd be happy to help you track your order! Please provide your order number (5 digits). For example, you can say: 'Track order 12345'",
                "type": "text"
            };
        }
    }

    handleCustomerSupport() {
        return {
            "message": "I'm here to help with customer support! Here are some ways I can assist you:",
            "type": "options",
            "data": {
                "options": [
                    "Track an order",
                    "Return/Exchange policy",
                    "Shipping information",
                    "Payment options",
                    "Product warranty",
                    "Contact human agent"
                ]
            }
        };
    }

    handleGeneralQuery(message) {
        const responses = [
            "I'm here to help with your shopping needs! You can ask me to find products, track orders, or get customer support.",
            "I can help you find products, check order status, or answer questions about shopping. What would you like to do?",
            "Feel free to ask me about our products, track an order, or get shopping assistance. How can I help?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return {
            "message": randomResponse,
            "type": "options",
            "data": {
                "options": [
                    "Show me products",
                    "Track my order",
                    "Customer support"
                ]
            }
        };
    }

    handleGetProducts(res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ products: this.products }));
    }

    handleSearchProducts(query, res) {
        const lowerQuery = query.toLowerCase();
        const filteredProducts = this.products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.description.toLowerCase().includes(lowerQuery) || 
            p.category.toLowerCase().includes(lowerQuery)
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ products: filteredProducts }));
    }

    handleGetOrder(orderId, res) {
        if (this.orders[orderId]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(this.orders[orderId]));
        } else {
            res.writeHead(404);
            res.end();
        }
    }

    sendErrorResponse(res, errorMessage) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        const response = {
            "message": "I'm sorry, I encountered an error. Please try again.",
            "type": "text"
        };
        res.end(JSON.stringify(response));
    }

    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        const port = 8000;
        server.listen(port, 'localhost', () => {
            console.log(`Starting server on http://localhost:${port}`);
        });

        process.on('SIGINT', () => {
            console.log('\nShutting down server...');
            server.close();
            process.exit(0);
        });
    }
}

if (require.main === module) {
    const chatBot = new ChatBotServer();
    chatBot.start();
}

module.exports = ChatBotServer;