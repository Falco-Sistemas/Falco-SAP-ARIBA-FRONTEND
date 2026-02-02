import type { CatalogProduct, PaginatedResponse, Product } from "../../domain/entities/Product";

/**
 * Port (interface) for Product Repository
 * Infraestructure layer MUST implement this interface
 * This allows us to swap implementations (real API, mock, etc.)
 */
export interface ProductRepository {
    /**
     * Get paginated list of products for catalog
     */
    getCatalogProducts(
        page: number,
        limit: number,
        searchQuery?: string,
        sortBy?: string
    ): Promise<PaginatedResponse<CatalogProduct>>;

    /**
     * Get single product by ID
     */
    getProductById(id: number): Promise<Product | null>;
}

