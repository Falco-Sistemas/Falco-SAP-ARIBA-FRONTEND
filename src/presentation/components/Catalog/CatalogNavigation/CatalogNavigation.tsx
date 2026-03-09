import { useRef } from 'react';
import './CatalogNavigation.css';
import { FiSearch } from 'react-icons/fi';

interface CatalogNavigationProps {
    title: string;
    onSearch: (query: string) => void;
}

function CatalogNavigation({title, onSearch}: CatalogNavigationProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <nav className="catalog-navigation">
            <div className="catalog-title-container">
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
        </nav>
    );
}

export default CatalogNavigation;