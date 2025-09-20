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
  IonBadge,
  useIonViewDidEnter
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { closeOutline, locationOutline, callOutline, timeOutline, cardOutline, checkmarkCircleOutline, hourglassOutline, closeCircleOutline, alertCircleOutline, chevronBackOutline } from 'ionicons/icons';
import '../styles/OrderDetails.css';
import '../styles/PageThemeForce.css';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
}

interface OrderDetails {
  id: string;
  date: string;
  total: string;
  status: string;
  items: OrderItem[];
  deliveryAddress?: DeliveryAddress;
  paymentMethod?: string;
  phoneNumber?: string;
  orderNotes?: string;
}

const AdminOrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [notFound, setNotFound] = useState(false);

  useIonViewDidEnter(() => {
    document.querySelector('.admin-order-details-page')?.classList.add('theme-applied');
    setTimeout(() => {
      document.querySelector('.admin-order-details-page')?.classList.remove('theme-applied');
    }, 10);
  });

  const getStatusColor = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'shipped': return 'tertiary';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'delivered': return checkmarkCircleOutline;
      case 'processing': return hourglassOutline;
      case 'shipped': return timeOutline;
      case 'cancelled': return closeCircleOutline;
      default: return alertCircleOutline;
    }
  };

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

  useEffect(() => {
    const fetchOrderDetails = () => {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
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
              price: `₹${item.price.toFixed(2)}`,
              image: item.image || item.img || ''
            })),
            deliveryAddress: matchedOrder.deliveryAddress ? { ...matchedOrder.deliveryAddress } : undefined,
            paymentMethod: matchedOrder.paymentMethod,
            phoneNumber: matchedOrder.deliveryAddress?.phone,
            orderNotes: matchedOrder.orderNotes
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
      }
    };
    fetchOrderDetails();
  }, [orderId, history]);

  const handleGoBack = () => {
    history.goBack();
  };

  if (notFound) {
    return (
      <IonPage className="admin-order-details-page">
        <IonContent>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <h2>Order Not Found</h2>
            <p>The order you are looking for does not exist.</p>
            <IonButton onClick={handleGoBack} color="primary">Back</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }
  if (!order) return null;

  return (
    <IonPage className="order-details-page admin-page">
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
              </div>
            </div>
          </div>

          {/* Order Items Section (with images for admin) */}
          <div className="simple-card">
            <div className="minimal-section">
              <h2 className="minimal-title">Order Items</h2>
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="minimal-label">Items Subtotal</td>
                    <td className="minimal-value">{order.total}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="minimal-label">Delivery Charges</td>
                    <td className="minimal-value">{parseFloat(order.total.replace('₹', '')) > 500 ? 'FREE' : '₹40.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="minimal-label">GST (5%)</td>
                    <td className="minimal-value">₹{(parseFloat(order.total.replace('₹', '')) * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="minimal-label minimal-total">Final Total</td>
                    <td className="minimal-value minimal-total">₹{(
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
            <div className="simple-card">
              <div className="minimal-section">
                <h2 className="minimal-title">Delivery Information</h2>
                <table className="minimal-table">
                  <tbody>
                    <tr>
                      <td className="minimal-label">Address</td>
                      <td className="minimal-value">
                        {order.deliveryAddress.addressLine1}
                        {order.deliveryAddress.addressLine2 && (<>, {order.deliveryAddress.addressLine2}</>)}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                      </td>
                    </tr>
                    {order.phoneNumber && (
                      <tr>
                        <td className="minimal-label">Phone Number</td>
                        <td className="minimal-value">{order.phoneNumber}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.paymentMethod && (
            <div className="simple-card" style={{ marginBottom: '2rem' }}>
              <div className="minimal-section">
                <h2 className="minimal-title">Payment Information</h2>
                <table className="minimal-table">
                  <tbody>
                    <tr>
                      <td className="minimal-label">Payment Method</td>
                      <td className="minimal-value">{order.paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminOrderDetails;
