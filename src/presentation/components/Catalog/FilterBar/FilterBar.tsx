import './FilterBar.css';

interface FilterBarProps {
    totalProducts: number;
    sortOptions: string[];
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

function FilterBar ({totalProducts, sortOptions, selectedSort, onSortChange}: FilterBarProps) {
    return (
        <div className="filter-bar">
            <span className="total-products">
                {totalProducts} Produtos no total
            </span>

            <div className="sort-container">
                <label className="sort-label">Filtrar por:</label>
                <select 
                    className="sort-select"
                    value={selectedSort}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default FilterBar;