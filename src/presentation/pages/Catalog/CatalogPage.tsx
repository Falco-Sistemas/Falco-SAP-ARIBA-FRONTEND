import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css';

import CatalogHeader from '../../components/Catalog/CatalogHeader/CatalogHeader';
import CatalogNavigation from '../../components/Catalog/CatalogNavigation/CatalogNavigation';
import FilterBar from '../../components/Catalog/FilterBar/FilterBar';
import ProductGrid from '../../components/Catalog/ProductGrid/ProductGrid';
import Pagination from '../../components/Catalog/Pagination/Pagination';

import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import type { CatalogProduct } from '../../../domain/entities/Product';


const sortOptions = ['Maior para Menor', 'Menor para Maior', 'A-Z', 'Z-A'];

const sortMapping: Record<string, string> = {
    'Maior para Menor': 'price_desc',
    'Menor para Maior': 'price_asc',
    'A-Z': 'name_asc',
    'Z-A': 'name_desc',
};

function CatalogoPage() {
    const navigate = useNavigate();

    // Use cart context for global cart state
    const { totalItems, addToCart } = useCart();

    // Use products hook for catalog data
    const {
        products,
        currentPage,
        totalPages,
        totalItems: totalProducts,
        isLoading,
        error,
        handleSearch,
        handleSortChange,
        handlePageChange,
        categoryFilters,
        handleCategoryFilterChange,
        availableFamilias,
        availableGrupos,
        availableSubgrupos,
    } = useProducts(10);

    const [selectedSort, setSelectedSort] = useState('Maior para Menor');

    const handleAddToCart = (product: CatalogProduct, quantity: number) => {
        addToCart(product, quantity);
        console.log('Added to cart:', product.name, 'Quantity:', quantity);
    };

    const handleProductDetails = (product: CatalogProduct) => {
        navigate(`/produto/${product.id}`);
    };

    const handleCartClick = () => {
        navigate('/carrinho');
    };

    const handlePunchOutClick = () => {
        navigate('/carrinho');
    };

    const onSortChange = (displaySort: string) => {
        setSelectedSort(displaySort);
        const apiSort = sortMapping[displaySort] || 'price_desc';
        handleSortChange(apiSort);
    };

    return (
        <div className="catalogo-page">
            <CatalogHeader
                userName="User_ID"
                language="Português"
                cartItemCount={totalItems}
                onCartClick={handleCartClick}
                onPunchOutClick={handlePunchOutClick}
            />

            <CatalogNavigation
                title="Catálogo de Produtos"
                onSearch={handleSearch}
            />

            <FilterBar
                totalProducts={totalProducts}
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={onSortChange}
                categoryFilters={categoryFilters}
                onCategoryFilterChange={handleCategoryFilterChange}
                availableFamilias={availableFamilias}
                availableGrupos={availableGrupos}
                availableSubgrupos={availableSubgrupos}
            />

            <main className="catalogo-content">
                {isLoading && (
                    <div className="loading">Carregando produtos...</div>
                )}

                {error && (
                    <div className="error">{error}</div>
                )}

                {!isLoading && !error && (
                    <>
                        <ProductGrid
                            products={products}
                            onAddToCart={handleAddToCart}
                            onProductDetails={handleProductDetails}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default CatalogoPage;
