import { useNavigate, useParams } from 'react-router-dom';
import './ProductVisualizationPage.css';
import { FiLogOut } from 'react-icons/fi';

import VisualizationHeader from '../../components/ProductVisualization/VisualizationHeader/VisualizationHeader';
import VisualizationNavigation from '../../components/ProductVisualization/VisualizationNavigation/VisualizationNavigation';
import ProductImageGallery from '../../components/ProductVisualization/ProductImageGallery/ProductImageGallery';
import ProductInfo from '../../components/ProductVisualization/ProductInfo/ProductInfo';

// Mock data - in real app this comes from API based on product ID
const mockProducts: Record<string, {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    price: number;
    images: string[];
}> = {
    '1': {
        id: 1,
        name: 'Botina Amarrar N° 41',
        subtitle: 'Calçado de Segurança',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        price: 41.00,
        images: [
            '/src/assets/images/WhiteLabelImage.jpg',
            '/src/assets/images/WhiteLabelImage.jpg',
            '/src/assets/images/WhiteLabelImage.jpg',
        ]
    },
    '2': {
        id: 2,
        name: 'Botina Amarrar N° 42',
        subtitle: 'Calçado de Segurança',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        price: 42.00,
        images: [
            '/src/assets/images/WhiteLabelImage.jpg',
            '/src/assets/images/WhiteLabelImage.jpg',
        ]
    }
};

// Default product for when ID not found
const defaultProduct = {
    id: 0,
    name: 'Produto não encontrado',
    subtitle: '',
    description: 'Este produto não existe.',
    price: 0,
    images: ['/src/assets/images/WhiteLabelImage.jpg']
};

function ProductVisualizationPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Get product by ID or use default
    const product = id && mockProducts[id] ? mockProducts[id] : defaultProduct;

    const handleSearch = (query: string) => {
        console.log('Searching:', query);
    };

    const handleCartClick = () => {
        navigate('/carrinho');
    };

    const handleAddToCart = (quantity: number) => {
        console.log('Added to cart:', product.name, 'Quantity:', quantity);
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="product-visualization-page">
            <VisualizationHeader
                title="Catálogo de Produtos"
                subtitle="220 Produtos no total"
                userName="User_IDh"
                language="Português"
                cartItemCount={0}
                onCartClick={handleCartClick}
            />

            <VisualizationNavigation
                title="Visualização do Produto"
                onSearch={handleSearch}
            />

            <main className="visualization-content">
                <div className="product-detail-container">
                    <div className="product-gallery-section">
                        <ProductImageGallery
                            images={product.images}
                            productName={product.name}
                        />
                    </div>

                    <div className="product-info-section">
                        <button className="back-btn" onClick={handleBack}>
                            <FiLogOut />
                        </button>

                        <ProductInfo
                            name={product.name}
                            subtitle={product.subtitle}
                            description={product.description}
                            price={product.price}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProductVisualizationPage;
