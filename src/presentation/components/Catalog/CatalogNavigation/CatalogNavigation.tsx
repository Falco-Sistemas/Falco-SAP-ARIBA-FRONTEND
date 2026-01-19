import './CatalogNavigation.css';
import { FiSearch } from 'react-icons/fi';

interface CatalogNavigationProps {
    title: string;
    onSearch: (query: string) => void;
}

function CatalogNavigation({title, onSearch}: CatalogNavigationProps) {
    return (
        <nav className="catalog-navigation">
            <div className="catalog-title-container">
                <h1 className="catalog-title">{title}</h1>
                <span className="vertical-divider"></span>
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

export default CatalogNavigation;