import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonModal,
  IonList,
  IonItem,
  IonPage
} from '@ionic/react';
import CrearCliente from './pages/CrearCliente';
import CrearMascota from './pages/CrearMascota';
import CrearHistoriaClinica from './pages/CrearHistoriaClinica';
import ConsultaHistoriaClinica from './pages/ConsultaHistoriaClinica'
import { setupIonicReact } from '@ionic/react';

import '@ionic/react/css/core.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  return (
    <IonApp>
      <Router>
        <IonPage>

          <IonHeader>
            <IonToolbar>
              <IonButton slot="start" onClick={() => setIsModalOpen(true)}>
                Menú
              </IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            {/* Modal para el menú */}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
              
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Seleccionar Módulo</IonTitle>
                  <IonButton slot="end" onClick={() => setIsModalOpen(false)}>
                    Cerrar
                  </IonButton>
                </IonToolbar>
              </IonHeader>

              <IonContent>
                <IonList>
                  
                  <IonItem button routerLink="/crear-cliente" onClick={() => setIsModalOpen(false)}>
                    Crear Cliente
                  </IonItem>
                  <IonItem button routerLink="/crear-mascota" onClick={() => setIsModalOpen(false)}>
                    Crear Mascota
                  </IonItem>
                  <IonItem button routerLink="/crear-historia-clinica" onClick={() => setIsModalOpen(false)}>
                    Crear Historia Clinica
                  </IonItem>
                  <IonItem button routerLink="/consulta-historia-clinica" onClick={() => setIsModalOpen(false)}>
                    Consultar Historia Clinica
                  </IonItem>

                </IonList>
              </IonContent>
            </IonModal>
            
            <IonRouterOutlet>
              <Route path="/crear-cliente" component={CrearCliente} exact />
              <Route path="/crear-mascota" component={CrearMascota} exact />
              <Route path="/crear-historia-clinica" component={CrearHistoriaClinica} exact />
              <Route path="/consulta-historia-clinica" component={ConsultaHistoriaClinica} exact />
            </IonRouterOutlet>

          </IonContent>
        </IonPage>
      </Router>
    </IonApp>
  );
};

export default App;
