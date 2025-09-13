import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStaticCategories } from "../data/staticData.js";
import {
  MdLaptop,
  MdPhone,
  MdWatch,
  MdHeadphones,
  MdTv,
  MdVideogameAsset,
  MdKitchen,
  MdChair,
  MdCategory
} from 'react-icons/md';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = {
    'الکترونیک': <MdLaptop className="w-6 h-6 md:w-8 md:h-8" />,
    'موبایل': <MdPhone className="w-6 h-6 md:w-8 md:h-8" />,
    'لپ تاپ': <MdLaptop className="w-6 h-6 md:w-8 md:h-8" />,
    'ساعت هوشمند': <MdWatch className="w-6 h-6 md:w-8 md:h-8" />,
    'هدفون': <MdHeadphones className="w-6 h-6 md:w-8 md:h-8" />,
    'تلویزیون': <MdTv className="w-6 h-6 md:w-8 md:h-8" />,
    'گیمینگ': <MdVideogameAsset className="w-6 h-6 md:w-8 md:h-8" />,
    'لوازم خانگی': <MdKitchen className="w-6 h-6 md:w-8 md:h-8" />,
    'مبلمان': <MdChair className="w-6 h-6 md:w-8 md:h-8" />
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const staticCategories = getStaticCategories();
      
      const topLevelCategories = staticCategories.filter(cat => cat.parent === null);
      
      const displayCategories = topLevelCategories.slice(0, 8);
      
      setCategories(displayCategories);
    } catch (error) {
      console.error('Error fetching categories from static data:', error);
      setCategories([
        { id: 1, name: 'الکترونیک', en_name: 'electronics' },
        { id: 2, name: 'موبایل', en_name: 'mobile' },
        { id: 3, name: 'لپ تاپ', en_name: 'laptop' },
        { id: 4, name: 'هدفون', en_name: 'headphone' },
        { id: 5, name: 'تلویزیون', en_name: 'tv' },
        { id: 6, name: 'گیمینگ', en_name: 'gaming' },
        { id: 7, name: 'لوازم خانگی', en_name: 'home' },
        { id: 8, name: 'مبلمان', en_name: 'furniture' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg mx-auto mb-2 md:mb-3"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded mx-auto w-16 md:w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">دسته‌بندی‌ها</h2>
          <Link 
            to="/categories" 
            className="text-sm md:text-base text-blue-600 hover:text-blue-800 transition-colors"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.en_name || category.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md p-3 md:p-4 text-center group-hover:scale-105 transform transition-transform duration-200">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 flex items-center justify-center text-blue-600 group-hover:text-blue-800 transition-colors ">
                  {categoryIcons[category.name] || <MdCategory className="w-6 h-6 md:w-8 md:h-8" />}
                </div>
                <h3 className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-blue-800 transition-colors truncate">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-8 md:py-12">
            <MdCategory className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm md:text-base">هیچ دسته‌بندی یافت نشد</p>
          </div>
        )}

        {/* Demo mode indicator */}
        <div className="mt-4 md:mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            حالت دمو - داده‌های استاتیک
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;