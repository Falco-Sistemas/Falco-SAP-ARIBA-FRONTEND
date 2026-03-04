import { useState } from 'react';
import './ProductInfo.css';
import { FiMinus, FiPlus } from 'react-icons/fi';
import type { CatalogProduct } from '../../Catalog/ProductGrid/ProductCard/ProductCard';

interface ProductInfoProps {
    name: string;
    subtitle: string;
    description: string;
    price: number;
    related: CatalogProduct[]
    onRelatedPicked: (productId: number) => void
    onAddToCart: (quantity: number) => void;
}

function ProductInfo({ name, subtitle, description, price, related, onRelatedPicked, onAddToCart }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);

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

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

    return (
        <div className="product-info-container">
            <div className="product-header">
                <h1 className="product-title">{name}</h1>
                <p className="product-subtitle">{subtitle}</p>
            </div>

            <div className='related-product-container'>
                {related.map((rel) => (
                    <div key={rel.id}>
                        <button
                        className='change-product-button'
                        onClick={() => onRelatedPicked(rel.id)}
                        >
                            {rel.name}
                        </button>
                    </div>
                ))}
            </div>

            <p className="product-description">{description}</p>

            <div className="product-purchase">
                <div className="price-section">
                    <span className="price-label">Preço Atual:</span>
                    <span className="price-value">{formatPrice(price)}</span>
                </div>

                <div className="purchase-actions">
                    <div className="quantity-input-container">
                        <input
                            type="number"
                            className="quantity-input"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                        />
                        <div className="quantity-controls">
                            <button className="qty-control-btn" onClick={handleIncrease}>
                                <FiPlus size={12} />
                            </button>
                            <button className="qty-control-btn" onClick={handleDecrease}>
                                <FiMinus size={12} />
                            </button>
                        </div>
                    </div>

                    <button
                        className="add-to-cart-btn"
                        onClick={() => onAddToCart(quantity)}
                    >
                        Adicionar Produto no Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;
