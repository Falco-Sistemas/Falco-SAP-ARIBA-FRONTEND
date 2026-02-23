import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './presentation/contexts/SessionContext';
import { CartProvider } from './presentation/contexts/CartContext';
import CatalogoPage from "./presentation/pages/Catalog/CatalogPage";
import LoginPage from "./presentation/pages/Login";
import ProductVisualizationPage from "./presentation/pages/ProductVisualization/ProductVisualizationPage";
import CartPage from "./presentation/pages/Cart/CartPage";

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<CatalogoPage />} />
            <Route path="/produto/:id" element={<ProductVisualizationPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </CartProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App
