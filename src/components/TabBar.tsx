import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';
import { homeOutline, searchOutline, cartOutline, personOutline } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';

const TabBar: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={homeOutline} className="nav-icon" />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="search" href="/search">
        <IonIcon icon={searchOutline} className="nav-icon" />
        <IonLabel>Search</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="cart" href="/cart">
        <div style={{ position: 'relative' }}>
          <IonIcon icon={cartOutline} className="nav-icon" />
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
        <IonLabel>Cart</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="profile" href="/profile">
        <IonIcon icon={personOutline} className="nav-icon" />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;