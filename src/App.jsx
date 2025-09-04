import "./tailwind.css";
import "./global.css";
import MainPage from "./pages/MainPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductPage } from "./pages/ProductPage.jsx";
import LoginPage from "./pages/users/LoginRegisterPage.jsx";
import ProfileLayout from "./pages/users/ProfileLayout.jsx";
import OrdersPage from "./pages/orders/OrdersPage.jsx";
import ProfileAddresses from "./pages/adresses/ProfileAddresses.jsx";
import UserPersonalInfo from "./pages/personalInfo/PersonalInfo.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProfileLists from "./pages/usersLikedList/UserLikedList.jsx";
import UserComments from "./pages/comments/UserComments.jsx";
import UserNotifications from "./pages/notifications/UserNotifications.jsx";
import SellerHomePage from "./pages/sellersPage/SellerHomePage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import SellerLoginRegisterPage from "./pages/sellersPage/sellerLoginRegisterPage/SellerLoginRegisterPage.jsx";
import EnhancedSellerRegister from "./pages/sellersPage/components/EnhancedSellerRegister.jsx";
import SellerProfileLayout from "./pages/sellersPage/SellerProfileLayout.jsx";
import ProfileHomePage from "./pages/sellersPage/pages/SellerDashboard.jsx";
import SellerProducts from "./pages/sellersPage/pages/SellerProducts.jsx";
import SellerStoreInfo from "./pages/sellersPage/pages/SellerStoreInfo.jsx";
import SellerAddress from "./pages/sellersPage/pages/SellerAddress.jsx";
import SellerProfileInfo from "./pages/sellersPage/pages/SellerProfileInfo.jsx";
import UserProfileHomePage from "./pages/profileHomePage/ProfileHomePage.jsx";
import SellerProductDetail from "./pages/sellersPage/pages/SellerProductDetail.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import CreateProduct from "./pages/sellersPage/pages/CreateProduct.jsx";
import ManageProducts from "./pages/sellersPage/pages/ManageProducts.jsx";

function App() {
	return (
		<>
			<AuthProvider>
				<CartProvider>
					<Router>
						<ScrollToTop/>
						<Routes>
							{/* Public Routes - All routes are now public in demo mode */}
							<Route path="/" element={<MainPage />} />
							<Route path="/product/:id" element={<ProductPage />} />
							
							{/* Demo Login Pages - Show UI but don't require actual auth */}
							<Route path="/users/login/" element={<LoginPage />} />
							<Route path="/seller-auth" element={<SellerLoginRegisterPage />} />
							<Route path="/seller-register" element={<EnhancedSellerRegister />} />
							
							{/* Cart and Checkout */}
							<Route path="/cart" element={<CartPage />} />
							<Route path="/checkout" element={<CheckoutPage />} />
							<Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
							
							{/* Seller Public Routes */}
							<Route path="/seller" element={<SellerHomePage />} />
							
							{/* User Profile Routes - Now accessible to everyone */}
							<Route path="/profile" element={<ProfileLayout />}>
								<Route index element={<UserProfileHomePage />} />
								<Route path="orders" element={<OrdersPage />} />
								<Route path="addresses" element={<ProfileAddresses />} />
								<Route path="personal-info" element={<UserPersonalInfo />} />
								<Route path="lists" element={<ProfileLists />} />
								<Route path="comments" element={<UserComments />} />
								<Route path="notifications" element={<UserNotifications />} />
							</Route>
							
							{/* Seller Profile Routes - Now accessible to everyone */}
							<Route path="/seller-profile" element={<SellerProfileLayout />}>
								<Route index element={<ProfileHomePage />} />
								<Route path="info" element={<SellerProfileInfo />} />
								<Route path="store-info" element={<SellerStoreInfo />} />
								<Route path="address" element={<SellerAddress />} />
								<Route path="products" element={<SellerProducts />} />
								<Route path="products/create" element={<CreateProduct />} />
								<Route path="products/manage" element={<ManageProducts />} />
								<Route path="product/:id" element={<SellerProductDetail />} />
							</Route>

							{/* Catch all route - redirect to home */}
							<Route path="*" element={<MainPage />} />
						</Routes>
					</Router>
				</CartProvider>
			</AuthProvider>
		</>
	);
}

export default App;