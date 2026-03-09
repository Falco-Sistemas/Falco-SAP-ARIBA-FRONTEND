import './CartNavigation.css';
import { FaShoppingCart } from 'react-icons/fa';
import logoImg from '../../../../assets/images/logo.png';

interface Tab {
    id: string;
    label: string;
}

interface CartNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    cartItemCount: number;
}

function CartNavigation({ tabs, activeTab, onTabChange, cartItemCount }: CartNavigationProps) {
    return (
        <nav className="cart-navigation">
            <img src={logoImg} alt="Logo" className="cart-nav-logo" />
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="cart-nav-cart-btn">
                <FaShoppingCart />
                {cartItemCount > 0 && (
                    <span className="cart-nav-cart-badge">{cartItemCount}</span>
                )}
            </div>
        </nav>
    );
}

export default CartNavigation;
