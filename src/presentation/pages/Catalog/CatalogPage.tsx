import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css';

import CatalogHeader from '../../components/Catalog/CatalogHeader/CatalogHeader';
import CatalogNavigation from '../../components/Catalog/CatalogNavigation/CatalogNavigation';
import FilterBar from '../../components/Catalog/FilterBar/FilterBar';
import ProductGrid from '../../components/Catalog/ProductGrid/ProductGrid';
import Pagination from '../../components/Catalog/Pagination/Pagination';
import type { CatalogProduct } from '../../components/Catalog/ProductGrid/ProductCard/ProductCard';

// Mock data - in real app this comes from API
const mockProducts: CatalogProduct[] = [
    { id: 1, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 2, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 3, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 4, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 5, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 6, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 7, name: 'Botina Amarrar N° 41', price: 41.00 },
    { id: 8, name: 'Botina Amarrar N° 41', price: 41.00 },
];

const sortOptions = ['Maior para Menor', 'Menor para Maior', 'A-Z', 'Z-A'];

function CatalogoPage() {
    const navigate = useNavigate();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('Maior para Menor');
    const [currentPage, setCurrentPage] = useState(3);
    const [cartCount, setCartCount] = useState(4);

    // Handlers
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log('Searching:', query);
    };

    const handleSortChange = (sort: string) => {
        setSelectedSort(sort);
        console.log('Sort changed:', sort);
    };

    const handleAddToCart = (product: CatalogProduct, quantity: number) => {
        setCartCount(cartCount + quantity);
        console.log('Added to cart:', product.name, 'Quantity:', quantity);
    };

    const handleProductDetails = (product: CatalogProduct) => {
        navigate(`/produto/${product.id}`);
    };

    const handleCartClick = () => {
        navigate('/carrinho');
    };

    const handlePunchOutClick = () => {
        console.log('PunchOut clicked');
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log('Page:', page);
    };

    // Filter products by search
    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="catalogo-page">
            <CatalogHeader
                userName="User_ID"
                language="Português"
                cartItemCount={cartCount}
                onCartClick={handleCartClick}
                onPunchOutClick={handlePunchOutClick}
            />

            <CatalogNavigation
                title="Catálogo de Produtos"
                onSearch={handleSearch}
            />

            <FilterBar
                totalProducts={filteredProducts.length}
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
            />

            <main className="catalogo-content">
                <ProductGrid
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                    onProductDetails={handleProductDetails}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={6}
                    onPageChange={handlePageChange}
                />
            </main>
        </div>
    );
}

export default CatalogoPage;
