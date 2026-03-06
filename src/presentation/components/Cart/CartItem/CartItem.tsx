import './CartItem.css';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { CartItem as CartItemType } from '../../../../domain/entities/Cart';

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
    const formatPrice = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1);
        }
    };

    const handleIncrease = () => {
        // Don't exceed stock
        if (item.stock && item.quantity < item.stock) {
            onQuantityChange(item.id, item.quantity + 1);
        } else if (!item.stock) {
            onQuantityChange(item.id, item.quantity + 1);
        }
    };

    // Build subtitle from color and size
    const subtitle = [
        item.color ? `Cor: ${item.color}` : null,
        item.size ? `Tam: ${item.size}` : null,
    ].filter(Boolean).join(' | ');

    return (
        <div className="cart-item">
            <div className="item-image">
                <div className="image-placeholder">
                    <img src={item.imageUrl} alt={item.name} />
                </div>
            </div>

            <div className="item-details">
                {subtitle && <span className="item-category">{subtitle}</span>}
                <h3 className="item-name">{item.name}</h3>
                {item.stock !== undefined && (
                    <span className="item-stock">{item.stock} disponíveis</span>
                )}
            </div>

            <div className="item-quantity">
                <button
                    className="qty-btn"
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1}
                >
                    <FiMinus />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                    className="qty-btn"
                    onClick={handleIncrease}
                    disabled={item.stock !== undefined && item.quantity >= item.stock}
                >
                    <FiPlus />
                </button>
            </div>

            <div className="item-price">
                <span className="unit-price">{formatPrice(item.price)} / un.</span>
                <span className="total-price">{formatPrice(item.price * item.quantity)}</span>
            </div>

            <button className="remove-btn" onClick={() => onRemove(item.id)}>
                <FiTrash2 />
            </button>
        </div>
    );
}

export default CartItem;
