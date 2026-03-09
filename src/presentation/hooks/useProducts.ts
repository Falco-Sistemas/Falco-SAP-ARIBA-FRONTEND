import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CatalogProduct } from '../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/ProductRepositoryImpl';
import { useSession } from '../contexts/SessionContext';

export interface CategoryFilters {
    familia: string;
    grupo: string;
    subgrupo: string;
}

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
    categoryFilters: CategoryFilters;
    handleCategoryFilterChange: (filterName: keyof CategoryFilters, value: string) => void;
    availableFamilias: string[];
    availableGrupos: string[];
    availableSubgrupos: string[];
}

function sortProducts(products: CatalogProduct[], sortBy: string): CatalogProduct[] {
    const sorted = [...products];
    switch (sortBy) {
        case 'price_desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'price_asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'name_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return sorted;
    }
}

function filterProducts(products: CatalogProduct[], query: string): CatalogProduct[] {
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(lowerQuery));
}

export function useProducts(itemsPerPage: number = 8): UseProductsReturn {
    const { sessionId } = useSession();

    const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('price_desc');
    const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({
        familia: '',
        grupo: '',
        subgrupo: '',
    });

    const repository = useMemo(
        () => new ProductRepositoryImpl(sessionId || '1'),
        [sessionId]
    );

    const fetchAllProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await repository.getCatalogProducts(1, 1000);
            setAllProducts(response.data);
        } catch (err) {
            setError('Erro ao carregar produtos. Tente novamente.');
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    }, [repository]);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    const availableFamilias = useMemo(() => {
        const set = new Set<string>();
        allProducts.forEach(p => { if (p.familia) set.add(p.familia); });
        return Array.from(set).sort();
    }, [allProducts]);

    const availableGrupos = useMemo(() => {
        const filtered = categoryFilters.familia
            ? allProducts.filter(p => p.familia === categoryFilters.familia)
            : allProducts;
        const set = new Set<string>();
        filtered.forEach(p => { if (p.grupo) set.add(p.grupo); });
        return Array.from(set).sort();
    }, [allProducts, categoryFilters.familia]);

    const availableSubgrupos = useMemo(() => {
        let filtered = allProducts;
        if (categoryFilters.familia) filtered = filtered.filter(p => p.familia === categoryFilters.familia);
        if (categoryFilters.grupo) filtered = filtered.filter(p => p.grupo === categoryFilters.grupo);
        const set = new Set<string>();
        filtered.forEach(p => { if (p.subgrupo) set.add(p.subgrupo); });
        return Array.from(set).sort();
    }, [allProducts, categoryFilters.familia, categoryFilters.grupo]);

    const filteredAndSorted = useMemo(() => {
        let filtered = filterProducts(allProducts, searchQuery);
        if (categoryFilters.familia) filtered = filtered.filter(p => p.familia === categoryFilters.familia);
        if (categoryFilters.grupo) filtered = filtered.filter(p => p.grupo === categoryFilters.grupo);
        if (categoryFilters.subgrupo) filtered = filtered.filter(p => p.subgrupo === categoryFilters.subgrupo);
        return sortProducts(filtered, sortBy);
    }, [allProducts, searchQuery, sortBy, categoryFilters]);

    const totalItems = filteredAndSorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const products = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAndSorted.slice(start, start + itemsPerPage);
    }, [filteredAndSorted, currentPage, itemsPerPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

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

    const handleCategoryFilterChange = (filterName: keyof CategoryFilters, value: string) => {
        setCategoryFilters(prev => {
            const updated = { ...prev, [filterName]: value };
            if (filterName === 'familia') {
                updated.grupo = '';
                updated.subgrupo = '';
            } else if (filterName === 'grupo') {
                updated.subgrupo = '';
            }
            return updated;
        });
        setCurrentPage(1);
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
        categoryFilters,
        handleCategoryFilterChange,
        availableFamilias,
        availableGrupos,
        availableSubgrupos,
    };
}
