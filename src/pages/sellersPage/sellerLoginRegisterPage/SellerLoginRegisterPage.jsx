import { useState, useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import supportLogo from "../../../assets/SellerSignIn.c1fdcd84.png";
import digisupportLogo from "../../../assets/digidownload.png";

const RegisterSeller = ({
	handleVerification,
	phoneOrEmail,
	setPhoneOrEmail,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	toggleMode,
	nationalCode,
	setNationalCode,
	shabaNumber,
	setShabaNumber,
	storeName,
	setStoreName,
	storeAddress,
	setStoreAddress,
	loading
}) => {
	return (
		<div className="flex justify-center items-center w-full min-h-screen relative p-4">
			{/* Demo Banner */}
			<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60 w-full max-w-md">
				<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
							</svg>
						</div>
						<div className="mr-2">
							<h3 className="text-xs font-medium">حالت دمو - ثبت نام فروشنده</h3>
							<div className="mt-1 text-xs">
								<p>تمام فیلدها اختیاری هستند. فقط کلیک کنید!</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="border border-gray-300 rounded-2xl m-auto p-6 flex flex-col justify-center items-center w-full max-w-2xl z-50 relative bg-white shadow-lg mt-16">
				<div className="align-right w-full my-5">
					<p className="text-2xl font-bold text-[#1bb1d4]">
						ثبت نام فروشنده (دمو)
					</p>
				</div>
				<div className="text-gray-600 text-base/7 w-full">
					<p>سلام!</p>
					<p>
						لطفا مشخصات خود را وارد کنید (در حالت دمو همه فیلدها اختیاری هستند)
					</p>
				</div>
				<div className="w-full m-6 space-y-4">
					{/* Phone Number */}
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label
							htmlFor="phone-number"
							className="md:w-32 text-sm font-medium"
						>
							شماره موبایل :
						</label>
						<input
							type="text"
							name="phone-number"
							id="phone-number"
							value={phoneOrEmail}
							onChange={(e) =>
								setPhoneOrEmail(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-base outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="09123456789 (اختیاری در دمو)"
						/>
					</div>

					{/* Password */}
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label
							htmlFor="password"
							className="md:w-32 text-sm font-medium"
						>
							رمز عبور :
						</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-base outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="رمز عبور (اختیاری در دمو)"
						/>
					</div>

					{/* Confirm Password */}
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label
							htmlFor="confirm-password"
							className="md:w-32 text-sm font-medium"
						>
							تکرار رمز :
						</label>
						<input
							type="password"
							name="confirm-password"
							id="confirm-password"
							value={confirmPassword}
							onChange={(e) =>
								setConfirmPassword(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-base outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="تکرار رمز عبور (اختیاری در دمو)"
						/>
					</div>

					{/* National Code */}
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label
							htmlFor="national-id"
							className="md:w-32 text-sm font-medium"
						>
							کدملی :
						</label>
						<input
							type="text"
							name="national-id"
							id="national-id"
							value={nationalCode}
							onChange={(e) =>
								setNationalCode(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-base outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="کد ملی (اختیاری در دمو)"
						/>
					</div>

					{/* SHABA Number */}
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label
							htmlFor="shaba-number"
							className="md:w-32 text-sm font-medium"
						>
							شماره شبا :
						</label>
						<input
							type="text"
							name="shaba-number"
							id="shaba-number"
							value={shabaNumber}
							onChange={(e) =>
								setShabaNumber(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-base outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="XXXX-XXXX-XXXX-XXXX (اختیاری در دمو)"
						/>
					</div>

					{/* Store Name */}
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label
							htmlFor="store-name"
							className="md:w-32 text-sm font-medium"
						>
							نام فروشگاه :
						</label>
						<input
							type="text"
							name="store-name"
							id="store-name"
							value={storeName}
							onChange={(e) =>
								setStoreName(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-base outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="نام فروشگاه (اختیاری در دمو)"
						/>
					</div>

					{/* Store Address */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="address"
							className="text-sm font-medium"
						>
							آدرس :
						</label>
						<textarea
							name="address"
							id="address"
							value={storeAddress}
							onChange={(e) =>
								setStoreAddress(
									e.target.value
								)
							}
							className="w-full rounded-lg resize-none p-2 text-base outline-none bg-gray-50 h-24 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="آدرس فروشگاه (اختیاری در دمو)"
						/>
					</div>
				</div>
				
				<div className="w-full flex items-center justify-center">
					<button
						className="text-white bg-[#1bb1d4] w-full md:w-auto px-8 rounded-lg h-12 hover:cursor-pointer disabled:bg-gray-400 hover:bg-[#1aa0c4] transition-colors"
						onClick={handleVerification}
						disabled={loading}
					>
						<p>{loading ? "در حال ثبت..." : "ثبت نام در حالت دمو"}</p>
					</button>
				</div>
				
				<div className="mt-6 text-[13px] font-medium text-center">
					<p className="text-gray-500">
						ثبت نام شما به معنای پذیرش شرایط{" "}
						<span className="text-blue-500">
							دیجی کالا
						</span>{" "}
						و{" "}
						<span className="text-blue-500">
							قوانین حریم خصوصی
						</span>{" "}
						است
					</p>
				</div>
				
				<div className="mt-6 text-[12px] font-medium text-center">
					<p className="text-gray-500">
						در دیجی کالا حساب دارید؟
						<span
							className="text-[#1bb1d4] font-semibold text-base cursor-pointer mr-2"
							onClick={toggleMode}
						>
							وارد شوید
						</span>
					</p>
				</div>
				
				{/* Background Images - Hidden on mobile for better UX */}
				<div className="lg:block absolute left-5 top-10  flex-col-reverse gap-4 items-center justify-center">
					<img
						src={supportLogo}
						alt=""
						className="w-80"
					/>
					<img
						src={digisupportLogo}
						alt=""
						className="w-30"
					/>
				</div>
			</div>
		</div>
	);
};

const LoginSeller = ({
	handleVerification,
	phoneOrEmail,
	setPhoneOrEmail,
	password,
	setPassword,
	toggleMode,
	loading
}) => {
	return (
		<div className="flex justify-center items-center w-full min-h-screen p-4">
			{/* Demo Banner */}
			<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60 w-full max-w-md">
				<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
							</svg>
						</div>
						<div className="mr-2">
							<h3 className="text-xs font-medium">حالت دمو - ورود فروشنده</h3>
							<div className="mt-1 text-xs">
								<p>فیلدها اختیاری هستند. فقط کلیک کنید!</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="relative border border-gray-300 rounded-2xl m-auto p-6 flex flex-col justify-center items-center w-full max-w-lg z-50 bg-white shadow-lg mt-16">
				<div className="content-baseline w-full my-5">
					<p className="text-2xl font-semibold text-[#1bb1d4]">
						ورود فروشنده (دمو)
					</p>
				</div>
				<div className="text-gray-600 text-base/7 w-full">
					<p>سلام!</p>
					<p>
						لطفا شماره موبایل و رمز عبور خود را وارد کنید (در حالت دمو اختیاری است)
					</p>
				</div>
				<div className="w-full my-6 space-y-4">
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label htmlFor="phoneOrEmail" className="md:w-24 text-sm font-medium">شماره شما :</label>
						<input
							type="text"
							name="phoneOrEmail"
							id="phoneOrEmail"
							value={phoneOrEmail}
							onChange={(e) =>
								setPhoneOrEmail(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-sm outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="09123456789 (اختیاری در دمو)"
						/>
					</div>
					
					<div className="flex flex-col md:flex-row md:items-center gap-2">
						<label htmlFor="password" className="md:w-24 text-sm font-medium">رمز عبور :</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target.value
								)
							}
							className="flex-1 rounded-lg p-2 text-sm outline-none bg-gray-50 h-12 border border-transparent focus:border-[#048e73] focus:text-gray-500 transition-colors duration-200"
							placeholder="رمز عبور (اختیاری در دمو)"
						/>
					</div>
				</div>
				
				<div className="w-full flex items-center justify-center">
					<button
						className="text-white bg-[#1bb1d4] w-full md:w-auto px-8 rounded-lg h-12 hover:cursor-pointer disabled:bg-gray-400 hover:bg-[#1aa0c4] transition-colors"
						onClick={handleVerification}
						disabled={loading}
					>
						<p>{loading ? "در حال ورود..." : "ورود در حالت دمو"}</p>
					</button>
				</div>

				<div className="mt-6 text-[12px] font-medium text-center">
					<p className="text-gray-500">
						در دیجی کالا حساب ندارید؟
						<span
							className="text-[#048e73] font-semibold text-base cursor-pointer mr-2"
							onClick={toggleMode}
						>
							ثبت نام کنید
						</span>
					</p>
				</div>
				
				{/* Background Images - Hidden on mobile for better UX */}
				<div className="lg:block absolute -left-10 top-10 flex flex-col-reverse gap-4 items-center justify-center">
					<img
						src={supportLogo}
						alt=""
						className="w-100"
					/>
					<img
						src={digisupportLogo}
						alt=""
						className="w-30"
					/>
				</div>
			</div>
		</div>
	);
};

const SellerLoginRegisterPage = () => {
	const navigate = useNavigate();
	const [phoneOrEmail, setPhoneOrEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [nationalCode, setNationalCode] = useState("");
	const [shabaNumber, setShabaNumber] = useState("");
	const [storeName, setStoreName] = useState("");
	const [storeAddress, setStoreAddress] = useState("");
	const [mode, setMode] = useState("login");
	const [loading, setLoading] = useState(false);
	
	const toggleMode = () => {
		setMode((prev) => (prev === "login" ? "register" : "login"));
	};

	const { loginUser, switchDemoRole, isDemoMode } = useContext(AuthContext);

	const handleSubmit = async () => {
		if (isDemoMode) {
			setLoading(true);
			
			const demoMessage = mode === "register" 
				? "در حالت دمو، ثبت‌نام فروشنده شبیه‌سازی شد. شما اکنون به عنوان فروشنده دسترسی دارید."
				: "در حالت دمو، ورود فروشنده شبیه‌سازی شد. شما اکنون به پنل فروشنده دسترسی دارید.";
			
			setTimeout(() => {
				setLoading(false);
				alert(demoMessage);
				
				if (switchDemoRole) switchDemoRole('seller');
				loginUser(phoneOrEmail || "seller_demo", password || "demo");
				
				navigate("/seller-profile");
			}, 1000);
			
			return;
		}

		if (!phoneOrEmail || !password) {
			alert("لطفا شماره موبایل و رمز عبور را وارد کنید");
			return;
		}

		if (mode === "register") {
			if (password !== confirmPassword) {
				alert("رمز عبور و تایید آن یکسان نیست.");
				return;
			}
			
			if (!nationalCode || !shabaNumber || !storeName || !storeAddress) {
				alert("لطفا همه فیلدهای ضروری را پر کنید");
				return;
			}
		}

		// This would be the original API logic (not used in demo mode)
		setLoading(true);
		try {
			// Simulate API calls in demo mode
			const result = await loginUser(phoneOrEmail, password);
			if (result.success) {
				if (switchDemoRole) switchDemoRole('seller');
				navigate("/seller-profile");
			}
		} catch (error) {
			console.error("Demo seller login error:", error);
			alert("خطا در حالت دمو");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{mode === "login" ? (
				<LoginSeller
					handleVerification={handleSubmit}
					phoneOrEmail={phoneOrEmail}
					setPhoneOrEmail={setPhoneOrEmail}
					password={password}
					setPassword={setPassword}
					toggleMode={toggleMode}
					loading={loading}
				/>
			) : (
				<RegisterSeller
					handleVerification={handleSubmit}
					phoneOrEmail={phoneOrEmail}
					setPhoneOrEmail={setPhoneOrEmail}
					password={password}
					setPassword={setPassword}
					confirmPassword={confirmPassword}
					setConfirmPassword={setConfirmPassword}
					nationalCode={nationalCode}
					setNationalCode={setNationalCode}
					shabaNumber={shabaNumber}
					setShabaNumber={setShabaNumber}
					storeName={storeName}
					setStoreName={setStoreName}
					storeAddress={storeAddress}
					setStoreAddress={setStoreAddress}
					toggleMode={toggleMode}
					loading={loading}
				/>
			)}

			{/* Demo navigation helper */}
			<div className="fixed bottom-4 right-4 z-50">
				<div className="bg-white p-4 rounded-lg shadow-lg border max-w-xs">
					<h4 className="text-sm font-medium text-gray-900 mb-3">دسترسی سریع در حالت دمو:</h4>
					<div className="space-y-2">
						<button
							onClick={() => navigate("/seller-profile")}
							className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						>
							ورود مستقیم به پنل فروشنده
						</button>
						<button
							onClick={() => navigate("/")}
							className="w-full px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
						>
							بازگشت به صفحه اصلی
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerLoginRegisterPage;