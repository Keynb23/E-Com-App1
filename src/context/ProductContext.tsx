import { createContext, useContext, type ReactNode, useReducer } from "react";
import type { Product } from "../types/types";


type ProductAction =
  { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string };

interface ProductState {
  products: Product[];
  selectedCategory: string;
}

const initialState: ProductState = {
  products: [],
  selectedCategory: '',
};

const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
};

interface ProductContextType {
  products: Product[];
  selectedCategory: string;

  dispatch: React.Dispatch<ProductAction>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}
export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};