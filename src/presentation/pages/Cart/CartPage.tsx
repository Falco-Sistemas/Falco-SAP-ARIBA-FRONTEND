import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import CartHeader from '../../components/Cart/CartHeader/CartHeader';
import CartNavigation from '../../components/Cart/CartNavigation/CartNavigation';
import CartItem from '../../components/Cart/CartItem/CartItem';
import CartSummary from '../../components/Cart/CartSummary/CartSummary';
import { useCart } from '../../contexts/CartContext';
import { useSession } from '../../contexts/SessionContext';
import { buildPunchOutOrderMessage, submitPunchOutOrder } from '../../../infrastructure/punchout/buildPunchOutOrderMessage';

const tabs = [
    { id: 'cart', label: 'Carrinho de Compras' },
    { id: 'catalog', label: 'Catálogo de Produtos' }
];

function CartPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('cart');
    const [searchQuery, setSearchQuery] = useState('');

    // Use cart and session contexts
    const { items, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { sessionId } = useSession();

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (tabId === 'catalog') {
            navigate('/');
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        updateQuantity(id, quantity);
    };

    const handleRemoveItem = (id: number) => {
        removeFromCart(id);
    };

    const handleCartClick = () => {
        // Already on cart page
    };

    const handlePunchOut = async () => {
        if (!sessionId) {
            alert('Sessão não encontrada. Verifique a URL.');
            return;
        }

        // Fetch extra session info from API
        const url = `http://localhost:3000/session/${sessionId}`;
        const response = await fetch(url);
        if (!response.ok) {
            alert('Erro ao buscar dados da sessão.');
            return;
        }

        const data = await response.json();
        const buyerIdentity = String(data.buyerIdentity_vc);
        const supplierIdentity = String(data.parceiroAribaIdentity_vc);
        const sessionPostUrl = String(data.punchoutUrl_vc);

        const xml = buildPunchOutOrderMessage({
            buyerCookie: sessionId,
            items,
            buyerIdentity,
            supplierIdentity,
        });

        console.log('PunchOut XML:', xml);

        if (!confirm('Enviar pedido para SAP Ariba?\n\nVerifique o XML no Console (F12) antes de confirmar.')) {
            return;
        }

        const orderTotalItems = totalItems;
        const orderTotalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

        await submitPunchOutOrder(sessionPostUrl, xml);
        clearCart();

        navigate('/pedido-sucesso', {
            state: {
                totalItems: orderTotalItems,
                totalPrice: orderTotalPrice,
            },
        });
    };

    // Filter items by search
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="cart-page">
            <CartHeader
                title="Carrinho de Compras"
                subtitle={`${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`}
                userName="User_ID"
                language="PT"
                onCartClick={handleCartClick}
            />

            <CartNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onSearch={handleSearch}
            />

            <main className="cart-content">
                <div className="cart-items-container">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                            />
                        ))
                    ) : (
                        <div className="empty-cart">
                            {items.length === 0 ? (
                                <>
                                    <p>Seu carrinho está vazio</p>
                                    <button
                                        className="continue-shopping-btn"
                                        onClick={() => navigate('/')}
                                    >
                                        Continuar Comprando
                                    </button>
                                </>
                            ) : (
                                <p>Nenhum item encontrado para "{searchQuery}"</p>
                            )}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <CartSummary
                        items={items}
                        onPunchOut={handlePunchOut}
                    />
                )}
            </main>
        </div>
    );
}

export default CartPage;
