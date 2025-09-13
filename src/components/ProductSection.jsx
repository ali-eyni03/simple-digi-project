import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { getStaticProducts, getStaticCategories } from '../data/staticData.js';
import ProductCard from './ProductComponent';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const ProductsSection = ({ title = "محصولات جدید", category = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let allProducts = getStaticProducts();
      
      if (category) {
        const categories = getStaticCategories();
        const categoryData = categories.find(cat => 
          cat.en_name === category || cat.name === category
        );
        
        if (categoryData) {
          allProducts = allProducts.filter(product => 
            product.category?.id === categoryData.id
          );
        }
      }
      
      const shuffled = allProducts.sort(() => Math.random() - 0.5);
      
      setProducts(shuffled.slice(0, 12));
    } catch (error) {
      console.error('Error loading static products:', error);
      setError('خطا در بارگذاری محصولات از داده‌های استاتیک');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-3 md:p-4 animate-pulse">
                <div className="bg-gray-200 h-32 md:h-40 lg:h-48 rounded mb-3 md:mb-4"></div>
                <div className="bg-gray-200 h-3 md:h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 md:h-4 rounded mb-2 w-3/4"></div>
                <div className="bg-gray-200 h-4 md:h-5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{title}</h2>
          <div className="text-center py-8">
            <p className="text-red-500 text-sm md:text-base">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{title}</h2>
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm md:text-base">محصولی یافت نشد</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-base md:text-xl font-bold text-gray-800">{title}</h2>
          <button className="text-blue-600 hover:text-blue-800 text-xs md:text-base transition-colors">
            مشاهده همه
          </button>
        </div>

        {/* Mobile: Grid Layout */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className="w-full"
              />
            ))}
          </div>
        </div>

        {/* Desktop: Swiper Layout */}
        <div className="hidden md:block">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,

              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            className="!pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev !left-0 !top-1/2 !w-10 !h-10 !mt-0 bg-white rounded-full shadow-lg border border-gray-200 after:!text-sm after:!font-bold after:!text-gray-600 hover:bg-gray-50 transition-colors">
              <FaAngleRight className="w-4 h-4 text-gray-600" />
            </div>
            <div className="swiper-button-next !right-0 !top-1/2 !w-10 !h-10 !mt-0 bg-white rounded-full shadow-lg border border-gray-200 after:!text-sm after:!font-bold after:!text-gray-600 hover:bg-gray-50 transition-colors">
              <FaAngleLeft className="w-4 h-4 text-gray-600" />
            </div>
          </Swiper>
        </div>

        {/* Demo Mode Indicator */}
        <div className="text-center mt-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            حالت دمو - داده‌های استاتیک ({products.length} محصول)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;