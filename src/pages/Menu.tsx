import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { addOutline, removeOutline, trashOutline, cartOutline } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import '../styles/Menu.css';

const Menu: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="themed-toolbar">
          <IonTitle>GroceMate</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/cart" fill="clear">
              <div style={{ position: 'relative' }}>
                <IonIcon icon={cartOutline} />
                {totalItems > 0 && (
                  <IonBadge 
                    className="cart-badge" 
                    data-count={totalItems}
                    data-count-length={totalItems.toString().length}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </IonBadge>
                )}
              </div>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="menu-content">
        {/* Menu content goes here */}
      </IonContent>
    </IonPage>
  );
};

export default Menu;