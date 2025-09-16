import React, { useState, useEffect, useContext } from "react";
import {
  FaShoppingCart, FaBox, FaTruck, FaCheckCircle,
   FaChevronDown, FaChevronUp,
   FaUndo, FaMapMarkerAlt,
  FaSearch, FaDownload
} from "react-icons/fa";
import {
   MdLocalShipping,MdCancel, MdLoop, MdDone,
  MdPending
} from "react-icons/md";
import { AuthContext } from "../../auth/AuthContext";

const OrdersPage = () => {
  const { isAuthenticated } = useContext(AuthContext); 
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const mockOrdersData = [
    {
      id: "ORD-20240125-001",
      order_number: "۱۴۰۲۱۲۳۴۵",
      status: "delivered",
      created_at: "2024-01-25",
      delivered_at: "2024-01-28",
      total_amount: 45500000,
      discount_amount: 2500000,
      shipping_cost: 50000,
      payment_method: "online",
      payment_status: "paid",
      tracking_code: "POST123456789",
      address: {
        recipient: "علی احمدی",
        phone: "09123456789",
        address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
        postal_code: "1234567890"
      },
      items: [
        {
          id: 1,
          product: {
            id: 101,
            name: "گوشی موبایل سامسونگ Galaxy S23",
            image: "https://dkstatics-public.digikala.com/digikala-products/12345.jpg", // Example image
            seller: "دیجی استور"
          },
          quantity: 1,
          price: 38000000,
          discount: 2000000,
          status: "delivered"
        },
        {
          id: 2,
          product: {
            id: 102,
            name: "قاب گوشی سامسونگ",
            image: "https://dkstatics-public.digikala.com/digikala-products/67890.jpg", // Example image
            seller: "موبایل پلاس"
          },
          quantity: 2,
          price: 250000,
          discount: 0,
          status: "delivered"
        }
      ],
      timeline: [
        { date: "2024-01-25 10:30", status: "pending", title: "ثبت سفارش" },
        { date: "2024-01-25 14:45", status: "confirmed", title: "تایید سفارش" },
        { date: "2024-01-26 09:00", status: "processing", title: "آماده‌سازی سفارش" },
        { date: "2024-01-27 11:30", status: "shipped", title: "ارسال از انبار" },
        { date: "2024-01-28 16:20", status: "delivered", title: "تحویل به مشتری" }
      ]
    },
    {
      id: "ORD-20240120-002",
      order_number: "۱۴۰۲۱۲۳۴۴",
      status: "processing",
      created_at: "2024-01-20",
      total_amount: 12500000,
      discount_amount: 500000,
      shipping_cost: 0,
      payment_method: "cash_on_delivery",
      payment_status: "pending",
      tracking_code: null,
      address: {
        recipient: "علی احمدی",
        phone: "09123456789",
        address: "تهران، میدان آرژانتین، برج آسمان",
        postal_code: "9876543210"
      },
      items: [
        {
          id: 3,
          product: {
            id: 103,
            name: "لپ تاپ ایسوس TUF Gaming",
            image: "https://dkstatics-public.digikala.com/digikala-products/112233.jpg", // Example image
            seller: "تکنولایف"
          },
          quantity: 1,
          price: 12500000,
          discount: 500000,
          status: "processing"
        }
      ],
      timeline: [
        { date: "2024-01-20 12:00", status: "pending", title: "ثبت سفارش" },
        { date: "2024-01-20 15:30", status: "confirmed", title: "تایید سفارش" },
        { date: "2024-01-21 10:00", status: "processing", title: "در حال آماده‌سازی" }
      ]
    },
    {
      id: "ORD-20240115-003",
      order_number: "۱۴۰۲۱۲۳۴۳",
      status: "cancelled",
      created_at: "2024-01-15",
      cancelled_at: "2024-01-16",
      cancellation_reason: "عدم موجودی کالا",
      total_amount: 2500000,
      discount_amount: 0,
      shipping_cost: 35000,
      payment_method: "online",
      payment_status: "refunded",
      refund_amount: 2535000,
      address: {
        recipient: "علی احمدی",
        phone: "09123456789",
        address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
        postal_code: "1234567890"
      },
      items: [
        {
          id: 4,
          product: {
            id: 104,
            name: "هدفون بی‌سیم سونی WH-1000XM5",
            image: "https://dkstatics-public.digikala.com/digikala-products/445566.jpg", // Example image
            seller: "صوتی تصویری احمدی"
          },
          quantity: 1,
          price: 2500000,
          discount: 0,
          status: "cancelled"
        }
      ],
      timeline: [
        { date: "2024-01-15 09:00", status: "pending", title: "ثبت سفارش" },
        { date: "2024-01-15 11:00", status: "confirmed", title: "تایید سفارش" },
        { date: "2024-01-16 10:30", status: "cancelled", title: "لغو سفارش - عدم موجودی" }
      ]
    },
    {
      id: "ORD-20240110-004",
      order_number: "۱۴۰۲۱۲۳۴۲",
      status: "returned",
      created_at: "2024-01-10",
      delivered_at: "2024-01-13",
      returned_at: "2024-01-18",
      return_reason: "مغایرت با کالای سفارش داده شده",
      total_amount: 850000,
      discount_amount: 50000,
      shipping_cost: 25000,
      payment_method: "online",
      payment_status: "refunded",
      refund_amount: 875000,
      address: {
        recipient: "علی احمدی",
        phone: "09123456789",
        address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
        postal_code: "1234567890"
      },
      items: [
        {
          id: 5,
          product: {
            id: 105,
            name: "کیبورد مکانیکال ردراگون",
            image: "https://dkstatics-public.digikala.com/digikala-products/778899.jpg", // Example image
            seller: "گیمینگ شاپ"
          },
          quantity: 1,
          price: 850000,
          discount: 50000,
          status: "returned"
        }
      ],
      timeline: [
        { date: "2024-01-10 14:00", status: "pending", title: "ثبت سفارش" },
        { date: "2024-01-10 16:00", status: "confirmed", title: "تایید سفارش" },
        { date: "2024-01-11 10:00", status: "processing", title: "آماده‌سازی" },
        { date: "2024-01-12 09:00", status: "shipped", title: "ارسال" },
        { date: "2024-01-13 15:00", status: "delivered", title: "تحویل" },
        { date: "2024-01-15 11:00", status: "return_requested", title: "درخواست مرجوعی" },
        { date: "2024-01-16 10:00", status: "return_approved", title: "تایید مرجوعی" },
        { date: "2024-01-17 14:00", status: "return_pickup", title: "دریافت کالا" },
        { date: "2024-01-18 12:00", status: "returned", title: "مرجوعی کامل شد" }
      ]
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setOrders([]); 
    }
  }, [activeTab, dateFilter, searchQuery, isAuthenticated]); 

  const loadOrders = () => {
    setLoading(true);
    let filtered = [...mockOrdersData]; 

    if (activeTab !== 'all') {
      const statusMap = {
        'pending': ['pending', 'confirmed', 'processing'],
        'delivered': ['delivered'],
        'cancelled': ['cancelled'],
        'returned': ['returned']
      };
      filtered = filtered.filter(order =>
        statusMap[activeTab]?.includes(order.status) || false
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch(dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'three-months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(order =>
        new Date(order.created_at) >= filterDate
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.includes(searchQuery) ||
        order.items.some(item =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setOrders(filtered);
    setLoading(false);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'در انتظار تایید', color: 'yellow', icon: <MdPending /> },
      'confirmed': { label: 'تایید شده', color: 'blue', icon: <MdDone /> },
      'processing': { label: 'در حال پردازش', color: 'blue', icon: <MdLoop /> },
      'shipped': { label: 'ارسال شده', color: 'indigo', icon: <FaTruck /> },
      'delivered': { label: 'تحویل شده', color: 'green', icon: <FaCheckCircle /> },
      'cancelled': { label: 'لغو شده', color: 'red', icon: <MdCancel /> },
      'returned': { label: 'مرجوع شده', color: 'gray', icon: <FaUndo /> },
      'return_requested': { label: 'درخواست مرجوعی', color: 'orange', icon: <FaUndo /> },
      'return_approved': { label: 'مرجوعی تایید شده', color: 'orange', icon: <FaCheckCircle /> },
      'return_pickup': { label: 'در انتظار دریافت', color: 'orange', icon: <FaTruck /> }
    };
    return statusMap[status] || { label: status, color: 'gray', icon: <FaBox /> };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fa-IR');
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('آیا از لغو این سفارش اطمینان دارید؟ (عملیات شبیه‌سازی شده)')) {
      console.log(`Mock cancelling order: ${orderId}`);
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled', cancellation_reason: 'لغو توسط کاربر' } : order
      ));
      alert('سفارش با موفقیت لغو شد (شبیه‌سازی شده)');
    }
  };

  const handleReturnRequest = async (orderId) => {
    alert('به صفحه درخواست مرجوعی منتقل می‌شوید (شبیه‌سازی شده)');
  };

  const handleReorder = async (order) => {
    alert('محصولات به سبد خرید اضافه شدند (شبیه‌سازی شده)');
  };

  const handleDownloadInvoice = (orderId) => {
    alert('فاکتور در حال دانلود... (شبیه‌سازی شده)');
  };

  const tabs = [
    { id: 'all', label: 'همه سفارش‌ها', icon: <FaBox /> },
    { id: 'pending', label: 'در حال پردازش', icon: <MdPending /> },
    { id: 'delivered', label: 'تحویل شده', icon: <FaCheckCircle /> },
    { id: 'cancelled', label: 'لغو شده', icon: <MdCancel /> },
    { id: 'returned', label: 'مرجوع شده', icon: <FaUndo /> }
  ];

  return (
    <>
      <div className="max-w-6xl  p-2 space-y-4">
        {/* Header */}
        <div className=" p-2 w-full ">
          <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
            <FaShoppingCart />
            سفارش‌های من
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            تاریخچه و وضعیت سفارشات شما
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو با شماره سفارش یا نام محصول..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:border-2 focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">همه زمان‌ها</option>
              <option value="week">هفته گذشته</option>
              <option value="month">ماه گذشته</option>
              <option value="three-months">سه ماه گذشته</option>
              <option value="year">سال گذشته</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm w-full">
          <div className="border-b overflow-x-auto">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-3 font-medium text-xs border-b-2 border-gray-300 transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="p-4 ">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری سفارشات...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaShoppingCart className="mx-auto text-4xl mb-3 text-gray-300" />
                <p>سفارشی یافت نشد</p>
                <button className="mt-4 text-blue-600 hover:underline text-sm">
                  شروع خرید
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-gray-300">
                {orders.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div key={order.id} className="border border-gray-300 rounded-lg overflow-x-auto ">
                      {/* Order Header */}
                      <div
                        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`text-${statusInfo.color}-500 text-sm md:text-2xl`}>
                              {statusInfo.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1 text-xs md:text-sm">
                                <span className="font-semibold">شماره سفارش:</span>
                                <span className="font-mono">{order.order_number}</span>
                                <span className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700 text-xs px-2 py-0.5 rounded hidden md:block`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="text-xs md:text-sm text-gray-600">
                                <span>{formatDate(order.created_at)}</span>
                                <span className="mx-2">•</span>
                                <span>{order.items.length} محصول</span>
                                <span className="mx-2">•</span>
                                <span className="font-medium">
                                  {formatPrice(order.total_amount)} تومان
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.tracking_code && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                  setShowTrackingModal(true);
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                                title="پیگیری مرسوله"
                              >
                                <MdLocalShipping size={20} />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadInvoice(order.id);
                              }}
                              className="text-gray-600 hover:bg-gray-100 p-2 rounded"
                              title="دانلود فاکتور"
                            >
                              <FaDownload size={16} />
                            </button>
                            <div className="text-gray-400">
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details (Expanded) */}
                      {isExpanded && (
                        <div className="border-t border-gray-300">
                          {/* Products */}
                          <div className="p-4 space-y-3">
                            <h3 className="font-semibold text-gray-800 mb-3">محصولات سفارش</h3>
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="w-20 h-20 flex-shrink-0">
                                  {item.product.image ? (
                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain rounded-lg border" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border">
                                      <FaShoppingCart className="text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                                  <p className="text-sm text-gray-600">فروشنده: {item.product.seller}</p>
                                  <p className="text-sm text-gray-600">تعداد: {item.quantity}</p>
                                  <p className="text-sm font-semibold text-gray-800">قیمت: {formatPrice(item.price)} تومان</p>
                                  {item.discount > 0 && (
                                    <p className="text-xs text-red-500">تخفیف: {formatPrice(item.discount)} تومان</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg text-red-600">
                                    {formatPrice(item.quantity * item.price - item.discount)} تومان
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="p-4 border-t border-gray-200 bg-white">
                            <h3 className="font-semibold text-gray-800 mb-3">خلاصه پرداخت</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                              <div className="flex justify-between">
                                <span>مبلغ کل کالاها:</span>
                                <span>{formatPrice(order.total_amount + order.discount_amount)} تومان</span>
                              </div>
                              {order.discount_amount > 0 && (
                                <div className="flex justify-between text-red-500">
                                  <span>تخفیف:</span>
                                  <span>-{formatPrice(order.discount_amount)} تومان</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>هزینه ارسال:</span>
                                <span>{order.shipping_cost > 0 ? formatPrice(order.shipping_cost) + ' تومان' : 'رایگان'}</span>
                              </div>
                              <div className="flex justify-between font-bold text-gray-800 text-lg">
                                <span>مبلغ قابل پرداخت:</span>
                                <span>{formatPrice(order.total_amount + order.shipping_cost)} تومان</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>روش پرداخت:</span>
                                <span>{order.payment_method === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>وضعیت پرداخت:</span>
                                <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                                  {order.payment_status === 'paid' ? 'پرداخت شده' : 'در انتظار پرداخت'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="p-4 border-t border-gray-200 bg-white">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FaMapMarkerAlt />
                              آدرس تحویل
                            </h3>
                            <p className="text-sm text-gray-700">{order.address.recipient} ({order.address.phone})</p>
                            <p className="text-sm text-gray-700">{order.address.address}</p>
                            <p className="text-sm text-gray-700">کد پستی: {order.address.postal_code}</p>
                          </div>

                          {/* Timeline */}
                          <div className="p-4 border-t border-gray-200 bg-white">
                            <h3 className="font-semibold text-gray-800 mb-3">پیگیری وضعیت</h3>
                            <div className="relative border-r-2 border-gray-200 pr-4">
                              {order.timeline.map((event, index) => (
                                <div key={index} className="mb-4 relative">
                                  <div className="absolute -right-3 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                                  <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                                  <p className="font-medium text-gray-800">{event.title}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => handleReturnRequest(order.id)}
                                className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                              >
                                <FaUndo />
                                درخواست مرجوعی
                              </button>
                            )}
                            {(order.status === 'pending' || order.status === 'processing') && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <MdCancel />
                                لغو سفارش
                              </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'returned' && (
                              <button
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                              >
                                <MdLoop />
                                سفارش مجدد
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;