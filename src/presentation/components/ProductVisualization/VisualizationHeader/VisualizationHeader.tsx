import './VisualizationHeader.css';
import { FiChevronDown } from 'react-icons/fi';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

interface VisualizationHeaderProps {
    title: string;
    subtitle: string;
    userName: string;
    language: string;
    cartItemCount: number;
    onCartClick: () => void;
}

function VisualizationHeader({
    title,
    subtitle,
    userName,
    language,
    cartItemCount,
    onCartClick
}: VisualizationHeaderProps) {
    return (
        <header className="visualization-header">
            <div className="header-info">
                <h1 className="header-title">{title}</h1>
                <p className="header-subtitle">{subtitle}</p>
            </div>

            <div className="header-actions">
                <button className="header-language">
                    {language} <FiChevronDown className="arrow-down" />
                </button>

                <div className="header-user">
                    <FaUser className="user-icon" />
                    <span>{userName}</span>
                </div>

                <button className="cart-btn" onClick={onCartClick}>
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                        <span className="cart-badge">{cartItemCount}</span>
                    )}
                </button>
            </div>
        </header>
    );
}

export default VisualizationHeader;
