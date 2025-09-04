import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

const LoginRegisterPage = () => {
	const [mode, setMode] = useState("login");
	const [phoneOrEmail, setPhoneOrEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const toggleMode = () => {
		setMode((prevMode) => (prevMode === "login" ? "register" : "login"));
	};

	const { loginUser, isDemoMode } = useContext(AuthContext);

	const handleSubmit = async () => {
		// Demo mode notification
		if (isDemoMode) {
			setLoading(true);
			
			// Show demo notification
			const demoMessage = mode === "register" 
				? "در حالت دمو، ثبت‌نام شبیه‌سازی شد. شما اکنون می‌تونید از تمام امکانات استفاده کنید."
				: "در حالت دمو، ورود شبیه‌سازی شد. شما اکنون می‌تونید از تمام امکانات استفاده کنید.";
			
			setTimeout(() => {
				setLoading(false);
				alert(demoMessage);
				
				// Mock successful login
				loginUser(phoneOrEmail || "demo_user", password);
				
				// Navigate to intended page or home
				const returnTo = location.state?.returnTo;
				if (returnTo) {
					navigate(returnTo);
				} else {
					navigate("/");
				}
			}, 1000); // Simulate loading time
			
			return;
		}

		// Basic validation for demo purposes
		if (!phoneOrEmail || !password) {
			alert("لطفا شماره موبایل و رمز عبور را وارد کنید");
			return;
		}

		if (mode === "register" && password !== confirmPassword) {
			alert("رمز عبور و تأیید آن یکسان نیست.");
			return;
		}

		setLoading(true);
		
		// In demo mode, always succeed
		try {
			const result = await loginUser(phoneOrEmail, password);
			if (result.success) {
				const returnTo = location.state?.returnTo;
				if (returnTo) {
					navigate(returnTo);
				} else {
					navigate("/");
				}
			}
		} catch (error) {
			console.error("Demo login error:", error);
			alert("خطا در حالت دمو");
		} finally {
			setLoading(false);
		}
	};

	// Demo banner component
	const DemoBanner = () => (
		<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
			<div className="flex">
				<div className="flex-shrink-0">
					<svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
					</svg>
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium">حالت دمو</h3>
					<div className="mt-2 text-sm">
						<p>این یک نسخه دمو است. شما می‌توانید با هر شماره‌ای وارد شوید و از تمام امکانات استفاده کنید.</p>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<DemoBanner />
				
				{mode === "login" ? (
					<LoginUser
						handleVerification={handleSubmit}
						phoneOrEmail={phoneOrEmail}
						setPhoneOrEmail={setPhoneOrEmail}
						password={password}
						setPassword={setPassword}
						toggleMode={toggleMode}
						loading={loading}
					/>
				) : (
					<RegisterUser
						handleVerification={handleSubmit}
						phoneOrEmail={phoneOrEmail}
						setPhoneOrEmail={setPhoneOrEmail}
						password={password}
						setPassword={setPassword}
						confirmPassword={confirmPassword}
						setConfirmPassword={setConfirmPassword}
						toggleMode={toggleMode}
						loading={loading}
					/>
				)}
				
				{/* Demo role switcher */}
				<div className="mt-6 bg-white p-4 rounded-lg shadow">
					<h4 className="text-sm font-medium text-gray-900 mb-3">تغییر نقش در حالت دمو:</h4>
					<div className="flex space-x-2 space-x-reverse">
						<button
							onClick={() => {
								const { switchDemoRole } = useContext(AuthContext);
								if (switchDemoRole) switchDemoRole('user');
							}}
							className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
						>
							کاربر عادی
						</button>
						<button
							onClick={() => {
								const { switchDemoRole } = useContext(AuthContext);
								if (switchDemoRole) switchDemoRole('seller');
							}}
							className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
						>
							فروشنده
						</button>
						<button
							onClick={() => {
								const { switchDemoRole } = useContext(AuthContext);
								if (switchDemoRole) switchDemoRole('admin');
							}}
							className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
						>
							ادمین
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginRegisterPage;