import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import ProductCard from './ProductCard';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'product':
        return (
          <div className="space-y-3">
            <p className="text-gray-800">{message.content}</p>
            {message.data?.products && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {message.data.products.slice(0, 4).map((product: any, index: number) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'order':
        return (
          <div className="space-y-3">
            <p className="text-gray-800">{message.content}</p>
            {message.data?.order && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Order #{message.data.order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.data.order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    message.data.order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    message.data.order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {message.data.order.status.charAt(0).toUpperCase() + message.data.order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Date: {message.data.order.date}</p>
                <p className="font-semibold">Total: ${message.data.order.total}</p>
              </div>
            )}
          </div>
        );
      
      case 'options':
        return (
          <div className="space-y-3">
            <p className="text-gray-800">{message.content}</p>
            {message.data?.options && (
              <div className="flex flex-wrap gap-2">
                {message.data.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} space-x-2`}>
      {isBot && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
        isBot ? 'bg-white' : 'bg-blue-600 text-white'
      } rounded-2xl px-4 py-3 shadow-sm`}>
        {renderMessageContent()}
        <p className={`text-xs mt-2 ${isBot ? 'text-gray-500' : 'text-blue-100'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;