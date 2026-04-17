import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product, useCartStore } from '../store/cart';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative pt-[100%]">
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4"
          loading="lazy"
        />
        {product.original_price > product.price && (
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.unit}</div>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 flex-grow">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-sm font-bold">₹{product.price}</div>
            {product.original_price > product.price && (
              <div className="text-xs text-gray-400 line-through">₹{product.original_price}</div>
            )}
          </div>
          {cartItem ? (
            <div className="flex items-center bg-green-600 text-white rounded-lg h-8">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="w-8 h-full flex items-center justify-center hover:bg-green-700 rounded-l-lg"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-8 h-full flex items-center justify-center hover:bg-green-700 rounded-r-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
