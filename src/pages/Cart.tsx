import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../components/AuthProvider';

// 장바구니 데이터 타입 (DB Join 결과물)
interface CartItem {
  id: number;
  quantity: number;
  product_id: number;
  products: {
    name: string;
    price: number;
    main_image: string | null;
  };
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // 1. 장바구니 목록 가져오기 (상품 정보 Join)
  async function fetchCart() {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)') // products 테이블 내용을 같이 가져와라!
      .eq('user_id', user?.id)
      .order('created_at', { ascending: true });

    if (error) console.error('Error:', error);
    else setCartItems(data || []);
    
    setLoading(false);
  }

  // 2. 장바구니에서 삭제
  async function removeItem(id: number) {
    const { error } = await supabase.from('cart_items').delete().eq('id', id);
    if (!error) {
      // 화면에서도 바로 지워주기 (새로고침 없이)
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  // 총 금액 계산
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity, 0
  );

  // 3. 주문하기 (무통장 입금)
  async function handleOrder() {
    if (!confirm('주문하시겠습니까? \n주문 후 입금 계좌가 안내됩니다.')) return;

    if (!user?.user_metadata.full_name && !user?.email) {
      alert('주문자 정보가 없습니다.');
      return;
    }

    // A. 주문서(Orders) 생성
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id,
        total_price: totalPrice,
        depositor_name: user?.user_metadata.full_name || user?.email?.split('@')[0], // 임시로 닉네임 사용
        shipping_address: '배송지 입력 기능은 추후 추가', // 일단 하드코딩 (나중에 입력폼 만듭시다)
        phone: '010-0000-0000', // 일단 하드코딩
        status: 'pending' // 입금 대기 상태
      })
      .select()
      .single();

    if (orderError) {
      alert('주문 실패: ' + orderError.message);
      return;
    }

    // B. 주문 상세(Order Items) 기록 및 장바구니 비우기
    // (원래는 트랜잭션으로 해야 하지만, Supabase JS에선 이렇게 순차적으로 해도 됩니다)
    
    // 1) 주문 상세 아이템 복사
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.products.price
    }));

    await supabase.from('order_items').insert(orderItems);

    // 2) 장바구니 비우기
    await supabase.from('cart_items').delete().eq('user_id', user?.id);

    // C. 완료 알림 및 이동
    alert(`[주문 접수 완료]\n\n입금하실 금액: ${totalPrice.toLocaleString()}원\n계좌: 카카오뱅크 3333-XX-XXXXXX (예금주: 홍길동)\n\n입금이 확인되면 배송이 시작됩니다.`);
    navigate('/'); // 메인으로 이동
  }

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (cartItems.length === 0) return <div className="p-16 text-center text-gray-500">장바구니가 비어있습니다.</div>;

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">장바구니</h2>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 border p-4 rounded-lg bg-white items-center">
            {/* 이미지 */}
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {item.products.main_image && (
                <img src={item.products.main_image} alt={item.products.name} className="w-full h-full object-cover" />
              )}
            </div>
            
            {/* 정보 */}
            <div className="flex-1">
              <h3 className="font-medium">{item.products.name}</h3>
              <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
              <p className="font-bold mt-1">{item.products.price.toLocaleString()}원</p>
            </div>

            {/* 삭제 버튼 */}
            <button 
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 text-sm underline"
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 결제 요약 */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between text-lg font-bold mb-6">
          <span>총 결제금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        
        <button 
          onClick={handleOrder}
          className="w-full py-4 bg-black text-white text-lg font-bold rounded hover:bg-gray-800 transition-colors"
        >
          주문하기 (입금 요청)
        </button>
      </div>
    </div>
  );
}