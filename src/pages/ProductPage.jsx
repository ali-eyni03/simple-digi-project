import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { useCart } from "../context/CartContext";
import { getStaticProductById, getStaticProducts } from "../data/staticData.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LiaStoreAltSolid } from "react-icons/lia";
import { MdAddShoppingCart } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaRegHeart, FaStar } from "react-icons/fa";
import ProductCard from "../components/ProductSection";

export function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isDemoMode } = useContext(AuthContext);
    
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('features');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    useEffect(() => {
        if (showOverlay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [showOverlay]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            
            // Use static data instead of API call
            const productData = getStaticProductById(parseInt(id));
            
            if (!productData) {
                alert("محصول یافت نشد");
                navigate("/");
                return;
            }
            
            setProduct(productData);
            setSelectedImage(productData.main_image);
            
            // Get related products from same category
            const allProducts = getStaticProducts();
            const related = allProducts
                .filter(p => 
                    p.id !== productData.id && 
                    p.category?.id === productData.category?.id
                )
                .slice(0, 8); // Limit to 8 related products
            
            setRelatedProducts(related);
            
        } catch (error) {
            console.error("Error loading product from static data:", error);
            alert("خطا در بارگذاری محصول");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowOverlay(true);
    };

    const handleAddToCart = async () => {
        if (!user) {
            if (isDemoMode) {
                alert("در حالت دمو، ابتدا وارد شوید (هر شماره‌ای قابل قبول است)");
                navigate("/users/login/");
                return;
            }
            navigate("/users/login/", { state: { returnTo: `/product/${id}` } });
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart(product, quantity);
            if (isDemoMode) {
                alert(`${product.name} به سبد خرید اضافه شد (حالت دمو)`);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("خطا در افزودن به سبد خرید");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">در حال بارگذاری محصول...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">محصول یافت نشد</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            بازگشت به صفحه اصلی
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Demo Mode Indicator */}
            {isDemoMode && (
                <div className="bg-blue-100 border-b border-blue-200 py-2 px-4 text-center text-blue-700 text-sm">
                    حالت دمو - داده‌های استاتیک
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-6 b">
                {/* Product Main Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => handleImageClick(selectedImage)}
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.png';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        بدون تصویر
                                    </div>
                                )}
                            </div>
                            
                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
                                    {product.images.slice(0, 6).map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                                                selectedImage === image ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.png';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-gray-600 leading-tight mb-2 text-justify">
                                    {product.name}
                                </h1>
                                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <FaStar className="text-yellow-400 ml-1" />
                                        {product.rating?.toFixed(1) || '4.5'}
                                    </span>
                                    <span>({product.reviews_count || 0} نظر)</span>
                                    <span className="text-blue-600">{product.category_name}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-baseline space-x-2 space-x-reverse">
                                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('fa-IR').format(product.price)}
                                    </span>
                                    <span className="text-lg text-gray-600">تومان</span>
                                </div>
                                {product.discount_price && (
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <span className="text-lg text-gray-400 line-through">
                                            {new Intl.NumberFormat('fa-IR').format(product.discount_price)}
                                        </span>
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                                            {Math.round(((product.discount_price - product.price) / product.discount_price) * 100)}% تخفیف
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `موجود (${product.stock} عدد)` : 'ناموجود'}
                                </span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            {product.stock > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 space-x-reverse">
                                        <span className="text-sm font-medium">تعداد:</span>
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-4 space-x-reverse">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                                        >
                                            {addingToCart ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <MdAddShoppingCart className="text-xl" />
                                                    <span>افزودن به سبد خرید</span>
                                                </>
                                            )}
                                        </button>
                                        <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <FaRegHeart className="text-xl text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Store Info */}
                            <div className="border-t pt-4">
                                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                                    <LiaStoreAltSolid className="text-lg" />
                                    <span>فروشگاه دمو</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                    <div className="border-b mb-6 border-gray-200">
                        <nav className="flex space-x-8  gap-2 ">
                            {[
                                { key: 'features', label: 'مشخصات' },
                                { key: 'description', label: 'توضیحات' },
                                { key: 'reviews', label: 'نظرات' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.key
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="prose max-w-none">
                        {activeTab === 'description' && (
                            <div className="text-gray-700 leading-relaxed text-justify">
                                {product.description || 'توضیحات محصول در دسترس نیست.'}
                            </div>
                        )}
                        
                        {activeTab === 'features' && (
                            <div>
                                {product.base_product_data?.attributes ? (
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(product.base_product_data.attributes).map(([key, value]) => (
                                            <div key={key} className="border-b border-gray-200 pb-2">
                                                <dt className="text-sm font-medium text-gray-600">{key}:</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {typeof value === 'object' && value !== null ? (
                                                        typeof value.length !== 'undefined' && typeof value.width !== 'undefined' && typeof value.height !== 'undefined' ? (
                                                            `${value.length} × ${value.width} × ${value.height} سانتی‌متر`
                                                        ) : (
                                                            JSON.stringify(value)
                                                        )
                                                    ) : (
                                                        String(value || 'نامشخص')
                                                    )}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <p className="text-gray-500">مشخصات فنی در دسترس نیست.</p>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'reviews' && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">نظری برای این محصول ثبت نشده است.</p>
                                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    اولین نظر را بنویسید
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">محصولات مشابه</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Overlay */}
            {showOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowOverlay(false)}
                            className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
                        >
                            <IoClose />
                        </button>
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.png';
                            }}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}