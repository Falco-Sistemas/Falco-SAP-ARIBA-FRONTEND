/**
 * Cart Item - represents a product in the cart
 */
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    stock: number;
    imageUrl: string | undefined
}

/**
 * Cart - represents the shopping cart
 */
export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}
