import { useState, useEffect, useContext } from "react";
import {
	FaPlus,
	FaTimes,
	FaSearch,
	FaArrowLeft,
	FaCheckCircle,
} from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit, MdShoppingCart, MdWarning } from "react-icons/md";
import { AuthContext } from "../../../auth/AuthContext";
import { getStaticCategories, getStaticProducts, searchStaticProducts } from "../../../data/staticData.js";

const CreateProduct = () => {
	const [selectedExistingProduct, setSelectedExistingProduct] = useState(null);
	const { authTokens, isDemoMode } = useContext(AuthContext);
	const [currentWorkflow, setCurrentWorkflow] = useState("search");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [offerData, setOfferData] = useState({
		price: "",
		discountPrice: "",
		stock: "",
		condition: "new",
		warranty: "",
		description: "",
		shippingTime: "1-3",
	});
	const [offerErrors, setOfferErrors] = useState({});
	const [currentStep, setCurrentStep] = useState(1);
	const [productName, setProductName] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [category, setCategory] = useState("");
	const [subcategory, setSubcategory] = useState("");
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [basePrice, setBasePrice] = useState("");
	const [discountPrice, setDiscountPrice] = useState("");
	const [discountPercent, setDiscountPercent] = useState("");
	const [stock, setStock] = useState("");
	const [sku, setSku] = useState("");
	const [weight, setWeight] = useState("");
	const [dimensions, setDimensions] = useState({
		length: "",
		width: "",
		height: "",
	});
	const [productImages, setProductImages] = useState([]);
	const [modalImage, setModalImage] = useState(null);
	const [attributes, setAttributes] = useState([]);
	const [newAttribute, setNewAttribute] = useState({
		name: "",
		value: "",
	});
	const [variants, setVariants] = useState([]);
	const [newVariant, setNewVariant] = useState({
		type: "",
		value: "",
		price: "",
		stock: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [categoriesError, setCategoriesError] = useState(null);
	const [subcategories, setSubcategories] = useState([]);
	const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

	const inputClasses = "bg-gray-50 w-full rounded-lg h-10 outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 px-3 ";
	const textareaClasses = "bg-gray-50 w-full rounded-lg outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 px-3 py-2 resize-none";

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		setCategoriesLoading(true);
		setCategoriesError(null);
		try {
			const allCategories = getStaticCategories();
			setCategories(allCategories);
		} catch (error) {
			console.error("Error loading categories from static data:", error);
			setCategoriesError("خطا در بارگذاری دسته‌بندی‌ها از داده‌های استاتیک");
			setCategories([]);
		} finally {
			setCategoriesLoading(false);
		}
	};

	const loadSubcategories = async (categoryId) => {
		if (!categoryId) {
			setSubcategories([]);
			return;
		}
		setSubcategoriesLoading(true);
		try {
			const allCategories = getStaticCategories();
			const selectedCategory = allCategories.find(cat => cat.id === categoryId);
			if (selectedCategory && selectedCategory.children) {
				setSubcategories(selectedCategory.children);
			} else {
				setSubcategories([]);
			}
		} catch (error) {
			console.error("Error loading subcategories from static data:", error);
			setSubcategories([]);
		} finally {
			setSubcategoriesLoading(false);
		}
	};

	const handleCategoryChange = (selectedCategoryName) => {
		setCategory(selectedCategoryName);
		setSubcategory("");
		const selectedCategoryObj = categories.find(cat => cat.name === selectedCategoryName);
		if (selectedCategoryObj) {
			loadSubcategories(selectedCategoryObj.id);
		} else {
			setSubcategories([]);
		}
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setSearchLoading(true);
		try {
			// Use static products for search
			const results = searchStaticProducts(searchQuery);
			setSearchResults(results.slice(0, 20)); // Limit to 20 results
		} catch (error) {
			console.error("Search error with static data:", error);
			alert("خطا در جستجو در داده‌های استاتیک");
			setSearchResults([]);
		} finally {
			setSearchLoading(false);
		}
	};

	const handleCreateOffer = async () => {
		// Validate offer data
		if (!offerData.price || !offerData.stock) {
			setOfferErrors({
				price: !offerData.price ? "قیمت الزامی است" : "",
				stock: !offerData.stock ? "موجودی الزامی است" : ""
			});
			return;
		}

		setLoading(true);
		try {
			if (isDemoMode) {
				// Simulate offer creation
				await new Promise(resolve => setTimeout(resolve, 1000));
				alert("در حالت دمو، پیشنهاد شما با موفقیت ایجاد شد!");
				// Reset form
				setSelectedExistingProduct(null);
				setOfferData({
					price: "",
					discountPrice: "",
					stock: "",
					condition: "new",
					warranty: "",
					description: "",
					shippingTime: "1-3",
				});
				setCurrentWorkflow("search");
			}
		} catch (error) {
			console.error("Demo offer creation:", error);
			alert("خطا در حالت دمو");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateProduct = async () => {
		// Validate required fields
		const requiredFields = {
			productName: "نام محصول الزامی است",
			category: "دسته‌بندی الزامی است",
			basePrice: "قیمت الزامی است",
			stock: "موجودی الزامی است"
		};

		const newErrors = {};
		Object.entries(requiredFields).forEach(([field, message]) => {
			const fieldValue = eval(field);
			if (!fieldValue) {
				newErrors[field] = message;
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		try {
			if (isDemoMode) {
				// Simulate product creation
				await new Promise(resolve => setTimeout(resolve, 1500));
				alert("در حالت دمو، محصول شما با موفقیت ایجاد شد!");
				// Reset form
				resetForm();
			}
		} catch (error) {
			console.error("Demo product creation:", error);
			alert("خطا در حالت دمو");
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setProductName("");
		setProductDescription("");
		setCategory("");
		setSubcategory("");
		setBrand("");
		setModel("");
		setBasePrice("");
		setDiscountPrice("");
		setDiscountPercent("");
		setStock("");
		setSku("");
		setWeight("");
		setDimensions({ length: "", width: "", height: "" });
		setProductImages([]);
		setAttributes([]);
		setVariants([]);
		setErrors({});
		setCurrentStep(1);
	};

	const addAttribute = () => {
		if (newAttribute.name && newAttribute.value) {
			setAttributes([...attributes, { ...newAttribute, id: Date.now() }]);
			setNewAttribute({ name: "", value: "" });
		}
	};

	const removeAttribute = (id) => {
		setAttributes(attributes.filter(attr => attr.id !== id));
	};

	const addVariant = () => {
		if (newVariant.type && newVariant.value && newVariant.price && newVariant.stock) {
			setVariants([...variants, { ...newVariant, id: Date.now() }]);
			setNewVariant({ type: "", value: "", price: "", stock: "" });
		}
	};

	const removeVariant = (id) => {
		setVariants(variants.filter(variant => variant.id !== id));
	};

	// Demo Banner Component
	const DemoBanner = () => (
		<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded ">
			<div className="flex">
				<div className="flex-shrink-0">
					<FaCheckCircle className="h-5 w-5 text-green-500" />
				</div>
				<div className="mr-3">
					<h3 className="text-[12px] md:text-sm font-medium">حالت دمو - ایجاد محصول</h3>
					<div className="mt-2 text-[12px] md:text-sm">
						<p>تمام عملیات ایجاد محصول در این حالت شبیه‌سازی می‌شود.</p>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="max-w-6xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm min-h-screen">
			<DemoBanner />
			
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-[12px] md:text-2xl font-bold text-gray-800">ایجاد محصول جدید</h1>
				<div className="flex gap-1 space-x-2 space-x-reverse">
					<button
						onClick={() => setCurrentWorkflow("search")}
						className={`px-2 py-2 text-[10px] md:text-sm rounded-lg transition-colors ${
							currentWorkflow === "search" 
								? "bg-blue-600 text-white" 
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						جستجو در محصولات موجود
					</button>
					<button
						onClick={() => setCurrentWorkflow("create")}
						className={`px-2 py-2 text-[10px] md:text-sm rounded-lg transition-colors ${
							currentWorkflow === "create" 
								? "bg-green-600 text-white" 
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						ایجاد محصول جدید
					</button>
				</div>
			</div>

			{/* Search Existing Products Workflow */}
			{currentWorkflow === "search" && (
				<div className="space-y-6">
					<div className="bg-blue-50 p-4 rounded-lg">
						<h2 className="text-[13px] md:text-lg font-semibold mb-4 text-blue-800">جستجو در محصولات موجود</h2>
						<div className="flex gap-4">
							<div className="flex-1">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
									placeholder="نام محصول، برند یا مدل را جستجو کنید..."
									className={inputClasses}
								/>
							</div>
							<button
								onClick={handleSearch}
								disabled={searchLoading}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2 text-[12px] "
							>
								{searchLoading ? (
									<div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
								) : (
									<FaSearch />
								)}
								جستجو
							</button>
						</div>
					</div>

					{/* Search Results */}
					{searchResults.length > 0 && (
						<div className="space-y-4">
							<h3 className="text-[12px] md:text-lg font-semibold">نتایج جستجو ({searchResults.length} محصول)</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{searchResults.map((product) => (
									<div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
										{product.main_image && (
											<img 
												src={product.main_image} 
												alt={product.name}
												className="w-full h-32 object-cover rounded mb-3"
												onError={(e) => { e.target.style.display = 'none' }}
											/>
										)}
										<h4 className="font-medium text-gray-800 mb-2">{product.name}</h4>
										<p className="text-sm text-gray-600 mb-2">{product.category_name}</p>
										<p className="text-green-600 font-semibold mb-3">
											{product.price.toLocaleString()} تومان
										</p>
										<button
											onClick={() => {
												setSelectedExistingProduct(product);
												setCurrentWorkflow("offer");
											}}
											className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
										>
											ایجاد پیشنهاد
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{searchQuery && searchResults.length === 0 && !searchLoading && (
						<div className="text-center py-8">
							<MdWarning className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
							<p className="text-gray-600">محصولی با این مشخصات یافت نشد</p>
							<button
								onClick={() => setCurrentWorkflow("create")}
								className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
							>
								ایجاد محصول جدید
							</button>
						</div>
					)}
				</div>
			)}

			{/* Create Offer Workflow */}
			{currentWorkflow === "offer" && selectedExistingProduct && (
				<div className="space-y-6">
					<div className="flex items-center gap-4 mb-6">
						<button
							onClick={() => {
								setCurrentWorkflow("search");
								setSelectedExistingProduct(null);
							}}
							className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
						>
							<FaArrowLeft />
							بازگشت
						</button>
						<h2 className="text-lg font-semibold">ایجاد پیشنهاد برای: {selectedExistingProduct.name}</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Product Info */}
						<div className="bg-gray-50 p-4 rounded-lg">
							{selectedExistingProduct.main_image && (
								<img 
									src={selectedExistingProduct.main_image} 
									alt={selectedExistingProduct.name}
									className="w-full h-48 object-cover rounded mb-4"
									onError={(e) => { e.target.style.display = 'none' }}
								/>
							)}
							<h3 className="font-semibold mb-2">{selectedExistingProduct.name}</h3>
							<p className="text-sm text-gray-600 mb-2">{selectedExistingProduct.description}</p>
							<p className="text-sm text-blue-600">دسته‌بندی: {selectedExistingProduct.category_name}</p>
						</div>

						{/* Offer Form */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									قیمت پیشنهادی (تومان) *
								</label>
								<input
									type="number"
									value={offerData.price}
									onChange={(e) => setOfferData({...offerData, price: e.target.value})}
									className={inputClasses}
									placeholder="مثال: 1500000"
								/>
								{offerErrors.price && <p className="text-red-500 text-xs mt-1">{offerErrors.price}</p>}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									قیمت با تخفیف (اختیاری)
								</label>
								<input
									type="number"
									value={offerData.discountPrice}
									onChange={(e) => setOfferData({...offerData, discountPrice: e.target.value})}
									className={inputClasses}
									placeholder="مثال: 1350000"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									موجودی *
								</label>
								<input
									type="number"
									value={offerData.stock}
									onChange={(e) => setOfferData({...offerData, stock: e.target.value})}
									className={inputClasses}
									placeholder="تعداد موجود"
								/>
								{offerErrors.stock && <p className="text-red-500 text-xs mt-1">{offerErrors.stock}</p>}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									وضعیت کالا
								</label>
								<select
									value={offerData.condition}
									onChange={(e) => setOfferData({...offerData, condition: e.target.value})}
									className={inputClasses}
								>
									<option value="new">نو</option>
									<option value="like-new">در حد نو</option>
									<option value="used">استفاده شده</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									گارانتی
								</label>
								<input
									type="text"
									value={offerData.warranty}
									onChange={(e) => setOfferData({...offerData, warranty: e.target.value})}
									className={inputClasses}
									placeholder="مثال: 18 ماه گارانتی شرکتی"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									زمان ارسال
								</label>
								<select
									value={offerData.shippingTime}
									onChange={(e) => setOfferData({...offerData, shippingTime: e.target.value})}
									className={inputClasses}
								>
									<option value="1-3">1 تا 3 روز کاری</option>
									<option value="3-7">3 تا 7 روز کاری</option>
									<option value="7-14">1 تا 2 هفته</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									توضیحات اضافی
								</label>
								<textarea
									value={offerData.description}
									onChange={(e) => setOfferData({...offerData, description: e.target.value})}
									className={textareaClasses}
									rows="3"
									placeholder="توضیحات اضافی درباره محصول..."
								/>
							</div>

							<button
								onClick={handleCreateOffer}
								disabled={loading}
								className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
							>
								{loading ? (
									<div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
								) : (
									<FaCheckCircle />
								)}
								{loading ? "در حال ایجاد..." : "ایجاد پیشنهاد"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Create New Product Workflow */}
			{currentWorkflow === "create" && (
				<div className="space-y-6">
					{/* Progress Indicator */}
					<div className="flex items-center justify-between mb-8">
						{[1, 2, 3, 4].map((step) => (
							<div key={step} className="flex items-center">
								<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
									step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
								}`}>
									{step}
								</div>
								{step < 4 && (
									<div className={`w-12 md:w-20 h-1 ${
										step < currentStep ? "bg-blue-600" : "bg-gray-200"
									}`}></div>
								)}
							</div>
						))}
					</div>

					{/* Step 1: Basic Info */}
					{currentStep === 1 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold">مرحله 1: اطلاعات پایه محصول</h2>
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										نام محصول *
									</label>
									<input
										type="text"
										value={productName}
										onChange={(e) => setProductName(e.target.value)}
										className={inputClasses}
										placeholder="نام کامل محصول"
									/>
									{errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										دسته‌بندی *
									</label>
									{categoriesLoading ? (
										<div className="animate-pulse bg-gray-200 rounded-lg h-10"></div>
									) : (
										<select
											value={category}
											onChange={(e) => handleCategoryChange(e.target.value)}
											className={inputClasses}
										>
											<option value="">انتخاب دسته‌بندی</option>
											{categories.filter(cat => cat.parent === null).map((cat) => (
												<option key={cat.id} value={cat.name}>
													{cat.name}
												</option>
											))}
										</select>
									)}
									{errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
								</div>

								{category && subcategories.length > 0 && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											زیردسته
										</label>
										<select
											value={subcategory}
											onChange={(e) => setSubcategory(e.target.value)}
											className={inputClasses}
										>
											<option value="">انتخاب زیردسته</option>
											{subcategories.map((subcat) => (
												<option key={subcat.id} value={subcat.name}>
													{subcat.name}
												</option>
											))}
										</select>
									</div>
								)}

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										برند
									</label>
									<input
										type="text"
										value={brand}
										onChange={(e) => setBrand(e.target.value)}
										className={inputClasses}
										placeholder="نام برند"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										مدل
									</label>
									<input
										type="text"
										value={model}
										onChange={(e) => setModel(e.target.value)}
										className={inputClasses}
										placeholder="مدل محصول"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										SKU
									</label>
									<input
										type="text"
										value={sku}
										onChange={(e) => setSku(e.target.value)}
										className={inputClasses}
										placeholder="کد محصول"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									توضیحات محصول
								</label>
								<textarea
									value={productDescription}
									onChange={(e) => setProductDescription(e.target.value)}
									className={textareaClasses}
									rows="4"
									placeholder="توضیح کاملی از محصول..."
								/>
							</div>

							<div className="flex justify-end">
								<button
									onClick={() => setCurrentStep(2)}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									مرحله بعد
								</button>
							</div>
						</div>
					)}

					{/* Step 2: Pricing & Inventory */}
					{currentStep === 2 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold">مرحله 2: قیمت و موجودی</h2>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										قیمت پایه (تومان) *
									</label>
									<input
										type="number"
										value={basePrice}
										onChange={(e) => setBasePrice(e.target.value)}
										className={inputClasses}
										placeholder="1500000"
									/>
									{errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										قیمت با تخفیف (تومان)
									</label>
									<input
										type="number"
										value={discountPrice}
										onChange={(e) => setDiscountPrice(e.target.value)}
										className={inputClasses}
										placeholder="1350000"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										درصد تخفیف
									</label>
									<input
										type="number"
										value={discountPercent}
										onChange={(e) => setDiscountPercent(e.target.value)}
										className={inputClasses}
										placeholder="10"
										max="100"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										موجودی *
									</label>
									<input
										type="number"
										value={stock}
										onChange={(e) => setStock(e.target.value)}
										className={inputClasses}
										placeholder="50"
									/>
									{errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										وزن (گرم)
									</label>
									<input
										type="number"
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
										className={inputClasses}
										placeholder="500"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-4">
									ابعاد (سانتی‌متر)
								</label>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className="block text-xs text-gray-500 mb-1">طول</label>
										<input
											type="number"
											value={dimensions.length}
											onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
											className={inputClasses}
											placeholder="20"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-500 mb-1">عرض</label>
										<input
											type="number"
											value={dimensions.width}
											onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
											className={inputClasses}
											placeholder="15"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-500 mb-1">ارتفاع</label>
										<input
											type="number"
											value={dimensions.height}
											onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
											className={inputClasses}
											placeholder="5"
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<button
									onClick={() => setCurrentStep(1)}
									className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
								>
									مرحله قبل
								</button>
								<button
									onClick={() => setCurrentStep(3)}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									مرحله بعد
								</button>
							</div>
						</div>
					)}

					{/* Step 3: Attributes & Variants */}
					{currentStep === 3 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold">مرحله 3: ویژگی‌ها و تنوع‌ها</h2>
							
							{/* Attributes */}
							<div>
								<h3 className="text-lg font-medium mb-4">ویژگی‌های محصول</h3>
								<div className="flex gap-4 mb-4">
									<input
										type="text"
										value={newAttribute.name}
										onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
										className={inputClasses}
										placeholder="نام ویژگی (مثل: رنگ)"
									/>
									<input
										type="text"
										value={newAttribute.value}
										onChange={(e) => setNewAttribute({...newAttribute, value: e.target.value})}
										className={inputClasses}
										placeholder="مقدار (مثل: قرمز)"
									/>
									<button
										onClick={addAttribute}
										className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
									>
										<IoMdAdd />
										افزودن
									</button>
								</div>

								{attributes.length > 0 && (
									<div className="space-y-2">
										{attributes.map((attr) => (
											<div key={attr.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
												<span><strong>{attr.name}:</strong> {attr.value}</span>
												<button
													onClick={() => removeAttribute(attr.id)}
													className="text-red-600 hover:text-red-800"
												>
													<MdDelete />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Variants */}
							<div>
								<h3 className="text-lg font-medium mb-4">تنوع‌های محصول</h3>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
									<input
										type="text"
										value={newVariant.type}
										onChange={(e) => setNewVariant({...newVariant, type: e.target.value})}
										className={inputClasses}
										placeholder="نوع (مثل: سایز)"
									/>
									<input
										type="text"
										value={newVariant.value}
										onChange={(e) => setNewVariant({...newVariant, value: e.target.value})}
										className={inputClasses}
										placeholder="مقدار (مثل: L)"
									/>
									<input
										type="number"
										value={newVariant.price}
										onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
										className={inputClasses}
										placeholder="قیمت اضافی"
									/>
									<input
										type="number"
										value={newVariant.stock}
										onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
										className={inputClasses}
										placeholder="موجودی"
									/>
								</div>
								<button
									onClick={addVariant}
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mb-4"
								>
									<IoMdAdd />
									افزودن تنوع
								</button>

								{variants.length > 0 && (
									<div className="space-y-2">
										{variants.map((variant) => (
											<div key={variant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
												<span>
													<strong>{variant.type}:</strong> {variant.value} - 
													{variant.price ? ` +${Number(variant.price).toLocaleString()} تومان` : ' بدون اضافه قیمت'} - 
													موجودی: {variant.stock}
												</span>
												<button
													onClick={() => removeVariant(variant.id)}
													className="text-red-600 hover:text-red-800"
												>
													<MdDelete />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="flex justify-between">
								<button
									onClick={() => setCurrentStep(2)}
									className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
								>
									مرحله قبل
								</button>
								<button
									onClick={() => setCurrentStep(4)}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									مرحله بعد
								</button>
							</div>
						</div>
					)}

					{/* Step 4: Images & Final Review */}
					{currentStep === 4 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold">مرحله 4: تصاویر و بررسی نهایی</h2>
							
							{/* Image Upload Simulation */}
							<div>
								<h3 className="text-lg font-medium mb-4">تصاویر محصول</h3>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
									<div className="space-y-4">
										<MdShoppingCart className="w-16 h-16 mx-auto text-gray-400" />
										<p className="text-gray-600">در حالت دمو، آپلود تصاویر شبیه‌سازی می‌شود</p>
										<button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
											شبیه‌سازی آپلود تصاویر
										</button>
									</div>
								</div>
							</div>

							{/* Final Review */}
							<div>
								<h3 className="text-lg font-medium mb-4">بررسی نهایی</h3>
								<div className="bg-gray-50 p-6 rounded-lg space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-600">نام محصول:</p>
											<p className="font-medium">{productName || "نامشخص"}</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">دسته‌بندی:</p>
											<p className="font-medium">{category || "نامشخص"}</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">قیمت:</p>
											<p className="font-medium">
												{basePrice ? `${Number(basePrice).toLocaleString()} تومان` : "نامشخص"}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">موجودی:</p>
											<p className="font-medium">{stock || "نامشخص"}</p>
										</div>
									</div>
									
									{attributes.length > 0 && (
										<div>
											<p className="text-sm text-gray-600 mb-2">ویژگی‌ها:</p>
											<div className="flex flex-wrap gap-2">
												{attributes.map((attr) => (
													<span key={attr.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
														{attr.name}: {attr.value}
													</span>
												))}
											</div>
										</div>
									)}

									{variants.length > 0 && (
										<div>
											<p className="text-sm text-gray-600 mb-2">تنوع‌ها:</p>
											<div className="space-y-1">
												{variants.map((variant) => (
													<div key={variant.id} className="text-sm bg-white p-2 rounded">
														{variant.type}: {variant.value} - موجودی: {variant.stock}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="flex justify-between">
								<button
									onClick={() => setCurrentStep(3)}
									className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
								>
									مرحله قبل
								</button>
								<button
									onClick={handleCreateProduct}
									disabled={loading}
									className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center gap-2"
								>
									{loading ? (
										<div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
									) : (
										<FaCheckCircle />
									)}
									{loading ? "در حال ایجاد..." : "ایجاد محصول"}
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Demo Helper Actions */}
			<div className="mt-8 p-4 bg-blue-50 rounded-lg">
				<h4 className="text-sm font-medium text-blue-800 mb-3">عملیات سریع در حالت دمو:</h4>
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => {
							setProductName("محصول نمونه دمو");
							setCategory("الکترونیک");
							setBasePrice("1500000");
							setStock("25");
							setProductDescription("این یک محصول نمونه برای نمایش حالت دمو است.");
						}}
						className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
					>
						پر کردن فرم نمونه
					</button>
					<button
						onClick={resetForm}
						className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
					>
						پاک کردن فرم
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateProduct;