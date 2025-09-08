const API_BASE = 'http://localhost:5000/api';

// Extend the Window interface to include ENV_API_URL
declare global {
  interface Window {
    ENV_API_URL?: string;
  }
}

// Fix the process not defined error
const API_URL = typeof window !== 'undefined' && window.ENV_API_URL 
  ? window.ENV_API_URL 
  : 'http://localhost:5000/api';

// Helper function to check server connection
const checkServerConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE}/health`, { 
      signal: controller.signal,
      method: 'HEAD' 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Auth functions
export async function login(email: string, password: string, role?: string) {
  try {
    localStorage.setItem('lastLoginEmail', email);
    
    const body: any = { email, password };
    if (role) body.role = role;
    
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Login failed' };
    }
    
    return res.json();
  } catch (error) {
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await res.json();
        return { error: true, message: errorData.message || 'Failed to fetch products' };
      } else {
        return { error: true, message: `Server error: ${res.status}` };
      }
    }
    
    const data = await res.json();
    return { data, error: false };
  } catch (error) {
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

export async function register(name: string, email: string, password: string, role: string = 'user') {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Registration failed' };
    }
    
    return res.json();
  } catch (error) {
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

// Profile functions
export async function updateProfile(userData: { name: string, email: string }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const isOnline = await checkServerConnection();
  if (!isOnline) {
    // Offline mode
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      name: userData.name,
      email: userData.email,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
  
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      let errorMsg = 'Failed to update profile';
      try {
        const errorData = await res.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {
        errorMsg = res.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const token = localStorage.getItem('token');
  
  const isOnline = await checkServerConnection();
  if (!isOnline) {
    throw new Error('Server is not reachable. Please check your connection.');
  }
  
  const res = await fetch(`${API_BASE}/users/change-password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to change password');
  }
  
  return res.json();
}

export async function uploadProfileImage(file: File) {
  const token = localStorage.getItem('token');
  
  const isOnline = await checkServerConnection();
  if (!isOnline) {
    throw new Error('Server is not reachable. Please check your connection.');
  }
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const res = await fetch(`${API_BASE}/users/upload-avatar`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload image');
  }
  
  return res.json();
}

export async function getProfileData() {
  const token = localStorage.getItem('token');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to get profile data');
    }
    
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    
    if (!response.ok) {
      return { error: true, message: `Failed to fetch categories: ${response.status}` };
    }
    
    const data = await response.json();
    return { error: false, data: data };
  } catch (error) {
    return { error: true, message: 'Network error' };
  }
};

// Get product by ID
export const getProductById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    
    return response.ok 
      ? { error: false, data } 
      : { error: true, message: data.message || 'Failed to fetch product' };
  } catch (error) {
    console.error('API error:', error);
    return { error: true, message: 'Network error' };
  }
};

// Add product
export const addProduct = async (productData: {
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { error: true, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();
    return response.ok 
      ? { error: false, data } 
      : { error: true, message: data.message || 'Failed to add product' };
  } catch (error) {
    console.error('API error:', error);
    return { error: true, message: 'Network error' };
  }
};

// Update product
export const updateProduct = async (
  id: string, 
  productData: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
    featured?: boolean;
  }
) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { error: true, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();
    return response.ok 
      ? { error: false, data } 
      : { error: true, message: data.message || 'Failed to update product' };
  } catch (error) {
    console.error('API error:', error);
    return { error: true, message: 'Network error' };
  }
};
