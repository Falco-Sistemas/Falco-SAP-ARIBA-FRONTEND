import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CatalogProduct, Familia, Grupo, Subgrupo } from '../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/ProductRepositoryImpl';
import { useSession } from '../contexts/SessionContext';
import { FamilyRepositoryImpl, type FamiliesResponse } from '../../infrastructure/repositories/FamilyRepositoryImpl';

export interface CategoryFilters {
    familia?: number;
    grupo?: number;
    subgrupo?: number;
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
    availableFamilias: Familia[];
    availableGrupos: Grupo[];
    availableSubgrupos: Subgrupo[];
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
    const [availableFamilias, setAvailableFamilias] = useState<FamiliesResponse[]>([])
    const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({});

    const productRepository = useMemo(
        () => new ProductRepositoryImpl(sessionId || '1'),
        [sessionId]
    );

    const familyRepository = useMemo(
        () => new FamilyRepositoryImpl(sessionId || '1'),
        [sessionId]
    );

    const fetchAllProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await productRepository.getCatalogProducts(1, 1000, undefined, undefined, {
                familyId: categoryFilters.familia,
                groupId: categoryFilters.grupo,
                subgroupId: categoryFilters.subgrupo
            });
            setAllProducts(response.data);
        } catch (err) {
            setError('Erro ao carregar produtos. Tente novamente.');
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    }, [productRepository, categoryFilters]);

    const fetchAllFamilies = useCallback(async () => {
        try {
            const data = await familyRepository.getAllFamilies();
            setAvailableFamilias(data);
        } catch (err) {
            setError('Erro ao carregar produtos. Tente novamente.');
            console.error('Error fetching products:', err);
        }
    }, [familyRepository])

    useEffect(() => {
        fetchAllFamilies();
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    const availableGrupos = useMemo(() => {
        if(categoryFilters.familia){
            const familia = availableFamilias.find(f => Number(categoryFilters.familia) === f.codigo)
            if(familia){
                return familia.groups
            }
        }

        return []
    }, [availableFamilias, categoryFilters.familia])

    const availableSubgrupos = useMemo(() => {
        if(categoryFilters.grupo && availableGrupos){
            const grupo = availableGrupos.find(g => Number(categoryFilters.grupo) === g.codigo)
            if(grupo){
                return grupo.subgroups
            }
        }

        return []
    }, [availableGrupos, categoryFilters.grupo])

    const filteredAndSorted = useMemo(() => {
        let filtered = filterProducts(allProducts, searchQuery);
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
                updated.grupo = undefined;
                updated.subgrupo = undefined;
            } else if (filterName === 'grupo') {
                updated.subgrupo = undefined;
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
