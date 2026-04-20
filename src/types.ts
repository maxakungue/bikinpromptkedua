export type Category = 'Prompt Text' | 'Prompt Gambar' | 'Prompt Video' | 'Other';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
  category: Category;
  author: string;
  price: number | 'Free';
  tags: string[];
  createdAt: string;
}
