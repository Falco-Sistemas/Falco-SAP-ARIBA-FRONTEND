import './CartNavigation.css';
import { FiSearch } from 'react-icons/fi';

interface Tab {
    id: string;
    label: string;
}

interface CartNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    onSearch: (query: string) => void;
}

function CartNavigation({ tabs, activeTab, onTabChange, onSearch }: CartNavigationProps) {
    return (
        <nav className="cart-navigation">
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

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    onChange={(e) => onSearch(e.target.value)}
                />
                <FiSearch className="search-icon" />
            </div>
        </nav>
    );
}

export default CartNavigation;
