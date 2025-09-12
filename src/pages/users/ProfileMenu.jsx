import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { getStaticUserProfiles } from "../../data/staticData";
import { LuPencilLine } from "react-icons/lu";
import { FaShoppingBasket } from "react-icons/fa";
import { RiHomeSmile2Line } from "react-icons/ri";
import { PiHeartStraightBold } from "react-icons/pi";
import { FaStreetView } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import "./profileMenu.css";
import { IoMenu } from "react-icons/io5";

const menu = [
	{
		id: 1,
		title: "خلاصه فعالیت ها",
		url: "",
		icon: <RiHomeSmile2Line />,
	},
	{
		id: 2,
		title: "سفارش ها",
		url: "orders",
		icon: <FaShoppingBasket />,
	},
	{
		id: 3,
		title: "لیست های من",
		url: "lists",
		icon: <PiHeartStraightBold />,
	},
	{
		id: 4,
		title: "دیدگاه ها و پرسش ها",
		url: "comments",
		icon: <LuPencilLine />,
	},
	{
		id: 5,
		title: "آدرس های من",
		url: "addresses",
		icon: <FaStreetView />,
	},
	{
		id: 6,
		title: "پیام ها",
		url: "notifications",
		icon: <MdNotificationsNone />,
	},
	{
		id: 7,
		title: "اطلاعات حساب کاربری",
		url: "personal-info",
		icon: <BsPersonCircle />,
	},
];

const ProfileMenu = () => {
	const { user, authTokens, logoutUser, userRole, isDemoMode } = useContext(AuthContext);
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState(null);
	const [isSeller, setIsSeller] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const fetchUserInfo = async () => {
		if (isDemoMode) {
			// Use static data in demo mode
			try {
				const staticProfiles = getStaticUserProfiles();
				const userProfile = staticProfiles.find(p => p.user === user?.phone_number) || staticProfiles[0];
				
				setUserInfo({
					phone_number: user?.phone_number || '09123456789',
					full_name: userProfile?.full_name || user?.full_name || 'کاربر دمو',
					first_name: userProfile?.first_name || 'کاربر',
					last_name: userProfile?.last_name || 'دمو',
					email: userProfile?.email || 'demo@example.com',
					role: userRole || 'user'
				});

				// Set seller status based on role
				setIsSeller(userRole === 'seller' || userRole === 'admin');
			} catch (error) {
				console.error("Error loading static user info:", error);
				// Fallback mock data
				setUserInfo({
					phone_number: user?.phone_number || '09123456789',
					full_name: user?.full_name || 'کاربر دمو',
					first_name: 'کاربر',
					last_name: 'دمو',
					email: 'demo@example.com',
					role: userRole || 'user'
				});
				setIsSeller(userRole === 'seller' || userRole === 'admin');
			}
		} else {
			
			try {
				setUserInfo({
					phone_number: user?.phone_number,
					full_name: user?.full_name || 'کاربر'
				});
			} catch (error) {
				console.error("Error fetching user info:", error);
				setUserInfo({
					phone_number: user?.phone_number,
					full_name: user?.full_name || 'کاربر'
				});
			}
		}
	};

	const checkUserRole = async () => {
		if (isDemoMode) {
			// In demo mode, role is already available from context
			setIsSeller(userRole === 'seller' || userRole === 'admin');
		} else {
			// Original API call logic would go here
			try {
				// This would be the original role checking logic
				console.log('Non-demo role check not implemented');
			} catch (error) {
				console.error('Error checking role:', error);
			}
		}
	};

	const handleLogout = () => {
		if (isDemoMode) {
			// In demo mode, show confirmation
			const confirmLogout = window.confirm("در حالت دمو، آیا مایل به بازگشت به صفحه اصلی هستید؟");
			if (confirmLogout) {
				navigate('/');
			}
		} else {
			logoutUser();
			navigate('/');
		}
	};

	useEffect(() => {
		if (user) {
			checkUserRole();
			fetchUserInfo();
		}
	}, [user, userRole, isDemoMode]);

	return (
	<div className="md:menu md:border-1 md:border-gray-200 md:rounded-md md:m-6 p-2">
		{/* Sticky button that sticks to top when scrolling down */}
		<button 
			className="sticky top-0 z-10 rounded-lg border border-gray-300 text-gray-400 p-2 md:hidden  bg-white shadow-sm" 
			onClick={() => setIsMenuOpen(!isMenuOpen)}
		>
			<IoMenu size={20}/>
		</button>

		<div className="hidden md:block">
			{/* Demo Mode Indicator */}
			{isDemoMode && (
				<div className="hidden md:block md:mb-4 md:p-2 md:rounded md:text-center">
					<span className={`px-3 py-1 rounded-full text-xs font-medium ${
						userRole === 'seller' ? 'bg-green-100 text-green-800' : 
						userRole === 'admin' ? 'bg-purple-100 text-purple-800' : 
						'bg-blue-100 text-blue-800'
					}`}>
						حالت دمو: {userRole === 'seller' ? 'فروشنده' : userRole === 'admin' ? 'ادمین' : 'کاربر عادی'}
					</span>
				</div>
			)}

			{/* User Info Section */}
			<div className="hidden md:flex md:justify-between md:w-full md:my-2.5 md:items-center md:mb-10">
				<div className="flex flex-col">
					<p className="font-medium text-sm md:text-base">
						{userInfo?.full_name || 'کاربر عزیز'}
					</p>
					<p className="text-gray-400 text-xs mt-2">
						{userInfo?.phone_number || user?.phone_number || ''}
					</p>
					{isDemoMode && (
						<p className="text-blue-500 text-xs mt-1">
							حالت دمو - تمام امکانات قابل دسترسی
						</p>
					)}
				</div>
				<div>
					<Link to="/profile/personal-info">
						<LuPencilLine className="text-blue-500 w-5 h-5 md:w-6 md:h-5 cursor-pointer hover:text-blue-600" />
					</Link>
				</div>
			</div>

			{/* Menu Items - Responsive */}
			<div className="space-y-1">
				{menu.map((item) => (
					<Link to={item.url} key={item.id}>
						<div className="item flex items-center gap-4 md:gap-7 h-12 md:h-14 text-sm font-medium border-t border-gray-200 hover:bg-gray-50 transition-colors px-2">
							<p className="icon text-lg md:text-xl">{item.icon}</p>
							<p className="title flex-1 text-gray-600">{item.title}</p>
						</div>
					</Link>
				))}

				{/* Seller Section - Only show if user is a seller */}
				{isSeller && (
					<Link to="/seller-profile">
						<div className="item flex items-center gap-4 md:gap-7 h-12 md:h-14 text-sm font-medium border-t border-gray-200 hover:bg-blue-50 transition-colors px-2">
							<p className="icon text-lg md:text-xl text-blue-600">
								<FaStore />
							</p>
							<p className="title flex-1 text-blue-600 font-semibold">
								پنل فروشندگی
							</p>
						</div>
					</Link>
				)}

				{/* Become Seller - Only show if user is NOT a seller in demo mode */}
				{!isSeller && isDemoMode && (
					<Link to="/seller-register">
						<div className="item flex items-center gap-4 md:gap-7 h-12 md:h-14 text-sm font-medium border-t border-gray-200 hover:bg-green-50 transition-colors px-2">
							<p className="icon text-lg md:text-xl text-green-600">
								<FaStore />
							</p>
							<p className="title flex-1 text-green-600">
								ثبت نام فروشندگی
							</p>
						</div>
					</Link>
				)}

				{/* Logout */}
				<div 
					onClick={handleLogout}
					className="item flex items-center gap-4 md:gap-7 h-12 md:h-14 text-sm font-medium border-t border-gray-200 hover:bg-red-50 transition-colors cursor-pointer px-2"
				>
					<p className="icon text-lg md:text-xl text-red-600">
						<IoMdExit />
					</p>
					<p className="title flex-1 text-red-600">
						{isDemoMode ? 'بازگشت به صفحه اصلی' : 'خروج از حساب کاربری'}
					</p>
				</div>
			</div>

			{/* Demo Info Footer */}
			{isDemoMode && (
				<div className="mt-6 p-3 bg-blue-50 rounded text-xs text-center text-blue-600">
					<p>این یک نسخه دمو است</p>
					<p className="mt-1">تمام عملیات شبیه‌سازی می‌شود</p>
				</div>
			)}
		</div>

		{/* Mobile Menu - Show when isMenuOpen is true */}
		{isMenuOpen && (
			<div className="md:hidden  space-y-1 w-[80%] border border-gray-200 shadow-lg z-10 rounded-lg absolute bg-white">
				{menu.map((item) => (
					<Link to={item.url} key={item.id} onClick={() => setIsMenuOpen(false)}>
						<div className="item flex items-center gap-4 h-12 text-sm font-medium border-t border-gray-200 hover:bg-gray-50 transition-colors px-2">
							<p className="icon text-lg">{item.icon}</p>
							<p className="title flex-1 text-gray-600">{item.title}</p>
						</div>
					</Link>
				))}

				{/* Mobile Seller Section */}
				{isSeller && (
					<Link to="/seller-profile" onClick={() => setIsMenuOpen(false)}>
						<div className="item flex items-center gap-4 h-12 text-sm font-medium border-t border-gray-200 hover:bg-blue-50 transition-colors px-2">
							<p className="icon text-lg text-blue-600">
								<FaStore />
							</p>
							<p className="title flex-1 text-blue-600 font-semibold">
								پنل فروشندگی
							</p>
						</div>
					</Link>
				)}

				{/* Mobile Become Seller */}
				{!isSeller && isDemoMode && (
					<Link to="/seller-register" onClick={() => setIsMenuOpen(false)}>
						<div className="item flex items-center gap-4 h-12 text-sm font-medium border-t border-gray-200 hover:bg-green-50 transition-colors px-2">
							<p className="icon text-lg text-green-600">
								<FaStore />
							</p>
							<p className="title flex-1 text-green-600">
								ثبت نام فروشندگی
							</p>
						</div>
					</Link>
				)}

				{/* Mobile Logout */}
				<div 
					onClick={() => {
						setIsMenuOpen(false);
						handleLogout();
					}}
					className="item flex items-center gap-4 h-12 text-sm font-medium border-t border-gray-200 hover:bg-red-50 transition-colors cursor-pointer px-2"
				>
					<p className="icon text-lg text-red-600">
						<IoMdExit />
					</p>
					<p className="title flex-1 text-red-600">
						{isDemoMode ? 'بازگشت به صفحه اصلی' : 'خروج از حساب کاربری'}
					</p>
				</div>
			</div>
		)}
	</div>
);
};

export default ProfileMenu;