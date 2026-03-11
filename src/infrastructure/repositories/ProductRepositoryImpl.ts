import type { CatalogProduct, Familia, Grupo, PaginatedResponse, Product, Subgrupo } from '../../domain/entities/Product';
import type { ProductFilters, ProductRepository } from '../../application/ports/ProductRepository';

/**
 * Real implementation of ProductRepository
 * Makes actual HTTP calls to the backend API
 */


interface ProductResponse {
    codigo: number
    idParceiro: number
    codigoNoParceiro: number
    descricao: string
    cor: string | undefined
    tamanho: string | undefined
    preco: number
    saldo: number
    fotos: string[]
    familia: Familia
    grupo: Grupo
    subgrupo: Subgrupo
}

interface ProductWithRelatedResponse extends ProductResponse {
    relacionados: ProductResponse[]
}

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
        sortBy?: string,
        filters?: ProductFilters
    ): Promise<PaginatedResponse<CatalogProduct>> {
        const url = new URL(`${this.baseUrl}/produtos`)
        const params = url.searchParams

        params.set('session', this.sessionId)
        params.set('page', String(page))
        params.set('pageSize', String(limit))

        if (searchQuery) {
            params.set('search', encodeURIComponent(searchQuery || ''))
        }

        if (sortBy) {
            params.set('sort', encodeURIComponent(sortBy || ''))
        }

        params.set('familia', String(filters?.familyId))
        params.set('grupo', String(filters?.groupId))
        params.set('subgrupo', String(filters?.subgroupId))

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
                imageUrl: p.fotos[0] ? `${this.baseUrl}${p.fotos[0]}` : '/src/assets/images/WhiteLabelImage.jpg',
                family: p.familia,
                group: p.grupo,
                subgroup: p.subgrupo
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
        // Get product by id from api using session
        const url = `${this.baseUrl}/produtos/${id}?session=${this.sessionId}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const produto = await response.json() as ProductWithRelatedResponse;
            if (!produto) {
                return null;
            }


            const images = produto.fotos.length > 0 ? produto.fotos.map((foto: string) => `${this.baseUrl}${foto}`) : ['/src/assets/images/WhiteLabelImage.jpg']
            const relacionados: CatalogProduct[] = produto.relacionados.map(rel => {
                const relFoto = produto.fotos.length > 0 ? `${this.baseUrl}${produto.fotos.at(0)}` : '/src/assets/images/WhiteLabelImage.jpg'

                return {
                    id: rel.codigo,
                    name: rel.descricao,
                    price: rel.preco,
                    stock: rel.saldo,
                    color: rel.cor,
                    size: rel.tamanho,
                    imageUrl: relFoto,
                    family: rel.familia,
                    group: rel.grupo,
                    subgroup: rel.subgrupo
                }
            })

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
                images,
                related: relacionados,
                family: produto.familia,
                group: produto.grupo,
                subgroup: produto.subgrupo
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }
}
