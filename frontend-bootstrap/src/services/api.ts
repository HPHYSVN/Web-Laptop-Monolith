import axios from 'axios';
import {
  ProductDTO, CategoryDTO, UserDTO, OrderDTO, DashboardDTO,
  LoginRequest, RegisterRequest, JwtResponse, CheckoutRequest,
  OrderStatusRequestDTO, UserStatusRequestDTO, ProductFilterDTO,
  CpuInforDTO, RamInforDTO, GpuInforDTO, ScreenInforDTO, StorageInforDTO,
  DiscountDTO, PageResponseDTO, MonthlyRevenueDTO, LabelValueDTO, CartItem,
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('laptop_auth');
  if (stored) {
    const user: JwtResponse = JSON.parse(stored);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('laptop_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<UserDTO> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },
};

export const productService = {
  getAllProducts: async (): Promise<ProductDTO[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductDTO> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<ProductDTO[]> => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  searchProducts: async (keyword: string): Promise<ProductDTO[]> => {
    const response = await api.get('/products/search', {
      params: { keyword },
    });
    return response.data;
  },

  filterProducts: async (filter: ProductFilterDTO): Promise<ProductDTO[]> => {
    const response = await api.post('/products/filter', filter);
    return response.data;
  },

  getProductsPage: async (filter: ProductFilterDTO): Promise<PageResponseDTO<ProductDTO>> => {
    const response = await api.get('/products', { params: filter });
    return response.data;
  },

  createProduct: async (data: any): Promise<ProductDTO> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: any): Promise<ProductDTO> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`, {
      headers: { 'Content-Type': undefined },
    });
  },

  bulkDeleteProducts: async (ids: number[]): Promise<void> => {
    await api.delete('/products/bulk', { data: { ids } });
  },

  importProducts: async (file: File): Promise<{ imported: number; message: string }> => {
    const form = new FormData();
    form.append('file', file);
    const response = await api.post('/products/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  exportProducts: async (format: 'csv' | 'xlsx'): Promise<Blob> => {
    const response = await api.get('/products/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

export const categoryService = {
  getAllCategories: async (): Promise<CategoryDTO[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (data: CategoryDTO): Promise<CategoryDTO> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: CategoryDTO): Promise<CategoryDTO> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const orderService = {
  checkout: async (data: CheckoutRequest): Promise<OrderDTO> => {
    const response = await api.post('/orders/checkout', data);
    return response.data;
  },

  getAllOrders: async (): Promise<OrderDTO[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrdersPage: async (params: { page: number; size: number; keyword?: string; status?: string }): Promise<PageResponseDTO<OrderDTO>> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<OrderDTO> => {
    const response = await api.put(`/orders/${id}/status`, { status } as OrderStatusRequestDTO);
    return response.data;
  },

  bulkDeleteOrders: async (ids: number[]): Promise<void> => {
    await api.delete('/orders/bulk', { data: { ids } });
  },
};

export const userService = {
  getAllUsers: async (): Promise<UserDTO[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUsersPage: async (params: { page: number; size: number; keyword?: string; status?: string; role?: string }): Promise<PageResponseDTO<UserDTO>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  updateUserStatus: async (id: number, status: string): Promise<UserDTO> => {
    const response = await api.put(`/users/${id}/status`, { status } as UserStatusRequestDTO);
    return response.data;
  },

  bulkDeleteUsers: async (ids: number[]): Promise<void> => {
    await api.delete('/users/bulk', { data: { ids } });
  },
};

export const adminService = {
  getDashboardStats: async (): Promise<DashboardDTO> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getMonthlyRevenue: async (): Promise<MonthlyRevenueDTO[]> => {
    const response = await api.get('/admin/dashboard/revenue-monthly');
    return response.data;
  },

  getOrderStatusStats: async (): Promise<LabelValueDTO[]> => {
    const response = await api.get('/admin/dashboard/order-status');
    return response.data;
  },

  getMonthlyUsers: async (): Promise<LabelValueDTO[]> => {
    const response = await api.get('/admin/dashboard/users-monthly');
    return response.data;
  },

  getCategoryShare: async (): Promise<LabelValueDTO[]> => {
    const response = await api.get('/admin/dashboard/category-share');
    return response.data;
  },
};

export const cartService = {
  getCart: async (userId: number): Promise<CartItem[]> => {
    const response = await api.get(`/carts/${userId}`);
    return response.data;
  },

  addToCart: async (userId: number, productDetailId: number, quantity: number): Promise<CartItem[]> => {
    const response = await api.post('/carts/add', { userId, productDetailId, quantity });
    return response.data;
  },

  updateQuantity: async (userId: number, cartDetailId: number, quantity: number): Promise<CartItem[]> => {
    const response = await api.put(`/carts/${cartDetailId}`, { userId, quantity });
    return response.data;
  },

  removeItem: async (userId: number, cartDetailId: number): Promise<CartItem[]> => {
    const response = await api.delete(`/carts/${cartDetailId}`, { params: { userId } });
    return response.data;
  },

  clearCart: async (userId: number): Promise<CartItem[]> => {
    const response = await api.delete(`/carts/clear/${userId}`);
    return response.data;
  },

  mergeCart: async (userId: number, items: CartItem[]): Promise<CartItem[]> => {
    const response = await api.post('/carts/merge', {
      userId,
      items: items.map((item) => ({
        productDetailId: item.productDetailId,
        quantity: item.quantity,
      })),
    });
    return response.data;
  },
};

export const specService = {
  getAllCpus: async (): Promise<CpuInforDTO[]> => {
    const response = await api.get('/specs/cpu');
    return response.data;
  },
  createCpu: async (dto: CpuInforDTO): Promise<CpuInforDTO> => {
    const response = await api.post('/specs/cpu', dto);
    return response.data;
  },
  updateCpu: async (id: number, dto: CpuInforDTO): Promise<CpuInforDTO> => {
    const response = await api.put(`/specs/cpu/${id}`, dto);
    return response.data;
  },
  deleteCpu: async (id: number): Promise<void> => {
    await api.delete(`/specs/cpu/${id}`);
  },
  getAllRams: async (): Promise<RamInforDTO[]> => {
    const response = await api.get('/specs/ram');
    return response.data;
  },
  createRam: async (dto: RamInforDTO): Promise<RamInforDTO> => {
    const response = await api.post('/specs/ram', dto);
    return response.data;
  },
  updateRam: async (id: number, dto: RamInforDTO): Promise<RamInforDTO> => {
    const response = await api.put(`/specs/ram/${id}`, dto);
    return response.data;
  },
  deleteRam: async (id: number): Promise<void> => {
    await api.delete(`/specs/ram/${id}`);
  },
  getAllGpus: async (): Promise<GpuInforDTO[]> => {
    const response = await api.get('/specs/gpu');
    return response.data;
  },
  createGpu: async (dto: GpuInforDTO): Promise<GpuInforDTO> => {
    const response = await api.post('/specs/gpu', dto);
    return response.data;
  },
  updateGpu: async (id: number, dto: GpuInforDTO): Promise<GpuInforDTO> => {
    const response = await api.put(`/specs/gpu/${id}`, dto);
    return response.data;
  },
  deleteGpu: async (id: number): Promise<void> => {
    await api.delete(`/specs/gpu/${id}`);
  },
  getAllScreens: async (): Promise<ScreenInforDTO[]> => {
    const response = await api.get('/specs/screen');
    return response.data;
  },
  createScreen: async (dto: ScreenInforDTO): Promise<ScreenInforDTO> => {
    const response = await api.post('/specs/screen', dto);
    return response.data;
  },
  updateScreen: async (id: number, dto: ScreenInforDTO): Promise<ScreenInforDTO> => {
    const response = await api.put(`/specs/screen/${id}`, dto);
    return response.data;
  },
  deleteScreen: async (id: number): Promise<void> => {
    await api.delete(`/specs/screen/${id}`);
  },
  getAllStorages: async (): Promise<StorageInforDTO[]> => {
    const response = await api.get('/specs/storage');
    return response.data;
  },
  createStorage: async (dto: StorageInforDTO): Promise<StorageInforDTO> => {
    const response = await api.post('/specs/storage', dto);
    return response.data;
  },
  updateStorage: async (id: number, dto: StorageInforDTO): Promise<StorageInforDTO> => {
    const response = await api.put(`/specs/storage/${id}`, dto);
    return response.data;
  },
  deleteStorage: async (id: number): Promise<void> => {
    await api.delete(`/specs/storage/${id}`);
  },
};

export const discountService = {
  getAllDiscounts: async (): Promise<DiscountDTO[]> => {
    const response = await api.get('/discounts');
    return response.data;
  },
  getDiscountById: async (id: number): Promise<DiscountDTO> => {
    const response = await api.get(`/discounts/${id}`);
    return response.data;
  },
  createDiscount: async (dto: DiscountDTO): Promise<DiscountDTO> => {
    const response = await api.post('/discounts', dto);
    return response.data;
  },
  updateDiscount: async (id: number, dto: DiscountDTO): Promise<DiscountDTO> => {
    const response = await api.put(`/discounts/${id}`, dto);
    return response.data;
  },
  deleteDiscount: async (id: number): Promise<void> => {
    await api.delete(`/discounts/${id}`);
  },
};

export default api;
