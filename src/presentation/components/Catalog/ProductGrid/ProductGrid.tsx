import './ProductGrid.css';
import ProductCard, { type CatalogProduct } from './ProductCard/ProductCard';

interface ProductGridProps {
    products: CatalogProduct[];
    onAddToCart: (product: CatalogProduct, quantity: number) => void;
    onProductDetails: (product: CatalogProduct) => void;
}

function ProductGrid({ products, onAddToCart, onProductDetails }: ProductGridProps) {
    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onDetails={onProductDetails}
                />
            ))}
        </div>
    );
}

export default ProductGrid;
