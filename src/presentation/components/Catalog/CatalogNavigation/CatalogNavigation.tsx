import { useRef } from 'react';
import './CatalogNavigation.css';
import { FiSearch } from 'react-icons/fi';
import { FaShoppingCart } from 'react-icons/fa';
import logoImg from '../../../../assets/images/logo.png';

interface CatalogNavigationProps {
    title: string;
    onSearch: (query: string) => void;
    cartItemCount: number;
    onCartClick: () => void;
}

function CatalogNavigation({title, onSearch, cartItemCount, onCartClick}: CatalogNavigationProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <nav className="catalog-navigation">
            <div className="catalog-title-container">
                <img src={logoImg} alt="Logo" className="catalog-logo" />
                <h1 className="catalog-title">{title}</h1>
                <span className="vertical-divider"></span>
            </div>

            <div className="search-wrapper">
                <div className="search-box" onClick={focusInput}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Pesquisar em Armazém"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                <span className="search-icon-btn">
                    <FiSearch className="search-icon" />
                </span>
            </div>

            <button className="catalog-cart-btn" onClick={onCartClick}>
                <FaShoppingCart />
                {cartItemCount > 0 && (
                    <span className="catalog-cart-badge">{cartItemCount}</span>
                )}
            </button>
        </nav>
    );
}

export default CatalogNavigation;