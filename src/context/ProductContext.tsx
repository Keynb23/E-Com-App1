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

// productReducer
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
// This is a reducer function that manages the state related to products within the application. 
// It handles two types of actions: `SET_PRODUCTS` to update the list of available products and `SET_SELECTED_CATEGORY` to change the currently chosen product category.

interface ProductContextType {
  products: Product[];
  selectedCategory: string;

  dispatch: React.Dispatch<ProductAction>;
}

// ProductContext
const ProductContext = createContext<ProductContextType | undefined>(undefined);
// This creates a React Context for product-related data and state management, enabling components to access product lists, selected categories, and dispatch actions.

interface ProductProviderProps {
  children: ReactNode;
}
// ProductProvider
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
// This component serves as a provider for the product context. 
// It utilizes the `useReducer` hook to manage the `productReducer` and `initialState`, 
// making the current product state and a `dispatch` function available to all components wrapped within it.

// useProductContext
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
// This custom hook allows functional components to easily access the `ProductContext`. 
// It also includes a check to ensure that the hook is only called within a `ProductProvider`, preventing common usage errors.