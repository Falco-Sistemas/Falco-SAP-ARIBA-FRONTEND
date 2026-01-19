import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogoPage from "./presentation/pages/Catalog/CatalogPage";
import LoginPage from "./presentation/pages/Login";
import ProductVisualizationPage from "./presentation/pages/ProductVisualization/ProductVisualizationPage";
import CartPage from "./presentation/pages/Cart/CartPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogoPage />} />
        <Route path="/produto/:id" element={<ProductVisualizationPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App