import { useState } from 'react';
import './ProductCard.css';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import type { CatalogProduct } from '../../../../../domain/entities/Product';

// Re-export for components that import from here
export type { CatalogProduct };

interface ProductCardProps {
    product: CatalogProduct;
    onAddToCart: (product: CatalogProduct, quantity: number) => void;
    onDetails: (product: CatalogProduct) => void;
}

function ProductCard({ product, onAddToCart, onDetails }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        // Don't allow quantity greater than stock
        if (product.stock && quantity < product.stock) {
            setQuantity(quantity + 1);
        } else if (!product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setQuantity(1); // Reset quantity after adding
    };

    // Check stock status
    const isOutOfStock = product.stock !== undefined && product.stock <= 0;
    const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 10;

    return (
        <div
            className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Stock Badge */}
            {isOutOfStock && (
                <span className="stock-badge out">Sem Estoque</span>
            )}
            {isLowStock && (
                <span className="stock-badge low">Últimas {product.stock} un.</span>
            )}

            <div className="product-image">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                ) : (
                    <div className="image-placeholder">
                        <FaLeaf className="placeholder-icon" />
                    </div>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                {/* Product attributes */}
                {(product.color || product.size) && (
                    <div className="product-attributes">
                        {product.color && <span className="attribute">Cor: {product.color}</span>}
                        {product.size && <span className="attribute">Tam: {product.size}</span>}
                    </div>
                )}

                <p className="product-price">{formatPrice(product.price)}</p>

                {/* Stock info */}
                {product.stock !== undefined && (
                    <p className={`product-stock ${isLowStock ? 'low' : ''}`}>
                        {product.stock} em estoque
                    </p>
                )}
            </div>

            {isHovered && !isOutOfStock && (
                <div className="product-actions">
                    <div className="action-buttons">
                        <button
                            className="btn-details"
                            onClick={() => onDetails(product)}
                        >
                            Detalhes
                        </button>
                        <button
                            className="btn-add-cart"
                            onClick={handleAddToCart}
                        >
                            Adicionar
                        </button>
                    </div>

                    <div className="quantity-selector">
                        <button
                            className="qty-btn"
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                        >
                            <FiMinus />
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={handleIncrease}
                            disabled={product.stock !== undefined && quantity >= product.stock}
                        >
                            <FiPlus />
                        </button>
                    </div>
                </div>
            )}

            {/* Out of stock actions */}
            {isHovered && isOutOfStock && (
                <div className="product-actions">
                    <button
                        className="btn-details full-width"
                        onClick={() => onDetails(product)}
                    >
                        Ver Detalhes
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductCard;
