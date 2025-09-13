import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../auth/AuthContext";
import { getStaticProductById, getSellerProducts } from "../../../data/staticData.js";
import { MdOutlineSecurity, MdEdit, MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

const SellerProductDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { authTokens, user, isDemoMode } = useContext(AuthContext);
	
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(null);
	const [showOverlay, setShowOverlay] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editData, setEditData] = useState({
		price: "",
		stock: "",
		description: ""
	});

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
				navigate("/seller-profile/products");
				return;
			}
			
			// Check if this product belongs to current seller (in demo, allow all)
			if (!isDemoMode) {
				// In real mode, you might want to check seller ownership
				const sellerProducts = getSellerProducts(user?.phone_number);
				const isOwner = sellerProducts.some(p => p.id === productData.id);
				if (!isOwner) {
					alert("شما مجاز به مشاهده این محصول نیستید");
					navigate("/seller-profile/products");
					return;
				}
			}
			
			setProduct(productData);
			setSelectedImage(productData.main_image);
			setEditData({
				price: productData.price,
				stock: productData.stock,
				description: productData.description
			});
			
		} catch (error) {
			console.error("Error loading product from static data:", error);
			alert("خطا در بارگذاری محصول");
			navigate("/seller-profile/products");
		} finally {
			setLoading(false);
		}
	};

	const handleImageClick = (imageUrl) => {
		setSelectedImage(imageUrl);
		setShowOverlay(true);
	};

	const handleEdit = async () => {
		if (!editMode) {
			setEditMode(true);
			return;
		}

		if (isDemoMode) {
			// Simulate update in demo mode
			setLoading(true);
			setTimeout(() => {
				setProduct(prev => ({
					...prev,
					...editData,
					price: parseFloat(editData.price)
				}));
				setEditMode(false);
				setLoading(false);
				alert("در حالت دمو، محصول با موفقیت به‌روزرسانی شد!");
			}, 1000);
			return;
		}

		// Real API call would go here
		try {
			// Simulate API call
			setProduct(prev => ({...prev, ...editData}));
			setEditMode(false);
			alert("محصول با موفقیت به‌روزرسانی شد");
		} catch (error) {
			console.error("Error updating product:", error);
			alert("خطا در به‌روزرسانی محصول");
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
			return;
		}

		if (isDemoMode) {
			alert("در حالت دمو، حذف محصول شبیه‌سازی شد!");
			navigate("/seller-profile/products");
			return;
		}

		// Real delete API call would go here
		try {
			alert("محصول با موفقیت حذف شد");
			navigate("/seller-profile/products");
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("خطا در حذف محصول");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">در حال بارگذاری...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 mb-4">محصول یافت نشد</p>
					<Link 
						to="/seller-profile/products/manage"
						className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
					>
						بازگشت به لیست محصولات
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-4 md:p-6">
			{/* Demo Mode Indicator */}
			{isDemoMode && (
				<div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg mb-6">
					<div className="flex items-center">
						<MdOutlineSecurity className="text-lg ml-2" />
						<span className="text-[12px]">حالت دمو - تمام عملیات شبیه‌سازی می‌شود</span>
					</div>
				</div>
			)}

			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-4 space-x-reverse">
					<Link 
						to="/seller-profile/products/manage"
						className="flex items-center text-blue-600 hover:text-blue-800 transition-colors underline underlined"
					>
						<FaArrowLeft className="ml-2" />
						<span className="text-[12px]">بازگشت به لیست محصولات</span>
					</Link>
					<h1 className="hidden lg:static text-[12px]  md:text-2xl font-bold text-gray-900 border w-full">جزئیات محصول</h1>
				</div>
				
				<div className="flex gap-1 items-center space-x-2 space-x-reverse">
					<button
						onClick={handleEdit}
						disabled={loading}
						className={`flex items-center gap-1 justify-center p-2 rounded-lg transition-colors text-[12px] max-w-fit ${
							editMode 
								? 'bg-green-600 text-white hover:bg-green-700' 
								: 'bg-blue-600 text-white hover:bg-blue-700'
						} disabled:bg-gray-400`}
					>
						<MdEdit />
						<span>{editMode ? 'ذخیره تغییرات' : 'ویرایش'}</span>
					</button>
					
					<button
						onClick={handleDelete}
						className="flex gap-1 items-center justify-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[12px] "
					>
						<MdDelete />
						<span>حذف</span>
					</button>
				</div>
			</div>

			{/* Product Details */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
				{/* Images Section */}
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

				{/* Product Info Section */}
				<div className="space-y-6">
					<div>
						<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
							{product.name}
						</h2>
						<p className="text-blue-600 text-sm">{product.category_name}</p>
					</div>

					{/* Editable Fields */}
					<div className="space-y-4">
						{/* Price */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
							{editMode ? (
								<input
									type="number"
									value={editData.price}
									onChange={(e) => setEditData({...editData, price: e.target.value})}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							) : (
								<div className="text-2xl font-bold text-gray-900">
									{new Intl.NumberFormat('fa-IR').format(product.price)} تومان
								</div>
							)}
						</div>

						{/* Stock */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
							{editMode ? (
								<input
									type="number"
									value={editData.stock}
									onChange={(e) => setEditData({...editData, stock: e.target.value})}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							) : (
								<div className="flex gap-2 items-center space-x-2 space-x-reverse text-sm">
									<div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
									<span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.stock > 0 ? `${product.stock} عدد موجود` : 'ناموجود'}
									</span>
								</div>
							)}
						</div>

						{/* Description */}
						<div>
							<label className="block text-base font-medium text-gray-700 mb-2">توضیحات</label>
							{editMode ? (
								<textarea
									value={editData.description}
									onChange={(e) => setEditData({...editData, description: e.target.value})}
									rows="6"
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
								/>
							) : (
								<div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg text-justify text-sm">
									{product.description || 'توضیحات محصول در دسترس نیست.'}
								</div>
							)}
						</div>
					</div>

					{/* Product Stats */}
					<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-900">{product.rating?.toFixed(1) || '4.5'}</div>
							<div className="text-sm text-gray-600">امتیاز</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-900">{product.reviews_count || 0}</div>
							<div className="text-sm text-gray-600">نظر</div>
						</div>
					</div>

					{/* Product Attributes */}
					{product.base_product_data?.attributes && (
						<div>
							<h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">مشخصات فنی</h3>
							<div className="space-y-2">
								{Object.entries(product.base_product_data.attributes).map(([key, value]) => (
									<div key={key} className="flex justify-between py-2 border-b border-gray-200">
										<span className="text-gray-600 text-sm md:text-base">{key}:</span>
										<span className="text-gray-900 font-medium text-sm md:text-base">
											{typeof value === 'object' && value !== null ? (
												typeof value.length !== 'undefined' && typeof value.width !== 'undefined' && typeof value.height !== 'undefined' ? (
													`${value.length} × ${value.width} × ${value.height} سانتی‌متر`
												) : (
													JSON.stringify(value)
												)
											) : (
												String(value || 'نامشخص')
											)}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Cancel Edit Mode */}
					{editMode && (
						<button
							onClick={() => {
								setEditMode(false);
								setEditData({
									price: product.price,
									stock: product.stock,
									description: product.description
								});
							}}
							className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							انصراف
						</button>
					)}
				</div>
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
		</div>
	);
};

export default SellerProductDetail;