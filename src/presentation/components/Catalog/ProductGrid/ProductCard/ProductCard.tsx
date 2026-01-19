import { useState } from 'react';
import './ProductCard.css';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

export interface CatalogProduct {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}

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
        setQuantity(quantity + 1);
    };

    return (
        <div
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
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
                <p className="product-price">{formatPrice(product.price)}</p>
            </div>

            {isHovered && (
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
                            onClick={() => onAddToCart(product, quantity)}
                        >
                            Adicionar ao carrinho
                        </button>
                    </div>

                    <div className="quantity-selector">
                        <button className="qty-btn" onClick={handleDecrease}>
                            <FiMinus />
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button className="qty-btn" onClick={handleIncrease}>
                            <FiPlus />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductCard;
