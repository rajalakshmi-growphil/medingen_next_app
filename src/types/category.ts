export interface Category {
  id?: number | string;
  category_id?: number | string;
  name?: string;
  category_name?: string;
  display_name?: string;
  title?: string;
  slug?: string;
  image?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id?: number | string;
  name: string;
  slug?: string;
}

export interface CategoryFilterState {
  subCategories: string[];
  dosageForm: string[];
  saltComposition: string;
}
