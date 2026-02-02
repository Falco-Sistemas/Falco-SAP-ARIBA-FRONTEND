import type { CatalogProduct, PaginatedResponse, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../application/ports/ProductRepository';

/**
 * Real implementation of ProductRepository
 * Makes actual HTTP calls to the backend API
 */
export class ProductRepositoryImpl implements ProductRepository {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    /**
     * Get paginated catalog products from API
     */
    async getCatalogProducts(
        page: number,
        limit: number,
        searchQuery?: string,
        sortBy?: string
    ): Promise<PaginatedResponse<CatalogProduct>> {
        // Your backend endpoint: /produtos?session=1
        const url = `${this.baseUrl}/produtos?session=1`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform backend response (produtos) to frontend format
            let products: CatalogProduct[] = data.produtos.map((p: any) => ({
                id: p.codigo,
                name: p.descricao,
                price: p.preco,
                color: p.cor,
                size: p.tamanho,
                stock: p.saldo,
            }));

            // Frontend search filter
            if (searchQuery) {
                products = products.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Frontend sorting
            if (sortBy) {
                products = this.sortProducts(products, sortBy);
            }

            // Frontend pagination
            const totalItems = products.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const paginatedProducts = products.slice(startIndex, startIndex + limit);

            return {
                data: paginatedProducts,
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
            };
        } catch (error) {
            console.error('Error fetching catalog products:', error);
            throw error;
        }
    }

    /**
     * Sort products by field
     */
    private sortProducts(products: CatalogProduct[], sortBy: string): CatalogProduct[] {
        const sorted = [...products];

        switch (sortBy) {
            case 'price_asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price_desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name_asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name_desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return sorted;
        }
    }

    /**
     * Get single product by ID
     */
    async getProductById(id: number): Promise<Product | null> {
        // Get all products and find by ID
        const url = `${this.baseUrl}/produtos?session=1`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const produto = data.produtos.find((p: any) => p.codigo === id);

            if (!produto) {
                return null;
            }

            return {
                id: produto.codigo,
                name: produto.descricao,
                description: produto.descricao,
                price: produto.preco,
                category: '',
                imageUrl: '/default-product.jpg',
                stock: produto.saldo,
                color: produto.cor,
                size: produto.tamanho,
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }
}
