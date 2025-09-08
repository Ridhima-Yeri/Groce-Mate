import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon } from '@ionic/react';
import { addOutline, removeOutline, trashOutline, cartOutline } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import '../styles/Cart.css';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  return (
    <IonPage className="cart-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="cart-content">
        {items.length === 0 ? (
          <div className="cart-container">
            <div className="cart-header">
              <h1 className="cart-title">Cart</h1>
            </div>
            <div className="cart-empty">
              <IonIcon icon={cartOutline} className="cart-empty-icon" />
              <p>Your cart is empty</p>
              <IonButton routerLink="/menu" expand="block" className="continue-shopping-btn">
                Continue Shopping
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="cart-container cart-has-items">
            <div className="cart-header">
              <h1 className="cart-title">Cart</h1>
            </div>
            <div className="cart-items">
              {items.map(item => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-item-no-image">No Image</div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price} each</div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <IonIcon icon={removeOutline} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <IonIcon icon={addOutline} />
                      </button>
                    </div>
                    <button 
                      className="cart-item-remove" 
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <IonButton expand="block" className="checkout-btn" routerLink="/checkout">
                  Proceed to Checkout
                </IonButton>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;