import axios from 'axios';
import {
  ProductDTO, CategoryDTO, UserDTO, OrderDTO, DashboardDTO,
  LoginRequest, RegisterRequest, JwtResponse, CheckoutRequest,
  OrderStatusRequestDTO, UserStatusRequestDTO, ProductFilterDTO,
  CpuInforDTO, RamInforDTO, GpuInforDTO, ScreenInforDTO, StorageInforDTO,
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

  createProduct: async (data: any): Promise<ProductDTO> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: any): Promise<ProductDTO> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
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

  updateOrderStatus: async (id: number, status: string): Promise<OrderDTO> => {
    const response = await api.put(`/orders/${id}/status`, { status } as OrderStatusRequestDTO);
    return response.data;
  },
};

export const userService = {
  getAllUsers: async (): Promise<UserDTO[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  updateUserStatus: async (id: number, status: string): Promise<UserDTO> => {
    const response = await api.put(`/users/${id}/status`, { status } as UserStatusRequestDTO);
    return response.data;
  },
};

export const adminService = {
  getDashboardStats: async (): Promise<DashboardDTO> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export const specService = {
  getAllCpus: async (): Promise<CpuInforDTO[]> => {
    const response = await api.get('/specs/cpu');
    return response.data;
  },
  getAllRams: async (): Promise<RamInforDTO[]> => {
    const response = await api.get('/specs/ram');
    return response.data;
  },
  getAllGpus: async (): Promise<GpuInforDTO[]> => {
    const response = await api.get('/specs/gpu');
    return response.data;
  },
  getAllScreens: async (): Promise<ScreenInforDTO[]> => {
    const response = await api.get('/specs/screen');
    return response.data;
  },
  getAllStorages: async (): Promise<StorageInforDTO[]> => {
    const response = await api.get('/specs/storage');
    return response.data;
  },
};

export default api;
