import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductVisualizationPage.css';
import { FiLogOut } from 'react-icons/fi';

import VisualizationHeader from '../../components/ProductVisualization/VisualizationHeader/VisualizationHeader';
import VisualizationNavigation from '../../components/ProductVisualization/VisualizationNavigation/VisualizationNavigation';
import ProductImageGallery from '../../components/ProductVisualization/ProductImageGallery/ProductImageGallery';
import ProductInfo from '../../components/ProductVisualization/ProductInfo/ProductInfo';
import type { Product } from '../../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../../infrastructure/repositories/ProductRepositoryImpl';
import { useCart } from '../../contexts/CartContext';
import { useSession } from '../../contexts/SessionContext';

// Default product for when ID not found or loading
const defaultProduct: Product = {
    id: 0,
    name: 'Produto não encontrado',
    description: 'Este produto não existe.',
    price: 0,
    category: '',
    imageUrl: '/src/assets/images/WhiteLabelImage.jpg',
    stock: 0,
    color: '',
    size: '',
};

function ProductVisualizationPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Use cart and session contexts
    const { totalItems, addToCart } = useCart();
    const { sessionId } = useSession();

    // State for product data
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch product from backend
    useEffect(() => {
        async function fetchProduct() {
            if (!id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const productRepository = new ProductRepositoryImpl(sessionId || '1');
                const productData = await productRepository.getProductById(Number(id));
                setProduct(productData);
            } catch (err) {
                setError('Erro ao carregar produto.');
                console.error('Error fetching product:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    const handleSearch = (query: string) => {
        navigate(`/?search=${encodeURIComponent(query)}`);
    };

    const handleCartClick = () => {
        navigate('/carrinho');
    };

    const handleAddToCart = (quantity: number) => {
        if (product) {
            // Convert Product to CatalogProduct for cart
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                color: product.color,
                size: product.size,
                stock: product.stock,
            }, quantity);
            console.log('Added to cart:', product.name, 'Quantity:', quantity);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    // Build subtitle from color and size
    const buildSubtitle = () => {
        const parts = [];
        if (product?.color) parts.push(`Cor: ${product.color}`);
        if (product?.size) parts.push(`Tamanho: ${product.size}`);
        return parts.join(' | ') || 'Produto';
    };

    // Build description
    const buildDescription = () => {
        if (product?.description && product.description !== product.name) {
            return product.description;
        }
        return `Estoque disponível: ${product?.stock || 0} unidades`;
    };

    // Display data
    const displayProduct = product || defaultProduct;
    const images = ['/src/assets/images/WhiteLabelImage.jpg'];

    return (
        <div className="product-visualization-page">
            <VisualizationHeader
                title="Catálogo de Produtos"
                subtitle="Detalhes do Produto"
                userName="User_ID"
                language="Português"
                cartItemCount={totalItems}
                onCartClick={handleCartClick}
            />

            <VisualizationNavigation
                title="Visualização do Produto"
                onSearch={handleSearch}
            />

            <main className="visualization-content">
                {isLoading && (
                    <div className="loading">Carregando produto...</div>
                )}

                {error && (
                    <div className="error">{error}</div>
                )}

                {!isLoading && !error && (
                    <div className="product-detail-container">
                        <div className="product-gallery-section">
                            <ProductImageGallery
                                images={images}
                                productName={displayProduct.name}
                            />
                        </div>

                        <div className="product-info-section">
                            <button className="back-btn" onClick={handleBack}>
                                <FiLogOut />
                            </button>

                            <ProductInfo
                                name={displayProduct.name}
                                subtitle={buildSubtitle()}
                                description={buildDescription()}
                                price={displayProduct.price}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProductVisualizationPage;
