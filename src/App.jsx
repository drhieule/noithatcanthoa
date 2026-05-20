import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import OrderSuccess from './components/OrderSuccess';
import Footer from './components/Footer';

function AppContent() {
  const { state } = useApp();
  const { currentView } = state;

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <FeaturedProducts />
          </>
        )}
        {currentView === 'products' && <ProductList />}
        {currentView === 'admin' && <AdminPanel />}
      </main>

      {currentView !== 'admin' && <Footer />}

      {/* Overlays */}
      <Cart />
      <OrderForm />
      <OrderSuccess />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
