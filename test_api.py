# import requests

# BASE_URL = "http://localhost:8000"

# def test_chat():
#     response = requests.post(f"{BASE_URL}/chat", json={"message": "track order 12345", "user": "test_user"})
#     print("🔁 /chat:", response.json())

# def test_get_products():
#     response = requests.get(f"{BASE_URL}/products")
#     print("🛍️ /products:", response.json())

# def test_search_products():
#     response = requests.get(f"{BASE_URL}/products/search", params={"q": "headphones"})
#     print("🔍 /products/search?q=headphones:", response.json())

# def test_get_order():
#     response = requests.get(f"{BASE_URL}/orders/12345")
#     print("📦 /orders/12345:", response.json())

# if __name__ == "__main__":
#     test_chat()
#     test_get_products()
#     test_search_products()
#     test_get_order()

import unittest
import json
from app import app, db, Product

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        with app.app_context():
            db.create_all()
            if not Product.query.first():
                db.session.add(Product(id="100", name="Test Product", price=123.45, category="test", rating=4.0, inStock=True))
                db.session.commit()

    def test_chat_response(self):
        res = self.client.post('/chat', json={"message": "show electronics"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("message", data)

    def test_get_products(self):
        res = self.client.get('/products')
        self.assertEqual(res.status_code, 200)
        self.assertIn("products", res.get_json())

    def test_order_lookup(self):
        res = self.client.get('/orders/12345')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("id", data)

if __name__ == '__main__':
    unittest.main()
