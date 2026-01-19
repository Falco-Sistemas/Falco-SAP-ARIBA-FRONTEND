import { useState } from 'react';
import './ProductImageGallery.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
    const thumbnailsToShow = 3;

    const handlePrevThumbnails = () => {
        if (thumbnailStartIndex > 0) {
            setThumbnailStartIndex(thumbnailStartIndex - 1);
        }
    };

    const handleNextThumbnails = () => {
        if (thumbnailStartIndex + thumbnailsToShow < images.length) {
            setThumbnailStartIndex(thumbnailStartIndex + 1);
        }
    };

    const visibleThumbnails = images.slice(
        thumbnailStartIndex,
        thumbnailStartIndex + thumbnailsToShow
    );

    return (
        <div className="product-image-gallery">
            <div className="main-image-container">
                <img
                    src={images[selectedIndex]}
                    alt={productName}
                    className="main-image"
                />
            </div>

            <div className="thumbnails-section">
                <p className="thumbnails-label">Outras imagens:</p>

                <div className="thumbnails-container">
                    <button
                        className="thumbnail-nav-btn"
                        onClick={handlePrevThumbnails}
                        disabled={thumbnailStartIndex === 0}
                    >
                        <FiChevronLeft />
                    </button>

                    <div className="thumbnails-list">
                        {visibleThumbnails.map((image, index) => {
                            const actualIndex = thumbnailStartIndex + index;
                            return (
                                <button
                                    key={actualIndex}
                                    className={`thumbnail ${selectedIndex === actualIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedIndex(actualIndex)}
                                >
                                    <img src={image} alt={`${productName} ${actualIndex + 1}`} />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className="thumbnail-nav-btn"
                        onClick={handleNextThumbnails}
                        disabled={thumbnailStartIndex + thumbnailsToShow >= images.length}
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductImageGallery;
