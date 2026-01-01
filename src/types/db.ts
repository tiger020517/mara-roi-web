export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  main_image: string | null;
  stock: number;
  category: string;
  is_active: boolean;
}

export interface MinistryPost {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  category: 'prayer_letter' | 'news' | 'vision';
  created_at: string;
}

export interface Profile {
  id: string; // uuid
  email: string;
  username: string;
  phone: string | null;
  role: 'customer' | 'admin';
}

// 필요할 때마다 여기에 타입을 추가하면 됩니다.