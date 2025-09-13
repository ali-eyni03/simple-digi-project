import navDigiLogo from "../../../assets/digidownload.png";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import { TiMessages } from "react-icons/ti";
import { MdNotificationsNone } from "react-icons/md";
import { TfiWallet } from "react-icons/tfi";
import "./sellerProfileNavbar.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { FaList } from "react-icons/fa";

const SellerProfileNavbar = () => {
  const navigate = useNavigate();
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Auto-hide menu after 3 seconds
  useEffect(() => {
    if (isMenuOpen) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout for 3 seconds
      timeoutRef.current = setTimeout(() => {
        setIsMenuOpen(false);
      }, 3000);
    }

    // Cleanup timeout on component unmount or when menu closes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    // Close menu immediately when user clicks on a menu item
    setIsMenuOpen(false);
    // Clear the auto-hide timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseEnter = () => {
    // Clear auto-hide timeout when user hovers over menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Restart auto-hide timeout when user leaves menu area
    if (isMenuOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsMenuOpen(false);
      }, 3000);
    }
  };

  return (
    <nav className="flex w-full bg-white sticky top-0 z-50 shadow-md">
      <div className="w-[95%] mx-auto flex p-2">
        {/* right section */}
        <div className="flex gap-3 items-center text-gray-500 font-semibold w-[70%]">
          <Link to="/seller-profile" className="items-center w-40">
            <img src={navDigiLogo} alt="" className="w-13 h-6 md:w-23 md:h-10" />
          </Link>
          
          <div 
            ref={dropdownRef}
            className="relative flex gap-0.5 items-center justify-baseline ml-4 cursor-pointer w-full text-[11px] md:text-sm"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <button 
                className="flex items-center justify-center hover:text-gray-700 transition-colors"
                onClick={handleMenuToggle}
                type="button"
              >
                <span>محصولات</span>
                <FaAngleDown className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <Link 
                    to="/seller-profile/products/create" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={handleMenuItemClick}
                  >
                    <FaPlus className="text-green-500" />
                    <span>درج محصول جدید</span>
                  </Link>
                  <Link 
                    to="/seller-profile/products/manage" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t"
                    onClick={handleMenuItemClick}
                  >
                    <FaList className="text-blue-500" />
                    <span>مدیریت محصولات</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* left section */}
        <div className="flex flex-row-reverse items-center justify-baseline gap-0.5 text-gray-600 w-[30%] font-normal">
          <Link to="/seller-profile/messages" className="relative p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <TiMessages className="w-4 h-4 md:w-7 md:h-7" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
          </Link>
          
          <Link to="/seller-profile/notifications" className="relative p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MdNotificationsNone className="w-4 h-4 md:w-7 md:h-7" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
          </Link>
          
          <Link to="/seller-profile/wallet" className="flex gap-1 items-center justify-center rounded-lg md:bg-gray-200 font-semibold h-10 px-3 hover:bg-gray-300 transition-colors">
            <TfiWallet className="w-4 h-4 md:w-7 md:h-7" />
            <span className="hidden md:block">۰ ریال</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default SellerProfileNavbar;