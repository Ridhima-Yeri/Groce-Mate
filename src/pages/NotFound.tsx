import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const NotFound: React.FC = () => {
  const history = useHistory();
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Page Not Found</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="not-found-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '5rem', margin: '0', color: 'var(--ion-color-medium)' }}>404</h1>
          <h2>Page Not Found</h2>
          <p style={{ maxWidth: '400px', margin: '1rem auto' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <IonButton 
            onClick={() => history.push('/')}
            expand="block"
            style={{ maxWidth: '200px', margin: '2rem auto 0' }}
          >
            Go Home
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
