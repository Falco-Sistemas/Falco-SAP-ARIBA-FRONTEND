// ProductRow.tsx

import './ProductRow.css';

// This interface represents a Product entity (Domain Layer concept)
export interface Product {
    id: number;
    name: string;
    distributor: string;
    deliveryTime: string;
    price: number;
    imageUrl?: string;  // Optional - the '?' means it can be undefined
}

interface ProductRowProps {
    product: Product;
    onAdd: (product: Product) => void;      // When user clicks + button
    onSettings: (product: Product) => void; // When user clicks settings
}

function ProductRow({ product, onAdd, onSettings }: ProductRowProps) {
    // Format price to Brazilian Real format
    const formatPrice = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    return (
        <tr className="product-row">
            <td className="product-image">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                ) : (
                    <div className="image-placeholder"></div>
                )}
            </td>
            <td className="product-id">{product.id}</td>
            <td className="product-name">{product.name}</td>
            <td className="product-distributor">{product.distributor}</td>
            <td className="product-delivery">{product.deliveryTime}</td>
            <td className="product-price">{formatPrice(product.price)}</td>
            <td className="product-actions">
                <button 
                    className="action-btn add-btn"
                    onClick={() => onAdd(product)}
                >
                    ⊕
                </button>
                <button 
                    className="action-btn settings-btn"
                    onClick={() => onSettings(product)}
                >
                    ⚙
                </button>
            </td>
        </tr>
    );
}

export default ProductRow;
