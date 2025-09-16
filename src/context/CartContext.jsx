import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { getStaticProducts, getStaticCartItems } from "../data/staticData.js";

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload.items || [],
                totalItems: action.payload.total_items || 0,
                totalPrice: action.payload.total_price || 0,
                loading: false
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalPrice: 0
            };
        case 'ADD_ITEM_STATIC': {
            const { product, quantity } = action.payload;
            const existingItem = state.items.find(item => item.product.id === product.id);
            let newItems;

            if (existingItem) {
                newItems = state.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity, total_price: (item.quantity + quantity) * product.price }
                        : item
                );
            } else {
                newItems = [...state.items, { id: Date.now(), product, quantity, total_price: quantity * product.price }];
            }

            const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalPrice = newItems.reduce((sum, item) => sum + item.total_price, 0);
            return { ...state, items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
        }
        case 'UPDATE_ITEM_STATIC': {
            const { itemId, quantity } = action.payload;
            const newItems = state.items.map(item =>
                item.id === itemId
                    ? { ...item, quantity: quantity, total_price: quantity * item.product.price }
                    : item
            );
            const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalPrice = newItems.reduce((sum, item) => sum + item.total_price, 0);
            return { ...state, items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
        }
        case 'REMOVE_ITEM_STATIC': {
            const newItems = state.items.filter(item => item.id !== action.payload);
            const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalPrice = newItems.reduce((sum, item) => sum + item.total_price, 0);
            return { ...state, items: newItems, totalItems: newTotalItems, totalPrice: newTotalPrice };
        }
        default:
            return state;
    }
};

const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user, isAuthenticated } = useContext(AuthContext);

    const fetchCart = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const staticCartItems = getStaticCartItems();
            const totalItems = staticCartItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = staticCartItems.reduce((sum, item) => sum + item.total_price, 0);

            dispatch({
                type: 'SET_CART',
                payload: {
                    items: staticCartItems,
                    total_items: totalItems,
                    total_price: totalPrice
                }
            });
        } catch (error) {
            console.error('Error fetching static cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            dispatch({ type: 'CLEAR_CART' });
        }
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            alert('برای افزودن به سبد خرید باید وارد حساب کاربری خود شوید (در حالت دمو، این پیام فقط برای اطلاع است).');
        }

        const productToAdd = getStaticProducts().find(p => p.id === productId);
        if (productToAdd) {
            dispatch({ type: 'ADD_ITEM_STATIC', payload: { product: productToAdd, quantity } });
            return true;
        }
        alert('محصول یافت نشد.');
        return false;
    };

    const updateCartItem = async (itemId, quantity) => {
        if (!isAuthenticated) return false;
        dispatch({ type: 'UPDATE_ITEM_STATIC', payload: { itemId, quantity } });
        return true;
    };

    const removeFromCart = async (itemId) => {
        if (!isAuthenticated) return false;
        dispatch({ type: 'REMOVE_ITEM_STATIC', payload: itemId });
        return true;
    };

    const clearCart = async () => {
        if (!isAuthenticated) return false;
        dispatch({ type: 'CLEAR_CART' });
        return true;
    };

    const createOrder = async (orderData) => {
        if (!isAuthenticated) {
            return { success: false, error: 'کاربر وارد نشده است (در حالت دمو، این پیام فقط برای اطلاع است).' };
        }
        dispatch({ type: 'CLEAR_CART' });
        const mockOrderNumber = `DEMO-${Date.now().toString().slice(-7)}`;
        return {
            success: true,
            order: { order_number: mockOrderNumber }
        };
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated, fetchCart]);

    const value = {
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        createOrder,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
