from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import re
import os

app = Flask(__name__)
CORS(app)

# Config for SQLite DB
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'ecommerce_chatbot.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# SQLAlchemy Models
class Product(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String)
    description = db.Column(db.String)
    category = db.Column(db.String)
    rating = db.Column(db.Float)
    inStock = db.Column(db.Boolean)

class Order(db.Model):
    id = db.Column(db.String, primary_key=True)
    status = db.Column(db.String)
    total = db.Column(db.Float)
    date = db.Column(db.String)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String, db.ForeignKey('order.id'))
    product_id = db.Column(db.String, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer)

class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String)
    message = db.Column(db.String)
    response = db.Column(db.String)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())


def contains_any(text, keywords):
    return any(word in text for word in keywords)

def handle_message(message):
    message = message.lower()

    if contains_any(message, ['track', 'order', 'status', 'delivery']):
        return handle_order_query(message)
    elif contains_any(message, ['find', 'search', 'show', 'product', 'buy']):
        return handle_product_search(message)
    elif contains_any(message, ['trending', 'popular', 'recommend', 'best']):
        return handle_trending()
    elif contains_any(message, ['help', 'support', 'customer', 'contact']):
        return handle_support()
    elif contains_any(message, ['hi', 'hello', 'hey']):
        return handle_greeting()
    else:
        return handle_fallback()

def handle_greeting():
    return {
        "message": "Hello! I'm ShopBot. How can I assist you today?",
        "type": "options",
        "data": {
            "options": ["Show trending products", "Search for electronics", "Track my order", "Customer support"]
        }
    }

def handle_product_search(message):
    category_map = {
        'electronics': ['electronics', 'phone', 'headphone', 'watch', 'charger'],
    }
    for category, keywords in category_map.items():
        if any(k in message for k in keywords):
            matched = Product.query.filter_by(category=category).limit(4).all()
            return {
                "message": f"Here are some {category} products:",
                "type": "product",
                "data": {"products": [p.__dict__ for p in matched]}
            }
    fallback = Product.query.limit(4).all()
    return {
        "message": "Here are some products I found:",
        "type": "product",
        "data": {"products": [p.__dict__ for p in fallback]}
    }

def handle_trending():
    trending = Product.query.order_by(Product.rating.desc()).limit(4).all()
    return {
        "message": "Trending products:",
        "type": "product",
        "data": {"products": [p.__dict__ for p in trending]}
    }

def handle_order_query(message):
    match = re.search(r'\b\d{5}\b', message)
    if match:
        oid = match.group(0)
        order = Order.query.filter_by(id=oid).first()
        if order:
            items = OrderItem.query.filter_by(order_id=oid).all()
            item_data = []
            for item in items:
                product = Product.query.filter_by(id=item.product_id).first()
                if product:
                    item_data.append({"product": product.__dict__, "quantity": item.quantity})
            return {
                "message": "Here are your order details:",
                "type": "order",
                "data": {"order": {**order.__dict__, "items": item_data}}
            }
        else:
            return {"message": "No order found with that ID.", "type": "text"}
    return {"message": "Please provide a 5-digit order ID.", "type": "text"}

def handle_support():
    return {
        "message": "Customer support options:",
        "type": "options",
        "data": {
            "options": ["Track an order", "Return policy", "Shipping info", "Payment options"]
        }
    }

def handle_fallback():
    return {
        "message": "I'm here to help! Ask me about products or orders.",
        "type": "options",
        "data": {"options": ["Show me products", "Track my order", "Customer support"]}
    }

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    user_id = data.get('user', 'guest')
    response = handle_message(user_message)
    db.session.add(ChatHistory(user=user_id, message=user_message, response=response['message']))
    db.session.commit()
    return jsonify(response)

@app.route('/products', methods=['GET'])
def get_products():
    all_products = Product.query.all()
    return jsonify({"products": [p.__dict__ for p in all_products]})

@app.route('/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').lower()
    results = Product.query.filter(Product.name.ilike(f"%{query}%") | Product.description.ilike(f"%{query}%")).all()
    return jsonify({"products": [p.__dict__ for p in results]})

@app.route('/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.filter_by(id=order_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    items = OrderItem.query.filter_by(order_id=order_id).all()
    item_data = []
    for item in items:
        product = Product.query.filter_by(id=item.product_id).first()
        if product:
            item_data.append({"product": product.__dict__, "quantity": item.quantity})
    return jsonify({"order": {**order.__dict__, "items": item_data}})
def seed_data():
    if not Product.query.first():
        products = [
            Product(id="P101", name="Wireless Earbuds", price=1999.0, image="C:\Users\mishi\Downloads\earbuds.jpeg", description="Bluetooth earbuds with mic", category="electronics", rating=4.5, inStock=True),
            Product(id="P102", name="Smart Watch", price=3499.0, image="C:\Users\mishi\Downloads\smartwatch.jpeg", description="Fitness smart watch", category="electronics", rating=4.2, inStock=True),
            Product(id="P103", name="Power Bank", price=999.0, image="C:\Users\mishi\Downloads\powerbank.jpg", description="10000mAh portable charger", category="electronics", rating=4.0, inStock=True),
            Product(id="P104", name="Bluetooth Speaker", price=1499.0, image="C:\Users\mishi\Downloads\speacker.jpg", description="Loud and clear portable speaker", category="electronics", rating=4.6, inStock=True),
        ]
        db.session.bulk_save_objects(products)
        db.session.commit()
        print("✅ Sample products seeded.")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()
    app.run(debug=True, port=8000)
