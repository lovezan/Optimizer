export interface ProductData {
  asin: string;
  original_title: string;
  original_bullets: string[];
  original_description: string;
  optimized_title: string;
  optimized_bullets: string[];
  optimized_description: string;
  keywords: string[];
}

export interface OptimizationHistory {
  id: number;
  asin: string;
  original_title: string;
  original_bullets: string[];
  original_description: string;
  optimized_title: string;
  optimized_bullets: string[];
  optimized_description: string;
  keywords: string[];
  created_at: string;
}
