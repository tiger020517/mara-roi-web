import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/db';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    // Supabase에서 products 테이블의 모든 데이터를 가져옴
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true) // 판매중인 것만
      .order('created_at', { ascending: false }); // 최신순 정렬

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">SHOP</h2>
      
      {/* 상품 그리드 (반응형: 모바일 1열, 태블릿 2열, PC 3열) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
            {/* 상품 이미지 */}
            <div className="h-48 bg-gray-200 overflow-hidden">
              {product.main_image ? (
                <img 
                  src={product.main_image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">이미지 없음</div>
              )}
            </div>

            {/* 상품 정보 */}
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1 uppercase">{product.category}</div>
              <h3 className="font-medium text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
                <button className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
                  담기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}