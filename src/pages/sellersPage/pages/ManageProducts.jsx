import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaTrash,
    FaEye,
    FaPlus,
    FaSearch,
    FaSortAmountDown,
    FaSortAmountUp
} from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import { RiShoppingCartLine } from "react-icons/ri";
import { AuthContext } from "../../../auth/AuthContext";
import { getStaticProducts } from "../../../data/staticData"; 

const ManageProducts = () => {
    const { authTokens } = useContext(AuthContext); 
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [searchQuery, filterStatus, sortBy, sortOrder, currentPage]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const allStaticProducts = getStaticProducts();
            let filtered = allStaticProducts;

            if (searchQuery) {
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }

            if (filterStatus === "in_stock") {
                filtered = filtered.filter(p => p.stock > 0);
            } else if (filterStatus === "out_of_stock") {
                filtered = filtered.filter(p => p.stock === 0);
            } else if (filterStatus === "low_stock") {
                filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
            }

            filtered.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            const productsPerPage = 12;
            const totalCount = filtered.length;
            const calculatedTotalPages = Math.ceil(totalCount / productsPerPage);
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const paginatedProducts = filtered.slice(startIndex, endIndex);

            setProducts(paginatedProducts);
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Error fetching static products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/seller-profile/product/${productId}`);
    };

    const handleEditProduct = (productId, e) => {
        e.stopPropagation();
        navigate(`/seller-profile/product/${productId}`);
    };

    const handleDeleteProduct = async (productId, e) => {
        e.stopPropagation();
        if (window.confirm("آیا از حذف این محصول مطمئن هستید؟ (عملیات شبیه‌سازی شده)")) {
            try {
                console.log(`Mock deleting product with ID: ${productId}`);
                setProducts(prev => prev.filter(p => p.id !== productId)); 
                alert("محصول با موفقیت حذف شد (شبیه‌سازی شده)");
            } catch (error) {
                console.error("Error deleting mock product:", error);
                alert("خطا در حذف محصول (شبیه‌سازی شده)");
            }
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => {
            const updated = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            setShowBulkActions(updated.length > 0);
            return updated;
        });
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
            setShowBulkActions(false);
        } else {
            setSelectedProducts(products.map(p => p.id));
            setShowBulkActions(true);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`آیا از حذف ${selectedProducts.length} محصول انتخاب شده مطمئن هستید؟ (عملیات شبیه‌سازی شده)`)) {
            try {
                console.log(`Mock deleting products with IDs: ${selectedProducts.join(', ')}`);
                setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id))); 
                setSelectedProducts([]);
                setShowBulkActions(false);
                alert("محصولات انتخاب شده با موفقیت حذف شدند (شبیه‌سازی شده)");
            } catch (error) {
                console.error("Error deleting mock products:", error);
                alert("خطا در حذف محصولات (شبیه‌سازی شده)");
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const getStatusBadge = (stock) => {
        if (stock === 0) {
            return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">ناموجود</span>;
        } else if (stock < 10) {
            return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">کم موجود</span>;
        }
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">موجود</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg md:text-xl font-bold text-gray-800">مدیریت محصولات</h1>
                    <Link
                        to="/seller-profile/products/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors max-w-fit text-[12px] md:text-base"
                    >
                        <FaPlus />
                        افزودن محصول جدید
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm text-[12px] md:text-base">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="جستجو در محصولات..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Filter by Status */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">همه محصولات</option>
                            <option value="in_stock">موجود</option>
                            <option value="out_of_stock">ناموجود</option>
                            <option value="low_stock">کم موجود</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="created_at">تاریخ ایجاد</option>
                            <option value="name">نام محصول</option>
                            <option value="price">قیمت</option>
                            <option value="stock">موجودی</option>
                        </select>

                        {/* Sort Order */}
                        <button
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                            className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                            {sortOrder === 'desc' ? 'نزولی' : 'صعودی'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-blue-800">
                            {selectedProducts.length} محصول انتخاب شده
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <FaTrash />
                                حذف انتخاب شده‌ها
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <RiShoppingCartLine className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">محصولی یافت نشد</h3>
                    <p className="text-gray-500 mb-6">
                        {searchQuery ? 'محصولی با این جستجو یافت نشد' : 'هنوز محصولی اضافه نکرده‌اید'}
                    </p>
                    <Link
                        to="/seller-profile/products/create"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        <FaPlus />
                        افزودن اولین محصول
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 px-2 py-3 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={selectedProducts.length === products.length && products.length > 0}
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="grid grid-cols-8 md:grid-cols-12 gap-1 flex-1  text-[12px] md:text-sm font-medium text-gray-700">
                                <div className="col-span-4 flex items-center justify-center">محصول</div>
                                <div className="col-span-2 flex items-center justify-center">قیمت</div>
                                <div className="col-span-2 flex items-center justify-center">موجودی</div>
                                <div className="hidden md:block col-span-2">وضعیت</div>
                                <div className="hidden md:block col-span-2">عملیات</div>
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200 w-full">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="px-2 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleProductClick(product.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleSelectProduct(product.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />

                                    <div className="grid grid-cols-8 md:grid-cols-12 gap-4 flex-1">
                                        {/* Product Info */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {product.main_image ? (
                                                    <img
                                                        src={product.main_image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <MdOutlineInventory className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-[12px] md:text-base font-medium text-gray-900 truncate">{product.name}</h3>
                                                <p className="text-[12px] md:text-[14px] text-gray-500 truncate">{product.sku || 'بدون کد'}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2 flex items-center justify-center">
                                            <span className="font-semibold text-gray-900 text-[11px] md:text-[14px]">
                                                {formatPrice(product.price)} تومان
                                            </span>
                                        </div>

                                        {/* Stock */}
                                        <div className="col-span-2 flex items-center justify-center">
                                            <span className="font-medium text-gray-900 text-[10px] md:text-sm">{product.stock}</span>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2 hidden md:flex items-center">
                                            {getStatusBadge(product.stock)}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 hidden md:flex items-center gap-2">

                                            <button
                                                onClick={(e) => handleEditProduct(product.id, e)}
                                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                title="ویرایش"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteProduct(product.id, e)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="حذف"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        قبلی
                    </button>

                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 border rounded-lg ${
                                    currentPage === i + 1
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        بعدی
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;