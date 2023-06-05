export interface CategoryList {
  total: number;
  items: Category[];
  has_next: boolean;
  has_prev: boolean;
}

export interface Category {
  id: number;
  type: string;
  name: string;
}

export interface CategoryParam {
  category_type: string;
  value: any;
  categoryList: CategoryList;
  errorMessages: string[];
}

export const array_fields = {
  keys: "key",
  instruments: "instrument",
  time_signatures: "time_signature",
}
