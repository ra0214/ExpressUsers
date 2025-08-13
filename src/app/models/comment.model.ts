export interface Comment {
  id?: number;
  name: string;
  content: string;
  product_id: number;
  rating: number;
  created_at?: string;
  updated_at?: string;
}
