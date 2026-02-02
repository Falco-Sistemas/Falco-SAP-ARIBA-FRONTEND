import './Pagination.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Don't show pagination if only 1 page or less
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    };

    return (
        <div className="pagination">
            <button
                className="pagination-arrow"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FiChevronLeft />
            </button>

            {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                    <button
                        key={index}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="pagination-ellipsis">{page}</span>
                )
            ))}

            <button
                className="pagination-arrow"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FiChevronRight />
            </button>
        </div>
    );
}

export default Pagination;
