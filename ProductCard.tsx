import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      
      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
        {product.name}
      </h3>
      
      <div className="flex items-center space-x-1 mb-2">
        {renderStars(product.rating)}
        <span className="text-xs text-gray-500">({product.rating})</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          ${product.price}
        </span>
        
        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
      
      {!product.inStock && (
        <p className="text-red-500 text-xs mt-2">Out of Stock</p>
      )}
    </div>
  );
};

export default ProductCard;