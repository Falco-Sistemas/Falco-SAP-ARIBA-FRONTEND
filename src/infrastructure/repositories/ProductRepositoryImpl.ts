import type { CatalogProduct, PaginatedResponse, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../application/ports/ProductRepository';

/**
 * Real implementation of ProductRepository
 * Makes actual HTTP calls to the backend API
 */
export class ProductRepositoryImpl implements ProductRepository {
    private baseUrl: string;
    private sessionId: string;

    constructor(sessionId: string, baseUrl: string = 'http://localhost:3000') {
        this.sessionId = sessionId;
        this.baseUrl = baseUrl;
    }

    /**
     * Get paginated catalog products from API (server-side pagination)
     */
    async getCatalogProducts(
        page: number,
        limit: number,
        searchQuery?: string,
        sortBy?: string
    ): Promise<PaginatedResponse<CatalogProduct>> {
        let url = `${this.baseUrl}/produtos?session=${this.sessionId}&page=${page}&pageSize=${limit}`;

        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        if (sortBy) {
            url += `&sort=${encodeURIComponent(sortBy)}`;
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const products: CatalogProduct[] = data.produtos.map((p: any) => ({
                id: p.codigo,
                name: p.descricao,
                price: p.preco,
                color: p.cor,
                size: p.tamanho,
                stock: p.saldo,
                imageUrl: p.fotos[0] ? `${this.baseUrl}${p.fotos[0]}` : '/src/assets/images/WhiteLabelImage.jpg'
            }));

            return {
                data: products,
                currentPage: data.pagination.page,
                totalPages: data.pagination.totalPages,
                totalItems: data.pagination.total,
            };
        } catch (error) {
            console.error('Error fetching catalog products:', error);
            throw error;
        }
    }

    /**
     * Get single product by ID
     */
    async getProductById(id: number): Promise<Product | null> {
        // Get all products and find by ID
        const url = `${this.baseUrl}/produtos?session=${this.sessionId}`;

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

            
            const images = produto.fotos.length > 0 ? produto.fotos.map((foto: string) => `${this.baseUrl}${foto}`) : ['/src/assets/images/WhiteLabelImage.jpg']
            
            return {
                id: produto.codigo,
                name: produto.descricao,
                description: produto.descricao,
                price: produto.preco,
                category: '',
                imageUrl: images[0],
                stock: produto.saldo,
                color: produto.cor,
                size: produto.tamanho,
                images
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }
}
