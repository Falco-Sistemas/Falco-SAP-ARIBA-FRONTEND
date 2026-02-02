import type { CatalogProduct, PaginatedResponse } from "../../domain/entities/Product";
import type { ProductRepository } from "../ports/ProductRepository";

/**
 * Use Case: Get products for catalog page
 * Contains business logic for fetching catalog products
 */
export class GetCatalogProductsUseCase {
    // The repository is injected (Dependency Injection)
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Execute the use case
     */
    async execute(
        page: number,
        limit: number,
        searchQuery?: string,
        sortBy?: string
    ): Promise<PaginatedResponse<CatalogProduct>> {
        // Business validation
        if (page < 1) {
            page = 1;
        }
        if(limit < 1 || limit > 100) {
            limit = 10
        }

        // Call the repository (doesn't know if it's API, mock, etc.)
        return this.productRepository.getCatalogProducts(
            page,
            limit,
            searchQuery,
            sortBy
        );
    }
}