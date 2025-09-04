// src/data/staticData.js
import rawData from './data.json';

// Categories
export const getStaticCategories = () => {
    const categories = rawData
        .filter(item => item.model === "products.category")
        .map(item => ({
            id: item.pk,
            name: item.fields.name,
            en_name: item.fields.en_name,
            parent: item.fields.parent,
            description: item.fields.description || ''
        }));

    // Build hierarchical structure
    const categoryMap = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));

    categories.forEach(cat => {
        if (cat.parent !== null) {
            const parent = categoryMap.get(cat.parent);
            if (parent) {
                parent.children.push(categoryMap.get(cat.id));
            }
        }
    });

    return Array.from(categoryMap.values());
};

// Helper function to fix image paths
// Helper function to fix image paths
const getImagePath = (imagePath) => {
    let basePath = import.meta.env.BASE_URL || '/';
    
    // Ensure basePath ends with a slash
    if (!basePath.endsWith('/')) {
        basePath += '/';
    }
    
    if (!imagePath) return `${basePath}placeholder-image.png`;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    if (imagePath.startsWith('product_images/')) {
        return `${basePath}${imagePath}`;
    }
    
    if (!imagePath.startsWith('/')) {
        return `${basePath}product_images/${imagePath}`;
    }
    
    return `${basePath}${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
};

// Products
export const getStaticProducts = () => {
    const productBases = rawData
        .filter(item => item.model === "products.productbase")
        .map(item => ({
            id: item.pk,
            name: item.fields.name,
            description: item.fields.description,
            category_id: item.fields.category,
            attributes: item.fields.attributes,
        }));

    const products = rawData
        .filter(item => item.model === "products.product")
        .map(item => {
            const baseProduct = productBases.find(pb => pb.id === item.fields.base_product);
            const images = rawData
                .filter(img => img.model === "products.productimage" && img.fields.product === item.pk)
                .map(img => ({
                    image: getImagePath(img.fields.image),
                    is_featured: img.fields.is_featured
                }));

            const category = getStaticCategories().find(cat => cat.id === (baseProduct?.category_id));

            // Get the featured image or first image
            const mainImage = images.find(img => img.is_featured)?.image || 
                             images[0]?.image || 
                             '/placeholder-image.png';

            return {
                id: item.pk,
                seller: item.fields.seller,
                base_product: item.fields.base_product,
                name: item.fields.name,
                description: item.fields.description,
                price: parseFloat(item.fields.price),
                stock: item.fields.stock,
                main_image: mainImage,
                images: images.map(img => img.image),
                category_name: category?.name || 'دسته‌بندی نامشخص',
                category: category,
                base_product_data: baseProduct,
                created_at: item.fields.created_at || new Date().toISOString(),
                updated_at: item.fields.updated_at || new Date().toISOString(),
                is_available: item.fields.stock > 0,
                rating: Math.random() * 5, // Mock rating
                reviews_count: Math.floor(Math.random() * 100) + 1 // Mock reviews
            };
        });
    
    return products;
};

// Users
export const getStaticUsers = () => {
    return rawData
        .filter(item => item.model === "accounts.customuser")
        .map(item => ({
            id: item.pk,
            phone_number: item.pk,
            is_superuser: item.fields.is_superuser,
            is_active: item.fields.is_active,
            is_admin: item.fields.is_admin,
            role: item.fields.role,
            created_at: item.fields.created_at,
            updated_at: item.fields.updated_at
        }));
};

// User Profiles
export const getStaticUserProfiles = () => {
    return rawData
        .filter(item => item.model === "accounts.profile")
        .map(item => ({
            id: item.pk,
            user: item.fields.user,
            first_name: item.fields.first_name,
            last_name: item.fields.last_name,
            national_id: item.fields.national_id,
            birth_date: item.fields.birth_date,
            email: item.fields.email,
            full_name: `${item.fields.first_name} ${item.fields.last_name}`.trim() || 'کاربر',
            phone_number: item.fields.user
        }));
};

// Sellers
export const getStaticSellers = () => {
    return rawData
        .filter(item => item.model === "sellers.seller")
        .map(item => ({
            id: item.pk,
            user: item.fields.user,
            is_legal: item.fields.is_legal,
            national_code: item.fields.national_code,
            shaba_number: item.fields.shaba_number,
            store_name: item.fields.store_name,
            store_address: item.fields.store_address,
            created_at: item.fields.created_at
        }));
};

// Cart Items
export const getStaticCartItems = () => {
    const products = getStaticProducts();
    return rawData
        .filter(item => item.model === "orders.cartitem")
        .map(item => {
            const product = products.find(p => p.id === item.fields.product);
            return {
                id: item.pk,
                cart: item.fields.cart,
                product: product,
                quantity: item.fields.quantity,
                total_price: product ? product.price * item.fields.quantity : 0,
                created_at: item.fields.created_at,
                updated_at: item.fields.updated_at
            };
        });
};

// Orders
export const getStaticOrders = () => {
    const products = getStaticProducts();
    const users = getStaticUsers();
    
    // Get order items first
    const orderItems = rawData
        .filter(item => item.model === "orders.orderitem")
        .map(item => {
            const product = products.find(p => p.id === item.fields.product);
            return {
                id: item.pk,
                order: item.fields.order,
                product: product,
                quantity: item.fields.quantity,
                price: parseFloat(item.fields.price),
                discount: 0,
                status: 'delivered'
            };
        });

    // Get orders and attach items
    const orders = rawData
        .filter(item => item.model === "orders.order")
        .map(item => {
            const orderItemsList = orderItems.filter(oi => oi.order === item.pk);
            const totalAmount = orderItemsList.reduce((sum, oi) => sum + (oi.quantity * oi.price), 0);
            
            return {
                id: item.pk,
                user: item.fields.user,
                order_number: `ORD-${String(item.pk).padStart(6, '0')}`,
                status: 'delivered',
                created_at: item.fields.created_at || new Date().toISOString(),
                total_amount: totalAmount,
                shipping_cost: 50000,
                payment_method: 'cash_on_delivery',
                payment_status: 'paid',
                items: orderItemsList,
                address: {
                    city: 'تهران',
                    address: 'آدرس تست',
                    postal_code: '1234567890'
                }
            };
        });

    return orders;
};

// Mock addresses for demo
export const getStaticAddresses = () => {
    return [
        {
            id: 1,
            user: '09123456789',
            title: 'خانه',
            recipient_name: 'کاربر دمو',
            recipient_phone: '09123456789',
            province: 'تهران',
            city: 'تهران',
            address: 'خیابان ولیعصر، پلاک 123',
            postal_code: '1234567890',
            is_default: true,
            location_lat: 35.7219,
            location_lng: 51.3347
        },
        {
            id: 2,
            user: '09123456789',
            title: 'محل کار',
            recipient_name: 'کاربر دمو',
            recipient_phone: '09123456789',
            province: 'تهران',
            city: 'تهران',
            address: 'میدان آزادی، برج آزادی',
            postal_code: '1234567891',
            is_default: false,
            location_lat: 35.6892,
            location_lng: 51.3890
        }
    ];
};

// Mock comments/reviews
export const getStaticComments = () => {
    return [
        {
            id: 1,
            user: '09123456789',
            product_id: 1,
            rating: 5,
            comment: 'محصول عالی بود، کیفیت بسیار خوب',
            created_at: new Date().toISOString(),
            status: 'approved'
        },
        {
            id: 2,
            user: '09123456789', 
            product_id: 2,
            rating: 4,
            comment: 'قیمت مناسب و کیفیت خوب',
            created_at: new Date().toISOString(),
            status: 'approved'
        }
    ];
};

// Search function
export const searchStaticProducts = (query, filters = {}) => {
    const allProducts = getStaticProducts();
    
    let results = allProducts.filter(product => {
        const searchText = query.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText) ||
            product.category_name.toLowerCase().includes(searchText)
        );
    });

    // Apply filters
    if (filters.category) {
        results = results.filter(p => p.category?.name === filters.category);
    }
    
    if (filters.min_price) {
        results = results.filter(p => p.price >= parseFloat(filters.min_price));
    }
    
    if (filters.max_price) {
        results = results.filter(p => p.price <= parseFloat(filters.max_price));
    }

    return results;
};

// Get product by ID
export const getStaticProductById = (id) => {
    const products = getStaticProducts();
    return products.find(p => p.id === parseInt(id));
};

// Get seller products
export const getSellerProducts = (sellerUserId) => {
    const products = getStaticProducts();
    return products.filter(p => p.seller === sellerUserId);
};

// Dashboard stats for seller
export const getSellerDashboardStats = (sellerUserId) => {
    const sellerProducts = getSellerProducts(sellerUserId);
    const orders = getStaticOrders().filter(o => 
        o.items.some(item => 
            sellerProducts.some(sp => sp.id === item.product?.id)
        )
    );
    
    return {
        total_products: sellerProducts.length,
        active_products: sellerProducts.filter(p => p.stock > 0).length,
        total_orders: orders.length,
        pending_orders: Math.floor(orders.length * 0.3),
        total_revenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
        avg_rating: 4.5,
        total_customers: Math.floor(orders.length * 0.7)
    };
};