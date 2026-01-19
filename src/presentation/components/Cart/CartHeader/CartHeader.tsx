import './CartHeader.css';
import { FiChevronDown } from 'react-icons/fi';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

interface CartHeaderProps {
    title: string;
    subtitle: string;
    userName: string;
    language: string;
    onCartClick: () => void;
}

function CartHeader({
    title,
    subtitle,
    userName,
    language,
    onCartClick
}: CartHeaderProps) {
    return (
        <header className="cart-header">
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
                </button>
            </div>
        </header>
    );
}

export default CartHeader;
