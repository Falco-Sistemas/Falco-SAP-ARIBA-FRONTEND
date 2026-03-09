/**
 * Product entity - represents a product in our system
 * This is a pure domain object with no depedencies
 */

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    color?: string;
    size?: string;
    images: string[];
    related: CatalogProduct[];
}

/**
 * Product for catalog listing (less data than full Product)
 */
export interface CatalogProduct {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    color?: string;
    size?: string;
    stock: number;
    familia?: string;
    grupo?: string;
    subgrupo?: string;
}

/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

