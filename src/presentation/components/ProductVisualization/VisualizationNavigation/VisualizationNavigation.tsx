import './VisualizationNavigation.css';
import { FaShoppingCart } from 'react-icons/fa';
import logoImg from '../../../../assets/images/logo.png';

interface VisualizationNavigationProps {
    title: string;
    cartItemCount: number;
    onCartClick: () => void;
}

function VisualizationNavigation({ title, cartItemCount, onCartClick }: VisualizationNavigationProps) {
    return (
        <nav className="visualization-navigation">
            <div className="nav-title-container">
                <img src={logoImg} alt="Logo" className="nav-logo" />
                <h2 className="nav-title">{title}</h2>
            </div>
            <button className="vis-cart-btn" onClick={onCartClick}>
                <FaShoppingCart />
                {cartItemCount > 0 && (
                    <span className="vis-cart-badge">{cartItemCount}</span>
                )}
            </button>
        </nav>
    );
}

export default VisualizationNavigation;
