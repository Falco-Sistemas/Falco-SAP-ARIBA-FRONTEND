import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useSession } from '../../contexts/SessionContext';
import { FaLeaf } from 'react-icons/fa';
import './CartPage.css';

export default function CartPage() {
    const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
    const { sessionId } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        if (!sessionId) {
            setError('Sessão inválida. Por favor, acesse o catálogo novamente.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/ariba/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    items: items.map(item => ({
                        produtoId: item.id,
                        quantidade: item.quantity
                    }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.message || 'Erro ao processar carrinho')
            }

            const { xml, postUrl } = await response.json()

            const form = document.createElement('form')
            form.method = 'POST'
            form.action = postUrl
            form.enctype = 'application/x-www-form-urlencoded'

            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = 'cXML-urlencoded'
            input.value = encodeURIComponent(xml)

            form.appendChild(input)
            document.body.appendChild(form)
            form.submit()

            clearCart()
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="cart-page">
            <div className="cart-content">
                <div className="cart-items-container">
                    {error && (
                        <div className="cart-error">
                            <span>⚠️ {error}</span>
                            <button onClick={() => setError(null)}>✕</button>
                        </div>
                    )}
                    {items.length === 0 ? (
                        <div className="empty-cart">
                            <p>Seu carrinho está vazio.</p>
                            <button className="continue-shopping-btn" onClick={() => history.back()}>
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} />
                                    ) : (
                                        <div className="cart-image-placeholder">
                                            <FaLeaf className="cart-placeholder-icon" />
                                        </div>
                                    )}
                                </div>
                                <div className="cart-item-info">
                                    <span className="cart-item-name">{item.name}</span>
                                    <span className="cart-item-price">R$ {item.price.toFixed(2)}</span>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remover</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-summary">
                        <h3>Resumo do pedido</h3>
                        <div className="cart-total">
                            <span>Total:</span>
                            <span>R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? 'Processando...' : 'Finalizar pedido'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}