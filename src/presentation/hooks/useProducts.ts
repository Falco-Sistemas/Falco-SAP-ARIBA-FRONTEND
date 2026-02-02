import { useState, useEffect, useCallback } from 'react';
import type { CatalogProduct } from '../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/ProductRepositoryImpl';

interface UseProductsReturn {
    products: CatalogProduct[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    error: string | null;
    handleSearch: (query: string) => void;
    handleSortChange: (sortBy: string) => void;
    handlePageChange: (page: number) => void;
}

export function useProducts(itemsPerPage: number = 8): UseProductsReturn {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('price_desc');

    const repository = new ProductRepositoryImpl();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await repository.getCatalogProducts(
                currentPage,
                itemsPerPage,
                searchQuery || undefined,
                sortBy
            );

            setProducts(response.data);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
        } catch (err) {
            setError('Erro ao carregar produtos. Tente novamente.');
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, sortBy]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return {
        products,
        currentPage,
        totalPages,
        totalItems,
        isLoading,
        error,
        handleSearch,
        handleSortChange,
        handlePageChange,
    };
}
