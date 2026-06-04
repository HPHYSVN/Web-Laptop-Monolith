export interface CpuInforDTO {
  id?: number;
  brands: string;
  speed: string;
  model: string;
  cores: number;
  threads: number;
  baseClock: string;
  boostClock: string;
  cache: string;
}

export interface RamInforDTO {
  id?: number;
  size: string;
  type: string;
  bus: string;
  slots: number;
}

export interface StorageInforDTO {
  id?: number;
  type: string;
  capacity: string;
  interface: string;
}

export interface GpuInforDTO {
  id?: number;
  brands: string;
  model: string;
  vram: string;
}

export interface ScreenInforDTO {
  id?: number;
  size: string;
  resolution: string;
  panel: string;
  refreshRate: string;
}

export interface ProductSpecsDTO {
  id: number;
  cpu?: CpuInforDTO;
  ram?: RamInforDTO;
  storage?: StorageInforDTO;
  gpu?: GpuInforDTO;
  screen?: ScreenInforDTO;
  battery?: string;
  weight?: string;
  os?: string;
}

export interface ProductDetailDTO {
  id: number;
  quantity: number;
  price: number;
  color: string;
  imageDetail: string;
  specs?: ProductSpecsDTO;
}

export interface ProductDTO {
  id: number;
  productName: string;
  productDescription: string;
  createDate: string;
  categoryName: string;
  details: ProductDetailDTO[];
}

export interface CategoryDTO {
  id?: number;
  categoryName: string;
  categoryDescription?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  role: string;
  status: string;
  createDate: string;
  avatar?: string;
}

export interface OrderDTO {
  id: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  totalPrice: number;
  status: string;
  orderDate: string;
  username: string;
}

export interface DashboardDTO {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

export interface DashboardSummaryDTO extends DashboardDTO {
  deliveredOrders: number;
  newUsers: number;
  averageOrderValue: number;
  ordersByStatus: LabelValueDTO[];
}

export interface PageResponseDTO<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface LabelValueDTO {
  label: string;
  value: number;
}

export interface MonthlyRevenueDTO {
  month: string;
  revenue: number;
}

export interface RevenuePointDTO {
  label: string;
  revenue: number;
  orderCount: number;
}

export interface DashboardQueryParams {
  fromDate?: string;
  toDate?: string;
  groupBy?: 'DAY' | 'MONTH';
}

export interface CartItem {
  id: number;
  productDetailId: number;
  productName: string;
  quantity: number;
  price: number;
  color: string;
  image?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  role: string;
}

export interface CheckoutRequest {
  userId: number;
  receiverName: string;
  phone: string;
  address: string;
}

export interface OrderStatusRequestDTO {
  status: string;
}

export interface UserStatusRequestDTO {
  status: string;
}

export interface ProductFilterDTO {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string; // "price", "discount"
  sortOrder?: string; // "asc", "desc"
}

export interface DiscountDTO {
  id?: number;
  code: string;
  discountPercent: number;
  maxPercent: number;
  startDate: string;
  endDate: string;
  description: string;
  quantity: number;
  status?: string; // ACTIVE, EXPIRED, FUTURE
}
