import './CartSummary.css';
import type { CartProduct } from '../CartItem/CartItem';

interface CartSummaryProps {
    items: CartProduct[];
    onPunchOut: () => void;
}

function CartSummary({ items, onPunchOut }: CartSummaryProps) {
    const formatPrice = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="cart-summary">
            <h2 className="summary-title">Resumo</h2>

            <div className="summary-section">
                <div className="summary-row subtotal-row">
                    <span className="label">Subtotal:</span>
                    <span className="value">{formatPrice(subtotal)}</span>
                </div>
            </div>

            <div className="summary-items">
                {items.map((item) => (
                    <div key={item.id} className="summary-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">{item.quantity} Unidade{item.quantity > 1 ? 's' : ''}</span>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                ))}
            </div>

            <div className="summary-total">
                <div className="summary-row total-row">
                    <span className="label">Valor Total:</span>
                    <span className="value">{formatPrice(subtotal)}</span>
                </div>
            </div>

            <button className="punchout-btn" onClick={onPunchOut}>
                PunchOut
            </button>
        </div>
    );
}

export default CartSummary;
