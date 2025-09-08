/**
 * Mock API service to simulate backend interactions for orders
 * This helps us test the order management functionality without a real backend
 */

// Helper to get orders from localStorage
export const getOrdersFromStorage = (): any[] => {
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders;
  } catch (error) {
    console.error('Error reading orders from localStorage:', error);
    return [];
  }
};

// Get all orders (simulating GET /api/admin/orders)
export const getAllOrders = async () => {
  const orders = getOrdersFromStorage();
  
  // Sort orders by date, newest first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return sortedOrders;
};

// Get order by ID (simulating GET /api/admin/orders/:id)
export const getOrderById = async (orderId: string) => {
  const orders = getOrdersFromStorage();
  return orders.find(order => order._id === orderId || order.orderNumber === orderId) || null;
};

// Update order status (simulating PUT /api/admin/orders/:id/status)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const orders = getOrdersFromStorage();
  
  // Find the order to update
  const updatedOrders = orders.map(order => {
    if (order._id === orderId || order.orderNumber === orderId) {
      // Create a display status with proper capitalization
      let displayStatus;
      switch(status) {
        case 'pending': displayStatus = 'Pending'; break;
        case 'processing': displayStatus = 'Processing'; break;
        case 'shipped': displayStatus = 'Shipped'; break;
        case 'delivered': displayStatus = 'Delivered'; break;
        case 'cancelled': displayStatus = 'Cancelled'; break;
        default: displayStatus = 'Processing';
      }
      
      // Return updated order
      return {
        ...order,
        deliveryStatus: status,
        status: displayStatus
      };
    }
    return order;
  });
  
  // Save updated orders to localStorage
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  
  // Return the updated order
  return updatedOrders.find(order => order._id === orderId || order.orderNumber === orderId) || null;
};

// Helper to format orders for display in the admin panel
export const formatOrdersForAdmin = (orders: any[]) => {
  return orders.map(order => ({
    ...order,
    // Ensure these properties exist
    items: order.items || [],
    deliveryAddress: order.deliveryAddress || {},
    deliveryStatus: order.deliveryStatus || 'pending',
    status: order.status || 'Pending'
  }));
};
