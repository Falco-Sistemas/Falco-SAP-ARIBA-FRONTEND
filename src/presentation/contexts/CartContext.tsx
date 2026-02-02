import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem } from '../../domain/entities/Cart';
import type { CatalogProduct } from '../../domain/entities/Product';

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (product: CatalogProduct, quantity: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addToCart = (product: CatalogProduct, quantity: number) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            const newItem: CartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity,
                color: product.color,
                size: product.size,
                stock: product.stock,
            };

            return [...currentItems, newItem];
        });
    };

    const updateQuantity = (id: number, quantity: number) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (id: number) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
