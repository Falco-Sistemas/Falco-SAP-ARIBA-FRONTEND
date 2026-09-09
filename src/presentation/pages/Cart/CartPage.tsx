import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useSession } from '../../contexts/SessionContext';
import CartNavigation from '../../components/Cart/CartNavigation/CartNavigation';
import CartItem from '../../components/Cart/CartItem/CartItem';
import CartSummary from '../../components/Cart/CartSummary/CartSummary';
import './CartPage.css';

const tabs = [
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'carrinho', label: 'Carrinho' },
];

export default function CartPage() {
    const navigate = useNavigate();
    const { items, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { sessionId } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (tabId: string) => {
        navigate(tabId === 'catalogo' ? '/' : '/carrinho');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

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
            <CartNavigation
                tabs={tabs}
                activeTab="carrinho"
                onTabChange={handleTabChange}
                cartItemCount={totalItems}
            />

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
                            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <CartSummary
                        items={items}
                        onPunchOut={handleCheckout}
                        isProcessing={loading}
                    />
                )}
            </div>
        </div>
    )
}