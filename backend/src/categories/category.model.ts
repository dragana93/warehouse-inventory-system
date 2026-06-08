export interface Category {
  id: number;
  name: string;
}

export interface CategorySummary {
  id: number;
  name: string;
  productCount: number;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}
