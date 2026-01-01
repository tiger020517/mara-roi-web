import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/db';
import { useAuth } from '../components/AuthProvider'; // 로그인 정보 가져오기 위함

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 현재 로그인한 유저 정보

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  }

  // [추가된 기능] 장바구니 담기 함수
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    const confirmAdd = window.confirm(`"${product.name}"을(를) 장바구니에 담으시겠습니까?`);
    if (!confirmAdd) return;

    // 1. 이미 담겨있는지 확인 (중복 체크)
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();

    if (existingItem) {
      alert('이미 장바구니에 담겨있는 상품입니다.');
      return;
    }

    // 2. 장바구니(DB)에 추가
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1, // 기본 1개
      });

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
    } else {
      // 대표님이 원했던 "토스트 메시지"는 나중에 구현하고 일단 alert로 확인
      alert('장바구니에 담겼습니다!'); 
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">SHOP</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
            <div className="h-48 bg-gray-200 overflow-hidden">
              {product.main_image ? (
                <img src={product.main_image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">이미지 없음</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1 uppercase">{product.category}</div>
              <h3 className="font-medium text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
                
                {/* [수정됨] 버튼에 클릭 이벤트 연결 */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
                >
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