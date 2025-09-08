import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonText,
  IonBackButton,
  useIonViewDidEnter
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { closeOutline, locationOutline, callOutline, timeOutline, cardOutline, checkmarkCircleOutline, hourglassOutline, closeCircleOutline, alertCircleOutline } from 'ionicons/icons';
import '../styles/OrderDetails.css';
import '../styles/PageThemeForce.css';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderDetails {
  id: string;
  date: string;
  total: string;
  status: string;
  items: OrderItem[];
  deliveryAddress?: string;
  paymentMethod?: string;
  phoneNumber?: string;
  estimatedDelivery?: string;
  orderNotes?: string;
}

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  
  // Force page to apply correct theme on view enter
  useIonViewDidEnter(() => {
    // Trigger a re-render to apply current theme
    document.querySelector('.order-details-page')?.classList.add('theme-applied');
    setTimeout(() => {
      document.querySelector('.order-details-page')?.classList.remove('theme-applied');
    }, 10);
  });
  
  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'shipped': return 'tertiary';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'delivered': return checkmarkCircleOutline;
      case 'processing': return hourglassOutline;
      case 'shipped': return timeOutline;
      case 'cancelled': return closeCircleOutline;
      default: return alertCircleOutline;
    }
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrderDetails = () => {
      try {
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Find the order with matching ID
        const matchedOrder = orders.find((o: any) => o.orderNumber === orderId || o._id === orderId);
        
        if (matchedOrder) {
          setOrder({
            id: matchedOrder.orderNumber,
            date: matchedOrder.createdAt,
            total: `₹${matchedOrder.total.toFixed(2)}`,
            status: matchedOrder.status,
            items: matchedOrder.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: `₹${item.price.toFixed(2)}`
            })),
            deliveryAddress: matchedOrder.deliveryAddress ? 
              `${matchedOrder.deliveryAddress.addressLine1}, ${matchedOrder.deliveryAddress.addressLine2 ? matchedOrder.deliveryAddress.addressLine2 + ', ' : ''}${matchedOrder.deliveryAddress.city}, ${matchedOrder.deliveryAddress.state} ${matchedOrder.deliveryAddress.pincode}` : 
              undefined,
            paymentMethod: matchedOrder.paymentMethod,
            phoneNumber: matchedOrder.deliveryAddress?.phone,
            estimatedDelivery: matchedOrder.estimatedDelivery,
            orderNotes: matchedOrder.orderNotes
          });
        } else {
          console.error('Order not found');
          history.push('/orders');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId, history]);

  const handleGoBack = () => {
    history.push('/orders');
  };
  
  // If order is still loading, show a loading message
  if (!order) {
    return (
      <IonPage className="order-details-page admin-page">
        <IonHeader>
          <IonToolbar className="themed-toolbar">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/orders" text="" />
            </IonButtons>
            <IonTitle className="admin-dashboard-title">Order Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="admin-dashboard-content" color="background">
          <div className="admin-dashboard-full">
            <div className="loading-container">
              <div className="admin-form">
                <p>Loading order details...</p>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="order-details-page admin-page">
      <IonHeader>
        <IonToolbar className="themed-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" text="" />
          </IonButtons>
          <IonTitle className="admin-dashboard-title">Order Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleGoBack} fill="clear">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="admin-dashboard-content" color="background">
        <div className="admin-dashboard-full">
          {/* Order Status Summary Card */}
          <div className="order-summary-card">
            <div className="order-summary-header">
              <div className="order-id-section">
                <h1>#{order.id}</h1>
                <IonBadge color={getStatusColor(order.status)} className="status-badge-large">
                  <IonIcon icon={getStatusIcon(order.status)} />
                  {order.status}
                </IonBadge>
              </div>
              
              {/* Status Progress Indicator */}
              <div className="status-progress">
                <div className="progress-steps">
                  <div className={`progress-step ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
                    <div className="step-icon">
                      <IonIcon icon={alertCircleOutline} />
                    </div>
                    <span>Pending</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
                    <div className="step-icon">
                      <IonIcon icon={hourglassOutline} />
                    </div>
                    <span>Processing</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
                    <div className="step-icon">
                      <IonIcon icon={timeOutline} />
                    </div>
                    <span>Shipped</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${order.status.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
                    <div className="step-icon">
                      <IonIcon icon={checkmarkCircleOutline} />
                    </div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
              
              <div className="order-meta">
                <div className="order-date-info">
                  <IonIcon icon={timeOutline} />
                  <span>{formatDate(order.date)}</span>
                </div>
                <div className="order-total-info">
                  <span className="total-label">Total Amount</span>
                  <span className="total-amount">{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="admin-form">
            <h2 className="section-title-admin">
              <IonIcon icon={cardOutline} />
              Order Items
            </h2>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Item">{item.name}</td>
                      <td data-label="Quantity">{item.quantity}</td>
                      <td data-label="Price">{item.price}</td>
                      <td data-label="Subtotal">₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="summary-row subtotal">
                    <td colSpan={3} data-label="Subtotal" className="action-label">Items Subtotal</td>
                    <td data-label="Amount" className="action-value">{order.total}</td>
                  </tr>
                  <tr className="summary-row">
                    <td colSpan={3} data-label="Delivery" className="action-label">Delivery Charges</td>
                    <td data-label="Amount" className="action-value">{parseFloat(order.total.replace('₹', '')) > 500 ? 'FREE' : '₹40.00'}</td>
                  </tr>
                  <tr className="summary-row">
                    <td colSpan={3} data-label="Tax" className="action-label">GST (5%)</td>
                    <td data-label="Amount" className="action-value">₹{(parseFloat(order.total.replace('₹', '')) * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr className="summary-row final-total">
                    <td colSpan={3} data-label="Total" className="action-label">Final Total</td>
                    <td data-label="Amount" className="action-value">₹{(
                      parseFloat(order.total.replace('₹', '')) + 
                      (parseFloat(order.total.replace('₹', '')) > 500 ? 0 : 40) + 
                      parseFloat(order.total.replace('₹', '')) * 0.05
                    ).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Information */}
          {order.deliveryAddress && (
            <div className="admin-form">
              <h2 className="section-title-admin">
                <IonIcon icon={locationOutline} />
                Delivery Information
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label className="simple-admin-label">Address</label>
                  <p className="info-value">{order.deliveryAddress}</p>
                </div>
                {order.phoneNumber && (
                  <div className="info-item">
                    <label className="simple-admin-label">Phone Number</label>
                    <p className="info-value">{order.phoneNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="info-item">
                    <label className="simple-admin-label">Estimated Delivery</label>
                    <p className="info-value">{order.estimatedDelivery}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.paymentMethod && (
            <div className="admin-form">
              <h2 className="section-title-admin">
                <IonIcon icon={cardOutline} />
                Payment Information
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label className="simple-admin-label">Payment Method</label>
                  <p className="info-value">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.orderNotes && (
            <div className="admin-form">
              <h2 className="section-title-admin">
                <IonIcon icon={alertCircleOutline} />
                Special Instructions
              </h2>
              <div className="order-notes-admin">
                <p>{order.orderNotes}</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="admin-form">
            <h2 className="section-title-admin">
              <IonIcon icon={alertCircleOutline} />
              Quick Actions
            </h2>
            <div className="action-buttons">
              <button 
                className="simple-admin-btn" 
                onClick={handleGoBack}
              >
                <IonIcon icon={locationOutline} />
                Back to Orders
              </button>
              <button 
                className="simple-admin-btn outline"
                onClick={() => window.open('tel:+916366147567')}
              >
                <IonIcon icon={callOutline} />
                Call Customer Support
              </button>
              <button 
                className="simple-admin-btn outline"
                onClick={() => window.print()}
              >
                Print Order
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderDetailsPage;
