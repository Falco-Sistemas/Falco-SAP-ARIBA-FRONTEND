export interface Familia {
    codigo: number,
    descricao: string
}

export interface Grupo {
    codigo: number,
    descricao: string
}

export interface Subgrupo {
    codigo: number,
    descricao: string
}

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
    family: Familia
    group: Grupo;
    subgroup: Subgrupo;
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
    family: Familia;
    group: Grupo;
    subgroup: Subgrupo;
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

