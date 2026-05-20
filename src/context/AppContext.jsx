import { createContext, useContext, useReducer, useEffect } from 'react';
import initialProducts from '../data/products';

const AppContext = createContext(null);

const CART_KEY = 'noithat_cart';

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

const initialState = {
  products: initialProducts,
  cart: loadCartFromStorage(),
  orders: [],
  currentView: 'home',       // 'home' | 'products' | 'admin'
  searchQuery: '',
  selectedCategory: 'all',
  priceFilter: 'all',
  isCartOpen: false,
  isOrderOpen: false,
  isOrderSuccess: false,
  isAdminLoggedIn: false,
  editingProduct: null,       // null or product object
  nextProductId: initialProducts.length + 1,
};

function reducer(state, action) {
  switch (action.type) {
    // ----- CART -----
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.product.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map(item =>
          item.id === action.product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.product, qty: 1 }];
      }
      return { ...state, cart: newCart };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.id);
      return { ...state, cart: newCart };
    }
    case 'UPDATE_CART_QTY': {
      if (action.qty <= 0) {
        const newCart = state.cart.filter(item => item.id !== action.id);
        return { ...state, cart: newCart };
      }
      const newCart = state.cart.map(item =>
        item.id === action.id ? { ...item, qty: action.qty } : item
      );
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };

    // ----- ORDERS -----
    case 'PLACE_ORDER': {
      const newOrder = {
        id: Date.now(),
        createdAt: new Date().toLocaleString('vi-VN'),
        items: [...state.cart],
        total: state.cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        customer: action.customer,
        status: 'Mới',
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        cart: [],
        isOrderOpen: false,
        isCartOpen: false,
        isOrderSuccess: true,
      };
    }

    // ----- PRODUCTS (admin) -----
    case 'ADD_PRODUCT': {
      const newProduct = {
        ...action.product,
        id: state.nextProductId,
      };
      return {
        ...state,
        products: [...state.products, newProduct],
        nextProductId: state.nextProductId + 1,
        editingProduct: null,
      };
    }
    case 'UPDATE_PRODUCT': {
      const updated = state.products.map(p =>
        p.id === action.product.id ? action.product : p
      );
      return { ...state, products: updated, editingProduct: null };
    }
    case 'DELETE_PRODUCT': {
      const filtered = state.products.filter(p => p.id !== action.id);
      return { ...state, products: filtered };
    }
    case 'SET_EDITING_PRODUCT':
      return { ...state, editingProduct: action.product };

    // ----- NAVIGATION / UI -----
    case 'SET_VIEW':
      return { ...state, currentView: action.view };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query, currentView: 'products' };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.category, currentView: 'products' };
    case 'SET_PRICE_FILTER':
      return { ...state, priceFilter: action.filter };
    case 'OPEN_CART':
      return { ...state, isCartOpen: true };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'OPEN_ORDER':
      return { ...state, isOrderOpen: true };
    case 'CLOSE_ORDER':
      return { ...state, isOrderOpen: false };
    case 'CLOSE_ORDER_SUCCESS':
      return { ...state, isOrderSuccess: false };
    case 'LOGIN_ADMIN':
      return { ...state, isAdminLoggedIn: true };
    case 'LOGOUT_ADMIN':
      return { ...state, isAdminLoggedIn: false };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Sync cart to localStorage
  useEffect(() => {
    saveCartToStorage(state.cart);
  }, [state.cart]);

  const actions = {
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', product }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', id }),
    updateCartQty: (id, qty) => dispatch({ type: 'UPDATE_CART_QTY', id, qty }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    placeOrder: (customer) => dispatch({ type: 'PLACE_ORDER', customer }),

    addProduct: (product) => dispatch({ type: 'ADD_PRODUCT', product }),
    updateProduct: (product) => dispatch({ type: 'UPDATE_PRODUCT', product }),
    deleteProduct: (id) => dispatch({ type: 'DELETE_PRODUCT', id }),
    setEditingProduct: (product) => dispatch({ type: 'SET_EDITING_PRODUCT', product }),

    setView: (view) => dispatch({ type: 'SET_VIEW', view }),
    setSearch: (query) => dispatch({ type: 'SET_SEARCH', query }),
    setCategory: (category) => dispatch({ type: 'SET_CATEGORY', category }),
    setPriceFilter: (filter) => dispatch({ type: 'SET_PRICE_FILTER', filter }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    openOrder: () => dispatch({ type: 'OPEN_ORDER' }),
    closeOrder: () => dispatch({ type: 'CLOSE_ORDER' }),
    closeOrderSuccess: () => dispatch({ type: 'CLOSE_ORDER_SUCCESS' }),
    loginAdmin: () => dispatch({ type: 'LOGIN_ADMIN' }),
    logoutAdmin: () => dispatch({ type: 'LOGOUT_ADMIN' }),
  };

  return (
    <AppContext.Provider value={{ state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
