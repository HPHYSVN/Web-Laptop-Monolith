import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', products: 'Products', cart: 'Cart', login: 'Login', register: 'Register', logout: 'Logout', admin: 'Admin', back: 'Back to Store', management: 'Management' },
      admin: { dashboard: 'Dashboard', categories: 'Categories', products: 'Products', specs: 'Specs', orders: 'Orders', users: 'Users', discounts: 'Discounts' },
      common: { search: 'Search', filter: 'Filter', status: 'Status', role: 'Role', actions: 'Actions', date: 'Date', total: 'Total', selected: 'selected', previous: 'Previous', next: 'Next', all: 'All', import: 'Import File', exportCsv: 'Export CSV', exportXlsx: 'Export XLSX', deleteSelected: 'Delete Selected', loading: 'Loading...' },
      dashboard: { title: 'Dashboard', subtitle: 'Overview of your store performance', totalUsers: 'Total Users', totalOrders: 'Total Orders', totalProducts: 'Total Products', totalRevenue: 'Total Revenue', revenueByMonth: 'Revenue by Month', orderStatus: 'Order Status', categoryShare: 'Product Categories', usersByMonth: 'Users by Month', deliveredOrders: 'Delivered Orders', averageOrderValue: 'Average Order Value', newUsers: 'New Users', deliveredRevenue: 'Delivered order revenue', completedOrders: 'Completed orders', perDeliveredOrder: 'Per delivered order', inSelectedRange: 'In selected range', catalogSize: 'Catalog size', quickRange: 'Quick range', today: 'Today', last7Days: 'Last 7 days', thisMonth: 'This month', thisYear: 'This year', fromDate: 'From date', toDate: 'To date', groupBy: 'Group by', byDay: 'By day', byMonth: 'By month', applyFilter: 'Apply filter', exportRevenue: 'Export Revenue', revenueTrend: 'Revenue Trend', revenue: 'Revenue', orders: 'Orders', usersByPeriod: 'Users by Period' },
      productsAdmin: { title: 'Manage Products', count: '{{count}} products in inventory', add: 'Add Product', product: 'Product', category: 'Category', variants: 'Variants', created: 'Created', keyword: 'Search product name', minPrice: 'Min price', maxPrice: 'Max price' },
      ordersAdmin: { title: 'Manage Orders', count: '{{count}} orders total', customer: 'Customer', receiver: 'Receiver', address: 'Address', keyword: 'Search customer, receiver, phone' },
      usersAdmin: { title: 'Manage Users', count: '{{count}} registered users', username: 'Username', email: 'Email', phone: 'Phone', created: 'Created', keyword: 'Search username, email, phone' },
      messages: { deleteConfirm: 'Are you sure you want to delete selected records?', loadError: 'Failed to load data.', exportError: 'Failed to export report.', updateError: 'Failed to update.', importSuccess: 'Import completed.', syncCart: 'Guest cart synced.' }
      ,
      public: {
        products: 'Products', product: 'product', productsCount: 'products', available: 'available', search: 'Search laptops...', filters: 'Filters', priceRange: 'Price Range (VND)', min: 'Min', max: 'Max', sortBy: 'Sort By', allCategories: 'All Categories', loadingProducts: 'Loading products...', noProducts: 'No products found.',
        heroBadge: 'Premium Collection 2026', heroTitleA: 'Find Your Perfect', heroTitleB: 'Laptop', heroCopy: 'Discover top-tier laptops with cutting-edge specs, unbeatable prices, and exceptional customer service.', browse: 'Browse Products', latest: 'Latest Technology', latestDesc: 'Cutting-edge processors and GPUs for maximum performance.', warranty: '2-Year Warranty', warrantyDesc: 'Every laptop comes with comprehensive warranty coverage.', delivery: 'Fast Delivery', deliveryDesc: 'Free shipping nationwide with real-time tracking.', featured: 'Featured Products', featuredDesc: 'Handpicked selection of our best laptops', viewAll: 'View All',
        cartEmpty: 'Your cart is empty', cartEmptyDesc: "Looks like you haven't added any items yet. Start browsing our products!", continueShopping: 'Continue Shopping', shoppingCart: 'Shopping Cart', color: 'Color', each: 'each', clearCart: 'Clear Cart', orderSummary: 'Order Summary', subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free', checkout: 'Proceed to Checkout',
        welcome: 'Welcome back', signInAccount: 'Sign in to your account', username: 'Username', password: 'Password', enterUsername: 'Enter username', enterPassword: 'Enter password', signIn: 'Sign In', noAccount: "Don't have an account?", createAccount: 'Create account', registerCopy: 'Get started with Laptop Store', email: 'Email', phone: 'Phone', alreadyAccount: 'Already have an account?'
      },
      forms: { add: 'Add', edit: 'Edit', update: 'Update', create: 'Create', cancel: 'Cancel', description: 'Description', name: 'Name', code: 'Code', quantity: 'Quantity', startDate: 'Start Date', endDate: 'End Date' },
      adminExtra: { manageCategories: 'Manage Categories', categoriesCount: '{{count}} categories available', addCategory: 'Add Category', categoryName: 'Category Name', manageDiscounts: 'Manage Discounts', discountsCount: '{{count}} discount codes available', addDiscount: 'Add Discount', discountPercent: 'Discount %', maxPercent: 'Max %', manageSpecs: 'Manage Specs', specsSubtitle: 'CPU, RAM, GPU, Screen, Storage specifications' }
    }
  },
  vi: {
    translation: {
      nav: { home: 'Trang chủ', products: 'Sản phẩm', cart: 'Giỏ hàng', login: 'Đăng nhập', register: 'Đăng ký', logout: 'Đăng xuất', admin: 'Quản trị', back: 'Về cửa hàng', management: 'Quản lý' },
      admin: { dashboard: 'Bảng điều khiển', categories: 'Danh mục', products: 'Sản phẩm', specs: 'Cấu hình', orders: 'Đơn hàng', users: 'Người dùng', discounts: 'Giảm giá' },
      common: { search: 'Tìm kiếm', filter: 'Lọc', status: 'Trạng thái', role: 'Vai trò', actions: 'Thao tác', date: 'Ngày', total: 'Tổng', selected: 'đã chọn', previous: 'Trước', next: 'Sau', all: 'Tất cả', import: 'Nhập file', exportCsv: 'Xuất CSV', exportXlsx: 'Xuất XLSX', deleteSelected: 'Xóa đã chọn', loading: 'Đang tải...' },
      dashboard: { title: 'Bảng điều khiển', subtitle: 'Tổng quan hiệu quả kinh doanh cửa hàng', totalUsers: 'Tổng người dùng', totalOrders: 'Tổng đơn hàng', totalProducts: 'Tổng sản phẩm', totalRevenue: 'Tổng doanh thu', revenueByMonth: 'Doanh thu theo tháng', orderStatus: 'Trạng thái đơn hàng', categoryShare: 'Sản phẩm theo danh mục', usersByMonth: 'Người dùng theo tháng', deliveredOrders: 'Đơn đã giao', averageOrderValue: 'Giá trị đơn TB', newUsers: 'Người dùng mới', deliveredRevenue: 'Doanh thu đơn đã giao', completedOrders: 'Đơn hoàn tất', perDeliveredOrder: 'Trên mỗi đơn đã giao', inSelectedRange: 'Trong kỳ đã chọn', catalogSize: 'Quy mô danh mục', quickRange: 'Khoảng nhanh', today: 'Hôm nay', last7Days: '7 ngày qua', thisMonth: 'Tháng này', thisYear: 'Năm nay', fromDate: 'Từ ngày', toDate: 'Đến ngày', groupBy: 'Nhóm theo', byDay: 'Theo ngày', byMonth: 'Theo tháng', applyFilter: 'Áp dụng lọc', exportRevenue: 'Xuất doanh thu', revenueTrend: 'Xu hướng doanh thu', revenue: 'Doanh thu', orders: 'Đơn hàng', usersByPeriod: 'Người dùng theo kỳ' },
      productsAdmin: { title: 'Quản lý sản phẩm', count: '{{count}} sản phẩm trong kho', add: 'Thêm sản phẩm', product: 'Sản phẩm', category: 'Danh mục', variants: 'Phiên bản', created: 'Ngày tạo', keyword: 'Tìm theo tên sản phẩm', minPrice: 'Giá thấp nhất', maxPrice: 'Giá cao nhất' },
      ordersAdmin: { title: 'Quản lý đơn hàng', count: '{{count}} đơn hàng', customer: 'Khách hàng', receiver: 'Người nhận', address: 'Địa chỉ', keyword: 'Tìm khách hàng, người nhận, SĐT' },
      usersAdmin: { title: 'Quản lý người dùng', count: '{{count}} người dùng', username: 'Tên đăng nhập', email: 'Email', phone: 'Số điện thoại', created: 'Ngày tạo', keyword: 'Tìm username, email, SĐT' },
      messages: { deleteConfirm: 'Bạn có chắc muốn xóa các bản ghi đã chọn?', loadError: 'Không thể tải dữ liệu.', exportError: 'Không thể xuất báo cáo.', updateError: 'Không thể cập nhật.', importSuccess: 'Nhập file thành công.', syncCart: 'Đã đồng bộ giỏ hàng khách.' }
      ,
      public: {
        products: 'Sản phẩm', product: 'sản phẩm', productsCount: 'sản phẩm', available: 'đang có', search: 'Tìm laptop...', filters: 'Bộ lọc', priceRange: 'Khoảng giá (VND)', min: 'Từ', max: 'Đến', sortBy: 'Sắp xếp', allCategories: 'Tất cả danh mục', loadingProducts: 'Đang tải sản phẩm...', noProducts: 'Không tìm thấy sản phẩm.',
        heroBadge: 'Bộ sưu tập cao cấp 2026', heroTitleA: 'Tìm chiếc', heroTitleB: 'Laptop phù hợp', heroCopy: 'Khám phá laptop cấu hình mạnh, giá cạnh tranh và dịch vụ hỗ trợ chuyên nghiệp.', browse: 'Xem sản phẩm', latest: 'Công nghệ mới nhất', latestDesc: 'CPU và GPU hiện đại cho hiệu năng tối đa.', warranty: 'Bảo hành 2 năm', warrantyDesc: 'Mỗi laptop đều có chính sách bảo hành đầy đủ.', delivery: 'Giao hàng nhanh', deliveryDesc: 'Miễn phí vận chuyển toàn quốc, theo dõi đơn hàng rõ ràng.', featured: 'Sản phẩm nổi bật', featuredDesc: 'Những mẫu laptop được chọn lọc cho bạn', viewAll: 'Xem tất cả',
        cartEmpty: 'Giỏ hàng đang trống', cartEmptyDesc: 'Bạn chưa thêm sản phẩm nào. Hãy bắt đầu xem các mẫu laptop.', continueShopping: 'Tiếp tục mua sắm', shoppingCart: 'Giỏ hàng', color: 'Màu', each: 'mỗi sản phẩm', clearCart: 'Xóa giỏ hàng', orderSummary: 'Tóm tắt đơn hàng', subtotal: 'Tạm tính', shipping: 'Vận chuyển', free: 'Miễn phí', checkout: 'Tiến hành đặt hàng',
        welcome: 'Chào mừng trở lại', signInAccount: 'Đăng nhập vào tài khoản', username: 'Tên đăng nhập', password: 'Mật khẩu', enterUsername: 'Nhập tên đăng nhập', enterPassword: 'Nhập mật khẩu', signIn: 'Đăng nhập', noAccount: 'Chưa có tài khoản?', createAccount: 'Tạo tài khoản', registerCopy: 'Bắt đầu với Laptop Store', email: 'Email', phone: 'Số điện thoại', alreadyAccount: 'Đã có tài khoản?'
      },
      forms: { add: 'Thêm', edit: 'Sửa', update: 'Cập nhật', create: 'Tạo mới', cancel: 'Hủy', description: 'Mô tả', name: 'Tên', code: 'Mã', quantity: 'Số lượng', startDate: 'Ngày bắt đầu', endDate: 'Ngày kết thúc' },
      adminExtra: { manageCategories: 'Quản lý danh mục', categoriesCount: '{{count}} danh mục', addCategory: 'Thêm danh mục', categoryName: 'Tên danh mục', manageDiscounts: 'Quản lý mã giảm giá', discountsCount: '{{count}} mã giảm giá', addDiscount: 'Thêm mã giảm giá', discountPercent: 'Giảm %', maxPercent: 'Giảm tối đa %', manageSpecs: 'Quản lý cấu hình', specsSubtitle: 'Thông số CPU, RAM, GPU, màn hình và ổ cứng' }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('app_language') || 'vi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
