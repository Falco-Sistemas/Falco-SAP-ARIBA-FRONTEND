import './VisualizationNavigation.css';
import { FiSearch } from 'react-icons/fi';

interface VisualizationNavigationProps {
    title: string;
    onSearch: (query: string) => void;
}

function VisualizationNavigation({ title, onSearch }: VisualizationNavigationProps) {
    return (
        <nav className="visualization-navigation">
            <div className="nav-title-container">
                <h2 className="nav-title">{title}</h2>
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

export default VisualizationNavigation;
