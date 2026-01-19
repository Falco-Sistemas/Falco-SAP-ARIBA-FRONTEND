import './CatalogHeader.css';
import { FiChevronDown } from 'react-icons/fi';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

interface CatalogHeaderProps {
    userName: string;
    language: string;
    cartItemCount: number;
    onCartClick: () => void;
    onPunchOutClick: () => void;
}


function CatalogHeader({
    userName,
    language,
    cartItemCount,
    onCartClick,
    onPunchOutClick
}: CatalogHeaderProps) {
    return (
        <header className="catalog-header">
            <div className="catalog-header-actions">
                <button className="header-language">
                    {language} <FiChevronDown className="arrow-down" />
                </button>

                <div className="header-user">
                    <FaUser className="user-icon" />
                    <span>{userName}</span>
                </div>

                <button className="punchout-btn" onClick={onPunchOutClick}>
                    PunchOut PunchOut
                </button>

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

export default CatalogHeader;