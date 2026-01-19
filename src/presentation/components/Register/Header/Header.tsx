import './Header.css';

// 1. Define Props interface - This is TypeScript teeling us what dat athis component needs
interface HeaderProps {
    title: String;      // "Catálogo de Produtos"
    subtitle: string;  // "220 Produtos no total"
    userName: string;   // "Admin_ID"
    language: string;   // "Português"
}

// 2.Component receives props as parameter
function Header({ title, subtitle, userName, language }: HeaderProps) {
    return (
        <header className="header">
            {/* Left side - Title and subtitle */}
            <div className="header-info">
                <h1 className="header-title">{title}</h1>
                <p className='header-subtitle'>{subtitle}</p>
            </div>

            {/* Right side - Actions */}
            <div className="header-actions">
                <button className="header-language">
                    {language} <span className="arrow-down">▼</span>
                </button>

                <div className='header-user'>
                    <span className='user-icon'>👤</span>
                    <span>{userName}</span>
                </div>

                <button className="header=cart">
                    🛒
                </button>
            </div>
        </header>
    );
}