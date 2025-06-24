const API_BASE_URL = 'http://localhost:8000';

export const chatService = {
  async sendMessage(message: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        message: "I'm having trouble connecting right now. Please try again later.",
        type: 'text'
      };
    }
  },

  async getProducts(query?: string): Promise<any> {
    try {
      const url = query 
        ? `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/products`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Products service error:', error);
      return { products: [] };
    }
  },

  async getOrder(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Order service error:', error);
      return null;
    }
  }
};