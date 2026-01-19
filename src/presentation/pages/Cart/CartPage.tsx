import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import CartHeader from '../../components/Cart/CartHeader/CartHeader';
import CartNavigation from '../../components/Cart/CartNavigation/CartNavigation';
import CartItem from '../../components/Cart/CartItem/CartItem';
import type { CartProduct } from '../../components/Cart/CartItem/CartItem';
import CartSummary from '../../components/Cart/CartSummary/CartSummary';

const mockCartItems: CartProduct[] = [
    {
        id: 1,
        category: 'Suprimentos Escritório',
        name: 'Papel Sulfite A4 500 folhas',
        price: 29.90,
        quantity: 2
    },
    {
        id: 2,
        category: 'Suprimentos Escritório',
        name: 'Caneta Esferográfica Azul (caixa)',
        price: 24.50,
        quantity: 1
    },
    {
        id: 3,
        category: 'Equipamentos',
        name: 'Monitor LED 24 polegadas',
        price: 899.00,
        quantity: 1
    }
];

const tabs = [
    { id: 'cart', label: 'Carrinho de Compras' },
    { id: 'catalog', label: 'Catálogo de Produtos' }
];

function CartPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('cart');
    const [cartItems, setCartItems] = useState<CartProduct[]>(mockCartItems);
    const [searchQuery, setSearchQuery] = useState('');

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
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleCartClick = () => {
        // Already on cart page
    };

    const handlePunchOut = () => {
        console.log('PunchOut clicked - sending cart to SAP Ariba');
        alert('Carrinho enviado para SAP Ariba!');
    };

    const filteredItems = cartItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="cart-page">
            <CartHeader
                title="Carrinho de Compras"
                subtitle="Revise seus itens antes de finalizar"
                userName="João Silva"
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
                            <p>Seu carrinho está vazio</p>
                        </div>
                    )}
                </div>

                <CartSummary
                    items={cartItems}
                    onPunchOut={handlePunchOut}
                />
            </main>
        </div>
    );
}

export default CartPage;
