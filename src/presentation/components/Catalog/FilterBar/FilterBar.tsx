import './FilterBar.css';
import type { CategoryFilters } from '../../../hooks/useProducts';
import type { Familia, Grupo, Subgrupo } from '../../../../domain/entities/Product';

interface FilterBarProps {
    totalProducts: number;
    sortOptions: string[];
    selectedSort: string;
    onSortChange: (sort: string) => void;
    categoryFilters: CategoryFilters;
    onCategoryFilterChange: (filterName: keyof CategoryFilters, value: string) => void;
    availableFamilias: Familia[];
    availableGrupos: Grupo[];
    availableSubgrupos: Subgrupo[];
}

function FilterBar ({
    totalProducts,
    sortOptions,
    selectedSort,
    onSortChange,
    categoryFilters,
    onCategoryFilterChange,
    availableFamilias,
    availableGrupos,
    availableSubgrupos,
}: FilterBarProps) {
    return (
        <div className="filter-bar">
            <span className="total-products">
                {totalProducts} Produtos no total
            </span>

            <div className="category-filters">
                <div className="category-filter">
                    <label className="filter-label">Família:</label>
                    <select
                        className="filter-select"
                        value={categoryFilters.familia}
                        onChange={(e) => onCategoryFilterChange('familia', e.target.value)}
                    >
                        <option value={undefined}>Todas</option>
                        {availableFamilias.map((f) => (
                            <option key={`family${f.codigo}`} value={f.codigo}>{f.descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="category-filter">
                    <label className="filter-label">Grupo:</label>
                    <select
                        className="filter-select"
                        value={categoryFilters.grupo}
                        onChange={(e) => onCategoryFilterChange('grupo', e.target.value)}
                    >
                        <option value={undefined}>Todos</option>
                        {availableGrupos.map((g) => (
                            <option key={`group${g.codigo}`} value={g.codigo}>{g.descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="category-filter">
                    <label className="filter-label">Subgrupo:</label>
                    <select
                        className="filter-select"
                        value={categoryFilters.subgrupo}
                        onChange={(e) => onCategoryFilterChange('subgrupo', e.target.value)}
                    >
                        <option value={undefined}>Todos</option>
                        {availableSubgrupos.map((s) => (
                            <option key={`subgroup${s.codigo}`} value={s.codigo}>{s.descricao}</option>
                        ))}
                    </select>
                </div>
            </div>

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
