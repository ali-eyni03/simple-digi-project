import Navbar from "../../components/Navbar.jsx";
import { Outlet } from "react-router-dom";
import ProfileMenu from "./ProfileMenu.jsx";

const ProfileLayout = () => {
		return (
			<div className="mb-8 h-screen flex flex-col">
				<Navbar />
				<div className="container flex flex-col md:flex-row md:w-[80%]  m-auto">
					<div className="menuContainer md:w-[40%]">
						<ProfileMenu />
					</div>
					<div className="contentContainer w-full">
						<Outlet />
					</div>
				</div>
			</div>
		);
	
};
export default ProfileLayout;
