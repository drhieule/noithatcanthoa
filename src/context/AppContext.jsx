import { createContext, useContext, useReducer, useEffect } from 'react';
import initialProducts from '../data/products';

const AppContext = createContext(null);

const CART_KEY = 'noithat_cart';
const SALES_KEY = 'noithat_sales';
const PRODUCTS_KEY = 'noithat_products';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function loadProducts() {
  const stored = load(PRODUCTS_KEY, null);
  if (stored && stored.length > 0) return stored;
  return initialProducts;
}

const storedProducts = loadProducts();

const initialState = {
  products: storedProducts,
  cart: load(CART_KEY, []),
  orders: [],
  sales: load(SALES_KEY, []),
  currentView: 'home',
  searchQuery: '',
  selectedCategory: 'all',
  priceFilter: 'all',
  isCartOpen: false,
  isOrderOpen: false,
  isOrderSuccess: false,
  currentUser: null,       // { role: 'owner'|'staff', name: string }
  editingProduct: null,
  nextProductId: Math.max(0, ...storedProducts.map(p => p.id)) + 1,
};

function reducer(state, action) {
  switch (action.type) {
    // ----- CART -----
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.product.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map(item =>
          item.id === action.product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...action.product, qty: 1 }];
      }
      return { ...state, cart: newCart };
    }
    case 'REMOVE_FROM_CART': {
      return { ...state, cart: state.cart.filter(item => item.id !== action.id) };
    }
    case 'UPDATE_CART_QTY': {
      if (action.qty <= 0) {
        return { ...state, cart: state.cart.filter(item => item.id !== action.id) };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.id ? { ...item, qty: action.qty } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };

    // ----- ORDERS (online) -----
    case 'PLACE_ORDER': {
      const newOrder = {
        id: Date.now(),
        dateKey: new Date().toISOString().split('T')[0],
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

    // ----- SALES (in-store, recorded by staff/owner) -----
    case 'ADD_SALE': {
      const sale = {
        id: Date.now(),
        dateKey: new Date().toISOString().split('T')[0],
        createdAt: new Date().toLocaleString('vi-VN'),
        soldBy: action.sale.soldBy,
        items: action.sale.items,
        total: action.sale.total,
        profit: action.sale.profit,
        paymentType: action.sale.paymentType,
        transferBy: action.sale.transferBy || '',
        note: action.sale.note || '',
        photo: action.sale.photo || '',
      };
      const updatedProducts = state.products.map(p => {
        const saleItem = sale.items.find(i => i.productId === p.id);
        if (saleItem) return { ...p, stock: Math.max(0, p.stock - saleItem.qty) };
        return p;
      });
      return { ...state, sales: [sale, ...state.sales], products: updatedProducts };
    }

    // ----- PRODUCTS -----
    case 'ADD_PRODUCT': {
      const newProduct = { ...action.product, id: state.nextProductId };
      return {
        ...state,
        products: [...state.products, newProduct],
        nextProductId: state.nextProductId + 1,
        editingProduct: null,
      };
    }
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map(p => p.id === action.product.id ? action.product : p),
        editingProduct: null,
      };
    }
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'SET_EDITING_PRODUCT':
      return { ...state, editingProduct: action.product };

    // ----- AUTH -----
    case 'LOGIN_USER':
      return { ...state, currentUser: action.user };
    case 'LOGOUT_USER':
      return { ...state, currentUser: null };

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

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { save(CART_KEY, state.cart); }, [state.cart]);
  useEffect(() => { save(SALES_KEY, state.sales); }, [state.sales]);
  useEffect(() => { save(PRODUCTS_KEY, state.products); }, [state.products]);

  const actions = {
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', product }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', id }),
    updateCartQty: (id, qty) => dispatch({ type: 'UPDATE_CART_QTY', id, qty }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    placeOrder: (customer) => dispatch({ type: 'PLACE_ORDER', customer }),

    addSale: (sale) => dispatch({ type: 'ADD_SALE', sale }),

    addProduct: (product) => dispatch({ type: 'ADD_PRODUCT', product }),
    updateProduct: (product) => dispatch({ type: 'UPDATE_PRODUCT', product }),
    deleteProduct: (id) => dispatch({ type: 'DELETE_PRODUCT', id }),
    setEditingProduct: (product) => dispatch({ type: 'SET_EDITING_PRODUCT', product }),

    loginUser: (user) => dispatch({ type: 'LOGIN_USER', user }),
    logoutUser: () => dispatch({ type: 'LOGOUT_USER' }),

    setView: (view) => dispatch({ type: 'SET_VIEW', view }),
    setSearch: (query) => dispatch({ type: 'SET_SEARCH', query }),
    setCategory: (category) => dispatch({ type: 'SET_CATEGORY', category }),
    setPriceFilter: (filter) => dispatch({ type: 'SET_PRICE_FILTER', filter }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    openOrder: () => dispatch({ type: 'OPEN_ORDER' }),
    closeOrder: () => dispatch({ type: 'CLOSE_ORDER' }),
    closeOrderSuccess: () => dispatch({ type: 'CLOSE_ORDER_SUCCESS' }),
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
