import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent as IonMenuContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle
} from '@ionic/react';
import { personOutline, logInOutline, receiptOutline, logOutOutline, homeOutline, cartOutline, storefrontOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';

const SideMenu: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      
      // Get user role if authenticated
      if (token) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || null);
      }
    };
    
    checkAuth();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/';
  };

  return (
    <IonMenu 
      side="end" 
      contentId="main-content"
      menuId="main-menu"
      swipeGesture={false}
      className="smooth-menu-transition"
      onIonWillOpen={() => {
        // Add a small delay before setting inert to allow animation to start
        setTimeout(() => {
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.setAttribute('inert', '');
          }
        }, 50);
      }}
      onIonDidOpen={() => {
        // When menu opens, find first focusable item and focus it
        const firstItem = document.querySelector('ion-menu[menu-id="main-menu"] ion-item') as HTMLElement;
        if (firstItem) {
          setTimeout(() => firstItem.focus(), 150);
        }
      }}
      onIonWillClose={() => {
        // Remove inert as soon as close animation starts
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.removeAttribute('inert');
        }
      }}
      onIonDidClose={() => {
        // Return focus to menu button
        const menuButton = document.querySelector('ion-menu-button') as HTMLElement;
        if (menuButton) {
          menuButton.focus();
        }
      }}
    >
      <IonHeader>
        <IonToolbar className="themed-toolbar">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonMenuContent className="ion-padding">
        <IonList>
          <IonMenuToggle autoHide={true}>
            {isAuthenticated ? (
              <>
                <IonItem 
                  button 
                  routerLink="/profile"
                  detail={true}
                  tabIndex={0}
                >
                  <IonIcon slot="start" icon={personOutline} aria-hidden="true" />
                  <IonLabel>Profile</IonLabel>
                </IonItem>
                
                <IonItem 
                  button 
                  routerLink="/orders"
                  detail={true}
                  tabIndex={0}
                >
                  <IonIcon slot="start" icon={receiptOutline} aria-hidden="true" />
                  <IonLabel>Orders</IonLabel>
                </IonItem>
                
                <IonItem 
                  button 
                  onClick={handleLogout}
                  detail={true}
                  tabIndex={0}
                >
                  <IonIcon slot="start" icon={logOutOutline} aria-hidden="true" />
                  <IonLabel>Logout</IonLabel>
                </IonItem>
              </>
            ) : (
              <IonItem 
                button 
                routerLink="/login"
                detail={true}
                tabIndex={0}
              >
                <IonIcon slot="start" icon={logInOutline} aria-hidden="true" />
                <IonLabel>Login</IonLabel>
              </IonItem>
            )}
          </IonMenuToggle>
        </IonList>
      </IonMenuContent>
    </IonMenu>
  );
};

export default SideMenu;
