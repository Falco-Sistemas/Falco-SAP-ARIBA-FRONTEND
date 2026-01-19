import './TabNavigations.css';

interface Tab {
    id: string;
    label: string;
}

interface TabNavigationProps {
    tabs: Tab[];            // Array of tabs to display
    activeTab: string;    // Wich tab is currently active
    onTabChange: (tabId: string) => void; // Function to call when tab is click
    onSearch: (query: string) => void; // Function to call when searching
}

function TabNavigation({tabs, activeTab, onTabChange, onSearch}: TabNavigationProps) {
    return (
        <nav className='tab-navigation'>
            <div className='tabs'>
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


            <div className='search-box'>
                <input
                    type='text'
                    placeholder='Pesquisar...'
                    onChange={(e) => onSearch(e.target.value)}
                />
                <span className='search-icon'>🔍</span>
            </div>
        </nav>
    )
}

export default TabNavigation;