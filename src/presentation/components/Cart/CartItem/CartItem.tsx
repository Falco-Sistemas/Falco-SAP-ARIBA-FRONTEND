import './CartItem.css';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export interface CartProduct {
    id: number;
    category: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartItemProps {
    item: CartProduct;
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
        onQuantityChange(item.id, item.quantity + 1);
    };

    return (
        <div className="cart-item">
            <div className="item-image">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                ) : (
                    <div className="image-placeholder"></div>
                )}
            </div>

            <div className="item-details">
                <span className="item-category">{item.category}</span>
                <h3 className="item-name">{item.name}</h3>
            </div>

            <div className="item-quantity">
                <button className="qty-btn" onClick={handleDecrease}>
                    <FiMinus />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button className="qty-btn" onClick={handleIncrease}>
                    <FiPlus />
                </button>
            </div>

            <div className="item-price">
                {formatPrice(item.price * item.quantity)}
            </div>

            <button className="remove-btn" onClick={() => onRemove(item.id)}>
                <FiTrash2 />
            </button>
        </div>
    );
}

export default CartItem;
