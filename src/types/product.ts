export interface Product {
  id?: number | string;
  product_id?: number | string;
  productName?: string;
  name?: string;
  product_name?: string;
  product_name_url?: string;
  slug?: string;
  salt?: string;
  salt_composition?: string;
  used_for?: string;
  productDescription?: string;
  description?: string;
  ourPrice?: number | string;
  originalPrice?: number | string;
  discountedPrice?: number | string;
  product_pricing_new?: number | string;
  mrp?: number | string;
  selling_price?: number | string;
  first_image_url?: string;
  image?: string;
  images?: string[];
  inStock?: boolean;
  rc?: number;
  quantity?: number;
  manufacturer?: string;
  brand?: string;
  meta_title?: string;
  metaTitle?: string;
  meta_description?: string;
  metaDescription?: string;
  meta_keywords?: string;
  metaKeywords?: string;
  tags?: string[];
}

export interface ProductPricing {
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
}
